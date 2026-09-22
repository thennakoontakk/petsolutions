-- =====================================================================
-- PetSolutions.lk: Sync 118 Real Priced Variants & Clinical Data
-- Matched from Word Document (01-04) and E-Com Product List.xlsx
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnakxlejkmyptoffvhsa/sql
-- =====================================================================

DO $$
DECLARE
  pid UUID;
BEGIN

  -- [Product #1]: TixFree Spot-On for Adult Cats
  SELECT id INTO pid FROM products WHERE slug = 'tixfree-spot-on-for-adult-cats' OR name ILIKE 'TixFree Spot-On for Adult Cats' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'TixFree'),
      ingredients = COALESCE(ingredients, 'Fipronil 10% w/v. It is marketed for control of fleas, ticks and biting lice on cats.'),
      directions = COALESCE(directions, 'Apply the complete single-dose pipette directly to exposed skin at the base/back of the neck where the cat cannot readily lick it. The local retailer instructions describe monthly protection and recommend keeping the animal dry for about 48 hours after application.'),
      packaging = COALESCE(packaging, 'A small single-use plastic spot-on pipette, sold individually or as a three-dose carton.'),
      storage_safety = COALESCE(storage_safety, 'The detailed local listing says to avoid use in sick or convalescent animals and rabbits, avoid the eyes and mouth, prevent children from handling the application area, and store below 30°C in a dry place; the formulation should be treated as flammable until dry.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, 'Adult Cat (3 pipettes pack)', 1980.00, 2200.00, 120, true);
  END IF;

  -- [Product #2]: TixFree Spot-On for Dogs
  SELECT id INTO pid FROM products WHERE slug = 'tixfree-spot-on-for-dogs' OR name ILIKE 'TixFree Spot-On for Dogs' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'TixFree'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Select the presentation for the dog''s body weight, part the hair and empty the complete pipette onto the skin rather than the coat. The local retailer instructions emphasize using the correct weight-specific dose.'),
      packaging = COALESCE(packaging, 'Weight-coded single-dose pipettes, sold individually or in three-dose boxes.'),
      storage_safety = COALESCE(storage_safety, 'Detailed storage information for every dog SKU was not recovered; use only the correctly labeled canine weight range and follow the pack''s external-use precautions. Do not calculate a different dose from the concentration when a weight-specific pipette is available.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '02 - 10 Kg (3 pipettes)', 2700.00, 2950.00, 85, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 - 20 Kg (3 pipettes)', 3060.00, 3350.00, 65, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '20 - 40 Kg (3 pipettes)', 3570.00, 3900.00, 45, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '40 - 60 Kg (3 pipettes)', 4680.00, 5100.00, 30, true);
  END IF;

  -- [Product #3]: Antick 10%
  SELECT id INTO pid FROM products WHERE slug = 'antick-10' OR name ILIKE 'Antick 10%' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, 'The official listing gives cypermethrin 10 g per 100 ml, equivalent to a 10% formulation, in solvent/emulsifying vehicle.'),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, 'Small concentrate bottles in the 10-ml sizes and a larger 1-L bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 ml Bottle', 775.00, 850.00, 100, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1 Litre Pack', 56500.00, 59000.00, 15, true);
  END IF;

  -- [Product #4]: Tickamit 12.5
  SELECT id INTO pid FROM products WHERE slug = 'tickamit-12-5' OR name ILIKE 'Tickamit 12.5' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 ml Bottle', 990.00, 1100.00, 90, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '100 ml Bottle', 9450.00, 9900.00, 25, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1 Litre Pack', 76000.00, 80000.00, 10, true);
  END IF;

  -- [Product #5]: Rapimec - Ivermectin 10 mg Tablets
  SELECT id INTO pid FROM products WHERE slug = 'rapimec-ivermectin-10-mg-tablets' OR name ILIKE 'Rapimec - Ivermectin 10 mg Tablets' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'As directed by the veterinary practitioner rather than giving a consumer self-dosing schedule.'),
      packaging = COALESCE(packaging, 'Ten tablets, normally presented as a blister/strip within retail packaging.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10''s Pack', 1100.00, 1250.00, 80, true);
  END IF;

  -- [Product #6]: Petfat Liquid 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'petfat-liquid-200-ml' OR name ILIKE 'Petfat Liquid 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, '2 g per 5 kg body weight daily, administered through feed; one pump = 2 g according to the product listing.'),
      packaging = COALESCE(packaging, '200-ml dispensing bottle, with a pump calibrated to approximately 2 g per actuation.'),
      storage_safety = COALESCE(storage_safety, 'Specific storage conditions were unspecified. Use as a feed supplement at the recommended amount.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 2150.00, 2300.00, 75, true);
  END IF;

  -- [Product #7]: Vetgrow Red Dogs 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-red-dogs-200-ml' OR name ILIKE 'Vetgrow Red Dogs 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'A detailed local listing gives 5 ml per 10 kg body weight daily, mixed with food or given directly.'),
      packaging = COALESCE(packaging, '200-ml liquid bottle; larger 1-L bottle'),
      storage_safety = COALESCE(storage_safety, 'Store cool and dry, away from direct sunlight, and keep the bottle tightly closed.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 1500.00, 1650.00, 60, true);
  END IF;

  -- [Product #8]: Orcalmin Suspension 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'orcalmin-suspension-200-ml' OR name ILIKE 'Orcalmin Suspension 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Exact species/weight dosage was unspecified in the retrieved official result; use as directed on the bottle or by the veterinarian.'),
      packaging = COALESCE(packaging, '200-ml oral-suspension bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Suspension', 925.00, 1050.00, 90, true);
  END IF;

  -- [Product #9]: Bones-Up 200 g
  SELECT id INTO pid FROM products WHERE slug = 'bones-up-200-g' OR name ILIKE 'Bones-Up 200 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'One teaspoonful / 5 g per 10 kg body weight daily.'),
      packaging = COALESCE(packaging, 'Powder supplement in 200-g and 900-g consumer containers.'),
      storage_safety = COALESCE(storage_safety, 'Specific storage conditions unspecified.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 g Container', 1400.00, 1550.00, 80, true);
  END IF;

  -- [Product #10]: Liv.52 Pet Liquid 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'liv-52-pet-liquid-200-ml' OR name ILIKE 'Liv.52 Pet Liquid 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Himalaya'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Small-breed dogs: 5-8 ml twice daily; large-breed dogs: 10-15 ml twice daily. Himalaya states that dosage may be altered for breed/severity or as directed by a veterinarian.'),
      packaging = COALESCE(packaging, '200-ml labeled liquid bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 1200.00, 1350.00, 150, true);
  END IF;

  -- [Product #11]: Digyton Drops 30 ml
  SELECT id INTO pid FROM products WHERE slug = 'digyton-drops-30-ml' OR name ILIKE 'Digyton Drops 30 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Himalaya'),
      ingredients = COALESCE(ingredients, 'Cardamom and Dill Oil, with concentrations unspecified.'),
      directions = COALESCE(directions, 'As directed by a veterinarian.'),
      packaging = COALESCE(packaging, '30-ml dropper-style veterinary bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '30 ml Drops', 383.00, 420.00, 110, true);
  END IF;

  -- [Product #12]: aRBCe PET 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'arbce-pet-200-ml' OR name ILIKE 'aRBCe PET 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Dogs: 5 ml per 20 kg body weight twice daily; cats: 0.5 ml per 5 kg twice daily, directly or mixed with food.'),
      packaging = COALESCE(packaging, '200-ml palatable oral-liquid bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 1625.00, 1800.00, 70, true);
  END IF;

  -- [Product #13]: Vi-Sorbits Tablets 50s
  SELECT id INTO pid FROM products WHERE slug = 'vi-sorbits-tablets-50s' OR name ILIKE 'Vi-Sorbits Tablets 50s' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'One tablet daily, given whole or crumbled onto food.'),
      packaging = COALESCE(packaging, 'Tablet bottle, with count varying by market.'),
      storage_safety = COALESCE(storage_safety, 'Store at 15-30°C and keep out of reach of children.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '50 Tablets Pack', 9375.00, 9900.00, 40, true);
  END IF;

  -- [Product #14]: Scavon VET Spray 100 ml
  SELECT id INTO pid FROM products WHERE slug = 'scavon-vet-spray-100-ml' OR name ILIKE 'Scavon VET Spray 100 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Himalaya'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Clip hair where necessary, clean the affected area and apply the required quantity, generally twice daily for companion-animal wound care according to the manufacturer''s instructions.'),
      packaging = COALESCE(packaging, '100-ml labeled spray container.'),
      storage_safety = COALESCE(storage_safety, 'Store dry, away from direct heat and sunlight; do not refrigerate; keep away from children and do not expose the container above 50°C. For animal use only.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '100 ml Spray', 1331.00, 1450.00, 95, true);
  END IF;

  -- [Product #15]: Scavon VET Cream 50 g
  SELECT id INTO pid FROM products WHERE slug = 'scavon-vet-cream-50-g' OR name ILIKE 'Scavon VET Cream 50 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Himalaya'),
      ingredients = COALESCE(ingredients, 'The cream uses the Scavon herbal/mineral wound-care combination, including Atasi, eucalyptus/Tailapatra, Karpura, Tulasi, Vacha and Yashada bhasma.'),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, '50-g topical cream tube, normally within labeled retail packaging.'),
      storage_safety = COALESCE(storage_safety, 'Dry storage away from direct heat and sunlight; do not refrigerate; keep out of children''s reach; animal use only.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '50 g Tube', 793.00, 880.00, 85, true);
  END IF;

  -- [Product #16]: SANPET-PLUS Broad Spectrum Deworming Tablets
  SELECT id INTO pid FROM products WHERE slug = 'sanpet-plus-broad-spectrum-deworming-tablets' OR name ILIKE 'SANPET-PLUS Broad Spectrum Deworming Tablets' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 kg Tablet', 360.00, 400.00, 200, true);
  END IF;

  -- [Product #17]: Wolfo Flea & Tick Powder
  SELECT id INTO pid FROM products WHERE slug = 'wolfo-flea-tick-powder' OR name ILIKE 'Wolfo Flea & Tick Powder' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, 'Propoxur 1% w/w.'),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, 'Shaker-style veterinary powder container; exact net weight unspecified.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '75 g Talc Powder', 590.00, 650.00, 100, true);
  END IF;

  -- [Product #18]: Woofy Medicated Neem Soap 70 g
  SELECT id INTO pid FROM products WHERE slug = 'woofy-medicated-neem-soap-70-g' OR name ILIKE 'Woofy Medicated Neem Soap 70 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Seepet'),
      ingredients = COALESCE(ingredients, 'Neem is the identified featured ingredient; a quantified full ingredient composition was unspecified.'),
      directions = COALESCE(directions, 'Wet the coat, work the soap into a lather and massage through the coat while avoiding the eyes and ears, then rinse thoroughly.'),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '70 g Soap Bar', 450.00, 500.00, 120, true);
  END IF;

  -- [Product #19]: Woofy Lavender Soap 70 g
  SELECT id INTO pid FROM products WHERE slug = 'woofy-lavender-soap-70-g' OR name ILIKE 'Woofy Lavender Soap 70 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Seepet'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Wet the coat, lather and massage, avoiding eyes and ears, then rinse completely.'),
      packaging = COALESCE(packaging, 'Individually packaged 70-g soap bar.'),
      storage_safety = COALESCE(storage_safety, 'Unspecified; keep the soap dry between uses and use externally as a grooming product.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '70 g Soap Bar', 450.00, 500.00, 120, true);
  END IF;

  -- [Product #20]: Permvet Medicated Dog Soap 70 g
  SELECT id INTO pid FROM products WHERE slug = 'permvet-medicated-dog-soap-70-g' OR name ILIKE 'Permvet Medicated Dog Soap 70 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, 'Medicated soap bar, normally individually boxed/wrapped.'),
      storage_safety = COALESCE(storage_safety, 'Specific storage is unspecified. Because the verified listing explicitly identifies this as a dog soap, the website should not imply feline use unless the actual label specifically authorizes it.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '70 g Soap Bar', 650.00, 720.00, 100, true);
  END IF;

  -- [Product #21]: Nutricoat Advance
  SELECT id INTO pid FROM products WHERE slug = 'nutricoat-advance' OR name ILIKE 'Nutricoat Advance' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Product listings vary: local information includes 5 g/day for dogs and 10 g/day for pregnant/nursing bitches, while some international labels express dosing in ml/body weight. Therefore, the exact local bottle instruction should be used.'),
      packaging = COALESCE(packaging, 'Viscous liquid/oil supplement in bottles labeled by net weight, commonly 200 g or 400 g.'),
      storage_safety = COALESCE(storage_safety, 'Store in a cool, dry place; a local listing additionally advises cool/dark storage with the container closed.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 g Bottle', 2990.00, 3200.00, 65, true);
  END IF;

  -- [Product #22]: Nutricoat Syrup
  SELECT id INTO pid FROM products WHERE slug = 'nutricoat-syrup' OR name ILIKE 'Nutricoat Syrup' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'puppies 2.5 ml twice daily; adult dogs 5 ml twice daily; pregnant/nursing bitches 5-10 ml twice daily; cats 2.5-5 ml twice daily.'),
      packaging = COALESCE(packaging, 'Palatable liquid/tonic in a bottle labeled by net weight, usually 200 g'),
      storage_safety = COALESCE(storage_safety, 'Specific storage on the Hayleys excerpt was unspecified; keep the container appropriately closed and follow the label.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 g Bottle', 2680.00, 2900.00, 70, true);
  END IF;

  -- [Product #23]: Negasunt Powder
  SELECT id INTO pid FROM products WHERE slug = 'negasunt-powder' OR name ILIKE 'Negasunt Powder' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Bayer / Elanco'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Clean the wound thoroughly and dust Negasunt over the wound, ensuring that the surrounding area is also covered.'),
      packaging = COALESCE(packaging, '40-g dusting/shaker bottle.'),
      storage_safety = COALESCE(storage_safety, 'Specific storage conditions were unspecified in the retrieved page. Treat as a veterinary medicated powder and avoid inhalation, ingestion and unnecessary skin contact.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '40 g Container', 1290.00, 1400.00, 80, true);
  END IF;

  -- [Product #24]: Aluspray AWD
  SELECT id INTO pid FROM products WHERE slug = 'aluspray-awd' OR name ILIKE 'Aluspray AWD' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Bayer / Elanco'),
      ingredients = COALESCE(ingredients, 'Hayleys gives, per gram, neomycin 3,400 units, polymyxin B 5,000 units and bacitracin 400 units, plus excipients.'),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, '125-ml spray/aerosol-style container.'),
      storage_safety = COALESCE(storage_safety, 'Unspecified in the retrieved listing; external veterinary use only.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '125 ml Aerosol', 1980.00, 2200.00, 70, true);
  END IF;

  -- [Product #25]: Petmend Spray
  SELECT id INTO pid FROM products WHERE slug = 'petmend-spray' OR name ILIKE 'Petmend Spray' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, 'Pinus longifolia 4 g per 100 ml as part of the composition'),
      directions = COALESCE(directions, 'Exact application frequency was unspecified in the retrieved official evidence; use according to label/veterinary instructions.'),
      packaging = COALESCE(packaging, '150-ml labeled spray container.'),
      storage_safety = COALESCE(storage_safety, 'Unspecified; external veterinary use only.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '150 ml Spray', 980.00, 1100.00, 85, true);
  END IF;

  -- [Product #26]: Drontal Plus Tasty
  SELECT id INTO pid FROM products WHERE slug = 'drontal-plus-tasty' OR name ILIKE 'Drontal Plus Tasty' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Bayer / Elanco'),
      ingredients = COALESCE(ingredients, 'Praziquantel 50 mg, pyrantel embonate 144 mg and febantel 150 mg.'),
      directions = COALESCE(directions, 'One tablet per 10 kg body weight; tablets may be administered directly or in food, and Hayleys states that pre-treatment starvation is unnecessary.'),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, 'Detailed storage instructions were unspecified in the retrieved local page. Dosing should be based on current body weight and the pack label.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '2''s Pack', 990.00, 1100.00, 100, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '12''s Carton', 5450.00, 5900.00, 40, true);
  END IF;

  -- [Product #27]: Dermitol Shampoo
  SELECT id INTO pid FROM products WHERE slug = 'dermitol-shampoo' OR name ILIKE 'Dermitol Shampoo' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Twice weekly for several weeks, allowing brief skin contact before rinsing; because regimen may vary by market, publish label/veterinary directions rather than a fixed treatment course.'),
      packaging = COALESCE(packaging, '250-ml dermatological shampoo bottle.'),
      storage_safety = COALESCE(storage_safety, 'Unspecified; external veterinary use only, avoid eyes.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '250 ml Bottle', 3980.00, 4200.00, 60, true);
  END IF;

  -- [Product #28]: Furr-Fresh Medicated Shampoo 100 ml
  SELECT id INTO pid FROM products WHERE slug = 'furr-fresh-medicated-shampoo-100-ml' OR name ILIKE 'Furr-Fresh Medicated Shampoo 100 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Furr-Fresh'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Exact contact time/frequency unspecified; follow the pack or veterinarian rather than borrowing instructions from another ketoconazole/chlorhexidine brand.'),
      packaging = COALESCE(packaging, '100-ml shampoo bottle.'),
      storage_safety = COALESCE(storage_safety, 'Unspecified; external use only, avoid eyes, ears and ingestion.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 1300.00, 1450.00, 75, true);
  END IF;

  -- [Product #29]: Ticks & Fleas Shampoo 225 ml
  SELECT id INTO pid FROM products WHERE slug = 'ticks-fleas-shampoo-225-ml' OR name ILIKE 'Ticks & Fleas Shampoo 225 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, 'citronella oil, lemongrass oil, eucalyptus oil, neem oil and cinnamon oil. Concentrations are unspecified.'),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, '225-ml plastic shampoo bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '225 ml Bottle', 800.00, 900.00, 80, true);
  END IF;

  -- [Product #30]: Aloe Vera Shampoo & Conditioner 225 ml
  SELECT id INTO pid FROM products WHERE slug = 'aloe-vera-shampoo-conditioner-225-ml' OR name ILIKE 'Aloe Vera Shampoo & Conditioner 225 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, '225-ml shampoo bottle'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '225 ml Bottle', 650.00, 750.00, 90, true);
  END IF;

  -- [Product #31]: Malaseb Shampoo 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'malaseb-shampoo-200-ml' OR name ILIKE 'Malaseb Shampoo 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, 'Miconazole nitrate 2% w/v plus chlorhexidine gluconate 2% w/v.'),
      directions = COALESCE(directions, 'Exact contact time and treatment frequency for this SeePet formulation were unspecified in the retrieved evidence; follow the bottle or veterinarian.'),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, 'Unspecified; external veterinary use only, avoid eyes and ingestion.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 1140.00, 1250.00, 70, true);
  END IF;

  -- [Product #32]: Petvit Liquid 200 ml
  SELECT id INTO pid FROM products WHERE slug = 'petvit-liquid-200-ml' OR name ILIKE 'Petvit Liquid 200 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'puppies and kittens: 1-2 ml daily. Other species/age doses were unspecified in the retrieved evidence.'),
      packaging = COALESCE(packaging, '200-ml oral vitamin-liquid bottle.'),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Bottle', 1490.00, 1600.00, 60, true);
  END IF;

  -- [Product #33]: Vetgrow Meat in Feet 400 g
  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-meat-in-feet-400-g' OR name ILIKE 'Vetgrow Meat in Feet 400 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Approximately 1-2 pieces per day depending on size/activity, but this is not a manufacturer-verified feeding instruction in the retrieved material; therefore the pack should remain the authority.'),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, 'Retail advice is cool, dry storage and resealing after opening.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g Pack', 350.00, 400.00, 120, true);
  END IF;

  -- [Product #34]: Vetgrow Kick in Punch 300 ml
  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-kick-in-punch-300-ml' OR name ILIKE 'Vetgrow Kick in Punch 300 ml' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, 'Hydrolyzed chicken meat and hydrolyzed whey protein. Quantitative nutrient concentrations are unspecified.'),
      directions = COALESCE(directions, 'Manufacturer-listed daily dose: one tin per 10 kg body weight.'),
      packaging = COALESCE(packaging, '300-ml tin/can.'),
      storage_safety = COALESCE(storage_safety, 'Specific storage instructions are unspecified on the current product page. It should be presented as a supplementary food/beverage rather than a nutritionally complete diet unless the label says otherwise.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '300 ml Bottle', 450.00, 500.00, 100, true);
  END IF;

  -- [Product #35]: Vetgrow Meowghurt 200 g
  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-meowghurt-200-g' OR name ILIKE 'Vetgrow Meowghurt 200 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'A specific numerical daily dose was not published on the current manufacturer page retrieved.'),
      packaging = COALESCE(packaging, '200-g tin/can.'),
      storage_safety = COALESCE(storage_safety, 'Unspecified in the manufacturer text reviewed.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 g Tub', 450.00, 500.00, 90, true);
  END IF;

  -- [Product #36]: Vetgrow Doghurt 200 g
  SELECT id INTO pid FROM products WHERE slug = 'vetgrow-doghurt-200-g' OR name ILIKE 'Vetgrow Doghurt 200 g' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Vetgrow'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, 'Manufacturer-listed daily dose: one tin per 10 kg body weight.'),
      packaging = COALESCE(packaging, '200-g tin/can.'),
      storage_safety = COALESCE(storage_safety, 'Specific storage conditions unspecified on the current page. Disease-related use should remain under veterinary guidance rather than positioning Doghurt as a replacement for diagnosis or medical treatment.')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 g Tub', 450.00, 500.00, 90, true);
  END IF;

  -- [Product #37]: Classic Pet Puppy – Milk Flavor
  SELECT id INTO pid FROM products WHERE slug = 'classic-pet-puppy-milk-flavor' OR name ILIKE 'Classic Pet Puppy – Milk Flavor' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Classic Pet'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 650.00, 720.00, 80, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '500 g', 850.00, 950.00, 60, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '2 Kg', 3150.00, 3400.00, 40, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 13690.00, 14500.00, 20, true);
  END IF;

  -- [Product #38]: Classic Pet Adult Dog – Chicken Flavour
  SELECT id INTO pid FROM products WHERE slug = 'classic-pet-adult-dog-chicken-flavour' OR name ILIKE 'Classic Pet Adult Dog – Chicken Flavour' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Classic Pet'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 560.00, 620.00, 80, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '2 Kg', 2800.00, 3050.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3.5 Kg', 4650.00, 4950.00, 35, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 12050.00, 12800.00, 25, true);
  END IF;

  -- [Product #39]: Classic Pet Adult Dog – Beef Flavour
  SELECT id INTO pid FROM products WHERE slug = 'classic-pet-adult-dog-beef-flavour' OR name ILIKE 'Classic Pet Adult Dog – Beef Flavour' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Classic Pet'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '2 Kg', 2800.00, 3050.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3.5 Kg', 4650.00, 4950.00, 35, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 12050.00, 12800.00, 25, true);
  END IF;

  -- [Product #40]: SmartHeart Puppy – Chicken, Egg & Milk
  SELECT id INTO pid FROM products WHERE slug = 'smartheart-puppy-chicken-egg-milk' OR name ILIKE 'SmartHeart Puppy – Chicken, Egg & Milk' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'SmartHeart'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '500 g', 930.00, 1020.00, 60, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.3 Kg', 2550.00, 2750.00, 40, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '2.7 Kg', 4460.00, 4800.00, 30, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '8 Kg', 12800.00, 13600.00, 15, true);
  END IF;

  -- [Product #41]: SmartHeart Adult Dog – Chicken & Egg
  SELECT id INTO pid FROM products WHERE slug = 'smartheart-adult-dog-chicken-egg' OR name ILIKE 'SmartHeart Adult Dog – Chicken & Egg' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'SmartHeart'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '500 g', 930.00, 1020.00, 60, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.5 Kg', 2550.00, 2750.00, 45, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 4460.00, 4800.00, 35, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 12800.00, 13600.00, 20, true);
  END IF;

  -- [Product #42]: SmartHeart Adult Dog – Chicken & Liver
  SELECT id INTO pid FROM products WHERE slug = 'smartheart-adult-dog-chicken-liver' OR name ILIKE 'SmartHeart Adult Dog – Chicken & Liver' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'SmartHeart'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '500 g', 930.00, 1020.00, 60, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.5 Kg', 2550.00, 2750.00, 45, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 4460.00, 4800.00, 35, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 12800.00, 13600.00, 20, true);
  END IF;

  -- [Product #43]: SmartHeart Power Pack – Puppy
  SELECT id INTO pid FROM products WHERE slug = 'smartheart-power-pack-puppy' OR name ILIKE 'SmartHeart Power Pack – Puppy' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'SmartHeart'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1 Kg', 2140.00, 2300.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 5670.00, 6100.00, 35, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 17690.00, 18800.00, 20, true);
  END IF;

  -- [Product #44]: SmartHeart Power Pack – Adult
  SELECT id INTO pid FROM products WHERE slug = 'smartheart-power-pack-adult' OR name ILIKE 'SmartHeart Power Pack – Adult' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'SmartHeart'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1 Kg', 2050.00, 2250.00, 55, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 5310.00, 5750.00, 40, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Kg', 16490.00, 17500.00, 20, true);
  END IF;

  -- [Product #45]: SmartHeart Mother & Baby Dog
  SELECT id INTO pid FROM products WHERE slug = 'smartheart-mother-baby-dog' OR name ILIKE 'SmartHeart Mother & Baby Dog' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'SmartHeart'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.3 Kg', 2720.00, 2950.00, 45, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '2.6 Kg', 5200.00, 5600.00, 30, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '8 Kg', 13500.00, 14200.00, 15, true);
  END IF;

  -- [Product #46]: Me-O Kitten – Ocean Fish
  SELECT id INTO pid FROM products WHERE slug = 'me-o-kitten-ocean-fish' OR name ILIKE 'Me-O Kitten – Ocean Fish' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 1450.00, 1600.00, 70, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.1 Kg', 3250.00, 3500.00, 40, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '7 Kg', 14950.00, 15800.00, 15, true);
  END IF;

  -- [Product #47]: Me-O Creamy Treats – Bonito Flavor
  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-bonito-flavor' OR name ILIKE 'Me-O Creamy Treats – Bonito Flavor' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);
  END IF;

  -- [Product #48]: Me-O Creamy Treats – Chicken & Liver Flavor
  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-chicken-liver-flavor' OR name ILIKE 'Me-O Creamy Treats – Chicken & Liver Flavor' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);
  END IF;

  -- [Product #49]: Me-O Creamy Treats – Crab Flavor
  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-crab-flavor' OR name ILIKE 'Me-O Creamy Treats – Crab Flavor' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);
  END IF;

  -- [Product #50]: Me-O Creamy Treats – Salmon Flavor
  SELECT id INTO pid FROM products WHERE slug = 'me-o-creamy-treats-salmon-flavor' OR name ILIKE 'Me-O Creamy Treats – Salmon Flavor' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '4 x 15 g Pack', 630.00, 700.00, 120, true);
  END IF;

  -- [Product #51]: Me-O Pouch – Tuna in Jelly
  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-tuna-in-jelly' OR name ILIKE 'Me-O Pouch – Tuna in Jelly' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '80 g Pouch', 390.00, 440.00, 150, true);
  END IF;

  -- [Product #52]: Me-O Pouch – Ocean Fish in Jelly
  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-ocean-fish-in-jelly' OR name ILIKE 'Me-O Pouch – Ocean Fish in Jelly' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '80 g Pouch', 390.00, 440.00, 150, true);
  END IF;

  -- [Product #53]: Me-O Pouch – Tuna with Sardine in Jelly (Kitten)
  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-tuna-with-sardine-in-jelly-kitten' OR name ILIKE 'Me-O Pouch – Tuna with Sardine in Jelly (Kitten)' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 1450.00, 1600.00, 70, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.1 Kg', 3250.00, 3500.00, 40, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '7 Kg', 14950.00, 15800.00, 15, true);
  END IF;

  -- [Product #54]: Me-O Pouch – Tuna Topping with White Fish
  SELECT id INTO pid FROM products WHERE slug = 'me-o-pouch-tuna-topping-with-white-fish' OR name ILIKE 'Me-O Pouch – Tuna Topping with White Fish' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '80 g Pouch', 390.00, 440.00, 150, true);
  END IF;

  -- [Product #55]: Catron Bentonite Cat Litter – Grey Control
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-grey-control' OR name ILIKE 'Catron Bentonite Cat Litter – Grey Control' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 4500.00, 4800.00, 60, true);
  END IF;

  -- [Product #56]: Catron Bentonite Cat Litter – Lavender
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-lavender' OR name ILIKE 'Catron Bentonite Cat Litter – Lavender' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);
  END IF;

  -- [Product #57]: Limoxin-25 Spray
  SELECT id INTO pid FROM products WHERE slug = 'limoxin-25-spray' OR name ILIKE 'Limoxin-25 Spray' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'PetSolutions Pharmacy'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '200 ml Spray', 1650.00, 1800.00, 50, true);
  END IF;

  -- [Product #58]: Me-O Adult Cat Dry Food - Tuna Flavour
  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-tuna-flavour' OR name ILIKE 'Me-O Adult Cat Dry Food - Tuna Flavour' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);
  END IF;

  -- [Product #59]: Me-O Adult Cat Dry Food - Seafood Flavour
  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-seafood-flavour' OR name ILIKE 'Me-O Adult Cat Dry Food - Seafood Flavour' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);
  END IF;

  -- [Product #60]: Me-O Adult Cat Dry Food - Mackerel Flavour
  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-mackerel-flavour' OR name ILIKE 'Me-O Adult Cat Dry Food - Mackerel Flavour' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);
  END IF;

  -- [Product #61]: Me-O Adult Cat Dry Food - Chicken & Vegetables
  SELECT id INTO pid FROM products WHERE slug = 'me-o-adult-cat-dry-food-chicken-vegetables' OR name ILIKE 'Me-O Adult Cat Dry Food - Chicken & Vegetables' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '450 g', 1450.00, 1600.00, 80, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.2 Kg', 3250.00, 3500.00, 50, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '3 Kg', 6490.00, 6950.00, 30, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '7 Kg', 13250.00, 14100.00, 20, true);
  END IF;

  -- [Product #62]: Me-O Persian Cat Food - Anti-Hairball Formula
  SELECT id INTO pid FROM products WHERE slug = 'me-o-persian-cat-food-anti-hairball-formula' OR name ILIKE 'Me-O Persian Cat Food - Anti-Hairball Formula' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 1450.00, 1600.00, 75, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.1 Kg', 3250.00, 3500.00, 45, true);
  END IF;

  -- [Product #63]: Catron Bentonite Cat Litter - Baby Powder
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-baby-powder' OR name ILIKE 'Catron Bentonite Cat Litter - Baby Powder' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);
  END IF;

  -- [Product #64]: Catron Bentonite Cat Litter - Marseille Soap
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-marseille-soap' OR name ILIKE 'Catron Bentonite Cat Litter - Marseille Soap' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);
  END IF;

  -- [Product #65]: Catron Bentonite Cat Litter - Green Apple
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-green-apple' OR name ILIKE 'Catron Bentonite Cat Litter - Green Apple' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);
  END IF;

  -- [Product #66]: Catron Bentonite Cat Litter - Coconut & Vanilla
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-coconut-vanilla' OR name ILIKE 'Catron Bentonite Cat Litter - Coconut & Vanilla' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);
  END IF;

  -- [Product #67]: Catron Bentonite Cat Litter - Cappuccino
  SELECT id INTO pid FROM products WHERE slug = 'catron-bentonite-cat-litter-cappuccino' OR name ILIKE 'Catron Bentonite Cat Litter - Cappuccino' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Catron'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '10 Litre Bag', 3250.00, 3600.00, 70, true);
  END IF;

  -- [Product #68]: Me-O Persian Kitten
  SELECT id INTO pid FROM products WHERE slug = 'me-o-persian-kitten' OR name ILIKE 'Me-O Persian Kitten' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 1490.00, 1650.00, 65, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.1 Kg', 3300.00, 3550.00, 40, true);
  END IF;

  -- [Product #69]: Me-O Mother and Baby Cat
  SELECT id INTO pid FROM products WHERE slug = 'me-o-mother-and-baby-cat' OR name ILIKE 'Me-O Mother and Baby Cat' LIMIT 1;
  
  IF pid IS NOT NULL THEN
    -- Update clinical details if missing
    UPDATE products SET
      brand = COALESCE(brand, 'Me-O'),
      ingredients = COALESCE(ingredients, ''),
      directions = COALESCE(directions, ''),
      packaging = COALESCE(packaging, ''),
      storage_safety = COALESCE(storage_safety, '')
    WHERE id = pid;

    -- Replace variants with true Excel priced variants
    DELETE FROM product_variants WHERE product_id = pid;
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '400 g', 1550.00, 1700.00, 60, true);
    INSERT INTO product_variants (product_id, size_label, price, compare_at_price, stock, is_active)
    VALUES (pid, '1.1 Kg', 3400.00, 3700.00, 35, true);
  END IF;

END $$;

-- Verification query
SELECT 
  p.name, 
  COUNT(v.id) AS variant_count, 
  MIN(v.price) AS min_price, 
  MAX(v.price) AS max_price,
  SUM(v.stock) AS total_stock
FROM products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.name ASC;
