import os
import json
import re
import sys
import time
import io
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image
import requests

MAPPING_JSON = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch_final_mapping.json'
BASE1 = r'C:\Users\thenn\OneDrive\Desktop\Edited-20260909T082604Z-1-001\Edited\Batch 1'
BASE2 = r'C:\Users\thenn\OneDrive\Desktop\Edited-20260909T082604Z-1-001\Edited\Batch 2'
OUTPUT_SQL = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\supabase\update_product_images_supabase.sql'
OUTPUT_REPORT = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch\upload_report.json'

SUPABASE_URL = "https://jnakxlejkmyptoffvhsa.supabase.co"
SUPABASE_KEY = "sb_publishable_bdZoe5MN7YgLgfS5dnZCdg_L2Y1PqFB"
BUCKET = "product-images"

with open(MAPPING_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

mapped_products = data['mapped']
print(f"Total mapped products: {len(mapped_products)}")
sys.stdout.flush()

def sanitize_filename(name):
    name = re.sub(r'[^\w\.-]', '_', name)
    return re.sub(r'_+', '_', name)

def compress_image_bytes(file_path):
    """Resizes to max 1400px and optimizes JPEG to ~250-400KB while preserving pristine 2K clarity."""
    try:
        with Image.open(file_path) as img:
            img.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            buf = io.BytesIO()
            img.save(buf, format='JPEG', quality=84, optimize=True)
            return buf.getvalue()
    except Exception as e:
        print(f"Fallback to raw bytes for {file_path}: {e}")
        with open(file_path, 'rb') as f:
            return f.read()

def upload_worker(task):
    local_path, dest_rel_path, mime = task
    quoted_path = urllib.parse.quote(dest_rel_path)
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{quoted_path}"
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true'
    }
    
    data = compress_image_bytes(local_path)
    
    for attempt in range(4):
        try:
            resp = requests.post(url, headers=headers, data=data, timeout=30)
            if resp.status_code in (200, 201):
                public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{quoted_path}"
                return dest_rel_path, public_url, None
            elif attempt == 3:
                return dest_rel_path, None, f"HTTP {resp.status_code}: {resp.text[:100]}"
        except Exception as e:
            if attempt == 3:
                return dest_rel_path, None, str(e)
        time.sleep(1.5)

def front_score(fname):
    fn = fname.lower()
    if 'back' in fn or 'panel' in fn or 'nutritional' in fn:
        return -10
    if 'macro' in fn or 'detail' in fn or 'close-up' in fn or 'closeup' in fn or 'logo' in fn:
        return 1
    if 'front' in fn:
        return 20
    if 'pack_shot' in fn or 'product_shot' in fn:
        return 15
    if 'bottle' in fn or 'tin' in fn or 'can' in fn or 'pouch' in fn:
        return 10
    return 5

tasks = []
product_files_map = {}

for p in mapped_products:
    pid = p['id']
    name = p['name']
    slug = p['slug']
    batch = p['batch']
    folder = p['folder']
    
    base_dir = BASE1 if batch == 'Batch 1' else BASE2
    folder_dir = os.path.join(base_dir, folder)
    if not os.path.exists(folder_dir):
        continue
    
    files = sorted([f for f in os.listdir(folder_dir) if f.lower().endswith(('.jpeg', '.jpg', '.png', '.webp'))])
    files.sort(key=front_score, reverse=True)
    
    product_files_map[pid] = {
        'product': p,
        'dest_paths': []
    }
    
    for f in files:
        local_p = os.path.join(folder_dir, f)
        clean_name = sanitize_filename(f)
        dest_p = f"products/{slug}_{clean_name}"
        if not dest_p.endswith('.jpeg') and not dest_p.endswith('.jpg'):
            dest_p += '.jpeg'
        
        product_files_map[pid]['dest_paths'].append(dest_p)
        tasks.append((local_p, dest_p, 'image/jpeg'))

print(f"Total image files to optimize & upload: {len(tasks)} across {len(product_files_map)} products.")
print("Starting concurrent uploads (4 workers)...")
sys.stdout.flush()

uploaded_map = {}
done = 0
start_time = time.time()

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(upload_worker, t) for t in tasks]
    for fut in as_completed(futures):
        dest_p, pub_url, err = fut.result()
        done += 1
        if pub_url:
            uploaded_map[dest_p] = pub_url
        else:
            print(f"[ERR] {dest_p}: {err}")
        
        if done % 15 == 0 or done == len(tasks):
            elapsed = time.time() - start_time
            rate = done / elapsed if elapsed > 0 else 1
            remain = (len(tasks) - done) / rate
            print(f"Progress: {done}/{len(tasks)} ({done/len(tasks)*100:.1f}%) - {rate:.1f} imgs/sec - ~{remain:.0f}s left")
            sys.stdout.flush()

# Build SQL statements & JSON report
results = []
sql_statements = [
    "-- ============================================================================",
    "-- Update All Products with High-Res 2K Supabase Storage Images",
    "-- Generated automatically on " + time.strftime("%Y-%m-%d %H:%M:%S"),
    "-- Run this in Supabase Dashboard -> SQL Editor",
    "-- ============================================================================\n",
    "BEGIN;\n"
]

for idx, (pid, info) in enumerate(product_files_map.items(), start=1):
    p = info['product']
    name = p['name']
    dest_paths = info['dest_paths']
    
    urls = [uploaded_map[dp] for dp in dest_paths if dp in uploaded_map]
    if not urls:
        continue
    
    primary_url = urls[0]
    gallery_urls = urls
    
    results.append({
        'id': pid,
        'name': name,
        'slug': p['slug'],
        'primary_url': primary_url,
        'gallery_urls': gallery_urls
    })
    
    escaped_primary = primary_url.replace("'", "''")
    gallery_sql_parts = ["'" + u.replace("'", "''") + "'" for u in gallery_urls]
    escaped_gallery = ", ".join(gallery_sql_parts)
    
    sql_statements.append(f"-- #{idx}: {name}")
    sql_statements.append(
        f"UPDATE products\n"
        f"SET image_url = '{escaped_primary}',\n"
        f"    images = ARRAY[{escaped_gallery}]::TEXT[],\n"
        f"    updated_at = NOW()\n"
        f"WHERE id = '{pid}';\n"
    )

sql_statements.append("COMMIT;\n")

# Write SQL file
with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_statements))

# Write JSON report
with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
    json.dump({
        'total_products': len(results),
        'total_images_uploaded': len(uploaded_map),
        'products': results
    }, f, indent=2)

print("\n==========================================")
print(f"SUCCESS! Uploaded {len(uploaded_map)} images across {len(results)} products in {time.time() - start_time:.1f}s.")
print(f"Generated SQL migration: {OUTPUT_SQL}")
print(f"Generated upload report: {OUTPUT_REPORT}")
print("==========================================")
sys.stdout.flush()
