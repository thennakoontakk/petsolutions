import json
import os
import re

with open('scratch_db_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('scratch_folders_data.json', 'r', encoding='utf-8') as f:
    folders = json.load(f)

# Build a rich text representation of each folder
for f in folders:
    # combine all filenames in this folder
    txt = " ".join(f['files'])
    # clean up punctuation and underscores for searching
    clean_txt = re.sub(r'[_.\-–/()]+', ' ', txt).lower()
    f['clean_txt'] = clean_txt

mapping = []

# Helper keywords / rules for products
def find_best_folder(p):
    pname = p['name'].lower()
    pslug = p['slug'].lower()
    pbrand = (p.get('brand') or '').lower()
    
    candidates = []
    
    for f in folders:
        ftxt = f['clean_txt']
        score = 0
        
        # Exact product name checks
        if 'tixfree' in pslug:
            if 'tixfree' in ftxt:
                score += 10
                if 'cat' in pslug and 'cat' in ftxt: score += 15
                elif '40' in pslug and '40' in ftxt: score += 15
                elif '20' in pslug and '20' in ftxt: score += 15
                elif '10' in pslug and '10' in ftxt: score += 15
                elif '02' in pslug or '2' in pslug: score += 10
        elif 'fluralaner' in pslug or 'petgard' in pslug:
            if 'petgard' in ftxt or 'fluralaner' in ftxt:
                score += 10
        elif 'liv-52' in pslug or 'liv.52' in pname.lower():
            if 'liv 52' in ftxt or 'liv52' in ftxt:
                score += 30
        elif 'digyton' in pslug:
            if 'digyton' in ftxt: score += 30
        elif 'arbce' in pslug:
            if 'arbce' in ftxt: score += 30
        elif 'vi-sorbits' in pslug or 'visorbits' in pslug:
            if 'sorbits' in ftxt: score += 30
        elif 'scavon' in pslug:
            if 'scavon' in ftxt:
                score += 20
                if 'spray' in pslug and 'spray' in ftxt: score += 15
                if 'cream' in pslug and 'cream' in ftxt: score += 15
        elif 'sanpet' in pslug:
            if 'sanpet' in ftxt: score += 30
        elif 'wolfo' in pslug:
            if 'wolfo' in ftxt: score += 30
        elif 'bolfo' in pslug:
            if 'bolfo' in ftxt: score += 30
        elif 'woofy' in pslug:
            if 'woofy' in ftxt:
                score += 20
                if 'neem' in pslug and 'neem' in ftxt: score += 15
                if 'lavender' in pslug and 'lavender' in ftxt: score += 15
        elif 'permvet' in pslug:
            if 'permvet' in ftxt: score += 30
        elif 'nutricoat' in pslug or 'nutri-coat' in pslug:
            if 'nutri coat' in ftxt or 'nutricoat' in ftxt:
                score += 20
                if 'advance' in pslug and 'advance' in ftxt: score += 15
                if 'syrup' in pslug and ('syrup' in ftxt or 'tonic' in ftxt): score += 15
        elif 'negasunt' in pslug:
            if 'negasunt' in ftxt: score += 30
        elif 'aluspray' in pslug:
            if 'aluspray' in ftxt: score += 30
        elif 'petmend' in pslug:
            if 'petmend' in ftxt: score += 30
        elif 'drontal' in pslug:
            if 'drontal' in ftxt: score += 30
        elif 'dermitol' in pslug:
            if 'dermitol' in ftxt: score += 30
        elif 'furr-fresh' in pslug or 'furrfresh' in pslug:
            if 'furrfresh' in ftxt or 'furr fresh' in ftxt: score += 30
        elif 'malaseb' in pslug:
            if 'malaseb' in ftxt: score += 30
        elif 'petvit' in pslug:
            if 'petvit' in ftxt: score += 30
        elif 'kick-in-punch' in pslug:
            if 'kick' in ftxt or 'punch' in ftxt: score += 30
        elif 'meowghurt' in pslug:
            if 'meowghurt' in ftxt or 'meow' in ftxt: score += 30
        elif 'doghurt' in pslug:
            if 'doghurt' in ftxt: score += 30
        elif 'catron' in pslug:
            if 'catron' in ftxt:
                score += 15
                if 'grey' in pslug and ('grey' in ftxt or 'gray' in ftxt): score += 20
                if 'lavender' in pslug and 'lavender' in ftxt: score += 20
                if 'baby' in pslug and 'baby' in ftxt: score += 20
                if 'marseil' in pslug and 'marseil' in ftxt: score += 20
                if 'green' in pslug and 'green' in ftxt: score += 20
                if 'apple' in pslug and 'apple' in ftxt: score += 20
        elif 'classic-pet' in pslug:
            if 'classic' in ftxt:
                score += 15
                if 'puppy' in pslug and 'puppy' in ftxt: score += 15
                if 'chicken' in pslug and 'chicken' in ftxt: score += 15
                if 'beef' in pslug and 'beef' in ftxt: score += 15
        elif 'smartheart' in pslug:
            if 'smartheart' in ftxt:
                score += 10
                if 'power-pack' in pslug or 'power pack' in pname:
                    if 'power' in ftxt: score += 20
                    if 'puppy' in pslug and 'puppy' in ftxt: score += 15
                    if 'adult' in pslug and 'adult' in ftxt: score += 15
                elif 'mother' in pslug and ('mother' in ftxt or 'baby' in ftxt): score += 25
                elif 'puppy' in pslug and 'puppy' in ftxt: score += 15
                elif 'chicken' in pslug and 'chicken' in ftxt: score += 10
                elif 'liver' in pslug and 'liver' in ftxt: score += 10
                elif 'egg' in pslug and 'egg' in ftxt: score += 10
        elif 'me-o' in pslug or 'me o' in pname:
            if 'me o' in ftxt or 'me-o' in ftxt:
                score += 10
                if 'treats' in pslug or 'creamy' in pslug:
                    if 'creamy' in ftxt or 'treats' in ftxt: score += 15
                    if 'bonito' in pslug and 'bonito' in ftxt: score += 20
                    if 'crab' in pslug and 'crab' in ftxt: score += 20
                    if 'salmon' in pslug and 'salmon' in ftxt: score += 20
                    if 'chicken' in pslug and 'chicken' in ftxt: score += 20
                elif 'pouch' in pslug:
                    if 'pouch' in ftxt or 'sachet' in ftxt: score += 15
                    if 'ocean' in pslug and 'ocean' in ftxt: score += 15
                    if 'sardine' in pslug and 'sardine' in ftxt: score += 20
                    if 'white' in pslug and 'white' in ftxt: score += 20
                elif 'persian' in pslug:
                    if 'persian' in ftxt or 'hairball' in ftxt: score += 25
                elif 'kitten' in pslug and 'kitten' in ftxt: score += 20
                elif 'dry' in pslug or 'food' in pslug:
                    if 'tuna' in pslug and 'tuna' in ftxt: score += 15
                    if 'seafood' in pslug and 'seafood' in ftxt: score += 20
                    if 'mackerel' in pslug and 'mackerel' in ftxt: score += 20
                    if 'chicken' in pslug and 'chicken' in ftxt: score += 15
        elif 'rapimec' in pslug:
            if 'rapimec' in ftxt or 'ivermectin' in ftxt: score += 30
        elif 'antick' in pslug:
            if 'antick' in ftxt: score += 30
        elif 'tickamit' in pslug:
            if 'tickamit' in ftxt: score += 30
        elif 'petfat' in pslug:
            if 'petfat' in ftxt: score += 30
        elif 'red-dogs' in pslug:
            if 'red dogs' in ftxt: score += 30
        elif 'orcalmin' in pslug:
            if 'orcalmin' in ftxt: score += 30
        elif 'limoxin' in pslug:
            if 'limoxin' in ftxt: score += 30

        if score > 0:
            candidates.append((score, f))
            
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0] if candidates else (0, None)

matches = []
unmatched = []

for p in products:
    score, best_f = find_best_folder(p)
    if best_f and score >= 15:
        matches.append({
            'product_id': p['id'],
            'product_name': p['name'],
            'product_slug': p['slug'],
            'batch': best_f['batch'],
            'folder': best_f['folder'],
            'score': score,
            'files': best_f['files']
        })
    else:
        unmatched.append(p)

print(f"Matched: {len(matches)} / {len(products)}")
print(f"Unmatched: {len(unmatched)}")

with open('scratch_mapping_preview.json', 'w', encoding='utf-8') as f:
    json.dump({'matches': matches, 'unmatched': unmatched}, f, indent=2)

print("\n--- SAMPLE MATCHES ---")
for m in matches[:25]:
    print(f"[MATCH] {m['product_name']}  --->  [{m['batch']}] Folder {m['folder']} ({len(m['files'])} images)")

if unmatched:
    print("\n--- UNMATCHED PRODUCTS ---")
    for u in unmatched:
        print(f"[UNMATCHED] {u['name']} ({u['slug']})")

