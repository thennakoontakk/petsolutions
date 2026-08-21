import struct
import zlib
import xml.etree.ElementTree as ET
import os
import re
import json
import openpyxl

DOCX_PATH = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\PetSolutions_Product_Details_01 - 04.docx"
EXCEL_PATH = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\E- Com Product List.xlsx"
OUTPUT_IMG_DIR = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\public\images\products"
OUTPUT_JSON = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch\extracted_products.json"
OUTPUT_SQL = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\supabase\import_all_docx_products.sql"

os.makedirs(OUTPUT_IMG_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

# 1. Read Excel prices and sizes
excel_products = []
if os.path.exists(EXCEL_PATH):
    wb = openpyxl.load_workbook(EXCEL_PATH)
    sheet = wb.active
    for r in sheet.iter_rows(values_only=True):
        if len(r) >= 5 and r[3] and r[4] is not None:
            name_str = str(r[3]).strip()
            price_val = float(r[4]) if isinstance(r[4], (int, float)) else 0.0
            pet_t = str(r[2]).strip() if r[2] else 'Cat/Dog'
            excel_products.append({
                'name': name_str,
                'price': price_val,
                'pet_type': pet_t
            })
print(f"Loaded {len(excel_products)} products with prices from Excel.")

# 2. Extract files from DOCX binary stream
raw_data = open(DOCX_PATH, 'rb').read()

entries = {}
pos = 0
while True:
    idx = raw_data.find(b'PK\x03\x04', pos)
    if idx == -1: break
    if idx + 30 <= len(raw_data):
        version, flags, comp, modtime, moddate, crc32, comp_size, uncomp_size, name_len, extra_len = struct.unpack('<HHHHHIIIHH', raw_data[idx+4:idx+30])
        name = raw_data[idx+30:idx+30+name_len].decode('latin1', errors='ignore')
        payload_offset = idx + 30 + name_len + extra_len
        raw_payload = raw_data[payload_offset:payload_offset+comp_size]
        try:
            if comp == 8:
                decomp = zlib.decompress(raw_payload, -15)
            elif comp == 0:
                decomp = raw_payload
            else:
                decomp = None
            if decomp is not None:
                entries[name] = decomp
        except Exception as e:
            pass
    pos = idx + 4

print(f"Decompressed {len(entries)} files from docx binary.")

# 3. Parse rels
rels_tree = ET.fromstring(entries['word/_rels/document.xml.rels'])
rel_map = {}
for elem in rels_tree:
    rid = elem.attrib.get('Id')
    target = elem.attrib.get('Target')
    if rid and target:
        rel_map[rid] = target

# 4. Parse document.xml
doc_tree = ET.fromstring(entries['word/document.xml'])

ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'v': 'urn:schemas-microsoft-com:vml',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
}

body = doc_tree.find('w:body', ns)
elements = []

for child in body:
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        texts = [t.text for t in child.findall('.//w:t', ns) if t.text]
        p_text = "".join(texts).strip()
        img_rids = []
        for blip in child.findall('.//a:blip', ns):
            embed_id = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            if embed_id: img_rids.append(embed_id)
        for imgdata in child.findall('.//v:imagedata', ns):
            rid = imgdata.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            if rid: img_rids.append(rid)
        elements.append({'type': 'p', 'text': p_text, 'images': img_rids})
    elif tag == 'tbl':
        for row in child.findall('.//w:tr', ns):
            for cell in row.findall('.//w:tc', ns):
                texts = [t.text for t in cell.findall('.//w:t', ns) if t.text]
                c_text = "".join(texts).strip()
                img_rids = []
                for blip in cell.findall('.//a:blip', ns):
                    embed_id = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                    if embed_id: img_rids.append(embed_id)
                for imgdata in cell.findall('.//v:imagedata', ns):
                    rid = imgdata.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                    if rid: img_rids.append(rid)
                if c_text or img_rids:
                    elements.append({'type': 'cell', 'text': c_text, 'images': img_rids})

print(f"Extracted {len(elements)} structural elements.")

# 5. Group by product numbers e.g. "1. TixFree..."
products = []
current_prod = None
pending_images = []

product_header_regex = re.compile(r'^(\d+)[\.\)]\s*(.+)$')

for el in elements:
    text = el['text']
    imgs = el['images']

    if imgs:
        pending_images.extend(imgs)

    if not text:
        continue

    match = product_header_regex.match(text)
    if match and not any(text.lower().startswith(x) for x in ['1. apply', '2. apply', '1. store', '1. give', '2. give']):
        num = int(match.group(1))
        title = match.group(2).strip()
        
        if current_prod:
            products.append(current_prod)
        
        current_prod = {
            'number': num,
            'header_title': title,
            'lines': [],
            'images': list(pending_images)
        }
        pending_images = []
    else:
        if current_prod:
            current_prod['lines'].append(text)
            if imgs:
                current_prod['images'].extend(imgs)

