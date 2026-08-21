-- =============================================
-- PetSolutions.lk Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO categories (name, slug, description, parent_category, display_order) VALUES
  ('Tick & Flea Treatment', 'tick-flea-treatment', 'Protect your pets from ticks and fleas with our range of spot-on treatments, powders, and sprays.', 'Cat/Dog', 1),
  ('Shampoo & Grooming', 'shampoo-grooming', 'Keep your pets clean and well-groomed with our selection of shampoos and grooming products.', 'Cat/Dog', 2),
  ('Soap', 'soap', 'Medicated and grooming soaps for dogs.', 'Dog', 3),
  ('Powder & Talc', 'powder-talc', 'Grooming powders and talcs for pets.', 'Dog', 4),
  ('Coat & Skin Care', 'coat-skin-care', 'Supplements and treatments for healthy skin and shiny coat.', 'Dog', 5),
  ('Bone & Joint', 'bone-joint', 'Calcium supplements and joint care products for strong bones.', 'Dog', 6),
  ('Vitamins & Supplements', 'vitamins-supplements', 'Essential vitamins and health supplements for your pets.', 'Dog', 7),
  ('Digestive Health', 'digestive-health', 'Liver tonics and digestive aids for cats and dogs.', 'Cat/Dog', 8),
  ('Wound Care', 'wound-care', 'Sprays, creams and wound care products for pet injuries.', 'Dog', 9),
  ('Deworming', 'deworming', 'Deworming tablets and treatments for dogs.', 'Dog', 10),
  ('Dog Food - Dry', 'dog-food-dry', 'Premium dry food and kibble for dogs of all ages.', 'Dog', 11),
  ('Dog Food - Wet', 'dog-food-wet', 'Wet food pouches and canned food for dogs.', 'Dog', 12),
  ('Cat Food - Dry', 'cat-food-dry', 'Premium dry food for cats and kittens.', 'Cat', 13),
  ('Cat Food - Wet & Treats', 'cat-food-wet-treats', 'Wet food pouches and creamy treats for cats.', 'Cat', 14),
  ('Cat Litter', 'cat-litter', 'Premium bentonite clumping cat litter in various scents.', 'Cat', 15),
  ('Dairy & Treats', 'dairy-treats', 'Probiotic yogurt treats and beverages for cats and dogs.', 'Cat/Dog', 16);

-- =============================================
-- PRODUCTS & VARIANTS
-- =============================================

-- ---- TICK & FLEA TREATMENT ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Tixfree Spot On Adult Cat', 'tixfree-spot-on-adult-cat', 'Effective spot-on flea and tick treatment for adult cats. Easy to apply, long-lasting protection.', (SELECT id FROM categories WHERE slug='tick-flea-treatment'), 'Cat', 'Tixfree', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='tixfree-spot-on-adult-cat'), '3 Packs', 1980);

INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Tixfree Spot On Dog', 'tixfree-spot-on-dog', 'Spot-on flea and tick treatment for dogs. Available for different weight ranges.', (SELECT id FROM categories WHERE slug='tick-flea-treatment'), 'Dog', 'Tixfree', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='tixfree-spot-on-dog'), '2-10 Kg (3 Packs)', 2700),
  ((SELECT id FROM products WHERE slug='tixfree-spot-on-dog'), '10-20 Kg (3 Packs)', 3060),
  ((SELECT id FROM products WHERE slug='tixfree-spot-on-dog'), '20-40 Kg (3 Packs)', 3570),
  ((SELECT id FROM products WHERE slug='tixfree-spot-on-dog'), '40-60 Kg (3 Packs)', 4680);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('ANTICK 10', 'antick-10', 'Powerful anti-tick solution for dogs. Available in retail and bulk sizes.', (SELECT id FROM categories WHERE slug='tick-flea-treatment'), 'Dog', 'Antick');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='antick-10'), '10ML', 775),
  ((SELECT id FROM products WHERE slug='antick-10'), '1L', 56500);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('TICKAMIT 12.5', 'tickamit-12-5', 'Amitraz-based tick treatment for dogs. Highly effective against all tick species.', (SELECT id FROM categories WHERE slug='tick-flea-treatment'), 'Dog', 'Tickamit');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='tickamit-12-5'), '10ML', 990),
  ((SELECT id FROM products WHERE slug='tickamit-12-5'), '100ML', 9450),
  ((SELECT id FROM products WHERE slug='tickamit-12-5'), '1L', 76000);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Rapimac Tablet', 'rapimac-tablet', 'Oral tick and flea treatment tablets for dogs.', (SELECT id FROM categories WHERE slug='tick-flea-treatment'), 'Dog', 'Rapimac');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='rapimac-tablet'), '10 Tablets', 1100);

