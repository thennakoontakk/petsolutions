import json

with open('scratch_db_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('scratch_folders_data.json', 'r', encoding='utf-8') as f:
    folders = json.load(f)

# Build a lookup for folders by (batch, folder_id)
folder_map = {}
for f in folders:
    key = f"{f['batch']}/{f['folder']}"
    folder_map[key] = f

# Explicit high-accuracy mapping table based on verified file contents
# Format: slug -> (batch, folder_id, notes)
MAPPING_RULES = {
    # Veterinary Spot-On & Oral Anti-parasitic
    'tixfree-spot-on-for-adult-cats-1': ('Batch 2', '63', 'Tixfree Spot-On Cat'),
    'tixfree-spot-on-for-dogs': ('Batch 2', '64', 'Tixfree Spot-On Dog'),
    'antick-10': ('Batch 2', '50', 'Antick 10%'),
    'tickamit-12-5': ('Batch 2', '51', 'Tickamit 12.5'),
    'rapimec-ivermectin-10-mg-tablets': ('Batch 2', '58', 'Rapimec Ivermectin 10mg Tablets'),
    'drontal-plus-tasty': ('Batch 2', '60', 'Drontal Plus Tasty Dog Dewormer'),
    'sanpet-plus': ('Batch 2', '78', 'Sanpet Plus Broad Spectrum Dewormer'),
    
    # Supplements, Tonics & Liquids
    'petfat-liquid-200-ml': ('Batch 2', '75', 'Petfat Liquid 200ml'),
    'vetgrow-red-dogs-200-ml': ('Batch 2', '74', 'Vetgrow Red Dogs 200ml'),
    'orcalmin-suspension-200-ml': ('Batch 2', '102', 'Orcalmin Vet Suspension 200ml'),
    'vetgrow-bones-up-mineral-and-vitamin-supplement': ('Batch 2', '99', 'Vetgrow Bones-Up Supplement'),
    'himalaya-liv-52-pet-200-ml': ('Batch 2', '70', 'Himalaya Liv.52 Pet Liquid 200ml'),
    'himalaya-digyton-drops-30-ml': ('Batch 2', '56', 'Himalaya Digyton Drops 30ml'),
    'arbce-pet-with-a-200-ml': ('Batch 2', '49', 'aRBCe Pet 200ml Tonic'),
    'vi-sorbits-tablets-50s': ('Batch 2', '90', 'Vi-Sorbits Chewable Tablets 50s'),
    'nutricoat-advance': ('Batch 2', '72', 'Petcare Nutricoat Advance'),
    'nutricoat-syrup': ('Batch 2', '48', 'Nutri-Coat Palatable Tonic/Syrup'),
    'petvit-liquid-200-ml': ('Batch 2', '73', 'Petvit Liquid 200ml'),
    'vetgrow-kick-in-punch-300-ml': ('Batch 2', '80', 'Vetgrow Kick in Punch 300ml'),
    'vetgrow-meowghurt-200-g': ('Batch 2', '81', 'Vetgrow Meowghurt 200g'),
    'vetgrow-doghurt-200-g': ('Batch 2', '82', 'Vetgrow Doghurt 200g'),
    'vetgrow-meat-in-feet-400-g-33': ('Batch 2', '79', 'Vetgrow Meat in Feet 400g'),

    # Wound & Topical Care / Sprays / Powders
    'himalaya-scavon-vet-spray-100-ml': ('Batch 2', '88', 'Scavon Vet Spray 100ml'),
    'himalaya-scavon-vet-cream-50-g': ('Batch 2', '88', 'Scavon Vet Cream 50g'),
    'wolfo-flea-tick-powder-for-dogs-and-cats': ('Batch 2', '100', 'Wolfo Flea & Tick Powder'),
    'negasunt-powder': ('Batch 2', '92', 'Negasunt Dusting Powder'),
    'aluspray-awd': ('Batch 2', '86', 'Aluspray-AWD Aerosol'),
    'petmend-spray-150-ml': ('Batch 2', '95', 'Petmend Herbal Spray 150ml'),
    'limoxin-25-spray-57': ('Batch 2', '93', 'Limoxin-25 Spray'),

    # Soaps & Shampoos
    'woofy-medicated-neem-soap-70-g': ('Batch 2', '47', 'Woofy Medicated Neem Soap 70g'),
    'seepet-woofy-lavender-soap-70-g': ('Batch 2', '62', 'Woofy Lavender Soap 70g'),
    'permvet-medicated-dog-soap-70-g': ('Batch 2', '46', 'Permvet Medicated Dog Soap 70g'),
    'dermitol-shampoo': ('Batch 2', '84', 'Dermitol Medicated Shampoo'),
    'furr-fresh-medicated-shampoo-100-ml': ('Batch 2', '97', 'Furr-Fresh Medicated Shampoo'),
    'ticks-fleas-shampoo-225-ml-29': ('Batch 2', '101', 'Dymec Ticks & Fleas Shampoo 225ml'),
    'aloe-vera-shampoo-conditioner-225-ml-30': ('Batch 2', '91', 'Dymec Aloe Vera Shampoo & Conditioner 225ml'),
    'malaseb-shampoo-200-ml-31': ('Batch 2', '83', 'Malaseb Dog & Cat Medicated Shampoo 200ml'),

    # SmartHeart Dog Foods
    'smartheart-power-pack-puppy': ('Batch 1', '2', 'SmartHeart Power Pack Puppy'),
    'smartheart-power-pack-adult': ('Batch 1', '5', 'SmartHeart Power Pack Adult'),
    'smartheart-mother-baby-dog': ('Batch 1', '3', 'SmartHeart Mother & Baby Dog'),
    'smartheart-puppy-chicken-egg-milk': ('Batch 1', '4', 'SmartHeart Puppy Pouch Chicken Egg Milk'),
    'smartheart-adult-dog-chicken-egg': ('Batch 1', '1', 'SmartHeart Adult Dog Chicken & Egg Pouch'),
    'smartheart-adult-dog-chicken-liver': ('Batch 1', '42', 'SmartHeart Adult Dog Chicken & Liver Pouch'),

    # Classic Pets Dog Foods
    'classic-pet-puppy-milk-flavor': ('Batch 1', '25', 'Classic Pets Puppy Milk Flavor'),
    'classic-pet-adult-dog-chicken-flavour': ('Batch 1', '40', 'Classic Pets Adult Dog Chicken Flavor'),
    'classic-pet-adult-dog-beef-flavour': ('Batch 1', '39', 'Classic Pets Adult Dog Beef Flavor'),

    # Me-O Cat Dry Foods
    'me-o-kitten-ocean-fish': ('Batch 1', '11', 'Me-O Kitten Ocean Fish 1.1kg/Dry'),
    'me-o-adult-cat-dry-food-tuna-flavour': ('Batch 1', '6', 'Me-O Adult Cat Dry Food Tuna Flavor'),
    'me-o-adult-cat-dry-food-seafood-flavour': ('Batch 1', '16', 'Me-O Adult Cat Dry Food Seafood Flavor'),
    'me-o-adult-cat-dry-food-mackerel-flavour': ('Batch 1', '7', 'Me-O Adult Cat Dry Food Mackerel Flavor'),
    'me-o-adult-cat-dry-food-chicken-vegetables-61': ('Batch 1', '13', 'Me-O Adult Cat Dry Food Chicken & Veg'),
    'me-o-persian-cat-food-anti-hairball': ('Batch 1', '18', 'Me-O Persian Cat Food Anti-Hairball'),
    'me-o-mother-and-baby-cat-69': ('Batch 1', '23', 'Me-O Persian Kitten / Mother & Baby Cat'),

    # Me-O Creamy Treats
    'me-o-creamy-treats-bonito-flavor': ('Batch 1', '44', 'Me-O Creamy Treats Bonito Flavor (4x15g)'),
    'me-o-creamy-treats-chicken-liver-flavor': ('Batch 1', '45', 'Me-O Creamy Treats Chicken Liver Flavor (4x15g)'),
    'me-o-creamy-treats-crab-flavor': ('Batch 1', '46', 'Me-O Creamy Treats Crab Flavor (4x15g)'),
    'me-o-creamy-treats-salmon-flavor': ('Batch 1', '43', 'Me-O Creamy Treats Salmon Flavor (4x15g)'),

    # Me-O Cat Wet Food Pouches (80g)
    'me-o-pouch-tuna-in-jelly': ('Batch 1', '14', 'Me-O Pouch Tuna in Jelly 80g'),
    'me-o-pouch-ocean-fish-in-jelly': ('Batch 1', '12', 'Me-O Pouch Ocean Fish in Jelly 80g'),
    'me-o-pouch-tuna-with-sardine-in-jelly': ('Batch 1', '15', 'Me-O Pouch Tuna with Sardine in Jelly 80g'),
    'me-o-pouch-tuna-topping-with-white-fish': ('Batch 1', '17', 'Me-O Pouch Tuna Topping with Whitefish 80g'),

    # Catron Cat Litters
    'catron-bentonite-cat-litter-grey-color-natural': ('Batch 1', '27', 'Catron Bentonite Cat Litter Grey Natural 5L/10L'),
    'catron-bentonite-cat-litter-grey-control-55': ('Batch 1', '27', 'Catron Bentonite Cat Litter Grey Control 5L/10L'),
    'catron-bentonite-cat-litter-lavender': ('Batch 1', '29', 'Catron Bentonite Cat Litter Lavender 5L/10L'),
    'catron-bentonite-cat-litter-baby-powder': ('Batch 1', '30', 'Catron Bentonite Cat Litter Baby Powder 5L/10L'),
    'catron-bentonite-cat-litter-marseille-soap': ('Batch 1', '31', 'Catron Bentonite Cat Litter Marseille Soap 5L/10L'),
    'catron-bentonite-cat-litter-green-apple': ('Batch 1', '32', 'Catron Bentonite Cat Litter Green Apple 5L/10L'),
    'catron-bentonite-cat-litter-coconut-vanilla-66': ('Batch 1', '33', 'Catron Bentonite Cat Litter Coconut & Vanilla'),
    'catron-bentonite-cat-litter-cappuccino-67': ('Batch 1', '28', 'Catron Bentonite Cat Litter White / Cappuccino'),
    'me-o-persian-kitten-68': ('Batch 1', '23', 'Me-O Persian Kitten 1.1kg'),
    'orcalmin-suspension-pack-200-ml': ('Batch 2', '102', 'Orcalmin Vet Suspension 200ml'),
}

# Also handle Fluralaner products if they are in DB
final_report = []
unmapped = []

for p in products:
    slug = p['slug']
    rule = MAPPING_RULES.get(slug)
    if not rule:
        # Check partial slug
        for r_slug, r_val in MAPPING_RULES.items():
            if r_slug in slug or slug in r_slug:
                rule = r_val
                break
    
    if rule:
        bname, f_id, note = rule
        key = f"{bname}/{f_id}"
        f_info = folder_map.get(key)
        files = f_info['files'] if f_info else []
        final_report.append({
            'id': p['id'],
            'name': p['name'],
            'slug': slug,
            'batch': bname,
            'folder': f_id,
            'note': note,
            'image_count': len(files),
            'files': files
        })
    else:
        unmapped.append(p)

print(f"Mapped {len(final_report)} out of {len(products)} products!")
print(f"Unmapped: {len(unmapped)}")
for u in unmapped:
    print(f"  - {u['name']} ({u['slug']})")

with open('scratch_final_mapping.json', 'w', encoding='utf-8') as out:
    json.dump({'mapped': final_report, 'unmapped': unmapped}, out, indent=2)
