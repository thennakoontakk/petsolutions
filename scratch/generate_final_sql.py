import os
import json
import time
import urllib.parse
import re

MAPPING_JSON = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch_final_mapping.json'
BASE1 = r'C:\Users\thenn\OneDrive\Desktop\Edited-20260909T082604Z-1-001\Edited\Batch 1'
BASE2 = r'C:\Users\thenn\OneDrive\Desktop\Edited-20260909T082604Z-1-001\Edited\Batch 2'
OUTPUT_SQL = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\supabase\update_product_images_supabase.sql'
OUTPUT_REPORT = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch\upload_report.json'

SUPABASE_URL = 'https://jnakxlejkmyptoffvhsa.supabase.co'
BUCKET = 'product-images'

with open(MAPPING_JSON, 'r', encoding='utf-8') as f:
    mapped = json.load(f)['mapped']

def sanitize_filename(name):
    name = re.sub(r'[^\w\.-]', '_', name)
    return re.sub(r'_+', '_', name)

def front_score(fname):
    fn = fname.lower()
    if 'back' in fn or 'panel' in fn or 'nutritional' in fn: return -10
    if 'macro' in fn or 'detail' in fn or 'close-up' in fn or 'closeup' in fn or 'logo' in fn: return 1
    if 'front' in fn: return 20
    if 'pack_shot' in fn or 'product_shot' in fn: return 15
    if 'bottle' in fn or 'tin' in fn or 'can' in fn or 'pouch' in fn: return 10
    return 5

sql_lines = [
    '-- ============================================================================',
    '-- Update All 69 Products with 2K Supabase Storage Images',
    '-- Generated: ' + time.strftime('%Y-%m-%d %H:%M:%S'),
    '-- Run this in Supabase Dashboard -> SQL Editor',
    '-- ============================================================================\n',
    'BEGIN;\n'
]

results = []
total_images = 0

for idx, p in enumerate(mapped, start=1):
    pid = p['id']
    name = p['name']
    slug = p['slug']
    batch = p['batch']
    folder = p['folder']
    
    base_dir = BASE1 if batch == 'Batch 1' else BASE2
    folder_dir = os.path.join(base_dir, folder)
    if not os.path.exists(folder_dir): continue
    
    files = sorted([f for f in os.listdir(folder_dir) if f.lower().endswith(('.jpeg', '.jpg', '.png', '.webp'))])
    files.sort(key=front_score, reverse=True)
    
    urls = []
    for f in files:
        clean_name = sanitize_filename(f)
        dest_p = f'products/{slug}_{clean_name}'
        if not dest_p.endswith('.jpeg') and not dest_p.endswith('.jpg'):
            dest_p += '.jpeg'
        quoted = urllib.parse.quote(dest_p)
        url = f'{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{quoted}'
        urls.append(url)
        total_images += 1
    
    if not urls: continue
    
    primary_url = urls[0]
    gallery_urls = urls
    
    results.append({
        'id': pid,
        'name': name,
        'slug': slug,
        'primary_url': primary_url,
        'gallery_urls': gallery_urls
    })
    
    escaped_primary = primary_url.replace("'", "''")
    gallery_parts = ["'" + u.replace("'", "''") + "'" for u in gallery_urls]
    escaped_gallery = ', '.join(gallery_parts)
    
    sql_lines.append(f'-- #{idx}: {name}')
    sql_lines.append(
        f"UPDATE products\n"
        f"SET image_url = '{escaped_primary}',\n"
        f"    images = ARRAY[{escaped_gallery}]::TEXT[],\n"
        f"    updated_at = NOW()\n"
        f"WHERE id = '{pid}';\n"
    )

sql_lines.append('COMMIT;\n')

with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
    json.dump({'total_products': len(results), 'total_images': total_images, 'products': results}, f, indent=2)

print(f'Successfully generated SQL for {len(results)} products ({total_images} total images).')