if current_prod:
    products.append(current_prod)

print(f"Grouped into {len(products)} products.")

# 6. Process each product
parsed_products = []

for p in products:
    num = p['number']
    header_title = p['header_title']
    lines = p['lines']
    raw_imgs = list(dict.fromkeys(p['images']))

    saved_images = []
    for idx, rid in enumerate(raw_imgs):
        target = rel_map.get(rid)
        if target:
            zip_target = 'word/' + target if not target.startswith('word/') else target
            zip_target = zip_target.replace('\\', '/')
            if zip_target in entries:
                ext = os.path.splitext(zip_target)[1] or '.png'
                slug_safe = re.sub(r'[^a-z0-9]+', '_', header_title.lower()).strip('_')[:35]
                img_filename = f"p{num}_{slug_safe}_{idx+1}{ext}"
                dest_path = os.path.join(OUTPUT_IMG_DIR, img_filename)
                with open(dest_path, 'wb') as f_out:
                    f_out.write(entries[zip_target])
                saved_images.append(f"/images/products/{img_filename}")

    field_buffers = {
        'product_name': [],
        'category': [],
        'ingredients': [],
        'indications': [],
        'directions': [],
        'packaging': [],
        'storage_safety': [],
        'description': []
    }
    curr_field = 'description'

    for line in lines:
        line_str = line.strip()
        l_lower = line_str.lower()

        if l_lower.startswith('product name:'):
            curr_field = 'product_name'
            val = line_str[len('product name:'):].strip()
            if val: field_buffers['product_name'].append(val)
        elif l_lower.startswith('category:') or l_lower.startswith('category / ingredients:'):
            curr_field = 'category'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['category'].append(val)
        elif l_lower.startswith('key ingredients:') or l_lower.startswith('ingredients:') or l_lower.startswith('active ingredient:') or l_lower.startswith('composition:') or l_lower.startswith('composition per tablet:'):
            curr_field = 'ingredients'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['ingredients'].append(val)
        elif l_lower.startswith('indications:') or l_lower.startswith('uses:') or l_lower.startswith('uses / directions:'):
            curr_field = 'indications'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['indications'].append(val)
        elif l_lower.startswith('directions:') or l_lower.startswith('directions for use:') or l_lower.startswith('dosage:'):
            curr_field = 'directions'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['directions'].append(val)
        elif l_lower.startswith('packaging:') or l_lower.startswith('pack sizes:') or l_lower.startswith('pack size:'):
            curr_field = 'packaging'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['packaging'].append(val)
        elif l_lower.startswith('storage / safety:') or l_lower.startswith('storage:') or l_lower.startswith('safety:'):
            curr_field = 'storage_safety'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['storage_safety'].append(val)
        elif l_lower.startswith('product description:') or l_lower.startswith('description:'):
            curr_field = 'description'
            val = line_str.split(':', 1)[1].strip()
            if val: field_buffers['description'].append(val)
        elif line_str.startswith('───') or line_str.startswith('==='):
            continue
        else:
            field_buffers[curr_field].append(line_str)

    parsed_name = " ".join(field_buffers['product_name']).strip() or header_title
    parsed_cat = " ".join(field_buffers['category']).strip()
    parsed_ingr = "\n".join(field_buffers['ingredients']).strip()
    parsed_ind = "\n".join(field_buffers['indications']).strip()
    parsed_dir = "\n".join(field_buffers['directions']).strip()
    parsed_pack = " ".join(field_buffers['packaging']).strip()
    parsed_storage = "\n".join(field_buffers['storage_safety']).strip()
    parsed_desc = "\n".join(field_buffers['description']).strip()

    if not parsed_desc:
        parsed_desc = f"{parsed_name} is a high-quality pet care solution providing essential health and veterinary support."

    # Determine brand
    brand = "PetSolutions"
    for candidate_brand in ["Himalaya", "Zoetis", "Virbac", "Bayer", "Biocan", "JosiCat", "Josera", "Drools", "Purina", "Royal Canin", "Catron", "Beaphar", "Seepet", "SmartHeart", "Me-O", "CP"]:
        if candidate_brand.lower() in parsed_name.lower() or candidate_brand.lower() in header_title.lower() or candidate_brand.lower() in parsed_desc.lower():
            brand = candidate_brand
            break

    # Determine pet_type
    text_for_pet = (parsed_name + " " + parsed_desc + " " + parsed_dir + " " + header_title).lower()
    has_dog = 'dog' in text_for_pet or 'puppy' in text_for_pet or 'canine' in text_for_pet
    has_cat = 'cat' in text_for_pet or 'kitten' in text_for_pet or 'feline' in text_for_pet

    if has_dog and has_cat:
        pet_type = 'Cat/Dog'
    elif has_cat:
        pet_type = 'Cat'
    elif has_dog:
        pet_type = 'Dog'
    else:
        pet_type = 'Cat/Dog'

    # Clean name
    clean_name = header_title.strip()
    if parsed_name and len(parsed_name) <= 60 and not any(parsed_name.lower().startswith(x) for x in ['the strongest', 'sold by', 'category', 'intended for']):
        clean_name = parsed_name.strip()
    clean_name = re.sub(r'[\.\,]+$', '', clean_name) # remove trailing dots/commas

    # Match price from Excel
    matched_price = 1500.0
    matched_size = 'Standard'
    
    # Try match with excel
    name_clean = re.sub(r'[^a-z0-9]', '', clean_name.lower())
    header_clean = re.sub(r'[^a-z0-9]', '', header_title.lower())
    
    best_match = None
    for ex in excel_products:
        ex_clean = re.sub(r'[^a-z0-9]', '', ex['name'].lower())
        if ex_clean in name_clean or ex_clean in header_clean or name_clean in ex_clean or header_clean in ex_clean:
            matched_price = ex['price']
            best_match = ex['name']
            size_match = re.search(r'(\d+(?:\.\d+)?\s*(?:ml|g|kg|l|tablets|tabs|s|packs))\b', ex['name'], re.IGNORECASE)
            if size_match:
                matched_size = size_match.group(1)
            break

    if matched_size == 'Standard' and parsed_pack:
        size_match = re.search(r'(\d+(?:\.\d+)?\s*(?:ml|g|kg|l|tablets|tabs|s))\b', parsed_pack, re.IGNORECASE)
        if size_match:
            matched_size = size_match.group(1)

    parsed_products.append({
        'number': num,
        'name': clean_name,
        'header_title': header_title,
        'brand': brand,
        'category_raw': parsed_cat or 'Veterinary Healthcare',
        'pet_type': pet_type,
        'ingredients': parsed_ingr,
        'indications': parsed_ind,
        'directions': parsed_dir,
        'packaging': parsed_pack,
        'storage_safety': parsed_storage,
        'description': parsed_desc,
        'price': matched_price,
        'size_label': matched_size,
        'images': saved_images,
        'image_url': saved_images[0] if saved_images else None
    })