-- ---- SHAMPOO & GROOMING ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Tick & Flea Pet Shampoo', 'tick-flea-pet-shampoo', 'Medicated shampoo to kill ticks and fleas on contact. Safe for cats and dogs.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Cat/Dog', 'PetSolutions');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='tick-flea-pet-shampoo'), '225ml', 800);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Alovera Shampoo', 'alovera-shampoo', 'Gentle aloe vera shampoo for a soft, shiny coat. Suitable for cats and dogs.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Cat/Dog', 'PetSolutions');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='alovera-shampoo'), '225ml', 650);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Furr Fresh Medicated Shampoo', 'furr-fresh-medicated-shampoo', 'Medicated shampoo for treating skin conditions and maintaining coat health.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Cat/Dog', 'Furr Fresh');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='furr-fresh-medicated-shampoo'), '200ml', 1300);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Seepet Malaseb Shampoo', 'seepet-malaseb-shampoo', 'Antifungal and antibacterial shampoo for dermatological conditions.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Cat/Dog', 'Seepet');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='seepet-malaseb-shampoo'), '200ml', 1140);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Topdog Shampoo', 'topdog-shampoo', 'Everyday grooming shampoo for dogs with pleasant fragrance.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Dog', 'Topdog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='topdog-shampoo'), '100ml', 450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Topdog Groom Shampoo', 'topdog-groom-shampoo', 'Professional grooming shampoo for dogs with conditioning formula.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Dog', 'Topdog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='topdog-groom-shampoo'), '200ml', 950);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Shampoo Dermitol', 'shampoo-dermitol', 'Premium dermatological shampoo for skin conditions and irritation.', (SELECT id FROM categories WHERE slug='shampoo-grooming'), 'Cat/Dog', 'Dermitol');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='shampoo-dermitol'), '250ml', 3980);

-- ---- SOAP ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Seepet Woofy Soap - Neem', 'seepet-woofy-soap-neem', 'Neem-infused dog soap with natural antibacterial and antifungal properties.', (SELECT id FROM categories WHERE slug='soap'), 'Dog', 'Seepet');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='seepet-woofy-soap-neem'), '70g', 450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Seepet Woofy Soap - Lavender', 'seepet-woofy-soap-lavender', 'Lavender-scented dog soap for gentle cleaning and calming effect.', (SELECT id FROM categories WHERE slug='soap'), 'Dog', 'Seepet');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='seepet-woofy-soap-lavender'), '70g', 450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Permvet Medicated Dog Soap', 'permvet-medicated-dog-soap', 'Medicated soap for treating skin infections and parasites in dogs.', (SELECT id FROM categories WHERE slug='soap'), 'Dog', 'Permvet');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='permvet-medicated-dog-soap'), '70g', 650);

-- ---- POWDER & TALC ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Bolfo Powder', 'bolfo-powder', 'Anti-parasitic powder for dogs. Effective against fleas and ticks.', (SELECT id FROM categories WHERE slug='powder-talc'), 'Dog', 'Bolfo');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='bolfo-powder'), '75g', 945);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Wolfo Talc', 'wolfo-talc', 'Grooming talcum powder for dogs. Keeps coat fresh and fragrant.', (SELECT id FROM categories WHERE slug='powder-talc'), 'Dog', 'Wolfo');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='wolfo-talc'), 'Standard', 590);

