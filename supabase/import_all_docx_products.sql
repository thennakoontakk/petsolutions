-- ==========================================================================
-- PetSolutions.lk — Full Catalog Import from Client Word Document
-- Run this script in Supabase SQL Editor to replace dummy products with the real 69 products
-- ==========================================================================

-- 1. Clear existing dummy store data
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM product_variants;
DELETE FROM products;

-- 2. Ensure Categories Exist
INSERT INTO categories (name, slug, description, parent_category, display_order) VALUES
  ('Parasite & Tick Control', 'parasite-tick-control', 'Spot-on treatments, tick sprays, collars and dewormers.', 'Cat/Dog', 1),
  ('Health & Supplements', 'health-supplements', 'Liver support, vitamins, haematinics, calcium and metabolic tonics.', 'Cat/Dog', 2),
  ('Wound Care & Topical Pharmacy', 'wound-care-topical-pharmacy', 'Antiseptic wound sprays, healing creams and lotions.', 'Cat/Dog', 3),
  ('Medicated Shampoos & Grooming', 'medicated-shampoos-grooming', 'Antibacterial, antifungal and coat care grooming products.', 'Cat/Dog', 4),
  ('Dry & Wet Pet Food', 'dry-wet-pet-food', 'Complete nutrition premium dry kibbles and pouches for cats and dogs.', 'Cat/Dog', 5),
  ('Cat Litter & Hygiene', 'cat-litter-hygiene', 'Bentonite, scented and natural clumping cat litter.', 'Cat', 6)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

DO $$
DECLARE
  cat_parasite UUID;
  cat_health UUID;
  cat_wound UUID;
  cat_grooming UUID;
  cat_food UUID;
  cat_litter UUID;
  pid UUID;