print(f"Total parsed products: {len(parsed_products)}")

# Save JSON
with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(parsed_products, f, indent=2, ensure_ascii=False)

# 7. Generate full SQL Import Script
sql_lines = [
    "-- ==========================================================================",
    "-- PetSolutions.lk — Full Catalog Import from Client Word Document",
    "-- Run this script in Supabase SQL Editor to replace dummy products with the real 69 products",
    "-- ==========================================================================",
    "",
    "-- 1. Clear existing dummy store data",
    "DELETE FROM cart_items;",
    "DELETE FROM order_items;",
    "DELETE FROM product_variants;",
    "DELETE FROM products;",
    "",
    "-- 2. Ensure Categories Exist",
    "INSERT INTO categories (name, slug, description, parent_category, display_order) VALUES",
    "  ('Parasite & Tick Control', 'parasite-tick-control', 'Spot-on treatments, tick sprays, collars and dewormers.', 'Cat/Dog', 1),",
    "  ('Health & Supplements', 'health-supplements', 'Liver support, vitamins, haematinics, calcium and metabolic tonics.', 'Cat/Dog', 2),",
    "  ('Wound Care & Topical Pharmacy', 'wound-care-topical-pharmacy', 'Antiseptic wound sprays, healing creams and lotions.', 'Cat/Dog', 3),",
    "  ('Medicated Shampoos & Grooming', 'medicated-shampoos-grooming', 'Antibacterial, antifungal and coat care grooming products.', 'Cat/Dog', 4),",
    "  ('Dry & Wet Pet Food', 'dry-wet-pet-food', 'Complete nutrition premium dry kibbles and pouches for cats and dogs.', 'Cat/Dog', 5),",
    "  ('Cat Litter & Hygiene', 'cat-litter-hygiene', 'Bentonite, scented and natural clumping cat litter.', 'Cat', 6)",
    "ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;",
    "",
    "DO $$",
    "DECLARE",
    "  cat_parasite UUID;",
    "  cat_health UUID;",
    "  cat_wound UUID;",
    "  cat_grooming UUID;",
    "  cat_food UUID;",
    "  cat_litter UUID;",
    "  pid UUID;",
    "BEGIN",
    "  SELECT id INTO cat_parasite FROM categories WHERE slug = 'parasite-tick-control';",
    "  SELECT id INTO cat_health FROM categories WHERE slug = 'health-supplements';",
    "  SELECT id INTO cat_wound FROM categories WHERE slug = 'wound-care-topical-pharmacy';",
    "  SELECT id INTO cat_grooming FROM categories WHERE slug = 'medicated-shampoos-grooming';",
    "  SELECT id INTO cat_food FROM categories WHERE slug = 'dry-wet-pet-food';",
    "  SELECT id INTO cat_litter FROM categories WHERE slug = 'cat-litter-hygiene';",
    ""
]