-- ---- COAT & SKIN CARE ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('NUTRICOAT', 'nutricoat', 'Coat supplement for dogs to promote a healthy, shiny coat. Rich in omega fatty acids.', (SELECT id FROM categories WHERE slug='coat-skin-care'), 'Dog', 'Nutricoat', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='nutricoat'), '200g', 2680);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('NUTRICOAT Advance', 'nutricoat-advance', 'Advanced formula coat supplement with extra vitamins and minerals for premium coat health.', (SELECT id FROM categories WHERE slug='coat-skin-care'), 'Dog', 'Nutricoat');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='nutricoat-advance'), '200g', 2990);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('PET FAT', 'pet-fat', 'Essential fatty acid supplement for dogs. Supports skin health and coat condition.', (SELECT id FROM categories WHERE slug='coat-skin-care'), 'Dog', 'Pet Fat');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='pet-fat'), '200ML', 2150);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Red Dog', 'red-dog', 'Coat and skin care supplement for dogs.', (SELECT id FROM categories WHERE slug='coat-skin-care'), 'Dog', 'Red Dog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='red-dog'), '200ml', 1500);

-- ---- BONE & JOINT ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('ORCALMIN Suspension', 'orcalmin-suspension', 'Calcium supplement suspension for dogs. Supports bone growth and dental health.', (SELECT id FROM categories WHERE slug='bone-joint'), 'Dog', 'Orcalmin');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='orcalmin-suspension'), 'Standard', 925);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Bones Up', 'bones-up', 'Calcium and phosphorus supplement for strong bones and joints in dogs.', (SELECT id FROM categories WHERE slug='bone-joint'), 'Dog', 'Bones Up');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='bones-up'), '200g', 1400);

-- ---- VITAMINS & SUPPLEMENTS ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('PET VIT Liquid', 'pet-vit-liquid', 'Multi-vitamin liquid supplement for dogs. Supports overall health and immunity.', (SELECT id FROM categories WHERE slug='vitamins-supplements'), 'Dog', 'Pet Vit');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='pet-vit-liquid'), '200ml', 1490);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('aRBCe PET', 'arbce-pet', 'Iron and vitamin supplement for dogs. Helps maintain healthy red blood cells.', (SELECT id FROM categories WHERE slug='vitamins-supplements'), 'Dog', 'aRBCe');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='arbce-pet'), '200ml', 1625);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Visobitts Tablets', 'visobitts-tablets', 'Multi-vitamin and mineral tablets for dogs. Complete nutritional supplement.', (SELECT id FROM categories WHERE slug='vitamins-supplements'), 'Dog', 'Visobitts');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='visobitts-tablets'), '50 Tablets', 9375);

-- ---- DIGESTIVE HEALTH ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Liv 52 Pet Liquid', 'liv-52-pet-liquid', 'Liver tonic and protectant for dogs. Promotes healthy liver function.', (SELECT id FROM categories WHERE slug='digestive-health'), 'Dog', 'Himalaya');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='liv-52-pet-liquid'), '200ml', 1200);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Digytone Drops', 'digytone-drops', 'Digestive aid drops for cats. Helps with digestive discomfort and bloating.', (SELECT id FROM categories WHERE slug='digestive-health'), 'Cat', 'Digytone');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='digytone-drops'), '30ml', 383);

-- ---- WOUND CARE ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('PETMEND Spray', 'petmend-spray', 'Wound healing spray for dogs. Promotes fast healing and prevents infection.', (SELECT id FROM categories WHERE slug='wound-care'), 'Dog', 'Petmend');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='petmend-spray'), '150ml', 980);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Negasunt', 'negasunt', 'Wound healing powder for dogs. Prevents maggot infestation and promotes healing.', (SELECT id FROM categories WHERE slug='wound-care'), 'Dog', 'Negasunt');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='negasunt'), '40g', 1290);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('ALUSPRAY', 'aluspray', 'Aluminium spray for wound protection in dogs. Creates protective barrier.', (SELECT id FROM categories WHERE slug='wound-care'), 'Dog', 'Aluspray');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='aluspray'), '125ml', 1980);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Scavon Vet Spray', 'scavon-vet-spray', 'Veterinary wound healing spray with herbal formula.', (SELECT id FROM categories WHERE slug='wound-care'), 'Dog', 'Scavon');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='scavon-vet-spray'), '100ml', 1331);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Scavon Vet Cream', 'scavon-vet-cream', 'Veterinary wound healing cream for topical application.', (SELECT id FROM categories WHERE slug='wound-care'), 'Dog', 'Scavon');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='scavon-vet-cream'), '50g', 793);

