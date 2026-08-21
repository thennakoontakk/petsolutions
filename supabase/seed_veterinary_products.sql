-- =============================================
-- Veterinary Products Seed Data (From Client Document)
-- Run this in your Supabase SQL Editor to populate sample products
-- =============================================

DO $$
DECLARE
  cat_health UUID;
  cat_pharmacy UUID;
  p_liv52 UUID;
  p_digyton UUID;
  p_arbce UUID;
  p_visorbits UUID;
  p_scavon_spray UUID;
  p_scavon_cream UUID;
BEGIN
  -- 1. Ensure categories exist
  INSERT INTO categories (name, slug, description, parent_category, display_order)
  VALUES 
    ('Health & Supplements', 'health-supplements', 'Herbal tonics, vitamin/mineral supplements, and metabolic support.', 'Cat/Dog', 1),
    ('Veterinary Care & Wound Care', 'veterinary-care-wound-care', 'Topical sprays, wound healing creams, and digestive drops.', 'Cat/Dog', 2)
  ON CONFLICT (slug) DO UPDATE 
    SET name = EXCLUDED.name;

  SELECT id INTO cat_health FROM categories WHERE slug = 'health-supplements';
  SELECT id INTO cat_pharmacy FROM categories WHERE slug = 'veterinary-care-wound-care';

  -- -------------------------------------------------------------
  -- 10. Himalaya Liv.52 Pet Liquid 200 ml
  -- -------------------------------------------------------------
  INSERT INTO products (
    name, slug, brand, category_id, pet_type,
    description,
    ingredients,
    indications,
    directions,
    packaging,
    storage_safety,
    is_featured, is_active
  ) VALUES (
    'Himalaya Liv.52 Pet Liquid 200 ml',
    'himalaya-liv-52-pet-liquid-200-ml',
    'Himalaya',
    cat_health,
    'Cat/Dog',
    'Liv.52 pet is Himalaya''s companion-animal herbal liquid for appetite and liver support. Its key botanical ingredients are Caper Bush and Chicory, herbs used by Himalaya in its hepatoprotective formulation. The manufacturer''s current guidance lists 5-8 ml twice daily for small-breed dogs and 10-15 ml twice daily for large breeds, with adjustment according to veterinary advice. The official pack contains 200 ml.',
    'Caper Bush (Himsra) and Chicory (Kasani)',
    'Liv.52 pet as an appetite stimulant and hepatoprotective product, with the herbal ingredients positioned for liver-support applications.',
    'Small-breed dogs: 5-8 ml twice daily; large-breed dogs: 10-15 ml twice daily. Himalaya states that dosage may be altered for breed/severity or as directed by a veterinarian.',
    '200-ml labeled liquid bottle.',
    'Store dry, away from direct heat and sunlight. Keep away from children.',
    true, true
  )
  ON CONFLICT (slug) DO UPDATE 
    SET description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        indications = EXCLUDED.indications,
        directions = EXCLUDED.directions,
        packaging = EXCLUDED.packaging,
        storage_safety = EXCLUDED.storage_safety
  RETURNING id INTO p_liv52;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (p_liv52, '200ml', 3200.00, 3500.00, 50)
  ON CONFLICT DO NOTHING;

  -- -------------------------------------------------------------
  -- 11. Himalaya Digyton Drops 30 ml
  -- -------------------------------------------------------------
  INSERT INTO products (
    name, slug, brand, category_id, pet_type,
    description,
    ingredients,
    indications,
    directions,
    packaging,
    storage_safety,
    is_featured, is_active
  ) VALUES (
    'Himalaya Digyton Drops 30 ml',
    'himalaya-digyton-drops-30-ml',
    'Himalaya',
    cat_health,
    'Cat/Dog',
    'Digyton Drops is Himalaya''s companion-animal digestive support formulation containing cardamom and dill oil. The product is designed to facilitate secretion of proteolytic, amylolytic and lipolytic enzymes involved in food digestion while supporting bowel regulation. Dosage should be selected according to the animal''s breed, condition and veterinary advice rather than extrapolated from another Digyton product. The official presentation is a 30 ml bottle.',
    'Cardamom and Dill Oil, with concentrations unspecified.',
    'Himalaya states that Digyton facilitates secretion of proteolytic, amylolytic and lipolytic digestive enzymes, supporting food digestion and bowel regulation.',
    'As directed by a veterinarian.',
    '30-ml dropper-style veterinary bottle.',
    'Store dry, away from direct heat and sunlight. Keep away from children.',
    false, true
  )
  ON CONFLICT (slug) DO UPDATE 
    SET description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        indications = EXCLUDED.indications,
        directions = EXCLUDED.directions,
        packaging = EXCLUDED.packaging,
        storage_safety = EXCLUDED.storage_safety
  RETURNING id INTO p_digyton;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (p_digyton, '30ml', 1850.00, 2100.00, 40)
  ON CONFLICT DO NOTHING;

  -- -------------------------------------------------------------
  -- 12. aRBCe PET 200 ml
  -- -------------------------------------------------------------
  INSERT INTO products (
    name, slug, brand, category_id, pet_type,
    description,
    ingredients,
    indications,
    directions,
    packaging,
    storage_safety,
    is_featured, is_active
  ) VALUES (
    'aRBCe PET Haematinic Liquid 200 ml',
    'arbce-pet-haematinic-liquid-200-ml',
    'Virbac / aRBCe',
    cat_health,
    'Cat/Dog',
    'aRBCe PET is palatable haematinic supplement formulated with bioavailable glycine-chelated minerals. Its confirmed components include chelated iron, copper and cobalt together with vitamins B2 and B3, providing nutritional support for haemoglobin formation and recovery from nutritional deficiency. Veterinary retailers also position the product for supportive use during anaemia, debility and convalescence. The verified pack size is 200 ml; dosing should follow the local pack or veterinarian.',
    'Glycine-chelated iron 20 mg, glycine-chelated copper 10 mg, glycine-chelated cobalt 4 mg, vitamin B2 1 mg and vitamin B3 5 mg among the formula''s ingredients. Positioned around highly bioavailable chelated minerals and B-complex nutritional support.',
    'Nutritional support in anaemic states and mineral/vitamin deficiency, including convalescence and conditions associated with blood loss or parasitism, as described by veterinary retailers.',
    'Dogs: 5 ml per 20 kg body weight twice daily; cats: 0.5 ml per 5 kg twice daily, directly or mixed with food.',
    '200-ml palatable oral-liquid bottle.',
    'Store dry, protect from direct sunlight.',
    true, true
  )
  ON CONFLICT (slug) DO UPDATE 
    SET description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        indications = EXCLUDED.indications,
        directions = EXCLUDED.directions,
        packaging = EXCLUDED.packaging,
        storage_safety = EXCLUDED.storage_safety
  RETURNING id INTO p_arbce;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (p_arbce, '200ml', 3800.00, 4200.00, 30)
  ON CONFLICT DO NOTHING;

  -- -------------------------------------------------------------
  -- 13. Zoetis Vi-Sorbits Tablets 50s
  -- -------------------------------------------------------------
  INSERT INTO products (
    name, slug, brand, category_id, pet_type,
    description,
    ingredients,
    indications,
    directions,
    packaging,
    storage_safety,
    is_featured, is_active
  ) VALUES (
    'Zoetis Vi-Sorbits Tablets (50 Tablets)',
    'zoetis-vi-sorbits-tablets-50s',
    'Zoetis',
    cat_health,
    'Dog',
    'Vi-Sorbits provides a broad spectrum of vitamins and minerals in a palatable tablet formulated for dogs. The formula includes vitamins A, D, E and B-complex nutrients together with iron, copper, calcium, phosphorus and other essential minerals. Give one tablet daily, either whole or crumbled over food, unless otherwise directed by a veterinarian. Store between 15°C and 30°C and keep out of children''s reach.',
    'Per tablet: vitamin A 1,250 IU, vitamin D 125 IU, vitamin E 2 IU, thiamine 1 mg, riboflavin 1 mg, d-pantothenic acid 0.5 mg, niacin 10 mg, vitamin B6 1 mg, folic acid 0.2 mg, vitamin B12 8 mcg, iron 9 mg, copper 0.45 mg, plus calcium, phosphorus, potassium, salt, chloride and magnesium.',
    'Routine vitamin/mineral supplementation; nutritional support during reduced appetite, anaemia, pregnancy, ageing and recovery.',
    'One tablet daily, given whole or crumbled onto food.',
    'Tablet bottle containing 50 chewable meat-flavored tablets.',
    'Store at 15-30°C and keep out of reach of children.',
    true, true
  )
  ON CONFLICT (slug) DO UPDATE 
    SET description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        indications = EXCLUDED.indications,
        directions = EXCLUDED.directions,
        packaging = EXCLUDED.packaging,
        storage_safety = EXCLUDED.storage_safety
  RETURNING id INTO p_visorbits;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (p_visorbits, '50 Tablets', 4500.00, 4900.00, 25)
  ON CONFLICT DO NOTHING;

  -- -------------------------------------------------------------
  -- 14. Himalaya Scavon VET Spray 100 ml
  -- -------------------------------------------------------------
  INSERT INTO products (
    name, slug, brand, category_id, pet_type,
    description,
    ingredients,
    indications,
    directions,
    packaging,
    storage_safety,
    is_featured, is_active
  ) VALUES (
    'Himalaya Scavon VET Spray 100 ml',
    'himalaya-scavon-vet-spray-100-ml',
    'Himalaya',
    cat_pharmacy,
    'Cat/Dog',
    'Scavon VET Spray is Himalaya''s topical veterinary wound-care formulation for traumatic, surgical and infected wounds. Its ingredient blend includes Atasi, eucalyptus, camphor, Tulasi and Vacha components together with Yashada bhasma. Clean the wound and apply the required amount according to the veterinary label, generally twice daily for companion-animal applications. Store the 100 ml spray away from direct heat and sunlight and keep out of children''s reach.',
    'Atasi oil 50 mg, Tailapatra/Eucalyptus oil 50 mg, Karpura 25 mg, Tulasi 12 mg, Vacha 7 mg and Yashada bhasma 25 mg in the formulation information.',
    'Traumatic and surgical wounds, maggot-infested or infected wounds, bacterial/fungal wound conditions and selected livestock lesions.',
    'Clip hair where necessary, clean the affected area and apply the required quantity, generally twice daily for companion-animal wound care according to the manufacturer''s instructions.',
    '100-ml labeled spray container.',
    'Store dry, away from direct heat and sunlight; do not refrigerate; keep away from children and do not expose the container above 50°C. For animal use only.',
    false, true
  )
  ON CONFLICT (slug) DO UPDATE 
    SET description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        indications = EXCLUDED.indications,
        directions = EXCLUDED.directions,
        packaging = EXCLUDED.packaging,
        storage_safety = EXCLUDED.storage_safety
  RETURNING id INTO p_scavon_spray;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (p_scavon_spray, '100ml Spray', 2200.00, 2500.00, 45)
  ON CONFLICT DO NOTHING;

  -- -------------------------------------------------------------
  -- 15. Himalaya Scavon VET Cream 50 g
  -- -------------------------------------------------------------
  INSERT INTO products (
    name, slug, brand, category_id, pet_type,
    description,
    ingredients,
    indications,
    directions,
    packaging,
    storage_safety,
    is_featured, is_active
  ) VALUES (
    'Himalaya Scavon VET Cream 50 g',
    'himalaya-scavon-vet-cream-50-g',
    'Himalaya',
    cat_pharmacy,
    'Cat/Dog',
    'Scavon VET Cream provides Himalaya''s antimicrobial and wound-support formulation in a convenient topical cream. It combines herbal ingredients including Atasi, eucalyptus, camphor, Tulasi and Vacha with Yashada bhasma and is intended for a range of traumatic and infected wounds. Clean the affected area before application and use at the frequency shown on the label or prescribed by a veterinarian. The product is supplied in a 50 g presentation and should be protected from direct heat and sunlight.',
    'Atasi, eucalyptus/Tailapatra, Karpura, Tulasi, Vacha and Yashada bhasma.',
    'Intended for traumatic, surgical, maggoted and infected wounds.',
    'Clip hair as appropriate, clean the area and apply the required amount of cream, generally twice daily or as directed by a veterinarian.',
    '50-g topical cream tube, normally within labeled retail packaging.',
    'Dry storage away from direct heat and sunlight; do not refrigerate; keep out of children''s reach; animal use only.',
    false, true
  )
  ON CONFLICT (slug) DO UPDATE 
    SET description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        indications = EXCLUDED.indications,
        directions = EXCLUDED.directions,
        packaging = EXCLUDED.packaging,
        storage_safety = EXCLUDED.storage_safety
  RETURNING id INTO p_scavon_cream;

  INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock)
  VALUES (p_scavon_cream, '50g Tube', 1650.00, 1900.00, 60)
  ON CONFLICT DO NOTHING;

END $$;