def sql_escape(s):
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')[:50]

for p in parsed_products:
    num = p['number']
    p_name = p['name']
    slug = f"{slugify(p_name)}-{num}"
    brand = p['brand']
    pet_t = p['pet_type']
    desc = p['description']
    ingr = p['ingredients'] or None
    ind = p['indications'] or None
    dirs = p['directions'] or None
    pack = p['packaging'] or None
    storage = p['storage_safety'] or None
    img_url = p['image_url'] or None
    imgs_pg = "ARRAY[" + ", ".join(sql_escape(img) for img in p['images']) + "]::TEXT[]" if p['images'] else "'{}'::TEXT[]"
    price = p['price']
    size = p['size_label']

    # Map category
    cat_raw = p['category_raw'].lower()
    p_name_lower = p_name.lower()
    desc_lower = desc.lower()

    if any(k in cat_raw or k in p_name_lower or k in desc_lower for k in ['tick', 'flea', 'spot-on', 'spot on', 'antick', 'tickamit', 'drontal', 'deworm', 'parasite']):
        cat_var = 'cat_parasite'
    elif any(k in cat_raw or k in p_name_lower or k in desc_lower for k in ['wound', 'scavon', 'antiseptic', 'spray', 'cream', 'aluspray', 'negasunt', 'petmend']):
        cat_var = 'cat_wound'
    elif any(k in cat_raw or k in p_name_lower or k in desc_lower for k in ['shampoo', 'soap', 'wash', 'groom', 'malaseb', 'dermitol']):
        cat_var = 'cat_grooming'
    elif any(k in cat_raw or k in p_name_lower or k in desc_lower for k in ['litter', 'bentonite']):
        cat_var = 'cat_litter'
    elif any(k in cat_raw or k in p_name_lower or k in desc_lower for k in ['food', 'kibble', 'pouch', 'josi', 'smartheart', 'me-o', 'bavaro', 'treat']):
        cat_var = 'cat_food'
    else:
        cat_var = 'cat_health'

    sql_lines.append(f"  -- #{num}. {p_name}")
    sql_lines.append(f"  INSERT INTO products (")
    sql_lines.append(f"    name, slug, brand, category_id, pet_type, description,")
    sql_lines.append(f"    ingredients, indications, directions, packaging, storage_safety,")
    sql_lines.append(f"    image_url, images, is_featured, is_active")
    sql_lines.append(f"  ) VALUES (")
    sql_lines.append(f"    {sql_escape(p_name)},")
    sql_lines.append(f"    {sql_escape(slug)},")
    sql_lines.append(f"    {sql_escape(brand)},")
    sql_lines.append(f"    {cat_var},")
    sql_lines.append(f"    {sql_escape(pet_t)},")
    sql_lines.append(f"    {sql_escape(desc)},")
    sql_lines.append(f"    {sql_escape(ingr)},")
    sql_lines.append(f"    {sql_escape(ind)},")
    sql_lines.append(f"    {sql_escape(dirs)},")
    sql_lines.append(f"    {sql_escape(pack)},")
    sql_lines.append(f"    {sql_escape(storage)},")
    sql_lines.append(f"    {sql_escape(img_url)},")
    sql_lines.append(f"    {imgs_pg},")
    sql_lines.append(f"    {'true' if num <= 8 else 'false'},")
    sql_lines.append(f"    true")
    sql_lines.append(f"  ) RETURNING id INTO pid;")
    sql_lines.append(f"")
    sql_lines.append(f"  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)")
    sql_lines.append(f"  VALUES (pid, {sql_escape(size)}, {price}, {price * 1.1:.2f}, 50);")
    sql_lines.append(f"")

sql_lines.append("END $$;")

with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print(f"Generated SQL import script with {len(parsed_products)} products at {OUTPUT_SQL}!")