-- ---- DEWORMING ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Drontal Plus', 'drontal-plus', 'Broad-spectrum deworming tablets for dogs. Effective against all major worm types.', (SELECT id FROM categories WHERE slug='deworming'), 'Dog', 'Bayer', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='drontal-plus'), '2 Tablets', 990),
  ((SELECT id FROM products WHERE slug='drontal-plus'), '12 Tablets', 5450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Sanpet', 'sanpet', 'Deworming treatment for dogs.', (SELECT id FROM categories WHERE slug='deworming'), 'Dog', 'Sanpet');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='sanpet'), '10kg', 360);

-- ---- DOG FOOD - DRY ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Bavaro Junior & Adult Force 28/16', 'bavaro-junior-adult-force', 'High-energy complete dog food for active dogs. Suitable for junior and adult dogs.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'Bavaro', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='bavaro-junior-adult-force'), '18KG', 22450),
  ((SELECT id FROM products WHERE slug='bavaro-junior-adult-force'), '18KG (S.Kibbles)', 22450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Josi Dog Active', 'josi-dog-active', 'Premium active formula dog food for highly active dogs.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'JosiDog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-dog-active'), '900g', 1700),
  ((SELECT id FROM products WHERE slug='josi-dog-active'), '2.7kg', 4900);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Josi Dog Junior Sensitive', 'josi-dog-junior-sensitive', 'Sensitive formula for junior dogs with delicate digestion.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'JosiDog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-dog-junior-sensitive'), '900g', 1800),
  ((SELECT id FROM products WHERE slug='josi-dog-junior-sensitive'), '2.7kg', 4800);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Josi Dog Master Mix', 'josi-dog-master-mix', 'Balanced everyday dog food with mixed flavors.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'JosiDog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-dog-master-mix'), '900g', 1300);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Josi Dog Mini Adult', 'josi-dog-mini-adult', 'Premium food specially formulated for small breed adult dogs.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'JosiDog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-dog-mini-adult'), '900g', 1800),
  ((SELECT id FROM products WHERE slug='josi-dog-mini-adult'), '2.7kg', 4900);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('JosiDog Economy', 'josidog-economy', 'Affordable everyday dog food for budget-conscious pet owners.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'JosiDog');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josidog-economy'), '10Kg', 10900);

INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('CP Dog Chicken', 'cp-dog-chicken', 'Premium chicken flavored dry food for adult dogs. Complete and balanced nutrition.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'CP', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='cp-dog-chicken'), '400g', 560),
  ((SELECT id FROM products WHERE slug='cp-dog-chicken'), '500g', 750),
  ((SELECT id FROM products WHERE slug='cp-dog-chicken'), '2Kg', 2800),
  ((SELECT id FROM products WHERE slug='cp-dog-chicken'), '3.5Kg', 4650),
  ((SELECT id FROM products WHERE slug='cp-dog-chicken'), '10Kg', 12050),
  ((SELECT id FROM products WHERE slug='cp-dog-chicken'), '15Kg', 16850);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('CP Dog Beef', 'cp-dog-beef', 'Premium beef flavored dry food for adult dogs. Rich in protein for muscle development.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'CP');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='cp-dog-beef'), '2Kg', 2800),
  ((SELECT id FROM products WHERE slug='cp-dog-beef'), '3.5Kg', 4650),
  ((SELECT id FROM products WHERE slug='cp-dog-beef'), '10Kg', 12050),
  ((SELECT id FROM products WHERE slug='cp-dog-beef'), '15Kg', 16850);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('CP Puppy Milk Flavour', 'cp-puppy-milk', 'Milk-flavored puppy food enriched with essential nutrients for growing puppies.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'CP');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='cp-puppy-milk'), '400g', 650),
  ((SELECT id FROM products WHERE slug='cp-puppy-milk'), '500g', 850),
  ((SELECT id FROM products WHERE slug='cp-puppy-milk'), '2Kg', 3150),
  ((SELECT id FROM products WHERE slug='cp-puppy-milk'), '10Kg', 13690);

INSERT INTO products (name, slug, description, category_id, pet_type, brand, image_url, images) VALUES
  ('SmartHeart Power Pack Adult', 'smartheart-power-pack-adult', 'High-energy power pack formula for adult dogs. Packed with protein and nutrients.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'SmartHeart', '/images/products/1.jpeg', ARRAY['/images/products/1.jpeg', '/images/products/2.jpeg', '/images/products/3.jpeg']);

INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-adult'), '1Kg', 2050),
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-adult'), '3Kg', 5310),
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-adult'), '10Kg', 16490),
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-adult'), '20Kg', 31990);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Power Pack Puppy', 'smartheart-power-pack-puppy', 'High-energy power pack formula for puppies. Supports growth and development.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-puppy'), '1Kg', 2140),
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-puppy'), '3Kg', 5670),
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-puppy'), '10Kg', 17690),
  ((SELECT id FROM products WHERE slug='smartheart-power-pack-puppy'), '20Kg', 34990);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Mother & Baby', 'smartheart-mother-baby', 'Specialized nutrition for pregnant, nursing mothers and newborn puppies.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-mother-baby'), '1.3Kg', 2720),
  ((SELECT id FROM products WHERE slug='smartheart-mother-baby'), '2.6Kg', 5200),
  ((SELECT id FROM products WHERE slug='smartheart-mother-baby'), '8Kg', 13500),
  ((SELECT id FROM products WHERE slug='smartheart-mother-baby'), '15Kg', 24540);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Adult Chicken & Egg', 'smartheart-adult-chicken-egg', 'Balanced nutrition with chicken and egg for adult dogs.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-egg'), '500g', 930),
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-egg'), '1.5Kg', 2550),
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-egg'), '3Kg', 4460),
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-egg'), '10Kg', 12800);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Adult Chicken & Liver', 'smartheart-adult-chicken-liver', 'Delicious chicken and liver formula for adult dogs.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-liver'), '500g', 930),
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-liver'), '1.5Kg', 2550),
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-liver'), '3Kg', 4460),
  ((SELECT id FROM products WHERE slug='smartheart-adult-chicken-liver'), '10Kg', 12800);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Puppy Chicken & Egg Milk', 'smartheart-puppy-chicken-egg-milk', 'Chicken, egg and milk formula specially designed for growing puppies.', (SELECT id FROM categories WHERE slug='dog-food-dry'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-puppy-chicken-egg-milk'), '500g', 930),
  ((SELECT id FROM products WHERE slug='smartheart-puppy-chicken-egg-milk'), '1.3Kg', 2550),
  ((SELECT id FROM products WHERE slug='smartheart-puppy-chicken-egg-milk'), '2.7Kg', 4460),
  ((SELECT id FROM products WHERE slug='smartheart-puppy-chicken-egg-milk'), '8Kg', 12800);

-- ---- DOG FOOD - WET ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Adult Pouch', 'smartheart-adult-pouch', 'Wet food pouch for adult dogs. Juicy and flavorful.', (SELECT id FROM categories WHERE slug='dog-food-wet'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-adult-pouch'), '80g', 310);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('SmartHeart Puppy Pouch', 'smartheart-puppy-pouch', 'Wet food pouch specially formulated for puppies.', (SELECT id FROM categories WHERE slug='dog-food-wet'), 'Dog', 'SmartHeart');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='smartheart-puppy-pouch'), '80g', 310);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Meat in Feet', 'meat-in-feet', 'Meaty wet food treat for dogs. High protein content.', (SELECT id FROM categories WHERE slug='dog-food-wet'), 'Dog', 'Meat in Feet');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='meat-in-feet'), '400g', 350);

-- ---- CAT FOOD - DRY ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Josi Cat Crispy Duck', 'josi-cat-crispy-duck', 'Premium crispy duck flavored dry food for adult cats.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'JosiCat', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-cat-crispy-duck'), '650g', 1550),
  ((SELECT id FROM products WHERE slug='josi-cat-crispy-duck'), '1.9kg', 3900),
  ((SELECT id FROM products WHERE slug='josi-cat-crispy-duck'), '10kg', 16900),
  ((SELECT id FROM products WHERE slug='josi-cat-crispy-duck'), '18kg', 27600);

INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Josi Cat Crunchy Chicken', 'josi-cat-crunchy-chicken', 'Crunchy chicken flavored dry food for adult cats.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'JosiCat', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-cat-crunchy-chicken'), '650g', 1550),
  ((SELECT id FROM products WHERE slug='josi-cat-crunchy-chicken'), '1.9kg', 3900),
  ((SELECT id FROM products WHERE slug='josi-cat-crunchy-chicken'), '10kg', 16900),
  ((SELECT id FROM products WHERE slug='josi-cat-crunchy-chicken'), '18kg', 27600);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Josi Kitten', 'josi-kitten', 'Premium kitten food specially formulated for growing kittens.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'JosiCat');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='josi-kitten'), '650g', 1800),
  ((SELECT id FROM products WHERE slug='josi-kitten'), '1.9kg', 4200),
  ((SELECT id FROM products WHERE slug='josi-kitten'), '10kg', 21900);

INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Me-O Cat Chicken & Veg', 'me-o-cat-chicken-veg', 'Chicken and vegetable flavored dry food for adult cats.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-cat-chicken-veg'), '450g', 1450),
  ((SELECT id FROM products WHERE slug='me-o-cat-chicken-veg'), '1.2Kg', 3250),
  ((SELECT id FROM products WHERE slug='me-o-cat-chicken-veg'), '3Kg', 6490),
  ((SELECT id FROM products WHERE slug='me-o-cat-chicken-veg'), '7Kg', 13250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Cat Mackerel', 'me-o-cat-mackerel', 'Mackerel flavored dry food for adult cats. Rich in omega fatty acids.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-cat-mackerel'), '450g', 1450),
  ((SELECT id FROM products WHERE slug='me-o-cat-mackerel'), '1.2Kg', 3250),
  ((SELECT id FROM products WHERE slug='me-o-cat-mackerel'), '3Kg', 6490),
  ((SELECT id FROM products WHERE slug='me-o-cat-mackerel'), '7Kg', 13250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Cat Seafood', 'me-o-cat-seafood', 'Seafood flavored dry food for adult cats.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-cat-seafood'), '450g', 1450),
  ((SELECT id FROM products WHERE slug='me-o-cat-seafood'), '1.2Kg', 3250),
  ((SELECT id FROM products WHERE slug='me-o-cat-seafood'), '3Kg', 6490),
  ((SELECT id FROM products WHERE slug='me-o-cat-seafood'), '7Kg', 13250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Cat Tuna', 'me-o-cat-tuna', 'Tuna flavored dry food for adult cats. Premium quality protein.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-cat-tuna'), '450g', 1450),
  ((SELECT id FROM products WHERE slug='me-o-cat-tuna'), '1.2Kg', 3250),
  ((SELECT id FROM products WHERE slug='me-o-cat-tuna'), '3Kg', 6490),
  ((SELECT id FROM products WHERE slug='me-o-cat-tuna'), '7Kg', 13250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Kitten Ocean Fish', 'me-o-kitten-ocean-fish', 'Ocean fish flavored food specially formulated for kittens.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-kitten-ocean-fish'), '400g', 1450),
  ((SELECT id FROM products WHERE slug='me-o-kitten-ocean-fish'), '1.1Kg', 3250),
  ((SELECT id FROM products WHERE slug='me-o-kitten-ocean-fish'), '7Kg', 14950);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Mother & Baby', 'me-o-mother-baby', 'Specialized nutrition for pregnant, nursing cats and their kittens.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-mother-baby'), '400g', 1550),
  ((SELECT id FROM products WHERE slug='me-o-mother-baby'), '1.1kg', 3400);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Persian Cat', 'me-o-persian-cat', 'Specially formulated dry food for Persian cats with hairball control.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-persian-cat'), '400g', 1450),
  ((SELECT id FROM products WHERE slug='me-o-persian-cat'), '1.1kg', 3250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Persian Kitten', 'me-o-persian-kitten', 'Specially formulated food for Persian kittens with coat care nutrients.', (SELECT id FROM categories WHERE slug='cat-food-dry'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-persian-kitten'), '400g', 1490),
  ((SELECT id FROM products WHERE slug='me-o-persian-kitten'), '1.1kg', 3300);

-- ---- CAT FOOD - WET & TREATS ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Creamy Treats Bonito', 'me-o-creamy-treats-bonito', 'Creamy lickable treats with bonito flavor. Irresistible for cats.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-creamy-treats-bonito'), 'Standard', 630);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Creamy Treats Chicken & Liver', 'me-o-creamy-treats-chicken-liver', 'Creamy lickable treats with chicken and liver flavor.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-creamy-treats-chicken-liver'), 'Standard', 630);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Creamy Treats Crab', 'me-o-creamy-treats-crab', 'Creamy lickable treats with crab flavor.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-creamy-treats-crab'), 'Standard', 630);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Creamy Treats Salmon', 'me-o-creamy-treats-salmon', 'Creamy lickable treats with salmon flavor.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-creamy-treats-salmon'), 'Standard', 630);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Pouch Tuna Topping White Fish', 'me-o-pouch-tuna-white-fish', 'Wet food pouch with tuna topped with white fish.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-pouch-tuna-white-fish'), '80g', 390);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Pouch Tuna With Sardine', 'me-o-pouch-tuna-sardine', 'Wet food pouch with tuna and sardine in jelly.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-pouch-tuna-sardine'), '80g', 390);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Tuna in Jelly', 'me-o-tuna-in-jelly', 'Tuna chunks in jelly for cats. Delicious wet food treat.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-tuna-in-jelly'), '80g', 390);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Me-O Pouch Ocean Fish in Jelly', 'me-o-pouch-ocean-fish-jelly', 'Ocean fish chunks in jelly. Nutritious wet food for cats.', (SELECT id FROM categories WHERE slug='cat-food-wet-treats'), 'Cat', 'Me-O');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='me-o-pouch-ocean-fish-jelly'), '80g', 390);