BEGIN
  SELECT id INTO cat_parasite FROM categories WHERE slug = 'parasite-tick-control';
  SELECT id INTO cat_health FROM categories WHERE slug = 'health-supplements';
  SELECT id INTO cat_wound FROM categories WHERE slug = 'wound-care-topical-pharmacy';
  SELECT id INTO cat_grooming FROM categories WHERE slug = 'medicated-shampoos-grooming';
  SELECT id INTO cat_food FROM categories WHERE slug = 'dry-wet-pet-food';
  SELECT id INTO cat_litter FROM categories WHERE slug = 'cat-litter-hygiene';

  -- #1. TixFree Spot-On for Adult Cats
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'TixFree Spot-On for Adult Cats',
    'tixfree-spot-on-for-adult-cats-1',
    'PetSolutions',
    cat_parasite,
    'Cat',
    'TixFree Spot-On for Adult Cats contains fipronil 10% w/v for topical control of common external parasites including fleas, ticks and biting lice. Apply the complete pipette directly to the skin at the back of the neck, following the pack instructions for retreatment intervals. The adult-cat presentation is 0.5 ml and is available as individual pipettes and multi-dose retail packs. For veterinary use only; avoid contact with the eyes and mouth and follow all label precautions.',
    'Fipronil 10% w/v. It is marketed for control of fleas, ticks and biting lice on cats.',
    NULL,
    'Apply the complete single-dose pipette directly to exposed skin at the base/back of the neck where the cat cannot readily lick it. The local retailer instructions describe monthly protection and recommend keeping the animal dry for about 48 hours after application.',
    'A small single-use plastic spot-on pipette, sold individually or as a three-dose carton.',
    'The detailed local listing says to avoid use in sick or convalescent animals and rabbits, avoid the eyes and mouth, prevent children from handling the application area, and store below 30°C in a dry place; the formulation should be treated as flammable until dry.',
    '/images/products/p1_tixfree_spot_on_for_adult_cats_1.png',
    ARRAY['/images/products/p1_tixfree_spot_on_for_adult_cats_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #2. TixFree Spot-On for Dogs
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'TixFree Spot-On for Dogs',
    'tixfree-spot-on-for-dogs-2',
    'PetSolutions',
    cat_parasite,
    'Cat/Dog',
    'TixFree Spot-On for Dogs contains fipronil 10% and provides topical protection against common external parasites such as fleas and ticks. The range includes weight-specific presentations for dogs from 2-10 kg through to over 40 kg, with individual and three-dose packs available. Apply the full contents of the appropriate pipette directly onto exposed skin according to the label. Always select the exact weight category shown on the pack rather than adjusting another size.',
    NULL,
    NULL,
    'Select the presentation for the dog''s body weight, part the hair and empty the complete pipette onto the skin rather than the coat. The local retailer instructions emphasize using the correct weight-specific dose.',
    'Weight-coded single-dose pipettes, sold individually or in three-dose boxes.',
    'Detailed storage information for every dog SKU was not recovered; use only the correctly labeled canine weight range and follow the pack''s external-use precautions. Do not calculate a different dose from the concentration when a weight-specific pipette is available.',
    '/images/products/p2_tixfree_spot_on_for_dogs_1.png',
    ARRAY['/images/products/p2_tixfree_spot_on_for_dogs_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #3. Antick 10%
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Antick 10%',
    'antick-10-3',
    'PetSolutions',
    cat_parasite,
    'Dog',
    'Antick 10% contains cypermethrin 10 g/100 ml and is designed for external parasite control in dogs and several livestock species. Controls ticks, fleas, lice and flies among its target parasites. The published dilution is 1 ml in 1 L of water for whole-body spraying, subject to the individual product label. Available pack sizes are 10 ml and 1 L.',
    'The official listing gives cypermethrin 10 g per 100 ml, equivalent to a 10% formulation, in solvent/emulsifying vehicle.
Indications / directions: Activity against flies, lice, fleas and ticks in livestock and dogs. The published instruction is 1 ml per 1 L of water as a whole-body spray.',
    NULL,
    NULL,
    'Small concentrate bottles in the 10-ml sizes and a larger 1-L bottle.',
    NULL,
    '/images/products/p3_antick_10_1.png',
    ARRAY['/images/products/p3_antick_10_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10ML', 775.0, 852.50, 50);

  -- #4. Tickamit 12.5
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Tickamit 12.5',
    'tickamit-12-5-4',
    'PetSolutions',
    cat_parasite,
    'Cat/Dog',
    'Calier Tickamit 12.5 is a concentrated amitraz-based ectoparasiticide for management of ticks, lice and mites in dogs and selected livestock species. Sri Lankan listings identify 10 ml, 100 ml and 1 L packs. As the product is a concentrate, dilution and application must follow the exact veterinary label for the intended animal. Do not transfer dosage instructions from a different market or species without veterinary confirmation.',
    NULL,
    'Marketed for control of ticks, lice and mites in animals including dogs and several livestock species; the product information also refers to ectoparasites resistant to some phosphorate/pyrethroid treatments.',
    NULL,
    NULL,
    NULL,
    '/images/products/p4_tickamit_12_5_1.png',
    ARRAY['/images/products/p4_tickamit_12_5_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10ML', 990.0, 1089.00, 50);

  -- #5. Rapimec - Ivermectin 10 mg Tablets
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Rapimec - Ivermectin 10 mg Tablets',
    'rapimec-ivermectin-10-mg-tablets-5',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Rapimec is a veterinary ivermectin tablet containing 10 mg ivermectin per tablet. The product is for management of generalized demodicosis in dogs and supplies it in a 1 × 10-tablet presentation. Because ivermectin dosing depends on the animal and clinical indication, the manufacturer''s listing directs users to follow veterinary-practitioner instructions.',
    NULL,
    NULL,
    'As directed by the veterinary practitioner rather than giving a consumer self-dosing schedule.',
    'Ten tablets, normally presented as a blister/strip within retail packaging.',
    NULL,
    '/images/products/p5_rapimec_ivermectin_10_mg_tablets_1.png',
    ARRAY['/images/products/p5_rapimec_ivermectin_10_mg_tablets_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #6. Petfat Liquid 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Petfat Liquid 200 ml',
    'petfat-liquid-200-ml-6',
    'PetSolutions',
    cat_food,
    'Cat/Dog',
    'Petfat Liquid provides concentrated omega-3 triglycerides with EPA and DHA for nutritional skin and coat support. Each 2 g serving contains at least 440 mg total omega-3 triglycerides, including at least 280 mg EPA and 160 mg DHA. Hayleys lists a daily feeding rate of 2 g per 5 kg body weight, with one pump delivering approximately 2 g. The product is supplied in a 200 ml bottle for convenient addition to food.',
    NULL,
    'Nutritional support for skin and coat health and provision of concentrated omega-3 fatty acids.',
    '2 g per 5 kg body weight daily, administered through feed; one pump = 2 g according to the product listing.',
    '200-ml dispensing bottle, with a pump calibrated to approximately 2 g per actuation.',
    'Specific storage conditions were unspecified. Use as a feed supplement at the recommended amount.',
    '/images/products/p6_petfat_liquid_200_ml_1.png',
    ARRAY['/images/products/p6_petfat_liquid_200_ml_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '2 g', 1500.0, 1650.00, 50);

  -- #7. Vetgrow Red Dogs 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vetgrow Red Dogs 200 ml',
    'vetgrow-red-dogs-200-ml-7',
    'PetSolutions',
    cat_food,
    'Cat/Dog',
    'Vetgrow Red Dogs is a veterinary-developed nutritional liquid for dogs, providing essential fatty acids including DHA, DPA and EPA. It is designed to support healthy skin, a glossy coat and everyday energy and activity. A local product listing recommends 5 ml per 10 kg body weight daily, given directly or with food. Retail presentations include 200 ml.',
    NULL,
    'Skin and coat nutrition, coat luster and general energy/vitality support.',
    'A detailed local listing gives 5 ml per 10 kg body weight daily, mixed with food or given directly.',
    '200-ml liquid bottle; larger 1-L bottle',
    'Store cool and dry, away from direct sunlight, and keep the bottle tightly closed.',
    '/images/products/p7_vetgrow_red_dogs_200_ml_1.png',
    ARRAY['/images/products/p7_vetgrow_red_dogs_200_ml_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #8. Orcalmin Suspension pack: 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Orcalmin Suspension pack: 200 ml',
    'orcalmin-suspension-pack-200-ml-8',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Orcalmin is a mineral-support suspension formulated around Microcrystalline Hydroxyapatite Complex. Each 5 ml provides calcium equivalent to 33 mg, phosphorus 15 mg and vitamin D 100 IU. The combination is intended to provide nutritional support for normal bone structure and healthy teeth. The verified presentation is 200 ml; follow the current product label for species-appropriate feeding directions.',
    NULL,
    'Nutritional support for healthy bone structure and teeth.',
    'Exact species/weight dosage was unspecified in the retrieved official result; use as directed on the bottle or by the veterinarian.',
    '200-ml oral-suspension bottle.',
    NULL,
    '/images/products/p8_orcalmin_suspension_200_ml_1.png',
    ARRAY['/images/products/p8_orcalmin_suspension_200_ml_1.png']::TEXT[],
    true,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 925.0, 1017.50, 50);

  -- #9. Vetgrow Bones-Up - Mineral & Vitamin Supplement
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vetgrow Bones-Up - Mineral & Vitamin Supplement',
    'vetgrow-bones-up-mineral-vitamin-supplement-9',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Bones-Up is a Vetgrow mineral and vitamin supplement formulated to support bone and dental nutrition in dogs and cats, including growing, pregnant and lactating animals. The formula is rich in calcium, phosphorus and magnesium together with key vitamins, and Vetgrow emphasizes the bioavailability of its mineral sources. It is particularly positioned to support skeletal development in large-breed dogs. Feed one 5 g teaspoonful per 10 kg body weight daily according to the manufacturer''s guidance.',
    NULL,
    'For dogs and cats of all ages and breeds, including pregnant and lactating animals; designed to support bone growth and mineral nutrition, with particular emphasis on large-breed dogs. Vetgrow states that its calcium component is animal-derived and that calcium and phosphorus are supplied in bioavailable forms.',
    'One teaspoonful / 5 g per 10 kg body weight daily.',
    '200 g and 900 g. Powder supplement in 200-g and 900-g consumer containers.',
    'Specific storage conditions unspecified.',
    '/images/products/p9_bones_up_200_g_1.png',
    ARRAY['/images/products/p9_bones_up_200_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200g', 1400.0, 1540.00, 50);

  -- #10. Himalaya Liv.52 pet, 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Himalaya Liv.52 pet, 200 ml',
    'himalaya-liv-52-pet-200-ml-10',
    'Himalaya',
    cat_health,
    'Dog',
    'Liv.52 pet is Himalaya''s companion-animal herbal liquid for appetite and liver support. Its key botanical ingredients are Caper Bush and Chicory, herbs used by Himalaya in its hepatoprotective formulation. The manufacturer''s current guidance lists 5-8 ml twice daily for small-breed dogs and 10-15 ml twice daily for large breeds, with adjustment according to veterinary advice. The official pack contains 200 ml.',
    'Caper Bush (Himsra) and Chicory (Kasani);',
    'Liv.52 pet as an appetite stimulant and hepatoprotective product, with the herbal ingredients positioned for liver-support applications.',
    'Small-breed dogs: 5-8 ml twice daily; large-breed dogs: 10-15 ml twice daily. Himalaya states that dosage may be altered for breed/severity or as directed by a veterinarian.',
    '200-ml labeled liquid bottle.',
    NULL,
    '/images/products/p10_liv_52_pet_liquid_200_ml_1.png',
    ARRAY['/images/products/p10_liv_52_pet_liquid_200_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200ml', 1200.0, 1320.00, 50);

  -- #11. Himalaya Digyton Drops, 30 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Himalaya Digyton Drops, 30 ml',
    'himalaya-digyton-drops-30-ml-11',
    'Himalaya',
    cat_food,
    'Cat/Dog',
    'Digyton Drops is Himalaya''s companion-animal digestive support formulation containing cardamom and dill oil. The product is designed to facilitate secretion of proteolytic, amylolytic and lipolytic enzymes involved in food digestion while supporting bowel regulation. Dosage should be selected according to the animal''s breed, condition and veterinary advice rather than extrapolated from another Digyton product. The official presentation is a 30 ml bottle.',
    'Cardamom and Dill Oil, with concentrations unspecified.',
    'Himalaya states that Digyton facilitates secretion of proteolytic, amylolytic and lipolytic digestive enzymes, supporting food digestion and bowel regulation.',
    'As directed by a veterinarian.',
    '30-ml dropper-style veterinary bottle.',
    NULL,
    '/images/products/p11_digyton_drops_30_ml_1.png',
    ARRAY['/images/products/p11_digyton_drops_30_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #12. aRBCe PET, with a 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'aRBCe PET, with a 200 ml',
    'arbce-pet-with-a-200-ml-12',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'aRBCe PET is palatable haematinic supplement formulated with bioavailable glycine-chelated minerals. Its confirmed components include chelated iron, copper and cobalt together with vitamins B2 and B3, providing nutritional support for haemoglobin formation and recovery from nutritional deficiency. Veterinary retailers also position the product for supportive use during anaemia, debility and convalescence. The verified pack size is 200 ml; dosing should follow the local pack or veterinarian.',
    'The manufacturer listing confirms glycine-chelated iron 20 mg, glycine-chelated copper 10 mg, glycine-chelated cobalt 4 mg, vitamin B2 1 mg and vitamin B3 5 mg among the formula''s ingredients. The product is positioned around highly bioavailable chelated minerals and B-complex nutritional support.',
    'Nutritional support in anaemic states and mineral/vitamin deficiency, including convalescence and conditions associated with blood loss or parasitism, as described by veterinary retailers.',
    'Dogs: 5 ml per 20 kg body weight twice daily; cats: 0.5 ml per 5 kg twice daily, directly or mixed with food.',
    '200-ml palatable oral-liquid bottle.',
    NULL,
    '/images/products/p12_arbce_pet_200_ml_1.png',
    ARRAY['/images/products/p12_arbce_pet_200_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200ml', 1625.0, 1787.50, 50);

  -- #13. Vi-Sorbits Tablets 50s
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vi-Sorbits Tablets 50s',
    'vi-sorbits-tablets-50s-13',
    'Zoetis',
    cat_food,
    'Dog',
    'Vi-Sorbits provides a broad spectrum of vitamins and minerals in a palatable tablet formulated for dogs. The formula includes vitamins A, D, E and B-complex nutrients together with iron, copper, calcium, phosphorus and other essential minerals. Give one tablet daily, either whole or crumbled over food, unless otherwise directed by a veterinarian. Store between 15°C and 30°C and keep out of children''s reach.',
    'vitamin A 1,250 IU, vitamin D 125 IU, vitamin E 2 IU, thiamine 1 mg, riboflavin 1 mg, d-pantothenic acid 0.5 mg, niacin 10 mg, vitamin B6 1 mg, folic acid 0.2 mg, vitamin B12 8 mcg, iron 9 mg, copper 0.45 mg, plus calcium, phosphorus, potassium, salt, chloride and magnesium.',
    'Routine vitamin/mineral supplementation; local veterinary retail descriptions also position Vi-Sorbits for nutritional support during reduced appetite, anaemia, pregnancy, ageing and recovery.',
    'One tablet daily, given whole or crumbled onto food.',
    '50 Tablet bottle, with count varying by market.',
    'Store at 15-30°C and keep out of reach of children.',
    '/images/products/p13_vi_sorbits_tablets_50s_1.png',
    ARRAY['/images/products/p13_vi_sorbits_tablets_50s_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #14. Himalaya Scavon VET Spray, 100 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Himalaya Scavon VET Spray, 100 ml',
    'himalaya-scavon-vet-spray-100-ml-14',
    'Himalaya',
    cat_wound,
    'Cat',
    'Scavon VET Spray is Himalaya''s topical veterinary wound-care formulation for traumatic, surgical and infected wounds. Its ingredient blend includes Atasi, eucalyptus, camphor, Tulasi and Vacha components together with Yashada bhasma. Clean the wound and apply the required amount according to the veterinary label, generally twice daily for companion-animal applications. Store the 100 ml spray away from direct heat and sunlight and keep out of children''s reach.',
    NULL,
    'Traumatic and surgical wounds, maggot-infested or infected wounds, bacterial/fungal wound conditions and selected livestock lesions.',
    'Clip hair where necessary, clean the affected area and apply the required quantity, generally twice daily for companion-animal wound care according to the manufacturer''s instructions.',
    '100-ml labeled spray container.',
    'Store dry, away from direct heat and sunlight; do not refrigerate; keep away from children and do not expose the container above 50°C. For animal use only.',
    '/images/products/p14_scavon_vet_spray_100_ml_1.png',
    ARRAY['/images/products/p14_scavon_vet_spray_100_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '100ml', 1331.0, 1464.10, 50);

  -- #15. Himalaya Scavon VET Cream, 50 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Himalaya Scavon VET Cream, 50 g',
    'himalaya-scavon-vet-cream-50-g-15',
    'Himalaya',
    cat_wound,
    'Cat',
    'Scavon VET Cream provides Himalaya''s antimicrobial and wound-support formulation in a convenient topical cream. It combines herbal ingredients including Atasi, eucalyptus, camphor, Tulasi and Vacha with Yashada bhasma and is intended for a range of traumatic and infected wounds. Clean the affected area before application and use at the frequency shown on the label or prescribed by a veterinarian. The product is supplied in a 50 g presentation and should be protected from direct heat and sunlight.',
    'The cream uses the Scavon herbal/mineral wound-care combination, including Atasi, eucalyptus/Tailapatra, Karpura, Tulasi, Vacha and Yashada bhasma.',
    'Intended for traumatic, surgical, maggoted and infected wounds. Clip hair as appropriate, clean the area and apply the required amount of cream, generally twice daily or as directed by a veterinarian.',
    NULL,
    '50-g topical cream tube, normally within labeled retail packaging.',
    'Dry storage away from direct heat and sunlight; do not refrigerate; keep out of children''s reach; animal use only.',
    '/images/products/p15_scavon_vet_cream_50_g_1.png',
    ARRAY['/images/products/p15_scavon_vet_cream_50_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '50g', 793.0, 872.30, 50);

  -- #16. SANPET-PLUS
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SANPET-PLUS',
    'sanpet-plus-16',
    'PetSolutions',
    cat_parasite,
    'Cat/Dog',
    'SANPET-PLUS is a high-quality pet care solution providing essential health and veterinary support.',
    'Each tablet contains Praziquantel 50 mg, Pyrantel embonate (pamoate) 144 mg and Febantel 150 mg.
Indications / Target Species: For puppies and adult dogs. Used for the treatment of gastrointestinal roundworms and tapeworms, including Toxocara canis, Toxascaris leonina, Uncinaria stenocephala, Ancylostoma caninum, Trichuris vulpis, Echinococcus species, Taenia species and Dipylidium caninum.
Dosage / Pack Size / Precautions: Oral use only. Give 1 tablet per 10 kg body weight; the tablet may be given directly or mixed with food. Sri Lankan retailers commonly offer a 2-tablet retail presentation. Manufacturer literature describes blister/tablet box presentations depending on market. Do not use simultaneously with piperazine compounds or in animals hypersensitive to the ingredients. Not recommended for puppies weighing under 3 kg. Avoid use during the first 4 weeks of pregnancy unless specifically directed by a veterinarian.
Website Product Description: SANPET-PLUS is a broad-spectrum deworming tablet for puppies and adult dogs, combining praziquantel, pyrantel and febantel to control common intestinal roundworms and tapeworms. Each tablet is formulated for approximately 10 kg body weight and can be administered directly or mixed with food. It targets important canine parasites including roundworms, hookworms, whipworms and tapeworms. Use according to the recommended body-weight dose and veterinary guidance.',
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p16_sanpet_plus_broad_spectrum_dewormin_1.png',
    ARRAY['/images/products/p16_sanpet_plus_broad_spectrum_dewormin_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #17. Wolfo Flea & Tick Powder for Dogs and Cats
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Wolfo Flea & Tick Powder for Dogs and Cats',
    'wolfo-flea-tick-powder-for-dogs-and-cats-17',
    'PetSolutions',
    cat_parasite,
    'Cat/Dog',
    'Wolfo is a propoxur 1% w/w flea-and-tick powder designed for topical use on dogs and cats. The fine powder is distributed through the coat to reach the skin, with the local product instructions describing weekly use. It may also be used on specified pet resting areas according to the label. Because the product is classified as a poison and is harmful if ingested, use gloves and follow all handling precautions carefully.',
    'Propoxur 1% w/w.
Indications / directions: Intended for ticks and fleas on dogs and cats. Wear gloves, distribute the powder through the coat to the skin, and describes weekly application.',
    NULL,
    NULL,
    'Shaker-style veterinary powder container; exact net weight unspecified.',
    'The retailer identifies it as a registered poison and says it is for external use only, toxic if ingested, should be kept away from children, and animals should be prevented from licking treated areas.',
    '/images/products/p17_wolfo_flea_tick_powder_1.png',
    ARRAY['/images/products/p17_wolfo_flea_tick_powder_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #18. Woofy Medicated Neem Soap 70 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Woofy Medicated Neem Soap 70 g',
    'woofy-medicated-neem-soap-70-g-18',
    'Seepet',
    cat_grooming,
    'Cat',
    'Woofy Medicated Neem Soap provides convenient routine cleansing for pets in a 70 g bar. Its neem-focused formulation is marketed for hygienic and antibacterial-support grooming while helping keep the coat clean and fresh. Wet the coat thoroughly, massage the lather through the fur and rinse well, taking care around the eyes and ears. Suitable species should always be confirmed from the individual pack label.',
    NULL,
    'Marketed for cleansing and antibacterial-support grooming and is listed for puppies, dogs and cats.',
    'Wet the coat, work the soap into a lather and massage through the coat while avoiding the eyes and ears, then rinse thoroughly.',
    NULL,
    NULL,
    '/images/products/p18_woofy_medicated_neem_soap_70_g_1.png',
    ARRAY['/images/products/p18_woofy_medicated_neem_soap_70_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #19. SeePet Woofy Lavender Soap, 70 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SeePet Woofy Lavender Soap, 70 g',
    'seepet-woofy-lavender-soap-70-g-19',
    'Seepet',
    cat_grooming,
    'Cat/Dog',
    'Woofy Lavender Soap is a routine pet-grooming bar designed to cleanse the skin and coat while providing a pleasant lavender fragrance. It is listed for puppies, adult dogs and cats. Work the bar into a lather on a thoroughly wet coat, massage gently and rinse well while avoiding the eyes and ears. The retail presentation is a 70 g bar.',
    NULL,
    'Routine cleansing, fresh scent and coat grooming for puppies, dogs and cats. The retailer contrasts the Lavender variant''s soothing/silky grooming positioning with the medicated Neem variant.',
    'Wet the coat, lather and massage, avoiding eyes and ears, then rinse completely.',
    'Individually packaged 70-g soap bar.',
    'Unspecified; keep the soap dry between uses and use externally as a grooming product.',
    '/images/products/p19_woofy_lavender_soap_70_g_1.png',
    ARRAY['/images/products/p19_woofy_lavender_soap_70_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #20. Permvet Medicated Dog Soap 70 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Permvet Medicated Dog Soap 70 g',
    'permvet-medicated-dog-soap-70-g-20',
    'PetSolutions',
    cat_parasite,
    'Cat/Dog',
    'Verified Product Name: Permvet Medicated Dog Soap. The 70-g
Category / active ingredient: Medicated dog soap containing permethrin 1%.
Permvet is a medicated soap formulated specifically for dogs and contains permethrin 1%. It combines coat cleansing with topical flea-and-tick control and may help reduce discomfort associated with parasite infestation. Apply only according to the manufacturer''s dog-use directions and rinse as instructed on the pack. Do not extend use to other species unless their use is explicitly stated on the physical label.',
    NULL,
    'Marketed to help control fleas and ticks while cleansing the coat and helping with parasite-associated itch.',
    NULL,
    'Medicated soap bar, normally individually boxed/wrapped.',
    'Specific storage is unspecified. Because the verified listing explicitly identifies this as a dog soap, the website should not imply feline use unless the actual label specifically authorizes it.',
    '/images/products/p20_permvet_medicated_dog_soap_70_g_1.png',
    ARRAY['/images/products/p20_permvet_medicated_dog_soap_70_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '70g', 650.0, 715.00, 50);

  -- #21. Nutricoat Advance
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Nutricoat Advance',
    'nutricoat-advance-21',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Nutricoat Advance delivers concentrated essential fatty acids, including Omega-6 linoleic acid and Omega-3 linolenic acid, to support the skin barrier and coat condition of dogs and cats. It is used as nutritional support in a range of dermatological conditions including pyoderma, mange, fungal disease and Malassezia-associated dermatitis. Additional formulation listings identify supportive nutrients such as zinc, biotin, selenium and selected vitamins. Available in 200 g and 400 g packs; follow the feeding instructions printed on the exact market pack because dosage conventions vary between presentations.',
    NULL,
    'Supportive nutrition in skin conditions including pyoderma, mange, Malassezia-associated dermatitis, fungal/dermatomycosis and allergic or ectoparasite-associated dermatitis, while supporting hair/skin growth and coat quality.',
    'Product listings vary: local information includes 5 g/day for dogs and 10 g/day for pregnant/nursing bitches, while some international labels express dosing in ml/body weight. Therefore, the exact local bottle instruction should be used.',
    'Viscous liquid/oil supplement in bottles labeled by net weight, commonly 200 g or 400 g.',
    'Store in a cool, dry place; a local listing additionally advises cool/dark storage with the container closed.',
    '/images/products/p21_nutricoat_advance_1.png',
    ARRAY['/images/products/p21_nutricoat_advance_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200G', 2990.0, 3289.00, 50);

  -- #22. Nutricoat Syrup
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Nutricoat Syrup',
    'nutricoat-syrup-22',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Verified Product Name: Nutricoat Syrup 200 g
Nutricoat is formulated to provide fatty-acid nutrition for pets with dry, dull or scaly coats and is used as supportive nutrition in a variety of skin conditions. Its ingredient profile includes linoleic, linolenic and oleic acids. Hayleys publishes separate feeding amounts for puppies, adult dogs, pregnant or nursing dogs and cats, so the dose should be matched to the animal and local label. The Sri Lankan distributor lists a 200 g pack, while 400 g is also documented internationally.',
    NULL,
    'Dry/lusterless hair and alopecia, scaly nutritional dermatoses and dandruff, hyperkeratosis, allergic dermatitis and pruritus, plus supportive nutrition in hypothyroidism, mange, pyoderma and fungal dermatitis.',
    'puppies 2.5 ml twice daily; adult dogs 5 ml twice daily; pregnant/nursing bitches 5-10 ml twice daily; cats 2.5-5 ml twice daily.',
    'Palatable liquid/tonic in a bottle labeled by net weight, usually 200 g',
    'Specific storage on the Hayleys excerpt was unspecified; keep the container appropriately closed and follow the label.',
    '/images/products/p22_nutricoat_syrup_1.png',
    ARRAY['/images/products/p22_nutricoat_syrup_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200 g', 1500.0, 1650.00, 50);

  -- #23. Negasunt Powder
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Negasunt Powder',
    'negasunt-powder-23',
    'PetSolutions',
    cat_wound,
    'Cat/Dog',
    'Negasunt combines coumaphos 30 mg/g, propoxur 20 mg/g and sulfanilamide 50 mg/g in a topical veterinary wound powder. It is intended for maggoticidal and bacteriostatic wound dressing in dogs and various livestock species. Before application, clean the wound thoroughly and dust enough powder to cover both the affected area and its immediate surroundings. The locally listed presentation is a 40 g bottle.',
    NULL,
    'Wound dressing where maggot control and bacteriostatic action are required in dogs and several livestock species.',
    'Clean the wound thoroughly and dust Negasunt over the wound, ensuring that the surrounding area is also covered.',
    '40-g dusting/shaker bottle.',
    'Specific storage conditions were unspecified in the retrieved page. Treat as a veterinary medicated powder and avoid inhalation, ingestion and unnecessary skin contact.',
    '/images/products/p23_negasunt_powder_1.png',
    ARRAY['/images/products/p23_negasunt_powder_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #24. Aluspray AWD
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Aluspray AWD',
    'aluspray-awd-24',
    'PetSolutions',
    cat_wound,
    'Cat/Dog',
    'Official/local name: Aluspray AWD, 125 ml.
Active ingredients: Hayleys gives, per gram, neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units, plus excipients.
Aluspray AWD is formulated for topical protection of superficial wounds, abrasions and cuts. Each gram contains neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units. Applying a fine superficial coating once or twice daily, subject to the veterinarian''s directions. The verified local pack size is 125 ml.',
    NULL,
    'For superficial wounds, cuts and abrasions, forming a protective antiseptic coating. The listed direction is a superficial application once or twice daily.',
    NULL,
    '125-ml spray/aerosol-style container.',
    'Unspecified in the retrieved listing; external veterinary use only.',
    '/images/products/p24_aluspray_awd_1.png',
    ARRAY['/images/products/p24_aluspray_awd_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #25. Petmend Spray, 150 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Petmend Spray, 150 ml',
    'petmend-spray-150-ml-25',
    'PetSolutions',
    cat_wound,
    'Cat',
    'Petmend Spray is designed for topical management of traumatic and surgical wounds, including wounds affected by maggot infestation. The Hayleys formulation information confirms Pinus longifolia at 4 g per 100 ml as one component. The product is supplied in a convenient 150 ml spray presentation. Clean and treat the affected area only according to the current product label or veterinarian''s instructions.',
    'Pinus longifolia 4 g per 100 ml as part of the composition',
    'All types of traumatic and surgical wounds, including maggot/worm-infested wounds.',
    'Exact application frequency was unspecified in the retrieved official evidence; use according to label/veterinary instructions.',
    '150-ml labeled spray container.',
    'Unspecified; external veterinary use only.',
    '/images/products/p25_petmend_spray_1.png',
    ARRAY['/images/products/p25_petmend_spray_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '150ml', 980.0, 1078.00, 50);

  -- #26. Drontal Plus Tasty
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Drontal Plus Tasty',
    'drontal-plus-tasty-26',
    'PetSolutions',
    cat_parasite,
    'Dog',
    'Drontal Plus Tasty combines praziquantel 50 mg, pyrantel embonate 144 mg and febantel 150 mg in each tablet for broad-spectrum intestinal worm control in dogs. It targets major roundworm and tapeworm groups including hookworms and whipworms. Hayleys lists a dosage of one tablet per 10 kg body weight, given directly or with food, without a fasting requirement. The official local presentation reviewed contains 12 tablets.',
    NULL,
    'Control of common canine ascarids/roundworms, hookworms, whipworms and tapeworms.',
    'One tablet per 10 kg body weight; tablets may be administered directly or in food, and Hayleys states that pre-treatment starvation is unnecessary.',
    NULL,
    'Detailed storage instructions were unspecified in the retrieved local page. Dosing should be based on current body weight and the pack label.',
    '/images/products/p26_drontal_plus_tasty_1.png',
    ARRAY['/images/products/p26_drontal_plus_tasty_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #27. Dermitol Shampoo
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Dermitol Shampoo',
    'dermitol-shampoo-27',
    'PetSolutions',
    cat_grooming,
    'Cat/Dog',
    'Verified Product Name: Dermitol, a dermatological veterinary shampoo
Category / composition: Hygienic, keratoplastic, moisturizing and emollient dog shampoo. Soft surfactants and Ichtyol liposomes
Dermitol is a veterinary dermatological shampoo designed to provide hygienic cleansing while helping moisturize and condition abnormal or seborrheic skin. Hayleys describes the formula as using soft surfactants together with Ichtyol liposome technology. It can be used as supportive topical care for dry or oily scaling conditions under veterinary guidance. The locally listed pack size is 250 ml.',
    NULL,
    'Supportive cleansing in seborrheic and scaling skin conditions, including dry/oily seborrhea.',
    'Twice weekly for several weeks, allowing brief skin contact before rinsing; because regimen may vary by market, publish label/veterinary directions rather than a fixed treatment course.',
    '250-ml dermatological shampoo bottle.',
    'Unspecified; external veterinary use only, avoid eyes.',
    '/images/products/p27_dermitol_shampoo_1.png',
    ARRAY['/images/products/p27_dermitol_shampoo_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #28. Furr-Fresh Medicated Shampoo 100 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Furr-Fresh Medicated Shampoo 100 ml',
    'furr-fresh-medicated-shampoo-100-ml-28',
    'PetSolutions',
    cat_grooming,
    'Cat',
    'Furr-Fresh Medicated Shampoo is a veterinary-strength cleansing formula containing ketoconazole and chlorhexidine gluconate. The combination provides antifungal and antibacterial activity and is marketed for pets with yeast, fungal and bacterial skin problems. Apply and leave on only for the contact time specified on the current label or by a veterinarian, then rinse thoroughly.',
    NULL,
    'Retail descriptions position it for veterinary-support cleansing in conditions involving fungi, yeast and bacteria, including ringworm-type fungal problems, hot spots and yeast-associated skin problems.',
    'Exact contact time/frequency unspecified; follow the pack or veterinarian rather than borrowing instructions from another ketoconazole/chlorhexidine brand.',
    '100-ml shampoo bottle.',
    'Unspecified; external use only, avoid eyes, ears and ingestion.',
    '/images/products/p28_furr_fresh_medicated_shampoo_100_ml_1.png',
    ARRAY['/images/products/p28_furr_fresh_medicated_shampoo_100_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #29. Ticks & Fleas Shampoo 225 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Ticks & Fleas Shampoo 225 ml',
    'ticks-fleas-shampoo-225-ml-29',
    'PetSolutions',
    cat_parasite,
    'Dog',
    'Dymec Ticks & Fleas Shampoo is formulated for dogs using a shampoo base with citronella, lemongrass, eucalyptus, neem and cinnamon oils. The botanical blend is intended for routine cleansing while supporting flea-and-tick-focused grooming. Wet and shampoo the animal only according to the directions printed on the product pack, taking care around the eyes. The verified presentation is a 225 ml bottle.',
    'citronella oil, lemongrass oil, eucalyptus oil, neem oil and cinnamon oil. Concentrations are unspecified.',
    'Routine shampooing where flea/tick-focused botanical grooming is desired. The clearest current product title says for dogs.',
    NULL,
    '225-ml plastic shampoo bottle.',
    NULL,
    '/images/products/p29_ticks_fleas_shampoo_225_ml_1.png',
    ARRAY['/images/products/p29_ticks_fleas_shampoo_225_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #30. Aloe Vera Shampoo & Conditioner 225 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Aloe Vera Shampoo & Conditioner 225 ml',
    'aloe-vera-shampoo-conditioner-225-ml-30',
    'PetSolutions',
    cat_grooming,
    'Cat/Dog',
    'Dymec Aloe Vera Shampoo & Conditioner combines routine cleansing with coat-conditioning ingredients including aloe vera extract and vitamin E. It is marketed for both dogs and cats and is designed to leave the coat clean, conditioned and well groomed. Apply and rinse according to the directions on the physical bottle while avoiding the eyes. The standard pack is 225 ml,',
    NULL,
    'Cleansing, moisturizing and conditioning of dog and cat coats, with aloe vera positioned for soothing coat/skin care.',
    NULL,
    '225-ml shampoo bottle',
    NULL,
    '/images/products/p30_aloe_vera_shampoo_conditioner_225_m_1.png',
    ARRAY['/images/products/p30_aloe_vera_shampoo_conditioner_225_m_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #31. Malaseb Shampoo 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Malaseb Shampoo 200 ml',
    'malaseb-shampoo-200-ml-31',
    'Seepet',
    cat_grooming,
    'Cat/Dog',
    'Verified Product Name: SeePet-Malaseb Medicated Shampoo for Dogs & Cats.
SeePet-Malaseb combines miconazole nitrate 2% w/v with chlorhexidine gluconate 2% w/v to provide dual antifungal and antibacterial cleansing. It is marketed for dogs and cats and is used as medicated support in skin conditions involving microbial overgrowth, seborrhea and itching. Use at the contact time and frequency specified on the SeePet label or by your veterinarian. Local retailers list  200 ml.',
    NULL,
    'Antifungal, antibacterial, keratolytic and antipruritic medicated cleansing, including supportive care for seborrheic dermatitis and dermatophilosis-associated skin problems.',
    'Exact contact time and treatment frequency for this SeePet formulation were unspecified in the retrieved evidence; follow the bottle or veterinarian.',
    '200 ml Active ingredients: Miconazole nitrate 2% w/v plus chlorhexidine gluconate 2% w/v.',
    'Unspecified; external veterinary use only, avoid eyes and ingestion.',
    '/images/products/p31_malaseb_shampoo_200_ml_1.png',
    ARRAY['/images/products/p31_malaseb_shampoo_200_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200ml', 1140.0, 1254.00, 50);

  -- #32. Petvit Liquid, 200 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Petvit Liquid, 200 ml',
    'petvit-liquid-200-ml-32',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Petvit Liquid is an oral multivitamin formulation for companion animals. Each 5 ml provides confirmed nutrients including vitamin A, vitamin D3, vitamin C and vitamins B1, B2 and B6. Hayleys lists the product for general nutritional supplementation and malnutrition, with a published puppy/kitten amount of 1-2 ml daily.',
    'Each 5 ml contains at least the following confirmed components from the official listing: vitamin A 2,500 IU, vitamin B1 1 mg, vitamin B2 0.75 mg, vitamin B6 1 mg, vitamin D3 500 IU and vitamin C 25 mg; the retrieved excerpt did not expose the complete remainder of the formulation.',
    'Nutritional supplementation, including support in generalized malnutrition.',
    'puppies and kittens: 1-2 ml daily. Other species/age doses were unspecified in the retrieved evidence.',
    '200-ml oral vitamin-liquid bottle.',
    NULL,
    '/images/products/p32_petvit_liquid_200_ml_1.png',
    ARRAY['/images/products/p32_petvit_liquid_200_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200ml', 1490.0, 1639.00, 50);

  -- #33. Vetgrow Meat in Feet 400 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vetgrow Meat in Feet 400 g',
    'vetgrow-meat-in-feet-400-g-33',
    'PetSolutions',
    cat_food,
    'Dog',
    'Verified Product Name: Vetgrow Meat in Feet.
Vetgrow Meat in Feet is a shaped chew/treat for dogs that encourages chewing and jaw activity while providing a source of calcium and phosphorus. Retail product information also positions the formula around dental cleaning and joint-support ingredients including glucosamine and chondroitin. It is sold in a 12-piece format, while a 400 g listing is also documented locally. Offer as a supplementary treat rather than a complete diet and supervise the dog during chewing.',
    NULL,
    'Chewing activity for jaw exercise and dental abrasion, with nutritional mineral and joint-support positioning.',
    'Approximately 1-2 pieces per day depending on size/activity, but this is not a manufacturer-verified feeding instruction in the retrieved material; therefore the pack should remain the authority.',
    NULL,
    'Retail advice is cool, dry storage and resealing after opening.',
    NULL,
    '{}'::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '400g', 350.0, 385.00, 50);

  -- #34. Vetgrow Kick in Punch 300 ml
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vetgrow Kick in Punch 300 ml',
    'vetgrow-kick-in-punch-300-ml-34',
    'PetSolutions',
    cat_health,
    'Cat/Dog',
    'Verified Product Name: Vetgrow Kick in Punch
Category / pack: Hydrolyzed supplementary beverage for dogs and cats, 300 ml.
Kick in Punch is a Vetgrow supplementary beverage formulated for both dogs and cats. It is produced from hydrolyzed chicken meat and hydrolyzed whey protein and is suitable for pets across different ages and life stages. Vetgrow''s published daily feeding guidance is one 300 ml tin per 10 kg body weight. Use it as a supplementary nutritional product alongside an appropriately balanced diet.',
    'Hydrolyzed chicken meat and hydrolyzed whey protein. Quantitative nutrient concentrations are unspecified.',
    'Vetgrow describes it as a supplementary beverage suitable for dogs and cats of all ages and stages.',
    'Manufacturer-listed daily dose: one tin per 10 kg body weight.',
    '300-ml tin/can.',
    'Specific storage instructions are unspecified on the current product page. It should be presented as a supplementary food/beverage rather than a nutritionally complete diet unless the label says otherwise.',
    '/images/products/p34_vetgrow_kick_in_punch_300_ml_1.png',
    ARRAY['/images/products/p34_vetgrow_kick_in_punch_300_ml_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #35. Vetgrow Meowghurt, 200 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vetgrow Meowghurt, 200 g',
    'vetgrow-meowghurt-200-g-35',
    'PetSolutions',
    cat_food,
    'Cat',
    'Meowghurt is Vetgrow''s milk-free yoghurt-equivalent food designed specifically for cats. Its proteins are hydrolyzed into amino acids and short peptides, lipids into free fatty acids and starch into simpler carbohydrate forms, together with an appropriate fibre component. The formula is enriched with taurine, arachidonic acid and vitamin A to reflect key feline nutritional needs. It is supplied in a 200 g presentation and should be fed according to the product label.',
    'Protein is hydrolyzed to simple amino acids and short peptides, lipids to free fatty acids, and starch to monosaccharide forms, with fibre; the product is additionally enriched with taurine, arachidonic acid and vitamin A.',
    'Highly processed/hydrolyzed supplementary nutrition for cats, designed for ready absorption.',
    'A specific numerical daily dose was not published on the current manufacturer page retrieved.',
    '200-g tin/can.',
    'Unspecified in the manufacturer text reviewed.',
    '/images/products/p35_vetgrow_meowghurt_200_g_1.png',
    ARRAY['/images/products/p35_vetgrow_meowghurt_200_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200g', 450.0, 495.00, 50);

  -- #36. Vetgrow Doghurt 200 g
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Vetgrow Doghurt 200 g',
    'vetgrow-doghurt-200-g-36',
    'PetSolutions',
    cat_food,
    'Dog',
    'Verified Product Name: Vetgrow Doghurt - Hydrolyzed Dog Food, 200 g. Manufacturer:
Doghurt is Vetgrow''s hydrolyzed dog food designed to provide nutritional support when normal digestion or intake is compromised. Protein is supplied as amino acids and short peptides, fats as free fatty acids and carbohydrates as monosaccharides, together with fibre. Vetgrow lists uses ranging from digestive disorders and poor appetite to pregnancy, ageing and post-surgical or illness recovery. The manufacturer recommends one 200 g tin per 10 kg body weight daily, subject to veterinary guidance for animals with clinical disease.',
    'Proteins are hydrolyzed into amino acids and peptides, lipids into free fatty acids, and carbohydrates into monosaccharides, with fibre.',
    'Vetgrow positions Doghurt for nutritional support during digestive disorders including EPI and IBD, pregnancy, senility, post-surgical recovery, growth retardation, anorectic conditions and recovery from systemic illness, among other supportive situations.',
    'Manufacturer-listed daily dose: one tin per 10 kg body weight.',
    '200-g tin/can.',
    'Specific storage conditions unspecified on the current page. Disease-related use should remain under veterinary guidance rather than positioning Doghurt as a replacement for diagnosis or medical treatment.',
    '/images/products/p36_vetgrow_doghurt_200_g_1.png',
    ARRAY['/images/products/p36_vetgrow_doghurt_200_g_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '200g', 450.0, 495.00, 50);

  -- #37. Classic Pet Puppy – Milk Flavor
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Classic Pet Puppy – Milk Flavor',
    'classic-pet-puppy-milk-flavor-37',
    'PetSolutions',
    cat_food,
    'Cat/Dog',
    'Product Type: Complete dry puppy food
Target / Life Stage: Puppies
Key Ingredients / Composition: Corn, chicken by-product meal, rice, corn gluten meal, soybean meal, full-fat soybeans, chicken fat, brewer’s dried yeast, dried skimmed milk, iodized salt, minerals, vitamins, flavoring and antioxidants.
Guaranteed Analysis: Crude Protein min. 27% | Crude Fat min. 8% | Crude Fiber max. 4% | Moisture max. 10%
Key Benefits / Indications: Supports healthy growth, strong muscles, bones and teeth, daily energy, immune function, and healthy skin and coat. The dry kibble also helps with routine dental cleaning.
Pack Size(s): 500 g | | 2 kg | 10 kg
Directions / Use: Feed according to the puppy’s age, body weight and activity level using the feeding guide on the pack. Introduce gradually when changing diets and keep fresh drinking water available.
Product Description
Classic Pet Puppy Milk Flavour is a complete dry food formulated for growing puppies. Its protein-, vitamin- and mineral-balanced recipe supports muscle development, strong bones and teeth, immune health, daily energy and a healthy skin and coat, with a palatable milk flavour suitable for everyday feeding.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p37_classic_pet_puppy_milk_flavor_1.png',
    ARRAY['/images/products/p37_classic_pet_puppy_milk_flavor_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #38. Classic Pet Adult Dog – Chicken Flavour
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Classic Pet Adult Dog – Chicken Flavour',
    'classic-pet-adult-dog-chicken-flavour-38',
    'PetSolutions',
    cat_food,
    'Cat/Dog',
    'Product Type: Complete dry adult dog food
Target / Life Stage: Adult dogs
Key Ingredients / Composition: Complete and balanced dry-food formula with poultry/chicken-based protein, carbohydrates, fats, vitamins and minerals. Refer to the locally supplied pack for the market-specific ingredient declaration.
Guaranteed Analysis: Crude Protein min.19% | Crude Fat min. 8% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: Provides everyday complete nutrition for adult dogs, supports healthy body condition and activity, and supplies nutrients for skin, coat, muscles, bones and general wellbeing.
Pack Size(s): 500 g | 2 kg | 3.5 | 10 kg | 15 kg
Directions / Use: Serve according to body weight, activity and the feeding table on the pack. Transition gradually over about 7–10 days and provide fresh water at all times.
Product Description
Classic Pet Adult Dog Chicken Flavour is a complete and balanced dry food for adult dogs. The palatable chicken-flavour formula provides essential protein, energy, vitamins and minerals to support everyday vitality, healthy body condition, strong muscles, and healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p38_classic_pet_adult_dog_chicken_flavo_1.png',
    ARRAY['/images/products/p38_classic_pet_adult_dog_chicken_flavo_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #39. Classic Pet Adult Dog – Beef Flavour
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Classic Pet Adult Dog – Beef Flavour',
    'classic-pet-adult-dog-beef-flavour-39',
    'PetSolutions',
    cat_food,
    'Cat/Dog',
    'Product Type: Complete dry adult dog food
Target / Life Stage: Adult dogs
Key Ingredients / Composition: Complete and balanced beef-flavour dry-food formula with protein, carbohydrates, fats, vitamins and minerals. Refer to the locally supplied pack for the exact market-specific ingredient declaration.
Guaranteed Analysis: Crude Protein min.19% | Crude Fat min. 8% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: Supports daily energy, healthy muscle condition, skin and coat, strong bones and general adult-dog wellbeing.
Pack Size(s): 2 kg | 3.5 kg | 10 kg | 15 kg
Directions / Use: Feed according to body weight and activity using the pack feeding guide. Make dietary changes gradually and ensure clean drinking water is always available.
Product Description
Classic Pet Adult Dog Beef Flavour is a complete dry food designed for the everyday nutritional needs of adult dogs. Its savoury beef flavour and balanced nutrient profile help maintain energy, muscle condition, healthy skin and coat, and overall wellbeing.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p39_classic_pet_adult_dog_beef_flavour_1.png',
    ARRAY['/images/products/p39_classic_pet_adult_dog_beef_flavour_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #40. SmartHeart Puppy – Chicken, Egg & Milk
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SmartHeart Puppy – Chicken, Egg & Milk',
    'smartheart-puppy-chicken-egg-milk-40',
    'SmartHeart',
    cat_food,
    'Cat/Dog',
    'Brand / Manufacturer: SmartHeart | Perfect Companion Group
Product Type: Complete dry puppy food
Target / Life Stage: Puppies from weaning to approximately 12 months
Key Ingredients / Composition: Rice, poultry meal, corn gluten meal, soybean meal, chicken oil, beet pulp, flaxseed, brewer’s dried yeast, lecithin, fish oil, milk replacer, iodized salt, vitamins, minerals, flavouring, food colouring and antioxidants.
Guaranteed Analysis: Crude Protein min. 26% | Crude Fat min. 10% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: DHA and choline support brain and nervous-system development; Omega-3 supports heart health; Vitamin E and selenium support immunity; balanced Omega-3 & 6 support skin and coat; calcium and phosphorus support strong bones and teeth.
Pack Size(s): 450 g | 1.3 kg | 2.7 kg | 8 kg
Directions / Use: Suitable from the weaning stage. Feed according to age and expected adult weight using the pack guide; split the daily amount into appropriate meals and keep fresh water available.
Product Description
SmartHeart Puppy Chicken, Egg & Milk is a complete and balanced growth formula for puppies. Enriched with DHA, choline, Omega fatty acids, calcium, phosphorus, vitamins and minerals, it supports brain development, immunity, digestion, strong bones and teeth, and healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p40_smartheart_puppy_chicken_egg_milk_1.png',
    ARRAY['/images/products/p40_smartheart_puppy_chicken_egg_milk_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #41. SmartHeart Adult Dog – Chicken & Egg
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SmartHeart Adult Dog – Chicken & Egg',
    'smartheart-adult-dog-chicken-egg-41',
    'SmartHeart',
    cat_food,
    'Cat/Dog',
    'Product Type: Complete dry adult dog food
Target / Life Stage: Adult dogs, approximately 1 year and above
Key Ingredients / Composition: Corn, poultry meal, rice, soybean meal, chicken oil, full-fat soybean, brewer’s dried yeast, dried whole egg, lecithin, fish oil, iodized salt, vitamins, minerals, antioxidants and food colouring.
Guaranteed Analysis: Crude Protein min. 23% | Crude Fat min. 8% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: Supports brain and nervous-system function with DHA and choline, heart health with Omega-3, immunity with Vitamin E and selenium, digestion, skin and coat health, and strong bones and teeth.
Pack Size(s): 500 g | 1.5 kg | 3 kg | 10 kg
Directions / Use: Feed according to body weight and activity using the feeding table on the pack. Provide fresh water and adjust the daily quantity to maintain ideal body condition.
Product Description
SmartHeart Adult Dog Chicken & Egg is a complete dry food for adult dogs, formulated with high-quality nutrients for daily health. DHA, choline, Omega fatty acids, antioxidants, calcium and phosphorus help support brain and heart function, immunity, digestion, healthy skin and coat, and strong bones and teeth.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p41_smartheart_adult_dog_chicken_egg_1.png',
    ARRAY['/images/products/p41_smartheart_adult_dog_chicken_egg_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #42. SmartHeart Adult Dog – Chicken & Liver
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SmartHeart Adult Dog – Chicken & Liver',
    'smartheart-adult-dog-chicken-liver-42',
    'SmartHeart',
    cat_food,
    'Cat/Dog',
    'Product Type: Complete dry adult dog food
Target / Life Stage: Adult dogs
Key Ingredients / Composition: A balanced adult-dog formula based on poultry protein, cereals, chicken oil, brewer’s dried yeast, liver digest, lecithin, fish oil, vitamins and minerals. Exact ingredient order can vary by market.
Guaranteed Analysis: Crude Protein min. 23% | Crude Fat min. 8% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: Supports daily energy and muscle condition, brain and heart function, immune health, digestion, healthy skin and coat, and strong bones and teeth.
Pack Size(s): 500 g | 1.5 kg | 3 kg | 10 kg
Directions / Use: Feed using the weight-based guide on the locally supplied pack. Ensure fresh water is always available and transition gradually from the previous diet.
Product Description
SmartHeart Adult Dog Chicken & Liver is a complete and balanced dry food with a highly palatable chicken-and-liver flavour. It supplies essential protein, fats, vitamins, minerals and Omega fatty acids to support healthy muscles, digestion, immunity, skin and coat, and everyday vitality.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p42_smartheart_adult_dog_chicken_liver_1.png',
    ARRAY['/images/products/p42_smartheart_adult_dog_chicken_liver_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #43. SmartHeart Power Pack – Puppy
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SmartHeart Power Pack – Puppy',
    'smartheart-power-pack-puppy-43',
    'SmartHeart',
    cat_food,
    'Cat/Dog',
    'Product Type: High-energy complete dry puppy food
Target / Life Stage: Growing puppies; particularly suitable for active and energetic puppies
Key Ingredients / Composition: Rice, poultry meal, chicken oil, corn gluten meal, soybean meal, dried whole egg, beet pulp, minerals, brewer’s dried yeast, vitamins and antioxidants.
Guaranteed Analysis: Crude Protein min. 33% | Crude Fat min. 22% | Crude Fibre max. 3.5% | Moisture max. 10%
Key Benefits / Indications: High energy and protein support growth, performance and muscle development; calcium and phosphorus support bones and teeth; Omega-6 supports skin and coat; Vitamin E and selenium support immunity; rice supports digestibility.
Pack Size(s): 1 kg | 3 kg | 10 kg | 20 kg
Directions / Use: Feed according to puppy age, body weight, activity and expected adult size. High-energy diets should be portioned according to the pack feeding guide.
Product Description
SmartHeart Power Pack Puppy is a high-energy, high-protein dry food developed for growing and active puppies. With 33% minimum crude protein and 22% minimum crude fat, it helps support growth, muscle development and performance while providing balanced minerals, vitamins and essential fatty acids for whole-body health.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p43_smartheart_power_pack_puppy_1.png',
    ARRAY['/images/products/p43_smartheart_power_pack_puppy_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '01Kg', 2140.0, 2354.00, 50);

  -- #44. SmartHeart Power Pack – Adult
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SmartHeart Power Pack – Adult',
    'smartheart-power-pack-adult-44',
    'SmartHeart',
    cat_food,
    'Cat/Dog',
    'Product Type: High-energy complete dry adult dog food
Target / Life Stage: Active and energetic adult dogs
Key Ingredients / Composition: Rice, poultry meal, chicken oil, soybean meal, corn gluten meal, full-fat soybean, minerals, brewer’s dried yeast, vitamins, antioxidants and L-carnitine.
Guaranteed Analysis: Crude Protein min. 30% | Crude Fat min. 20% | Crude Fibre max. 3.5% | Moisture max. 10%
Key Benefits / Indications: High energy supports active dogs; protein and L-carnitine help maintain lean muscle; calcium and phosphorus support bones and teeth; Omega-6 supports skin and coat; Vitamin E and selenium support immune function.
Pack Size(s): 1 kg | 3 kg | 10 kg | 20 kg
Directions / Use: Feed according to the dog’s weight, workload and body condition using the pack guide. Adjust portions for activity level and always provide clean drinking water.
Product Description
SmartHeart Power Pack Adult is a high-energy complete food for active adult dogs. Its concentrated protein and fat, together with L-carnitine, vitamins and minerals, support stamina, lean muscle, body condition, healthy skin and coat, strong bones and overall performance.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p44_smartheart_power_pack_adult_1.png',
    ARRAY['/images/products/p44_smartheart_power_pack_adult_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '01Kg', 2050.0, 2255.00, 50);

  -- #45. SmartHeart Mother & Baby Dog
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'SmartHeart Mother & Baby Dog',
    'smartheart-mother-baby-dog-45',
    'SmartHeart',
    cat_food,
    'Cat/Dog',
    'Product Type: Complete dry food for mother dogs and young puppies
Target / Life Stage: Mother dogs during gestation and lactation; puppies from weaning to about 3 months
Key Ingredients / Composition: High-protein complete formula with GOS (galactooligosaccharide) prebiotic. The kibble is designed to be easily softened with milk or lukewarm water.
Guaranteed Analysis: Crude Protein min. 28% | Crude Fat min. 18% | Crude Fibre max. 5% | Moisture max. 10%
Key Benefits / Indications: Supports the increased nutritional needs of pregnant and nursing mothers and early puppy growth. GOS promotes beneficial intestinal bacteria and digestive health; energy-dense nutrition supports growth and milk production.
Pack Size(s): 1.3 kg | 2.6 kg | 8 kg | 15 kg
Directions / Use: For mothers, adjust intake according to pregnancy/lactation stage and body condition. For weaning puppies, kibble may be softened with milk or lukewarm water. Follow the pack feeding guide.
Product Description
SmartHeart Mother & Baby Dog is specially formulated for pregnant and nursing mother dogs and puppies from weaning to around three months. Its high-protein, energy-rich formula supports pregnancy, milk production and early growth, while GOS prebiotic helps promote a healthy digestive system.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p45_smartheart_mother_baby_dog_1.png',
    ARRAY['/images/products/p45_smartheart_mother_baby_dog_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #46. Me-O Kitten – Ocean Fish
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Kitten – Ocean Fish',
    'me-o-kitten-ocean-fish-46',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry kitten food
Target / Life Stage: Kittens up to approximately 1 year
Key Ingredients / Composition: Typical formula includes corn, poultry/chicken by-product meal, rice, corn gluten meal, soybean meal, fish meal, chicken fat, skimmed milk, brewer’s dried yeast, taurine, vitamins, minerals and antioxidants.
Guaranteed Analysis: Crude Protein min. 30% | Market label values for fat/fibre/moisture may vary; use the local bag for final guaranteed analysis.
Key Benefits / Indications: Ocean fish and milk provide protein for growth; taurine and Vitamin A support vision; calcium, phosphorus and Vitamin D support bones and teeth; vitamins and essential fatty acids support immunity, skin and coat.
Pack Size(s): 400 g | 1.1 kg  | 7 kg
Directions / Use: Feed according to kitten age and body weight using the pack guide. Divide the daily ration into several meals for young kittens and provide fresh water at all times.
Product Description
Me-O Kitten Ocean Fish is a complete dry food designed for growing kittens. Rich in quality protein and fortified with taurine, vitamins, calcium and phosphorus, it supports healthy growth, strong bones and teeth, clear vision, immunity, and a healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p46_me_o_kitten_ocean_fish_1.png',
    ARRAY['/images/products/p46_me_o_kitten_ocean_fish_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '400g', 1450.0, 1595.00, 50);

  -- #47. Me-O Creamy Treats – Bonito Flavor
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Creamy Treats – Bonito Flavor',
    'me-o-creamy-treats-bonito-flavor-47',
    'Me-O',
    cat_wound,
    'Cat',
    'Product Type: Creamy cat treat
Target / Life Stage: Cats of all life stages
Key Ingredients / Composition: Creamy meat-based treat with bonito flavour, taurine, fibre, Omega-6, zinc and DL-methionine.
Guaranteed Analysis: Crude Protein min. 5% | Crude Fat min. 2% | Crude Fibre max. 2.5% | Moisture max. 85%
Key Benefits / Indications: Fibre supports digestive health; taurine supports eyesight; Omega-6, zinc and DL-methionine help maintain healthy skin and coat.
Pack Size(s): 60 g (4 × 15 g sachets) |
Directions / Use: Serve as a treat or snack, not as a complete meal. Adjust the main diet to account for treats and provide fresh drinking water.
Product Description
Me-O Creamy Treats Bonito Flavor is a smooth, palatable cat snack suitable for all life stages. Enriched with fibre, taurine, Omega-6, zinc and DL-methionine, it combines irresistible taste with support for digestion, eyesight, and healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p47_me_o_creamy_treats_bonito_flavor_1.png',
    ARRAY['/images/products/p47_me_o_creamy_treats_bonito_flavor_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #48. Me-O Creamy Treats – Chicken & Liver Flavor
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Creamy Treats – Chicken & Liver Flavor',
    'me-o-creamy-treats-chicken-liver-flavor-48',
    'Me-O',
    cat_wound,
    'Cat',
    'Brand / Manufacturer: Me-O | Perfect Companion Group
Product Type: Creamy cat treat
Target / Life Stage: Cats of all life stages
Key Ingredients / Composition: Creamy chicken-and-liver treat with green tea, taurine, Omega-6, zinc and DL-methionine.
Guaranteed Analysis: Crude Protein min. 5% | Crude Fat min. 2% | Crude Fibre max. 1% | Moisture max. 85%
Key Benefits / Indications: Green tea supports general healthy balance; taurine supports eyesight; Omega-6, zinc and DL-methionine support healthy skin and coat.
Pack Size(s): 60 g (4 × 15 g sachets) | Manufacturer presentations may also include single 15 g and 20-sachet multipacks
Directions / Use: Offer as a treat between meals or as a topper. It is not a replacement for a complete and balanced diet. Keep fresh water available.
Website Product Description
Me-O Creamy Treats Chicken & Liver Flavor is a rich, smooth snack for cats of all life stages. It contains taurine and skin-and-coat nutrients including Omega-6, zinc and DL-methionine, with a highly palatable chicken-and-liver taste cats enjoy.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p48_me_o_creamy_treats_chicken_liver_fl_1.png',
    ARRAY['/images/products/p48_me_o_creamy_treats_chicken_liver_fl_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #49. Me-O Creamy Treats – Crab Flavor
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Creamy Treats – Crab Flavor',
    'me-o-creamy-treats-crab-flavor-49',
    'Me-O',
    cat_wound,
    'Cat',
    'Brand / Manufacturer: Me-O | Perfect Companion Group
Product Type: Creamy cat treat
Target / Life Stage: Cats of all life stages
Key Ingredients / Composition: Creamy crab-flavour treat with prebiotic, taurine, Omega-6, zinc and DL-methionine.
Guaranteed Analysis: Crude Protein min. 5% | Crude Fat min. 2% | Crude Fibre max. 1% | Moisture max. 85%
Key Benefits / Indications: Prebiotic supports healthy digestion; taurine supports eyesight; Omega-6, zinc and DL-methionine support skin and coat condition.
Pack Size(s): 60 g (4 × 15 g sachets) | Manufacturer presentations may also include single 15 g and 20-sachet multipacks
Directions / Use: Feed as a snack or treat only. Do not use as the sole diet; keep clean drinking water available.
Website Product Description
Me-O Creamy Treats Crab Flavor is a delicious creamy snack for cats of all life stages. The formula combines prebiotic support for digestion with taurine for eye health and Omega-6, zinc and DL-methionine for healthy skin and a glossy coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p49_me_o_creamy_treats_crab_flavor_1.png',
    ARRAY['/images/products/p49_me_o_creamy_treats_crab_flavor_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #50. Me-O Creamy Treats – Salmon Flavor
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Creamy Treats – Salmon Flavor',
    'me-o-creamy-treats-salmon-flavor-50',
    'Me-O',
    cat_wound,
    'Cat',
    'Product Type: Creamy cat treat
Target / Life Stage: Cats of all life stages
Key Ingredients / Composition: Creamy salmon-flavour treat with Omega-3, taurine, Omega-6, zinc and DL-methionine.
Guaranteed Analysis: Crude Protein min. 5% | Crude Fat min. 2% | Crude Fibre max. 1% | Moisture max. 85%
Key Benefits / Indications: Omega-3 supports immune health; taurine supports eyesight; Omega-6, zinc and DL-methionine help maintain healthy skin and coat.
Pack Size(s): 60 g (4 × 15 g sachets) | Manufacturer presentations may also include single 15 g and 20-sachet multipacks
Directions / Use: Serve as a treat or topper rather than a complete meal. Always provide access to fresh water.
Product Description
Me-O Creamy Treats Salmon Flavor is a smooth and tasty cat treat suitable for all life stages. Omega-3 supports immune health, while taurine, Omega-6, zinc and DL-methionine help support eyesight and maintain healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p50_me_o_creamy_treats_salmon_flavor_1.png',
    ARRAY['/images/products/p50_me_o_creamy_treats_salmon_flavor_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #51. Me-O Pouch – Tuna in Jelly
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Pouch – Tuna in Jelly',
    'me-o-pouch-tuna-in-jelly-51',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Wet cat food in jelly 80 g
Target / Life Stage: Cats; check the local pouch for the exact life-stage statement
Key Ingredients / Composition: Tuna/fish-based wet food in jelly with added taurine, vitamins and minerals; exact recipe can vary by market.
Guaranteed Analysis: Crude Protein min. 8% | Crude Fat min. 0.5% | Crude Fat min. 1% | Moisture max. 87%
Key Benefits / Indications: High-moisture wet food helps support hydration. Fish protein supports muscle condition, while taurine, vitamins, minerals and fats support general health, eyesight, bones, skin and coat.
Pack Size(s): 80 g pouch
Directions / Use: Serve at room temperature. Adjust feeding according to body weight and activity. Refrigerate unused opened food in a sealed container and use promptly; provide fresh water.
Website Product Description
Me-O Tuna in Jelly is a tasty 80 g wet cat food pouch featuring fish in a soft jelly texture. Its high moisture content helps support hydration, while protein, taurine, vitamins and minerals contribute to healthy muscles, eyesight and overall wellbeing.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p51_me_o_pouch_tuna_in_jelly_1.png',
    ARRAY['/images/products/p51_me_o_pouch_tuna_in_jelly_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #52. Me-O Pouch – Ocean Fish in Jelly
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Pouch – Ocean Fish in Jelly',
    'me-o-pouch-ocean-fish-in-jelly-52',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Wet cat food in jelly 80 g
Target / Life Stage: Cats
Key Ingredients / Composition: Made with real meat and real fish, with protein, fats, minerals, taurine and vitamins.
Guaranteed Analysis:  Crude Protein min. 8% | Crude Fat min. 2% | Crude Fat min. 1% | Moisture max. 87%
Key Benefits / Indications: Protein helps maintain muscle mass; fats support healthy skin and coat; minerals support bones and teeth; taurine supports vision; vitamins support normal body function and immunity.
Pack Size(s): 80 g pouch
Directions / Use: Serve as directed on the pouch according to the cat’s body weight and activity. Keep fresh drinking water available and refrigerate unused opened food.
Product Description
Me-O Pouch Ocean Fish in Jelly is an 80 g wet cat food made with real meat and fish in a soft jelly texture. It supplies protein, fats, minerals, taurine and vitamins to support muscles, skin and coat, bones and teeth, eyesight, and overall health.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p52_me_o_pouch_ocean_fish_in_jelly_1.png',
    ARRAY['/images/products/p52_me_o_pouch_ocean_fish_in_jelly_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #53. Me-O Pouch – Tuna with Sardine in Jelly (Kitten)
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)',
    'me-o-pouch-tuna-with-sardine-in-jelly-kitten-53',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Wet kitten food in jelly 80 g
Target / Life Stage: Kittens
Key Ingredients / Composition: Real meat and fish-based wet food featuring tuna and sardine, with protein, fats, minerals, taurine and vitamins.
Guaranteed Analysis: Crude Protein min. 10% | Crude Fat min. 2% | Moisture max. 85%
Key Benefits / Indications: Provides a soft, high-moisture meal for kittens. Protein supports muscle growth; fats support skin and coat; minerals support bones and teeth; taurine supports developing vision; vitamins support normal body function.
Pack Size(s): 80 g pouch
Directions / Use: Feed according to kitten age and body weight. Serve at room temperature, refrigerate leftovers after opening and provide fresh drinking water.
Product Description
Me-O Pouch Tuna with Sardine in Jelly for Kitten is a soft and appetizing 80 g wet food designed for young cats. Made with real meat and fish, it provides protein, fats, minerals, taurine and vitamins to support growth, muscles, bones, eyesight and overall development.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p53_me_o_pouch_tuna_with_sardine_in_jel_1.png',
    ARRAY['/images/products/p53_me_o_pouch_tuna_with_sardine_in_jel_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #54. Me-O Pouch – Tuna Topping with White Fish
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Pouch – Tuna Topping with White Fish',
    'me-o-pouch-tuna-topping-with-white-fish-54',
    'Me-O',
    cat_food,
    'Cat',
    'Brand / Manufacturer: Me-O | Perfect Companion Group
Product Type: Wet cat food in jelly
Target / Life Stage: Cats
Key Ingredients / Composition: Made from real meat and real fish, featuring tuna topped with white fish and supplemented with key nutrients.
Guaranteed Analysis: Crude Protein min. 9% | Crude Fat min. 3% | Crude Fiber max. 1% | Moisture max. 82%
Key Benefits / Indications: Protein supports good muscle mass; fats support healthy skin and coat; minerals support bones and teeth; taurine supports eyesight; vitamins support body function and immunity.
Pack Size(s): 80 g pouch
Directions / Use: Feed according to weight and activity using the pouch guide. Serve at room temperature, refrigerate unused opened food and keep fresh water available.
Product Description
Me-O Pouch Tuna Topping with White Fish is an 80 g wet cat food combining tuna and white fish in a palatable jelly-style meal. Its nutrient profile supports muscle condition, skin and coat, strong bones and teeth, eyesight and general health.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p54_me_o_pouch_tuna_topping_with_white__1.png',
    ARRAY['/images/products/p54_me_o_pouch_tuna_topping_with_white__1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #55. Catron Bentonite Cat Litter – Grey Control
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter – Grey Control',
    'catron-bentonite-cat-litter-grey-control-55',
    'Catron',
    cat_litter,
    'Cat',
    'Brand / Manufacturer: Catron
Product Type: Clumping bentonite cat litter with activated carbon
Target / Life Stage: Cats
Key Ingredients / Composition: Natural bentonite mineral cat litter with activated carbon for enhanced odour adsorption.
Guaranteed Analysis: Not applicable.
Key Benefits / Indications: Strong moisture absorption and clumping performance; activated carbon helps bind and reduce unpleasant ammonia/urine-related odours, helping keep the litter tray fresher for longer.
Pack Size(s): 10 L
Directions / Use: Fill a clean litter tray to approximately 7 cm depth. Remove clumps and solid waste regularly and top up with fresh litter as required. Replace and clean the tray periodically.
Product Description
Catron Grey Control is a 10 L clumping bentonite cat litter enhanced with activated carbon for stronger odour control. Natural bentonite rapidly absorbs moisture and forms easy-to-remove clumps, while activated carbon helps trap unpleasant litter-box odours for a cleaner, fresher environment.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p55_catron_bentonite_cat_litter_grey_co_1.jpg',
    ARRAY['/images/products/p55_catron_bentonite_cat_litter_grey_co_1.jpg']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #56. Catron Bentonite Cat Litter – Lavender
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter – Lavender',
    'catron-bentonite-cat-litter-lavender-56',
    'Catron',
    cat_litter,
    'Cat',
    'Brand / Manufacturer: Catron
Product Type: Lavender-scented clumping bentonite cat litter
Target / Life Stage: Cats
Key Ingredients / Composition: Natural white bentonite clay with lavender fragrance.
Guaranteed Analysis: Not applicable.
Key Benefits / Indications: Fast clumping and high moisture absorption make daily cleaning easier, while the lavender fragrance helps control litter-box odour. Bentonite clumps can be removed without replacing the entire tray contents.
Pack Size(s): 10 L (commonly marketed; some international markets may also carry other sizes)
Directions / Use: Place an adequate layer of litter in a clean, dry tray. Scoop clumps and solids daily, replenish as needed and clean the tray periodically. Do not flush bentonite litter unless the product label specifically states it is flushable.
Product Description
Catron Lavender Bentonite Cat Litter is a clumping mineral litter made from absorbent bentonite clay with a fresh lavender fragrance. It forms firm clumps for convenient scooping while helping control moisture and unpleasant odours in the litter tray.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p56_catron_bentonite_cat_litter_lavende_1.png',
    ARRAY['/images/products/p56_catron_bentonite_cat_litter_lavende_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10L', 3250.0, 3575.00, 50);

  -- #57. Limoxin-25 Spray
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Limoxin-25 Spray',
    'limoxin-25-spray-57',
    'PetSolutions',
    cat_wound,
    'Cat',
    'Product Type: Veterinary topical antibacterial aerosol spray
Target / Life Stage: Cattle, calves, sheep, goats and swine
Key Ingredients / Composition: Each ml contains Oxytetracycline hydrochloride 25 mg (2.5%).
Guaranteed Analysis: Veterinary medicine – not a nutritional product.
Key Benefits / Indications: For external skin, teat, hoof and paw infections caused by oxytetracycline-sensitive microorganisms in the target livestock species.
Pack Size(s): 200 ml aerosol spray can
Directions / Use: Manufacturer direction: spray the affected area 1–2 times daily from approximately 15–20 cm. Use only according to the product label and veterinary guidance.
Precautions: For veterinary use. Avoid contact with eyes. Pressurised container: protect from sunlight and excessive heat; do not pierce or burn after use. Do not use in animals with known hypersensitivity to tetracyclines. Follow local veterinary regulations and label precautions.
Product Description
Limoxin-25 Spray is a 2.5% oxytetracycline veterinary antibacterial aerosol for topical use in cattle, calves, sheep, goats and swine. It is intended for external skin, teat, hoof and paw infections caused by susceptible microorganisms. Use strictly according to veterinary directions and the product label.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p57_limoxin_25_spray_1.png',
    ARRAY['/images/products/p57_limoxin_25_spray_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #58. Me-O Adult Cat Dry Food - Tuna Flavour
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Adult Cat Dry Food - Tuna Flavour',
    'me-o-adult-cat-dry-food-tuna-flavour-58',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry food for adult cats
Target / Life Stage: Adult cats, approximately 1 year and above
Key Ingredients / Composition: Wholegrain cereals (corn and rice), poultry by-product meal, vegetable proteins (soybean and corn), fish meal, cassava, chicken fat, brewer''s dried yeast, fish digest, tuna by-product meal, iodized salt, taurine, vitamins and minerals, antioxidants and food colouring.
Guaranteed Analysis: Crude Protein min. 30% | Crude Fat min. 9% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: Complete daily nutrition with protein for muscle maintenance; taurine to support normal vision and heart function; calcium, phosphorus and vitamin D for strong bones and teeth; Omega-3, Omega-6 and zinc for healthy skin and a glossy coat; vitamin C and balanced micronutrients to support immune health. The formula is designed to support normal urinary health.
Pack Size(s): 450 g | 1.2 kg | 3 kg | 7 kg
Directions / Use: Feed according to body weight, activity and body condition using the feeding table on the pack. When changing diets, introduce the new food gradually over about one week. Keep clean drinking water available at all times.
Product Description
Me-O Adult Cat Dry Food Tuna Flavour is a complete and balanced everyday diet for adult cats. Its highly palatable tuna recipe supplies quality protein, taurine, vitamins, minerals and essential fatty acids to support healthy muscles, vision, heart function, strong bones and teeth, urinary wellbeing, and a soft, glossy coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p58_me_o_adult_cat_dry_food_tuna_flavou_1.png',
    ARRAY['/images/products/p58_me_o_adult_cat_dry_food_tuna_flavou_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #59. Me-O Adult Cat Dry Food - Seafood Flavour
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Adult Cat Dry Food - Seafood Flavour',
    'me-o-adult-cat-dry-food-seafood-flavour-59',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry food for adult cats
Target / Life Stage: Adult cats, approximately 1 year and above
Key Ingredients / Composition: Wholegrain cereals (corn and rice), poultry by-product meal, vegetable proteins (soybean and corn), fish meal, cassava, chicken fat, brewer''s dried yeast, fish digest, shrimp meal, squid by-product meal, iodized salt, taurine, vitamins and minerals, antioxidants and food colouring.
Guaranteed Analysis: Crude Protein min. 30% | Crude Fat min. 9% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: A seafood-based adult formula providing protein for muscle condition, taurine for normal eyesight and heart function, Omega-3 and Omega-6 with zinc for skin and coat health, and calcium, phosphorus and vitamin D for strong bones and teeth. Vitamin C and balanced micronutrients support general immunity, while the formula is designed to support urinary wellbeing.
Pack Size(s): 450 g | 1.2 kg | 3 kg | 7 kg
Directions / Use: Feed according to the cat''s body weight and activity level using the pack feeding guide. Transition gradually from the previous food and provide fresh drinking water at all times.
Product Description
Me-O Adult Cat Dry Food Seafood Flavour is a complete and balanced dry diet made with a flavourful blend of fish-derived ingredients, including seafood components such as shrimp and squid meal. It provides essential protein, taurine, vitamins, minerals and Omega fatty acids to support healthy muscles, vision, bones, urinary wellbeing, immunity, skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p59_me_o_adult_cat_dry_food_seafood_fla_1.png',
    ARRAY['/images/products/p59_me_o_adult_cat_dry_food_seafood_fla_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #60. Me-O Adult Cat Dry Food - Mackerel Flavour
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Adult Cat Dry Food - Mackerel Flavour',
    'me-o-adult-cat-dry-food-mackerel-flavour-60',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry food for adult cats
Target / Life Stage: Adult cats, approximately 1 year and above
Key Ingredients / Composition: Wholegrain cereals (corn and rice), poultry meal, vegetable proteins (soybean and corn), fish meal, cassava, chicken fat, brewer''s dried yeast, fish and mackerel digest, iodized salt, taurine, vitamins and minerals, and antioxidants.
Guaranteed Analysis: Crude Protein min. 30% | Crude Fat min. 9% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: High-quality protein supports muscle maintenance and daily vitality. Taurine supports eyesight and heart function; vitamin C supports normal immune function; calcium, phosphorus and vitamin D support strong teeth and bones; Omega-3, Omega-6 and zinc nourish the skin and coat. The balanced formula also supports normal urinary health.
Pack Size(s): 450 g | 1.2 kg | 3 kg | 7 kg
Directions / Use: Use the pack feeding chart according to the cat''s weight, activity and body condition. Make diet changes gradually and ensure clean drinking water is always available.
Product Description
Me-O Adult Cat Dry Food Mackerel Flavour is a nutritionally complete dry food created for adult cats. Its savoury mackerel taste combines quality protein with taurine, vitamins, minerals and Omega fatty acids to support healthy muscles, eyesight, heart function, strong bones and teeth, urinary wellbeing, and a shiny coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p60_me_o_adult_cat_dry_food_mackerel_fl_1.png',
    ARRAY['/images/products/p60_me_o_adult_cat_dry_food_mackerel_fl_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #61. Me-O Adult Cat Dry Food - Chicken & Vegetables
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Adult Cat Dry Food - Chicken & Vegetables',
    'me-o-adult-cat-dry-food-chicken-vegetables-61',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry food for adult cats
Target / Life Stage: Adult cats, approximately 1 year and above
Key Ingredients / Composition: Corn, poultry meal, rice, corn gluten meal, soybean meal, chicken oil, tuna meal, chicken hydrolysate, minerals, krill meal, vitamins, DL-methionine, taurine, potassium sorbate, antioxidants and food colouring.
Guaranteed Analysis: Crude Protein min. 30% | Crude Fat min. 9% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits / Indications: Balanced protein supports healthy muscles and everyday activity. Taurine supports normal vision; calcium, phosphorus and vitamin D support strong bones and teeth; Omega-3, Omega-6 and zinc help maintain healthy skin and coat; vitamin C and other micronutrients support immune health. The balanced mineral profile is designed to support normal urinary wellbeing.
Pack Size(s): 450 g | 1.2 kg | 3 kg | 7 kg
Directions / Use: Feed according to body weight and activity using the feeding table printed on the pack. Introduce gradually when changing diets and maintain constant access to fresh water.
Product Description
Me-O Adult Cat Dry Food Chicken & Vegetables is a complete and balanced diet for adult cats, combining poultry-based protein with essential vitamins, minerals, taurine and Omega fatty acids. It supports healthy muscles, bright eyes, strong bones and teeth, urinary wellbeing, immune function, and healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p61_me_o_adult_cat_dry_food_chicken_veg_1.png',
    ARRAY['/images/products/p61_me_o_adult_cat_dry_food_chicken_veg_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #62. Me-O Persian Cat Food - Anti-Hairball Formula
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Persian Cat Food - Anti-Hairball Formula',
    'me-o-persian-cat-food-anti-hairball-formula-62',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry adult cat food formulated for Persian and long-haired cats
Target / Life Stage: Adult cats 1 year and above; especially Persian and other long-haired breeds
Key Ingredients / Composition: Complete adult-cat formula with a special fibre system for hairball management, together with protein sources, fats, taurine, vitamins, minerals and essential fatty acids. Use the locally supplied pack as the final authority for the complete ingredient declaration.
Guaranteed Analysis: Crude Protein min. 30% | Crude Fat min. 15% | Crude Fibre max. 9% | Moisture max. 10%
Key Benefits / Indications: Special dietary fibre promotes the safe passage of swallowed hair through the digestive tract and helps reduce hairball formation. Omega-3 and Omega-6 fatty acids support healthy skin and a lustrous long coat; taurine supports normal vision; highly digestible fibres support digestive health; essential minerals help maintain strong bones and teeth and support urinary wellbeing.
Pack Size(s): 400 g | 1.1 kg
Directions / Use: Feed according to the cat''s weight, age, activity and body condition using the pack feeding guide. Brush long-haired cats regularly to complement hairball management and keep clean drinking water available.
Website Product Description
Me-O Persian Cat Food is a complete dry anti-hairball formula developed for adult Persian and other long-haired cats. Its special fibre system helps swallowed hair pass safely through the digestive tract, while added taurine, Omega fatty acids, vitamins and minerals support healthy digestion, bright eyes, strong bones and teeth, urinary wellbeing, and a soft, lustrous coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p62_me_o_persian_cat_food_anti_hairball_1.png',
    ARRAY['/images/products/p62_me_o_persian_cat_food_anti_hairball_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #63. Catron Bentonite Cat Litter - Baby Powder
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter - Baby Powder',
    'catron-bentonite-cat-litter-baby-powder-63',
    'Catron',
    cat_litter,
    'Cat',
    'Brand / Manufacturer: Catron | Bestonit
Product Type: Premium scented clumping white bentonite cat litter
Target / Life Stage: Cats; suitable for open and covered litter trays
Key Ingredients / Composition: 100% natural white bentonite mineral with Baby Powder fragrance.
Guaranteed Analysis: Not applicable. Product performance is based on natural bentonite absorbency and clumping properties.
Key Benefits / Indications: Fast and strong clumping for easy scooping; high liquid absorption; natural bentonite helps lock in moisture and unpleasant odours; approximately 99% dust-free presentation; soft Baby Powder fragrance helps keep the litter area smelling fresh.
Pack Size(s): 10 L
Directions / Use: Fill a clean litter tray with approximately 7 cm of litter. Remove urine clumps and solid waste every day, top up with fresh litter as needed, and periodically replace and clean the tray. Do not flush bentonite litter down the toilet.
Product Description
Catron Baby Powder is a 10 L premium clumping cat litter made from natural white bentonite. It quickly absorbs moisture and forms firm clumps for easy daily cleaning, while helping trap unpleasant odours. A soft Baby Powder fragrance provides an added feeling of freshness around the litter tray.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p63_catron_bentonite_cat_litter_baby_po_1.png',
    ARRAY['/images/products/p63_catron_bentonite_cat_litter_baby_po_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10L', 3250.0, 3575.00, 50);

  -- #64. Catron Bentonite Cat Litter - Marseille Soap
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter - Marseille Soap',
    'catron-bentonite-cat-litter-marseille-soap-64',
    'Catron',
    cat_grooming,
    'Cat',
    'Brand / Manufacturer: Catron | Bestonit
Product Type: Premium scented clumping white bentonite cat litter
Target / Life Stage: Cats; suitable for open and covered litter trays
Key Ingredients / Composition: 100% natural white bentonite mineral with Marseille Soap fragrance.
Guaranteed Analysis: Not applicable. Product performance is based on natural bentonite absorbency and clumping properties.
Key Benefits / Indications: Fast, strong clumping makes waste easy to remove; high absorbency helps keep the tray dry; natural bentonite traps moisture and odour; approximately 99% dust-free presentation; Marseille Soap fragrance adds a clean, fresh scent after use.
Pack Size(s): 10 L
Directions / Use: Maintain roughly 7 cm of litter in a clean tray. Scoop clumps and faeces daily, replenish as necessary and clean the tray periodically. Dispose of used litter with household waste; do not flush bentonite litter.
Product Description
Catron Marseille Soap is a 10 L natural white bentonite clumping cat litter designed for convenient everyday hygiene. Its highly absorbent granules form firm, scoopable clumps and help control unpleasant odours, while the classic Marseille Soap fragrance leaves the litter area smelling clean and fresh.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p64_catron_bentonite_cat_litter_marseil_1.png',
    ARRAY['/images/products/p64_catron_bentonite_cat_litter_marseil_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10L', 3250.0, 3575.00, 50);

  -- #65. Catron Bentonite Cat Litter - Green Apple
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter - Green Apple',
    'catron-bentonite-cat-litter-green-apple-65',
    'Catron',
    cat_litter,
    'Cat',
    'Brand / Manufacturer: Catron | Bestonit
Product Type: Premium scented clumping white bentonite cat litter
Target / Life Stage: Cats; suitable for open and covered litter trays
Key Ingredients / Composition: 100% natural white bentonite mineral with Green Apple fragrance.
Guaranteed Analysis: Not applicable. Product performance is based on natural bentonite absorbency and clumping properties.
Key Benefits / Indications: Rapid moisture absorption and firm clumping make daily cleaning easier; bentonite naturally helps contain odours; approximately 99% dust-free presentation supports cleaner handling; fresh Green Apple fragrance helps maintain a pleasant litter-box environment.
Pack Size(s): 10 L
Directions / Use: Add approximately 7 cm of litter to a clean, dry tray. Scoop clumps and solids every day, top up to maintain depth, and replace/clean the tray periodically. Do not dispose of bentonite litter in the toilet.
Product Description
Catron Green Apple is a 10 L premium white bentonite cat litter combining strong clumping and high absorbency with a crisp Green Apple fragrance. It forms compact clumps on contact with moisture for quick scooping and helps keep the litter tray cleaner and fresher between changes.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '/images/products/p65_catron_bentonite_cat_litter_green_a_1.png',
    ARRAY['/images/products/p65_catron_bentonite_cat_litter_green_a_1.png']::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10L', 3250.0, 3575.00, 50);

  -- #66. Catron Bentonite Cat Litter - Coconut & Vanilla
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter - Coconut & Vanilla',
    'catron-bentonite-cat-litter-coconut-vanilla-66',
    'Catron',
    cat_litter,
    'Cat',
    'Brand / Manufacturer: Catron | Bestonit
Product Type: Premium scented clumping white bentonite cat litter
Target / Life Stage: Cats; suitable for open and covered litter trays
Key Ingredients / Composition: Natural white bentonite mineral with Coconut & Vanilla fragrance.
Guaranteed Analysis: Not applicable. Product performance is based on natural bentonite absorbency and clumping properties.
Key Benefits / Indications: Strong clumping and effective moisture absorption support easy maintenance and economical use; natural bentonite helps capture unpleasant odours; low-dust handling helps keep the surrounding area cleaner; warm Coconut & Vanilla fragrance adds long-lasting freshness.
Pack Size(s): 10 L
Directions / Use: Fill the tray to about 7 cm depth. Remove clumps and solid waste daily, add fresh litter when required and clean the tray regularly. Dispose of used bentonite litter with household waste and do not flush.
Product Description
Catron Coconut & Vanilla is a 10 L clumping bentonite cat litter with a warm tropical fragrance. Natural white bentonite rapidly absorbs moisture and forms firm, easy-to-scoop clumps while helping control litter-box odours, making routine cleaning simple and convenient.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}'::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

  -- #67. Catron Bentonite Cat Litter - Cappuccino
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Catron Bentonite Cat Litter - Cappuccino',
    'catron-bentonite-cat-litter-cappuccino-67',
    'Catron',
    cat_litter,
    'Cat',
    'Brand / Manufacturer: Catron | Bestonit
Product Type: Premium scented clumping white bentonite cat litter
Target / Life Stage: Cats; suitable for open and covered litter trays
Key Ingredients / Composition: Natural white bentonite mineral with Cappuccino fragrance.
Guaranteed Analysis: Not applicable. Product performance is based on natural bentonite absorbency and clumping properties.
Key Benefits / Indications: High absorbency and fast clumping help maintain a cleaner, drier litter tray; firm clumps are easy to scoop; natural bentonite helps control unpleasant odours; low-dust performance supports cleaner handling; distinctive Cappuccino fragrance adds a warm, pleasant scent.
Pack Size(s): 10 L
Directions / Use: Use approximately a 7 cm layer in a clean litter tray. Scoop urine clumps and faeces daily, replenish as needed, and fully clean the tray periodically. Do not flush bentonite litter down the toilet.
Product Description
Catron Cappuccino is a 10 L premium clumping cat litter made from absorbent natural white bentonite. It forms firm clumps for quick daily cleaning and helps trap moisture and unpleasant odours, while its distinctive Cappuccino fragrance keeps the litter area pleasantly fresh.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}'::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '10L', 3250.0, 3575.00, 50);

  -- #68. Me-O Persian Kitten
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Persian Kitten',
    'me-o-persian-kitten-68',
    'Me-O',
    cat_food,
    'Cat',
    'Product Type: Complete dry kitten food
Target / Life Stage: Persian kittens from weaning up to 1 year
Key Ingredients / Composition: Poultry by-product meal, rice, soybean meal, corn, corn gluten meal, poultry fat, full-fat soybean, fish meal, egg powder, beet pulp, flaxseed, milk replacer, sunflower oil, fish oil, brewer''s dried yeast, minerals, lecithin, fructo-oligosaccharide, vitamins, DL-methionine, taurine, antioxidants and food colouring.
Guaranteed Analysis: Crude Protein min. 32% | Crude Fat min. 18% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits: Specially formulated for the nutritional needs of growing Persian kittens. High-quality protein supports growth and muscle development; taurine supports healthy eyesight; calcium, phosphorus and vitamin D support strong bones and teeth; Omega-3 and Omega-6 fatty acids with zinc help maintain healthy skin and a shiny coat. The formula also supports immunity and healthy digestion.
Pack Size(s): 400 g | 1.1 kg
Directions / Use: Feed according to the kitten''s age, body weight and activity level using the feeding guide on the pack. Divide the daily quantity into suitable meals for young kittens. Introduce a new diet gradually and always provide clean, fresh drinking water.
Product Description
Me-O Persian Kitten is a complete and balanced dry food scientifically formulated for Persian kittens from weaning up to one year of age. With 32% minimum crude protein and 18% minimum crude fat, the formula supports healthy growth and muscle development while taurine, Omega fatty acids, vitamins and balanced minerals help support eyesight, immunity, strong bones and teeth, healthy digestion, and a soft, shiny coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}'::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, '400g', 1490.0, 1639.00, 50);

  -- #69. Me-O Mother and Baby Cat
  INSERT INTO products (
    name, slug, brand, category_id, pet_type, description,
    ingredients, indications, directions, packaging, storage_safety,
    image_url, images, is_featured, is_active
  ) VALUES (
    'Me-O Mother and Baby Cat',
    'me-o-mother-and-baby-cat-69',
    'Me-O',
    cat_litter,
    'Cat',
    'Product Type: Complete dry food for mother cats and young kittens
Target / Life Stage: Mother cats during gestation and lactation; kittens from weaning to 4 months
Key Ingredients / Composition: Poultry meal, corn gluten meal, poultry fat, corn, soybean meal, wheat flour, rice, beet pulp, fish meal, prebiotics including fructo-oligosaccharide, beta-glucan, mannan-oligosaccharide and galacto-oligosaccharide, minerals, ocean fish oil, lecithin, brewer''s dried yeast, milk replacer, vitamins, DL-methionine, taurine and antioxidants.
Guaranteed Analysis: Crude Protein min. 35% | Crude Fat min. 18% | Crude Fibre max. 4% | Moisture max. 10%
Key Benefits: Provides an elevated protein and energy level to support the increased nutritional needs of pregnant and nursing mother cats and the rapid growth of young kittens. Supports immunity, healthy digestion, brain and nervous-system development, eyesight, skin and coat health, and strong bones and teeth. The kibble can be easily softened with lukewarm water to assist kittens during the transition from milk to solid food.
Pack Size(s): 400 g | 1.1 kg
Directions / Use: For mother cats, adjust the daily quantity according to the stage of pregnancy or lactation, body condition and litter size. For kittens during weaning, the kibble may be softened with lukewarm water. Follow the feeding table on the pack and keep fresh drinking water available at all times.
Product Description
Me-O Mother and Baby Cat is a complete, nutrient-dense dry food designed for mother cats during pregnancy and lactation and for kittens from weaning to four months of age. Its high-protein, high-energy formula supports milk production, early growth and muscle development, while prebiotics, taurine, fish oil, vitamins and minerals help support digestion, immunity, brain and eye development, strong bones and teeth, and healthy skin and coat.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '{}'::TEXT[],
    false,
    true
  ) RETURNING id INTO pid;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (pid, 'Standard', 1500.0, 1650.00, 50);

END $$;