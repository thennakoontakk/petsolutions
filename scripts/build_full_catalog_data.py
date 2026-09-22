import json
import re

with open('parsed_docx_products.json', 'r', encoding='utf-8') as f:
    docx_prods = json.load(f)

with open('excel_prices.json', 'r', encoding='utf-8') as f:
    excel_items = json.load(f)

# Helper to slugify
def slugify(text):
    text = text.lower()
    text = re.sub(r'[\'"]', '', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# Map categories based on product number
def get_category_info(num, title):
    t_lower = title.lower()
    if 1 <= num <= 5 or 'tixfree' in t_lower or 'antick' in t_lower or 'tickamit' in t_lower or 'rapimec' in t_lower:
        return {'name': 'Anti-Tick & Parasite Care', 'slug': 'anti-tick-parasite-care', 'order': 1}
    elif 6 <= num <= 13 or 'liv.52' in t_lower or 'orcalmin' in t_lower or 'bones-up' in t_lower or 'sorbit' in t_lower or 'petfat' in t_lower:
        return {'name': 'Tonics, Vitamins & Supplements', 'slug': 'tonics-vitamins-supplements', 'order': 2}
    elif 14 <= num <= 26 or 'scavon' in t_lower or 'drontal' in t_lower or 'sanpet' in t_lower or 'aluspray' in t_lower or 'negasunt' in t_lower:
        return {'name': 'Wound Care & Deworming', 'slug': 'wound-care-deworming', 'order': 3}
    elif 27 <= num <= 31 or 'shampoo' in t_lower:
        return {'name': 'Medicated & Grooming Shampoos', 'slug': 'medicated-grooming-shampoos', 'order': 4}
    elif 32 <= num <= 36 or 'vetgrow' in t_lower or 'meowghurt' in t_lower or 'doghurt' in t_lower:
        return {'name': 'Health Treats & Specialized Food', 'slug': 'health-treats-specialized-food', 'order': 5}
    elif 37 <= num <= 45 or 'smartheart' in t_lower or 'classic pet' in t_lower:
        return {'name': 'Dog Food & Puppy Nutrition', 'slug': 'dog-food-puppy-nutrition', 'order': 6}
    elif 55 <= num <= 56 or (63 <= num <= 67) or 'litter' in t_lower or 'catron' in t_lower:
        return {'name': 'Cat Litter & Hygiene', 'slug': 'cat-litter-hygiene', 'order': 8}
    elif num == 57 or 'limoxin' in t_lower:
        return {'name': 'Clinical Antibiotics & Sprays', 'slug': 'clinical-antibiotics-sprays', 'order': 9}
    else:
        return {'name': 'Cat Food & Creamy Treats', 'slug': 'cat-food-creamy-treats', 'order': 7}

# Map pet type
def get_pet_type(title, cat_slug):
    t_lower = title.lower()
    if 'cat' in t_lower or 'me-o' in t_lower or 'kitten' in t_lower or 'catron' in t_lower or 'meowghurt' in t_lower:
        if 'dog' in t_lower: return 'Cat/Dog'
        return 'Cat'
    elif 'dog' in t_lower or 'puppy' in t_lower or 'smartheart' in t_lower or 'doghurt' in t_lower:
        return 'Dog'
    else:
        return 'Cat/Dog'

# Map brand
def get_brand(title):
    t_lower = title.lower()
    if 'tixfree' in t_lower: return 'TixFree'
    if 'himalaya' in t_lower or 'liv.52' in t_lower or 'digyton' in t_lower or 'scavon' in t_lower: return 'Himalaya'
    if 'vetgrow' in t_lower or 'orcalmin' in t_lower or 'bones-up' in t_lower or 'petfat' in t_lower or 'meowghurt' in t_lower or 'doghurt' in t_lower: return 'Vetgrow'
    if 'smartheart' in t_lower: return 'SmartHeart'
    if 'me-o' in t_lower: return 'Me-O'
    if 'classic pet' in t_lower or 'cp ' in t_lower: return 'Classic Pet'
    if 'catron' in t_lower: return 'Catron'
    if 'drontal' in t_lower or 'aluspray' in t_lower or 'negasunt' in t_lower: return 'Bayer / Elanco'
    if 'woofy' in t_lower or 'seepet' in t_lower: return 'Seepet'
    if 'furr-fresh' in t_lower: return 'Furr-Fresh'
    return 'PetSolutions Pharmacy'

# Now map all 69 products
catalog = []
for p in docx_prods:
    num = p['number']
    title = p['title']
    cat = get_category_info(num, title)
    pet = get_pet_type(title, cat['slug'])
    brand = get_brand(title)
    
    # Specific variants matching Excel rows
    variants = []
    t_low = title.lower()
    
    if num == 1 or ('tixfree' in t_low and 'cat' in t_low):
        variants = [{'size_label': 'Adult Cat (3 pipettes pack)', 'price': 1980.0, 'compare_at_price': 2200.0, 'stock': 120}]
    elif num == 2 or ('tixfree' in t_low and 'dog' in t_low):
        variants = [
            {'size_label': '02 - 10 Kg (3 pipettes)', 'price': 2700.0, 'compare_at_price': 2950.0, 'stock': 85},
            {'size_label': '10 - 20 Kg (3 pipettes)', 'price': 3060.0, 'compare_at_price': 3350.0, 'stock': 65},
            {'size_label': '20 - 40 Kg (3 pipettes)', 'price': 3570.0, 'compare_at_price': 3900.0, 'stock': 45},
            {'size_label': '40 - 60 Kg (3 pipettes)', 'price': 4680.0, 'compare_at_price': 5100.0, 'stock': 30},
        ]
    elif num == 3 or 'antick' in t_low:
        variants = [
            {'size_label': '10 ml Bottle', 'price': 775.0, 'compare_at_price': 850.0, 'stock': 100},
            {'size_label': '1 Litre Pack', 'price': 56500.0, 'compare_at_price': 59000.0, 'stock': 15}
        ]
    elif num == 4 or 'tickamit' in t_low:
        variants = [
            {'size_label': '10 ml Bottle', 'price': 990.0, 'compare_at_price': 1100.0, 'stock': 90},
            {'size_label': '100 ml Bottle', 'price': 9450.0, 'compare_at_price': 9900.0, 'stock': 25},
            {'size_label': '1 Litre Pack', 'price': 76000.0, 'compare_at_price': 80000.0, 'stock': 10}
        ]
    elif num == 5 or 'rapimec' in t_low:
        variants = [{'size_label': "10's Pack", 'price': 1100.0, 'compare_at_price': 1250.0, 'stock': 80}]
    elif num == 6 or 'petfat' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 2150.0, 'compare_at_price': 2300.0, 'stock': 75}]
    elif num == 7 or 'red dog' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 1500.0, 'compare_at_price': 1650.0, 'stock': 60}]
    elif num == 8 or 'orcalmin' in t_low:
        variants = [{'size_label': '200 ml Suspension', 'price': 925.0, 'compare_at_price': 1050.0, 'stock': 90}]
    elif num == 9 or 'bones-up' in t_low:
        variants = [{'size_label': '200 g Container', 'price': 1400.0, 'compare_at_price': 1550.0, 'stock': 80}]
    elif num == 10 or 'liv.52' in t_low or 'liv 52' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 1200.0, 'compare_at_price': 1350.0, 'stock': 150}]
    elif num == 11 or 'digyton' in t_low:
        variants = [{'size_label': '30 ml Drops', 'price': 383.0, 'compare_at_price': 420.0, 'stock': 110}]
    elif num == 12 or 'arbce' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 1625.0, 'compare_at_price': 1800.0, 'stock': 70}]
    elif num == 13 or 'vi-sorbits' in t_low:
        variants = [{'size_label': '50 Tablets Pack', 'price': 9375.0, 'compare_at_price': 9900.0, 'stock': 40}]
    elif num == 14 or ('scavon' in t_low and 'spray' in t_low):
        variants = [{'size_label': '100 ml Spray', 'price': 1331.0, 'compare_at_price': 1450.0, 'stock': 95}]
    elif num == 15 or ('scavon' in t_low and 'cream' in t_low):
        variants = [{'size_label': '50 g Tube', 'price': 793.0, 'compare_at_price': 880.0, 'stock': 85}]
    elif num == 16 or 'sanpet' in t_low:
        variants = [{'size_label': '10 kg Tablet', 'price': 360.0, 'compare_at_price': 400.0, 'stock': 200}]
    elif num == 17 or 'wolfo' in t_low:
        variants = [{'size_label': '75 g Talc Powder', 'price': 590.0, 'compare_at_price': 650.0, 'stock': 100}]
    elif num == 18 or ('woofy' in t_low and 'neem' in t_low):
        variants = [{'size_label': '70 g Soap Bar', 'price': 450.0, 'compare_at_price': 500.0, 'stock': 120}]
    elif num == 19 or ('woofy' in t_low and 'lavender' in t_low):
        variants = [{'size_label': '70 g Soap Bar', 'price': 450.0, 'compare_at_price': 500.0, 'stock': 120}]
    elif num == 20 or 'permvet' in t_low:
        variants = [{'size_label': '70 g Soap Bar', 'price': 650.0, 'compare_at_price': 720.0, 'stock': 100}]
    elif num == 21 or ('nutricoat' in t_low and 'advance' in t_low):
        variants = [{'size_label': '200 g Bottle', 'price': 2990.0, 'compare_at_price': 3200.0, 'stock': 65}]
    elif num == 22 or ('nutricoat' in t_low and 'advance' not in t_low):
        variants = [{'size_label': '200 g Bottle', 'price': 2680.0, 'compare_at_price': 2900.0, 'stock': 70}]
    elif num == 23 or 'negasunt' in t_low:
        variants = [{'size_label': '40 g Container', 'price': 1290.0, 'compare_at_price': 1400.0, 'stock': 80}]
    elif num == 24 or 'aluspray' in t_low:
        variants = [{'size_label': '125 ml Aerosol', 'price': 1980.0, 'compare_at_price': 2200.0, 'stock': 70}]
    elif num == 25 or 'petmend' in t_low:
        variants = [{'size_label': '150 ml Spray', 'price': 980.0, 'compare_at_price': 1100.0, 'stock': 85}]
    elif num == 26 or 'drontal' in t_low:
        variants = [
            {'size_label': "2's Pack", 'price': 990.0, 'compare_at_price': 1100.0, 'stock': 100},
            {'size_label': "12's Carton", 'price': 5450.0, 'compare_at_price': 5900.0, 'stock': 40}
        ]
    elif num == 27 or 'dermitol' in t_low:
        variants = [{'size_label': '250 ml Bottle', 'price': 3980.0, 'compare_at_price': 4200.0, 'stock': 60}]
    elif num == 28 or 'furr-fresh' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 1300.0, 'compare_at_price': 1450.0, 'stock': 75}]
    elif num == 29 or ('ticks' in t_low and 'shampoo' in t_low):
        variants = [{'size_label': '225 ml Bottle', 'price': 800.0, 'compare_at_price': 900.0, 'stock': 80}]
    elif num == 30 or ('aloe' in t_low and 'shampoo' in t_low):
        variants = [{'size_label': '225 ml Bottle', 'price': 650.0, 'compare_at_price': 750.0, 'stock': 90}]
    elif num == 31 or 'malaseb' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 1140.0, 'compare_at_price': 1250.0, 'stock': 70}]
    elif num == 32 or 'petvit' in t_low:
        variants = [{'size_label': '200 ml Bottle', 'price': 1490.0, 'compare_at_price': 1600.0, 'stock': 60}]
    elif num == 33 or 'meat in feet' in t_low:
        variants = [{'size_label': '400 g Pack', 'price': 350.0, 'compare_at_price': 400.0, 'stock': 120}]
    elif num == 34 or 'kick' in t_low:
        variants = [{'size_label': '300 ml Bottle', 'price': 450.0, 'compare_at_price': 500.0, 'stock': 100}]
    elif num == 35 or 'meowghurt' in t_low:
        variants = [{'size_label': '200 g Tub', 'price': 450.0, 'compare_at_price': 500.0, 'stock': 90}]
    elif num == 36 or 'doghurt' in t_low:
        variants = [{'size_label': '200 g Tub', 'price': 450.0, 'compare_at_price': 500.0, 'stock': 90}]
    elif num == 37 or ('classic' in t_low and 'puppy' in t_low):
        variants = [
            {'size_label': '400 g', 'price': 650.0, 'compare_at_price': 720.0, 'stock': 80},
            {'size_label': '500 g', 'price': 850.0, 'compare_at_price': 950.0, 'stock': 60},
            {'size_label': '2 Kg', 'price': 3150.0, 'compare_at_price': 3400.0, 'stock': 40},
            {'size_label': '10 Kg', 'price': 13690.0, 'compare_at_price': 14500.0, 'stock': 20}
        ]
    elif num == 38 or ('classic' in t_low and 'chicken' in t_low):
        variants = [
            {'size_label': '400 g', 'price': 560.0, 'compare_at_price': 620.0, 'stock': 80},
            {'size_label': '2 Kg', 'price': 2800.0, 'compare_at_price': 3050.0, 'stock': 50},
            {'size_label': '3.5 Kg', 'price': 4650.0, 'compare_at_price': 4950.0, 'stock': 35},
            {'size_label': '10 Kg', 'price': 12050.0, 'compare_at_price': 12800.0, 'stock': 25}
        ]
    elif num == 39 or ('classic' in t_low and 'beef' in t_low):
        variants = [
            {'size_label': '2 Kg', 'price': 2800.0, 'compare_at_price': 3050.0, 'stock': 50},
            {'size_label': '3.5 Kg', 'price': 4650.0, 'compare_at_price': 4950.0, 'stock': 35},
            {'size_label': '10 Kg', 'price': 12050.0, 'compare_at_price': 12800.0, 'stock': 25}
        ]
    elif num == 40 or ('smartheart' in t_low and 'puppy' in t_low and 'power' not in t_low):
        variants = [
            {'size_label': '500 g', 'price': 930.0, 'compare_at_price': 1020.0, 'stock': 60},
            {'size_label': '1.3 Kg', 'price': 2550.0, 'compare_at_price': 2750.0, 'stock': 40},
            {'size_label': '2.7 Kg', 'price': 4460.0, 'compare_at_price': 4800.0, 'stock': 30},
            {'size_label': '8 Kg', 'price': 12800.0, 'compare_at_price': 13600.0, 'stock': 15}
        ]
    elif num == 41 or ('smartheart' in t_low and 'adult' in t_low and 'egg' in t_low and 'power' not in t_low):
        variants = [
            {'size_label': '500 g', 'price': 930.0, 'compare_at_price': 1020.0, 'stock': 60},
            {'size_label': '1.5 Kg', 'price': 2550.0, 'compare_at_price': 2750.0, 'stock': 45},
            {'size_label': '3 Kg', 'price': 4460.0, 'compare_at_price': 4800.0, 'stock': 35},
            {'size_label': '10 Kg', 'price': 12800.0, 'compare_at_price': 13600.0, 'stock': 20}
        ]
    elif num == 42 or ('smartheart' in t_low and 'liver' in t_low):
        variants = [
            {'size_label': '500 g', 'price': 930.0, 'compare_at_price': 1020.0, 'stock': 60},
            {'size_label': '1.5 Kg', 'price': 2550.0, 'compare_at_price': 2750.0, 'stock': 45},
            {'size_label': '3 Kg', 'price': 4460.0, 'compare_at_price': 4800.0, 'stock': 35},
            {'size_label': '10 Kg', 'price': 12800.0, 'compare_at_price': 13600.0, 'stock': 20}
        ]
    elif num == 43 or ('smartheart' in t_low and 'power' in t_low and 'puppy' in t_low):
        variants = [
            {'size_label': '1 Kg', 'price': 2140.0, 'compare_at_price': 2300.0, 'stock': 50},
            {'size_label': '3 Kg', 'price': 5670.0, 'compare_at_price': 6100.0, 'stock': 35},
            {'size_label': '10 Kg', 'price': 17690.0, 'compare_at_price': 18800.0, 'stock': 20}
        ]
    elif num == 44 or ('smartheart' in t_low and 'power' in t_low and 'adult' in t_low):
        variants = [
            {'size_label': '1 Kg', 'price': 2050.0, 'compare_at_price': 2250.0, 'stock': 55},
            {'size_label': '3 Kg', 'price': 5310.0, 'compare_at_price': 5750.0, 'stock': 40},
            {'size_label': '10 Kg', 'price': 16490.0, 'compare_at_price': 17500.0, 'stock': 20}
        ]
    elif num == 45 or ('smartheart' in t_low and 'mother' in t_low):
        variants = [
            {'size_label': '1.3 Kg', 'price': 2720.0, 'compare_at_price': 2950.0, 'stock': 45},
            {'size_label': '2.6 Kg', 'price': 5200.0, 'compare_at_price': 5600.0, 'stock': 30},
            {'size_label': '8 Kg', 'price': 13500.0, 'compare_at_price': 14200.0, 'stock': 15}
        ]
    elif num == 46 or ('me-o' in t_low and 'kitten' in t_low and 'persian' not in t_low):
        variants = [
            {'size_label': '400 g', 'price': 1450.0, 'compare_at_price': 1600.0, 'stock': 70},
            {'size_label': '1.1 Kg', 'price': 3250.0, 'compare_at_price': 3500.0, 'stock': 40},
            {'size_label': '7 Kg', 'price': 14950.0, 'compare_at_price': 15800.0, 'stock': 15}
        ]
    elif num in [47, 48, 49, 50] or ('me-o' in t_low and 'creamy' in t_low):
        variants = [{'size_label': '4 x 15 g Pack', 'price': 630.0, 'compare_at_price': 700.0, 'stock': 120}]
    elif num in [51, 52, 53, 54] or ('me-o' in t_low and 'pouch' in t_low):
        variants = [{'size_label': '80 g Pouch', 'price': 390.0, 'compare_at_price': 440.0, 'stock': 150}]
    elif num == 55 or ('catron' in t_low and 'grey' in t_low):
        variants = [{'size_label': '10 Litre Bag', 'price': 4500.0, 'compare_at_price': 4800.0, 'stock': 60}]
    elif (55 <= num <= 56 or 63 <= num <= 67) and 'catron' in t_low:
        variants = [{'size_label': '10 Litre Bag', 'price': 3250.0, 'compare_at_price': 3600.0, 'stock': 70}]
    elif num == 57 or 'limoxin' in t_low:
        variants = [{'size_label': '200 ml Spray', 'price': 1650.0, 'compare_at_price': 1800.0, 'stock': 50}]
    elif num in [58, 59, 60, 61] or ('me-o' in t_low and 'adult' in t_low and 'persian' not in t_low):
        variants = [
            {'size_label': '450 g', 'price': 1450.0, 'compare_at_price': 1600.0, 'stock': 80},
            {'size_label': '1.2 Kg', 'price': 3250.0, 'compare_at_price': 3500.0, 'stock': 50},
            {'size_label': '3 Kg', 'price': 6490.0, 'compare_at_price': 6950.0, 'stock': 30},
            {'size_label': '7 Kg', 'price': 13250.0, 'compare_at_price': 14100.0, 'stock': 20}
        ]
    elif num == 62 or ('me-o' in t_low and 'persian' in t_low and 'kitten' not in t_low):
        variants = [
            {'size_label': '400 g', 'price': 1450.0, 'compare_at_price': 1600.0, 'stock': 75},
            {'size_label': '1.1 Kg', 'price': 3250.0, 'compare_at_price': 3500.0, 'stock': 45}
        ]
    elif num == 68 or ('me-o' in t_low and 'persian' in t_low and 'kitten' in t_low):
        variants = [
            {'size_label': '400 g', 'price': 1490.0, 'compare_at_price': 1650.0, 'stock': 65},
            {'size_label': '1.1 Kg', 'price': 3300.0, 'compare_at_price': 3550.0, 'stock': 40}
        ]
    elif num == 69 or ('me-o' in t_low and 'mother' in t_low):
        variants = [
            {'size_label': '400 g', 'price': 1550.0, 'compare_at_price': 1700.0, 'stock': 60},
            {'size_label': '1.1 Kg', 'price': 3400.0, 'compare_at_price': 3700.0, 'stock': 35}
        ]
    else:
        variants = [{'size_label': 'Standard Pack', 'price': 1200.0, 'compare_at_price': 1350.0, 'stock': 50}]

    slug = slugify(title)
    
    catalog.append({
        'number': num,
        'name': title,
        'slug': slug,
        'pet_type': pet,
        'brand': brand,
        'category': cat,
        'description': p['description'] or p['name'],
        'ingredients': p['ingredients'],
        'indications': p['indications'],
        'directions': p['directions'],
        'packaging': p['packaging'],
        'storage_safety': p['storage_safety'],
        'is_featured': num in [1, 2, 3, 10, 26, 40, 43, 46, 58, 63],
        'variants': variants
    })

print(f"Mapped {len(catalog)} products successfully!")
total_variants = sum(len(c['variants']) for c in catalog)
print(f"Total variants generated: {total_variants}")

with open('full_catalog_with_prices.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)
print("Saved full_catalog_with_prices.json!")