-- ---- CAT LITTER ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand, is_featured) VALUES
  ('Catron Bentonite Cat Litter - Baby Powder', 'catron-litter-baby-powder', 'Premium bentonite clumping cat litter with baby powder scent. Superior odor control.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron', true);
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-baby-powder'), '10L', 3250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Catron Bentonite Cat Litter - Cappuccino', 'catron-litter-cappuccino', 'Premium bentonite clumping cat litter with cappuccino scent.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-cappuccino'), '10L', 3250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Catron Bentonite Cat Litter - Coconut & Vanilla', 'catron-litter-coconut-vanilla', 'Premium bentonite clumping cat litter with coconut and vanilla scent.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-coconut-vanilla'), '10L', 3250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Catron Bentonite Cat Litter - Gray Control', 'catron-litter-gray-control', 'Premium bentonite cat litter with enhanced gray odor control formula.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-gray-control'), '10L', 4500);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Catron Bentonite Cat Litter - Green Apple', 'catron-litter-green-apple', 'Premium bentonite clumping cat litter with green apple scent.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-green-apple'), '10L', 3250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Catron Bentonite Cat Litter - Lavender', 'catron-litter-lavender', 'Premium bentonite clumping cat litter with lavender scent.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-lavender'), '10L', 3250);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Catron Bentonite Cat Litter - Marseille Soap', 'catron-litter-marseille-soap', 'Premium bentonite clumping cat litter with Marseille soap scent.', (SELECT id FROM categories WHERE slug='cat-litter'), 'Cat', 'Catron');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='catron-litter-marseille-soap'), '10L', 3250);

-- ---- DAIRY & TREATS ----
INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Kick and Punch', 'kick-and-punch', 'Energy drink for active pets. Suitable for both cats and dogs.', (SELECT id FROM categories WHERE slug='dairy-treats'), 'Cat/Dog', 'Kick and Punch');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='kick-and-punch'), '300ml', 450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Meowghurt', 'meowghurt', 'Probiotic yogurt treat specially formulated for cats. Supports digestive health.', (SELECT id FROM categories WHERE slug='dairy-treats'), 'Cat', 'Meowghurt');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='meowghurt'), '200g', 450);

INSERT INTO products (name, slug, description, category_id, pet_type, brand) VALUES
  ('Doghurt', 'doghurt', 'Probiotic yogurt treat specially formulated for dogs. Supports digestive health.', (SELECT id FROM categories WHERE slug='dairy-treats'), 'Dog', 'Doghurt');
INSERT INTO product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM products WHERE slug='doghurt'), '200g', 450);

-- =============================================
-- SAMPLE OFFERS
-- =============================================
INSERT INTO offers (title, description, discount_type, discount_value, min_order_amount, start_date, end_date, is_active) VALUES
  ('Summer Sale! 10% OFF', 'Get 10% off on all products this summer!', 'percentage', 10, 2000, now(), now() + interval '60 days', true),
  ('Free Delivery Over Rs.5000', 'Free delivery on all orders above Rs.5,000', 'fixed', 0, 5000, now(), now() + interval '365 days', true),
  ('New Customer Discount', 'Get Rs.500 off your first order!', 'fixed', 500, 3000, now(), now() + interval '90 days', true);
