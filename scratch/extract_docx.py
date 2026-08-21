import zipfile
import xml.etree.ElementTree as ET
import os
import re
import json

DOCX_PATH = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\PetSolutions_Product_Details_01 - 04.docx"
OUTPUT_IMG_DIR = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\public\images\products"
OUTPUT_JSON = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch\extracted_products.json"
OUTPUT_SQL = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\supabase\import_all_docx_products.sql"

os.makedirs(OUTPUT_IMG_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

print("Opening docx:", DOCX_PATH)

with zipfile.ZipFile(DOCX_PATH, 'r') as docx:
    # 1. Parse rels
    rels_xml = docx.read('word/_rels/document.xml.rels')
    rels_tree = ET.fromstring(rels_xml)
    rel_map = {}
    for elem in rels_tree:
        rid = elem.attrib.get('Id')
        target = elem.attrib.get('Target')
        if rid and target:
            rel_map[rid] = target

    print(f"Found {len(rel_map)} relationships.")

    # 2. Parse document.xml
    doc_xml = docx.read('word/document.xml')
    doc_tree = ET.fromstring(doc_xml)

    # Namespaces
    ns = {
        'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'v': 'urn:schemas-microsoft-com:vml',
        'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
    }

    # Iterate over all elements in body in sequence
    body = doc_tree.find('w:body', ns)
    
    elements = []
    
    for child in body:
        # Check if paragraph or table
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            # Extract text
            texts = [t.text for t in child.findall('.//w:t', ns) if t.text]
            p_text = "".join(texts).strip()
            
            # Extract images (blip r:embed or imagedata r:id)
            img_rids = []
            for blip in child.findall('.//a:blip', ns):
                embed_id = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                if embed_id:
                    img_rids.append(embed_id)
            for imgdata in child.findall('.//v:imagedata', ns):
                rid = imgdata.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                if rid:
                    img_rids.append(rid)
                    
            elements.append({
                'type': 'p',
                'text': p_text,
                'images': img_rids
            })
        elif tag == 'tbl':
            # Table extraction
            for row in child.findall('.//w:tr', ns):
                for cell in row.findall('.//w:tc', ns):
                    texts = [t.text for t in cell.findall('.//w:t', ns) if t.text]
                    c_text = "".join(texts).strip()
                    img_rids = []
                    for blip in cell.findall('.//a:blip', ns):
                        embed_id = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                        if embed_id:
                            img_rids.append(embed_id)
                    for imgdata in cell.findall('.//v:imagedata', ns):
                        rid = imgdata.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                        if rid:
                            img_rids.append(rid)
                    if c_text or img_rids:
                        elements.append({
                            'type': 'cell',
                            'text': c_text,
                            'images': img_rids
                        })

    print(f"Extracted {len(elements)} block elements.")

    # Now group by numbered product headers e.g. "1. TixFree..." or "10. Liv.52..."
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
        # Check if it looks like a product heading (e.g. "1. TixFree Spot-On for Adult Cats")
        # Ensure it's not a numbered list item like "1. Apply..." inside directions by checking length and keywords
        if match and not any(text.lower().startswith(x) for x in ['1. apply', '2. apply', '1. store', '1. give', '2. give']):
            num = int(match.group(1))
            title = match.group(2).strip()
            
            # Start new product
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

    print(f"Identified {len(products)} products.")

    # Now let's extract media files for each product and parse fields
    parsed_products = []

    for p in products:
        num = p['number']
        header_title = p['header_title']
        lines = p['lines']
        raw_imgs = list(dict.fromkeys(p['images'])) # remove duplicates preserving order

        # Extract image files from zip
        saved_image_urls = []
        for idx, rid in enumerate(raw_imgs):
            target = rel_map.get(rid)
            if target:
                zip_target = 'word/' + target if not target.startswith('word/') else target
                # Normalize path
                zip_target = zip_target.replace('\\', '/')
                if zip_target in docx.namelist():
                    ext = os.path.splitext(zip_target)[1]
                    slug_safe = re.sub(r'[^a-z0-9]+', '_', header_title.lower()).strip('_')[:40]
                    img_filename = f"p{num}_{slug_safe}_{idx+1}{ext}"
                    dest_path = os.path.join(OUTPUT_IMG_DIR, img_filename)
                    with open(dest_path, 'wb') as f_out:
                        f_out.write(docx.read(zip_target))
                    saved_image_urls.append(f"/images/products/{img_filename}")

        # Field parsing
        full_text = "\n".join(lines)
        
        # Parse fields from lines
        product_name = header_title
        category = ""
        ingredients = ""
        indications = ""
        directions = ""
        packaging = ""
        storage_safety = ""
        description = ""

        # Let's parse known prefixes
        curr_field = "description"
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

        # Fallback for description if empty
        if not parsed_desc:
            parsed_desc = full_text[:400]

        # Determine brand
        brand = "PetSolutions"
        for candidate_brand in ["Himalaya", "Zoetis", "Virbac", "Bayer", "Biocan", "JosiCat", "Josera", "Drools", "Purina", "Royal Canin", "Catron", "Beaphar"]:
            if candidate_brand.lower() in parsed_name.lower() or candidate_brand.lower() in parsed_desc.lower():
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

        parsed_products.append({
            'number': num,
            'name': parsed_name,
            'header_title': header_title,
            'brand': brand,
            'category_raw': parsed_cat,
            'pet_type': pet_type,
            'ingredients': parsed_ingr,
            'indications': parsed_ind,
            'directions': parsed_dir,
            'packaging': parsed_pack,
            'storage_safety': parsed_storage,
            'description': parsed_desc,
            'images': saved_image_urls,
            'main_image': saved_image_urls[0] if saved_image_urls else None
        })

    print(f"Successfully processed {len(parsed_products)} products.")

    # Save to JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(parsed_products, f, indent=2, ensure_ascii=False)

    print("Saved products to JSON:", OUTPUT_JSON)
