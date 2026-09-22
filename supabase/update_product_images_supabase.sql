-- ============================================================================
-- Update All 69 Products with 2K Supabase Storage Images
-- Generated: 2026-09-20 21:14:38
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================================

BEGIN;

-- #1: Himalaya Digyton Drops, 30 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-digyton-drops-30-ml-11_Himalaya_Digyton_Drops_box_2K_202607281638.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-digyton-drops-30-ml-11_Himalaya_Digyton_Drops_box_2K_202607281638.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-digyton-drops-30-ml-11_Himalaya_Digyton_product_label_2K_202607281638.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-digyton-drops-30-ml-11_Product_box_back_panel_details_202607281638.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '6cb772ab-1047-4b59-82f6-66aa73cd71f2';

-- #2: Negasunt Powder
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/negasunt-powder-23_Negasunt_Dusting_Powder_product_2K_202607300115.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/negasunt-powder-23_Negasunt_Dusting_Powder_product_2K_202607300115.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/negasunt-powder-23_Macro_detail_label_close-up_2K_202607300115.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/negasunt-powder-23_Product_back_panel_details_2K_202607300115.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '39cffb6c-6708-40f6-8323-a4434e19a242';

-- #3: Aluspray AWD
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aluspray-awd-24_Aluspray-AWD_product_shot_2K_202607300101.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aluspray-awd-24_Aluspray-AWD_product_shot_2K_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aluspray-awd-24_Aluspray-AWD_label_macro_detail_2K_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aluspray-awd-24_Product_back_panel_details_2K_202607300101_2_.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'a8c2b864-ffb0-40c9-a9ac-8386635cf514';

-- #4: Petmend Spray, 150 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petmend-spray-150-ml-25_Petmend_Spray_topical_herbal_spray_202607300120.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petmend-spray-150-ml-25_Petmend_Spray_topical_herbal_spray_202607300120.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petmend-spray-150-ml-25_Petmend_Spray_label_detail_2K_202607300116.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petmend-spray-150-ml-25_Petmend_Spray_back_panel_2K_202607300116.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'd8098dfa-34f9-4bc6-8cc7-4b758d91e53c';

-- #5: Vetgrow Bones-Up - Mineral & Vitamin Supplement
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-bones-up-mineral-and-vitamin-supplement_Macro_detail_label_close-up_2K_202607300119.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-bones-up-mineral-and-vitamin-supplement_Macro_detail_label_close-up_2K_202607300119.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-bones-up-mineral-and-vitamin-supplement_Product_back_panel_nutritional_a_202607300119.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-bones-up-mineral-and-vitamin-supplement_Product_front_panel_details_2K_202607300119.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '2d45569b-1d77-4fe6-b922-19022e35ad16';

-- #6: Himalaya Liv.52 pet, 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-liv-52-pet-200-ml-10_Himalaya_Liv.52_Pet_Liquid_2K_202607281714.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-liv-52-pet-200-ml-10_Himalaya_Liv.52_Pet_Liquid_2K_202607281714.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-liv-52-pet-200-ml-10_Macro_detail_label_close-up_2K_202607281714.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-liv-52-pet-200-ml-10_Product_back_panel_details_2K_202607281714.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '86d30914-1505-4e98-8a70-6ef5eda4df64';

-- #7: Vetgrow Red Dogs 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-red-dogs-200-ml-7_VETGROW_Red_Dogs_product_2K_202607281727.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-red-dogs-200-ml-7_VETGROW_Red_Dogs_product_2K_202607281727.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-red-dogs-200-ml-7_Red_Dogs_title_macro_2K_202607281729.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-red-dogs-200-ml-7_Product_back_panel_details_2K_202607281728.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '06665a21-e18a-434b-876c-763809f6eef5';

-- #8: Rapimec - Ivermectin 10 mg Tablets
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/rapimec-ivermectin-10-mg-tablets-5_Rapimec_Ivermectin_Vet_Tablets_2K_202607281640.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/rapimec-ivermectin-10-mg-tablets-5_Rapimec_Ivermectin_Vet_Tablets_2K_202607281640.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/rapimec-ivermectin-10-mg-tablets-5_Rapimec_brand_mark_detail_2K_202607281640.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/rapimec-ivermectin-10-mg-tablets-5_Rapimec_back_panel_details_2K_202607281640.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'de491f83-9752-466d-bac8-f0ebd45f47ff';

-- #9: Tickamit 12.5
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tickamit-12-5-4_TICKAMIT_12.5_Golden_Retriever_p_202607281624.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tickamit-12-5-4_TICKAMIT_12.5_Golden_Retriever_p_202607281624.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tickamit-12-5-4_TICKAMIT_12.5_text_detail_2K_202607281624.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tickamit-12-5-4_Product_back_panel_details_2K_202607281624.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '5c15612a-862e-4ca0-bae0-ad40bde90986';

-- #10: Antick 10%
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/antick-10-3_ANTICK_label_macro_detail_2K_202607281623.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/antick-10-3_ANTICK_label_macro_detail_2K_202607281623.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/antick-10-3_Product_back_panel_details_2K_202607281623.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/antick-10-3_Product_front_panel_details_2K_202607281623.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '87dd6fb2-dcb2-49d0-b736-871a20c2b340';

-- #11: TixFree Spot-On for Dogs
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tixfree-spot-on-for-dogs-2_Product_back_panel_details_2K_202607281707.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tixfree-spot-on-for-dogs-2_Product_back_panel_details_2K_202607281707.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tixfree-spot-on-for-dogs-2_TIXFREE_product_front_panel_2K_202607281707.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '085c6eb8-b240-46de-a668-0d9c7a2fcfd1';

-- #12: TixFree Spot-On for Adult Cats
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tixfree-spot-on-for-adult-cats-1_Product_back_panel_details_2K_202607281659.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tixfree-spot-on-for-adult-cats-1_Product_back_panel_details_2K_202607281659.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/tixfree-spot-on-for-adult-cats-1_TIXFREE_product_front_panel_2K_202607281656.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '41ca7430-8776-4eda-97fa-c287b626bd67';

-- #13: aRBCe PET, with a 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/arbce-pet-with-a-200-ml-12_Macro_detail_aRBCe_Pet_logo_202607281620.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/arbce-pet-with-a-200-ml-12_Macro_detail_aRBCe_Pet_logo_202607281620.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/arbce-pet-with-a-200-ml-12_Product_pack_shot_details_2K_202607281620.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/arbce-pet-with-a-200-ml-12_Product_back_panel_details_2K_202607281621.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '90fe04c7-091e-4671-b456-48602160113d';

-- #14: Vi-Sorbits Tablets 50s
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vi-sorbits-tablets-50s-13_Vi-sorbits_tablets_dog_graphic_2K_202607300105.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vi-sorbits-tablets-50s-13_Vi-sorbits_tablets_dog_graphic_2K_202607300105.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vi-sorbits-tablets-50s-13_Macro_detail_label_close-up_2K_202607300104.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vi-sorbits-tablets-50s-13_Yellow_label_back_panel_2K_202607300105.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'f7d23010-aca7-4ba3-944a-2f571ef38e8c';

-- #15: Himalaya Scavon VET Spray, 100 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-spray-100-ml-14_Scavon_VET_SPRAY_product_shot_202607300103.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-spray-100-ml-14_Scavon_VET_SPRAY_product_shot_202607300103.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-spray-100-ml-14_Brand_logo_and_title_detail_202607300103.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-spray-100-ml-14_Product_back_panel_details_2K_202607300102.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'f967987d-641c-4c60-864f-adc2a669607c';

-- #16: Himalaya Scavon VET Cream, 50 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-cream-50-g-15_Scavon_VET_SPRAY_product_shot_202607300103.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-cream-50-g-15_Scavon_VET_SPRAY_product_shot_202607300103.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-cream-50-g-15_Brand_logo_and_title_detail_202607300103.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/himalaya-scavon-vet-cream-50-g-15_Product_back_panel_details_2K_202607300102.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'cd895621-0377-4b4d-b395-35483614015d';

-- #17: SANPET-PLUS
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/sanpet-plus-16_Sanpet_Plus_product_shot_2K_202607281742.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/sanpet-plus-16_Sanpet_Plus_product_shot_2K_202607281742.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/sanpet-plus-16_Sanpet_Plus_product_detail_2K_202607281742.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/sanpet-plus-16_Product_back_panel_details_2K_202607281742_1_.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'c532e754-897f-435c-bc6b-cf003834a6fc';

-- #18: Wolfo Flea & Tick Powder for Dogs and Cats
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/wolfo-flea-tick-powder-for-dogs-and-cats-17_WOLFO_Powder_product_shot_2K_202607300119.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/wolfo-flea-tick-powder-for-dogs-and-cats-17_WOLFO_Powder_product_shot_2K_202607300119.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/wolfo-flea-tick-powder-for-dogs-and-cats-17_WOLFO_Powder_label_close-up_2K_202607300119.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/wolfo-flea-tick-powder-for-dogs-and-cats-17_Product_back_panel_details_2K_202607300119.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '1bd17202-da38-4fcf-8661-527be4ab3159';

-- #19: Woofy Medicated Neem Soap 70 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/woofy-medicated-neem-soap-70-g-18_Macro_detail_logo_band_2K_202607281615.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/woofy-medicated-neem-soap-70-g-18_Macro_detail_logo_band_2K_202607281615.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/woofy-medicated-neem-soap-70-g-18_Product_back_panel_details_2K_202607281612.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/woofy-medicated-neem-soap-70-g-18_SEEPET_WOOFY_SOAP_front_panel_202607281613.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '91c9cf02-a791-4ebc-84c4-44303d2a11e6';

-- #20: SeePet Woofy Lavender Soap, 70 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/seepet-woofy-lavender-soap-70-g-19_SEEPET_WOOFY_SOAP_logo_2K_202607281656.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/seepet-woofy-lavender-soap-70-g-19_SEEPET_WOOFY_SOAP_logo_2K_202607281656.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/seepet-woofy-lavender-soap-70-g-19_Product_back_panel_details_2K_202607281653.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/seepet-woofy-lavender-soap-70-g-19_Seepet_Woofy_Soap_front_panel_202607281653.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '14c532c9-436b-458d-a880-d77138052e46';

-- #21: Permvet Medicated Dog Soap 70 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/permvet-medicated-dog-soap-70-g-20_PERMVET_Medicated_Dog_Soap_2K_202607281610.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/permvet-medicated-dog-soap-70-g-20_PERMVET_Medicated_Dog_Soap_2K_202607281610.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/permvet-medicated-dog-soap-70-g-20_PERMVET_Dog_Soap_typography_detail_202607281612.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/permvet-medicated-dog-soap-70-g-20_Product_back_panel_details_2K_202607281610.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'e27fd982-8583-4620-90e0-50d8caacc55d';

-- #22: Nutricoat Syrup
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-syrup-22_Nutri-Coat_palatable_tonic_packa_2K_202607281620.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-syrup-22_Nutri-Coat_palatable_tonic_packa_2K_202607281620.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-syrup-22_Nutri-Coat_label_detail_shot_2K_202607281620.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-syrup-22_Nutricoat_back_panel_details_2K_202607281620.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'cfbba553-8740-4dee-ae0d-7694ef93452b';

-- #23: Drontal Plus Tasty
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/drontal-plus-tasty-26_Drontal_Plus_Tasty_dog_medication_202607281642.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/drontal-plus-tasty-26_Drontal_Plus_Tasty_dog_medication_202607281642.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/drontal-plus-tasty-26_Drontal_logo_macro_detail_2K_202607281642.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/drontal-plus-tasty-26_Product_back_panel_details_2K_202607281642.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '0aceeda9-26ad-4501-bda8-94d0bd5c5064';

-- #24: Dermitol Shampoo
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/dermitol-shampoo-27_Dermitol_shampoo_bottle_front_2K_202607300101.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/dermitol-shampoo-27_Dermitol_shampoo_bottle_front_2K_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/dermitol-shampoo-27_Macro_detail_label_close-up_2K_202607300101_1_.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/dermitol-shampoo-27_Product_back_panel_details_2K_202607300101.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '7ae3b021-0ac3-4886-93f7-fe4642518bd7';

-- #25: Furr-Fresh Medicated Shampoo 100 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/furr-fresh-medicated-shampoo-100-ml-28_FURRfresh_shampoo_bottle_front_2K_202607300118.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/furr-fresh-medicated-shampoo-100-ml-28_FURRfresh_shampoo_bottle_front_2K_202607300118.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/furr-fresh-medicated-shampoo-100-ml-28_Product_label_macro_detail_2K_202607300118.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/furr-fresh-medicated-shampoo-100-ml-28_Product_back_panel_details_2K_202607300118.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '2fc21823-2a39-4abe-b953-764d591b963a';

-- #26: Ticks & Fleas Shampoo 225 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/ticks-fleas-shampoo-225-ml-29_Dog_shampoo_bottle_front_2K_202607300119_1_.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/ticks-fleas-shampoo-225-ml-29_Dog_shampoo_bottle_front_2K_202607300119_1_.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/ticks-fleas-shampoo-225-ml-29_Macro_detail_DYMEC_logo_label_202607300120.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/ticks-fleas-shampoo-225-ml-29_Back_panel_details_multilingual_202607300119.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'fd32458c-6d6c-483c-aaa7-96b01cba8607';

-- #27: Aloe Vera Shampoo & Conditioner 225 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aloe-vera-shampoo-conditioner-225-ml-30_Aloe_Vera_Shampoo_Conditioner_Bo_202607300115.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aloe-vera-shampoo-conditioner-225-ml-30_Aloe_Vera_Shampoo_Conditioner_Bo_202607300115.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aloe-vera-shampoo-conditioner-225-ml-30_Label_detail_DYMEC_Aloe_Vera_202607300115.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/aloe-vera-shampoo-conditioner-225-ml-30_Bottle_back_panel_details_2K_202607300115.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'aac4cc87-d8cd-423a-af9e-86aaf414b5fa';

-- #28: Malaseb Shampoo 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/malaseb-shampoo-200-ml-31_Dog_and_cat_medicated_shampoo_202607300101.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/malaseb-shampoo-200-ml-31_Dog_and_cat_medicated_shampoo_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/malaseb-shampoo-200-ml-31_Macro_detail_label_close-up_2K_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/malaseb-shampoo-200-ml-31_Dog_shampoo_back_label_2K_202607300101.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'ef86ba70-7a94-4a4c-b929-6d5b1d552b23';

-- #29: Petvit Liquid, 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petvit-liquid-200-ml-32_Petvit_Liquid_Multivitamin_Suppl_2K_202607281731.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petvit-liquid-200-ml-32_Petvit_Liquid_Multivitamin_Suppl_2K_202607281731.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petvit-liquid-200-ml-32_Petvit_Liquid_logo_detail_2K_202607281731.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petvit-liquid-200-ml-32_Product_back_panel_details_2K_202607281731.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '235889cd-7b4e-45f7-b3b4-efe6447c3060';

-- #30: Vetgrow Meat in Feet 400 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meat-in-feet-400-g-33_VETGROW_Meat_n_Feet_can_202607281751.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meat-in-feet-400-g-33_VETGROW_Meat_n_Feet_can_202607281751.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meat-in-feet-400-g-33_Macro_detail_label_close-up_2K_202607281751.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meat-in-feet-400-g-33_Back_panel_display_content_2K_202607281751.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '3bc81b62-21b9-4e3d-8bda-97e146952f99';

-- #31: Vetgrow Kick in Punch 300 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-kick-in-punch-300-ml-34_Cat_illustration_on_product_2K_202607281759.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-kick-in-punch-300-ml-34_Cat_illustration_on_product_2K_202607281759.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-kick-in-punch-300-ml-34_Dogtor_s_Nutrifunction_Kick_n_Punch_202607281800.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-kick-in-punch-300-ml-34_Macro_detail_Kick_n_Punch_202607281753.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'f739dc46-3a4d-4544-9e74-4583672cd1b6';

-- #32: Vetgrow Meowghurt, 200 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meowghurt-200-g-35_Meowghurt_cat_food_product_2K_202607300054.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meowghurt-200-g-35_Meowghurt_cat_food_product_2K_202607300054.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meowghurt-200-g-35_Macro_detail_of_product_label_202607300054.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-meowghurt-200-g-35_Product_back_label_details_2K_202607300054.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'b4d1f5c7-f603-4d00-8fb2-c947b45beeff';

-- #33: Vetgrow Doghurt 200 g
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-doghurt-200-g-36_Doghurt_Hydrolyzed_Pet_Diet_tin_202607300101.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-doghurt-200-g-36_Doghurt_Hydrolyzed_Pet_Diet_tin_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-doghurt-200-g-36_Doghurt_label_macro_detail_2K_202607300101.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/vetgrow-doghurt-200-g-36_Dog_food_tin_back_panel_202607300100.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'e857dc88-5f69-470d-8189-ccdcef76e34b';

-- #34: Classic Pet Puppy – Milk Flavor
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-puppy-milk-flavor-37_Puppy_milk_product_shot_2K_202607270231.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-puppy-milk-flavor-37_Puppy_milk_product_shot_2K_202607270231.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-puppy-milk-flavor-37_Puppy_milk_splash_logo_2K_202607270231.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-puppy-milk-flavor-37_Product_back_panel_details_2K_202607270231.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-puppy-milk-flavor-37_Product_back_panel_details_2K_202607270231.jpeg.png.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '4424345e-63b9-4965-876f-2da1e68d9ec2';

-- #35: Me-O Pouch – Tuna Topping with White Fish
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-topping-with-white-fish-54_Cat_food_product_shot_2K_202607271530.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-topping-with-white-fish-54_Cat_food_product_shot_2K_202607271530.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-topping-with-white-fish-54_Cat_food_label_macro_detail_202607271530.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-topping-with-white-fish-54_Product_back_panel_details_2K_202607271535.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '5ed19761-e466-4eb5-bc69-e019ab20d7b2';

-- #36: Classic Pet Adult Dog – Chicken Flavour
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-chicken-flavour-38_Classic_Pets_dog_food_bag_202607270321.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-chicken-flavour-38_Classic_Pets_dog_food_bag_202607270321.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-chicken-flavour-38_Macro_detail_label_close-up_2K_202607270324.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-chicken-flavour-38_Product_back_panel_details_2K_202607270324.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'a59782e2-1f98-46ec-988d-ec28e77f769a';

-- #37: Classic Pet Adult Dog – Beef Flavour
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-beef-flavour-39_Classic_Pets_Beef_Dog_Food_202607270319.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-beef-flavour-39_Classic_Pets_Beef_Dog_Food_202607270319.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-beef-flavour-39_Macro_detail_crest_emblem_2K_202607270319.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-beef-flavour-39_Product_back_panel_details_2K_202607270319.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '12eb28d8-43d2-4cba-be35-528b6b522ea8';

-- #38: SmartHeart Puppy – Chicken, Egg & Milk
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-puppy-chicken-egg-milk-40_SmartHeart_puppy_food_pouch_2K_202607262253.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-puppy-chicken-egg-milk-40_SmartHeart_puppy_food_pouch_2K_202607262253.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-puppy-chicken-egg-milk-40_Black_puppy_face_and_icons_202607262253.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-puppy-chicken-egg-milk-40_Product_back_panel_details_2K_202607262253.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '6c06cfce-ea42-4ec0-9826-7ee4c91e8c09';

-- #39: SmartHeart Adult Dog – Chicken & Egg
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-egg-41_Dog_food_pouch_product_shot_202607300126.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-egg-41_Dog_food_pouch_product_shot_202607300126.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-egg-41_SmartHeart_logo_crest_dog_2K_202607300126.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-egg-41_Product_back_panel_details_2K_202607300127.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'bbf41bfe-665d-41fc-8ede-47d5d1fa32f7';

-- #40: SmartHeart Adult Dog – Chicken & Liver
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-liver-42_SmartHeart_chicken_liver_pouch_2K_202607270326.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-liver-42_SmartHeart_chicken_liver_pouch_2K_202607270326.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-liver-42_SmartHeart_logo_Chicken_Liver_2K_202607270327.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-liver-42_Product_back_panel_details_202607270326.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-adult-dog-chicken-liver-42_Product_back_panel_details_202607270326.jpeg.png.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '07160f38-d588-4f4f-8a25-51fd6ecb4bb6';

-- #41: SmartHeart Power Pack – Adult
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-adult-44_SmartHeart_Power_Pack_dog_food_202607262309.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-adult-44_SmartHeart_Power_Pack_dog_food_202607262309.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-adult-44_Macro_detail_label_close-up_2K_202607262309.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-adult-44_Product_back_panel_details_2K_202607262309.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '7c9a5948-0613-4643-be6f-ba75b57b6ba8';

-- #42: SmartHeart Mother & Baby Dog
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-mother-baby-dog-45_SmartHeart_mother_baby_dog_2K_202607300132.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-mother-baby-dog-45_SmartHeart_mother_baby_dog_2K_202607300132.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-mother-baby-dog-45_Macro_detail_label_close-up_2K_202607300132.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-mother-baby-dog-45_Product_back_panel_details_2K_202607300132.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '7241d0e8-b87a-4051-9cdd-5940645b57c3';

-- #43: Me-O Kitten – Ocean Fish
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-kitten-ocean-fish-46_Me-O_Kitten_Ocean_Fish_Pouch_202607271242.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-kitten-ocean-fish-46_Me-O_Kitten_Ocean_Fish_Pouch_202607271242.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-kitten-ocean-fish-46_Me-O_kitten_ocean_fish_2K_202607271242.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-kitten-ocean-fish-46_Product_back_panel_details_2K_202607271242.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'b5e97170-c691-42f6-92fe-3b95376b9b12';

-- #44: Me-O Creamy Treats – Bonito Flavor
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-bonito-flavor-47_Me-O_Creamy_Treats_pouch_2K_202607270331.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-bonito-flavor-47_Me-O_Creamy_Treats_pouch_2K_202607270331.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-bonito-flavor-47_Me-O_logo_and_text_2K_202607270330.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-bonito-flavor-47_Product_back_panel_details_2K_202607270330.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '60a44000-3960-47fa-a4cc-ba369b580507';

-- #45: Me-O Creamy Treats – Chicken & Liver Flavor
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-chicken-liver-flavor-48_Cat_food_sachet_packaging_2K_202607300220.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-chicken-liver-flavor-48_Cat_food_sachet_packaging_2K_202607300220.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-chicken-liver-flavor-48_Macro_detail_Me-O_logo_2K_202607270340.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-chicken-liver-flavor-48_Product_back_panel_details_2K_202607270338.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'ebc3c01b-b37c-4db9-bf8f-9296021f0ce3';

-- #46: Me-O Creamy Treats – Crab Flavor
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-crab-flavor-49_Me-O_Creamy_Treats_Crab_2K_202607270349.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-crab-flavor-49_Me-O_Creamy_Treats_Crab_2K_202607270349.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-crab-flavor-49_Macro_detail_of_product_label_202607270342.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-crab-flavor-49_Product_back_panel_details_2K_202607270342.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'bc9e7763-c13b-45ed-ac43-641319b48b41';

-- #47: Me-O Creamy Treats – Salmon Flavor
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-salmon-flavor-50_Me-O_Salmon_Flavor_pouch_2K_202607270339.jpeg.png.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-salmon-flavor-50_Me-O_Salmon_Flavor_pouch_2K_202607270339.jpeg.png.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-salmon-flavor-50_Me-O_logo_and_text_2K_202607270328.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-creamy-treats-salmon-flavor-50_Product_back_panel_details_2K_202607270333.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '2bf0f2b7-4f2f-45e0-a530-7300538e10fe';

-- #48: Me-O Pouch – Tuna in Jelly
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-in-jelly-51_Me-O_tuna_cat_food_2K_202607271410.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-in-jelly-51_Me-O_tuna_cat_food_2K_202607271410.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-in-jelly-51_Me-O_logo_on_packaging_202607271410.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-in-jelly-51_Product_back_panel_details_2K_202607271410.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '50c76b87-d1b8-4026-84d6-5d01daa9d122';

-- #49: Me-O Pouch – Ocean Fish in Jelly
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-ocean-fish-in-jelly-52_Cat_food_pouch_product_shot_202607271257.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-ocean-fish-in-jelly-52_Cat_food_pouch_product_shot_202607271257.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-ocean-fish-in-jelly-52_Me-O_logo_macro_detail_2K_202607271259.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-ocean-fish-in-jelly-52_Product_back_panel_details_2K_202607271257.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '12a763e2-35bf-4831-abd5-e70464a740ad';

-- #50: Me-O Pouch – Tuna with Sardine in Jelly (Kitten)
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-with-sardine-in-jelly-kitten-53_Me-O_cat_food_pouch_2K_202607271415.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-with-sardine-in-jelly-kitten-53_Me-O_cat_food_pouch_2K_202607271415.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-with-sardine-in-jelly-kitten-53_Me-O_logo_Mackerel_banner_2K_202607271415.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-pouch-tuna-with-sardine-in-jelly-kitten-53_Product_back_panel_details_2K_202607271415.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '299ac3da-4b81-46ac-9230-b354cc40c6f7';

-- #51: Catron Bentonite Cat Litter – Grey Control
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-grey-control-55_Cat_litter_product_packaging_2K_202607270244.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-grey-control-55_Cat_litter_product_packaging_2K_202607270244.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-grey-control-55_Catron_logo_macro_detail_2K_202607270244.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-grey-control-55_Catron_cat_litter_back_panel_202607270244.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '0a3b7071-d4de-4f2f-89b0-3e7795a35d4b';

-- #52: Limoxin-25 Spray
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/limoxin-25-spray-57_Macro_label_close-up_shot_2K_202607300116.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/limoxin-25-spray-57_Macro_label_close-up_shot_2K_202607300116.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/limoxin-25-spray-57_Product_back_panel_details_2K_202607300115_1_.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/limoxin-25-spray-57_Product_front_panel_details_2K_202607300115.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'aaa6c347-f8cd-4573-bf43-85c31b8d94bd';

-- #53: Me-O Adult Cat Dry Food - Tuna Flavour
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-tuna-flavour-58_Product_front_pack_shot_2K_202607262318.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-tuna-flavour-58_Product_front_pack_shot_2K_202607262318.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-tuna-flavour-58_Me-O_Cat_Food_Tuna_2K_202607262318.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-tuna-flavour-58_Product_back_panel_details_2K_202607262318.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '4a16a085-66fb-4204-8b19-bbcb026c4307';

-- #54: Me-O Adult Cat Dry Food - Seafood Flavour
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-seafood-flavour-59_Me-O_seafood_cat_food_2K_202607271419.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-seafood-flavour-59_Me-O_seafood_cat_food_2K_202607271419.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-seafood-flavour-59_Macro_detail_Me-O_logo_2K_202607271419.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-seafood-flavour-59_Product_back_panel_details_2K_202607271420.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '0f0708a2-2d82-4b6f-b4b8-667d0f0a052c';

-- #55: Me-O Adult Cat Dry Food - Mackerel Flavour
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-mackerel-flavour-60_Me-O_Mackerel_cat_food_2K_202607262337.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-mackerel-flavour-60_Me-O_Mackerel_cat_food_2K_202607262337.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-mackerel-flavour-60_Me-O_logo_gold_emblem_2K_202607262337.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-mackerel-flavour-60_Product_back_panel_details_2K_202607262337.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'edc6bfa3-de63-4b40-9e32-10594767d27e';

-- #56: Me-O Adult Cat Dry Food - Chicken & Vegetables
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-chicken-vegetables-61_Me-O_cat_food_packaging_2K_202607271313.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-chicken-vegetables-61_Me-O_cat_food_packaging_2K_202607271313.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-chicken-vegetables-61_Me-O_logo_and_cat_graphic_202607271313.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-adult-cat-dry-food-chicken-vegetables-61_Product_back_panel_details_2K_202607271314.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '9eba1e33-a097-4265-b9c2-fdad3d558beb';

-- #57: Me-O Persian Cat Food - Anti-Hairball Formula
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-cat-food-anti-hairball-formula-62_Me-O_Persian_Cat_product_2K_202607272013.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-cat-food-anti-hairball-formula-62_Me-O_Persian_Cat_product_2K_202607272013.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-cat-food-anti-hairball-formula-62_Me-O_logo_and_cat_graphic_202607272013.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-cat-food-anti-hairball-formula-62_Product_back_panel_details_2K_202607272013.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '00252822-0a94-4728-afee-2e17c81323d2';

-- #58: Orcalmin Suspension pack: 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/orcalmin-suspension-pack-200-ml_Macro_detail_Orcalmin_VET_SUSPEN_202607300125.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/orcalmin-suspension-pack-200-ml_Macro_detail_Orcalmin_VET_SUSPEN_202607300125.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/orcalmin-suspension-pack-200-ml_Product_back_panel_details_2K_202607300125.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/orcalmin-suspension-pack-200-ml_Product_front_panel_details_2K_202607300125.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'cab0d254-daf3-488e-beef-d4929dea15ec';

-- #59: Catron Bentonite Cat Litter - Green Apple
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-green-apple-65_Cat_litter_product_shot_2K_202607270257.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-green-apple-65_Cat_litter_product_shot_2K_202607270257.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-green-apple-65_CATRON_typography_gold_accent_trim_202607270300.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-green-apple-65_Back_panel_details_product_2K_202607270303.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '6a94f8b2-bb39-48e4-ace4-d341913bbfe8';

-- #60: Catron Bentonite Cat Litter - Coconut & Vanilla
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-coconut-vanilla-66_Catron_s_cat_litter_product_2K_202607270302_1_.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-coconut-vanilla-66_Catron_s_cat_litter_product_2K_202607270302_1_.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-coconut-vanilla-66_Catron_s_cat_litter_product_2K_202607270302.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-coconut-vanilla-66_Catron_s_wordmark_gold_cat_2K_202607270302.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '7c6236da-7ae0-4bf9-8de1-2968495b5de2';

-- #61: Me-O Persian Kitten
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-kitten-68_Me-O_Persian_Kitten_cat_food_202607281639.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-kitten-68_Me-O_Persian_Kitten_cat_food_202607281639.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-kitten-68_Macro_detail_cat_artwork_text_202607281639.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-persian-kitten-68_Product_back_panel_catalog_shot_202607281642.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'ca2cf606-6e4e-4b47-85ee-2be1828f2562';

-- #62: Me-O Mother and Baby Cat
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-mother-and-baby-cat-69_Me-O_Persian_Kitten_cat_food_202607281639.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-mother-and-baby-cat-69_Me-O_Persian_Kitten_cat_food_202607281639.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-mother-and-baby-cat-69_Macro_detail_cat_artwork_text_202607281639.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/me-o-mother-and-baby-cat-69_Product_back_panel_catalog_shot_202607281642.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'ad3af9e5-28a5-460e-9dab-8c3f7908a4ed';

-- #63: Nutricoat Advance
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-advance-21_Product_packaging_with_pets_2K_202607281724.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-advance-21_Product_packaging_with_pets_2K_202607281724.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-advance-21_Macro_detail_PETCARE_ADVANCE_2K_202607281724.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/nutricoat-advance-21_Product_back_panel_details_2K_202607281724.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '3a240633-309d-4f10-98ad-da2f087d6575';

-- #64: Catron Bentonite Cat Litter – Lavender
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-lavender-56_Cat_litter_product_shot_2K_202607270251.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-lavender-56_Cat_litter_product_shot_2K_202607270251.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-lavender-56_CATRON_brand_name_emblem_2K_202607270251.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-lavender-56_Catron_backpack_back_panel_2K_202607270251.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '42394b1f-09ef-4038-8663-b4f40ce6a866';

-- #65: SmartHeart Power Pack – Puppy
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-puppy_Macro_detail_SmartHeart_logo_2K_202607300130.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-puppy_Macro_detail_SmartHeart_logo_2K_202607300130.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-puppy_Product_pack_shot_details_2K_202607300128.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/smartheart-power-pack-puppy_Product_back_panel_details_2K_202607300128.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'e8c0c90b-3208-482d-88ae-190eec7948e7';

-- #66: Catron Bentonite Cat Litter - Baby Powder
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-baby-powder-63_Catrons_litter_front_pack_2K_202607270253.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-baby-powder-63_Catrons_litter_front_pack_2K_202607270253.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-baby-powder-63_Macro_detail_catrons_logo_2K_202607270257.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-baby-powder-63_Product_back_panel_details_2K_202607270253.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'ab93c488-c97e-42f6-a0ab-33f73c213a84';

-- #67: Catron Bentonite Cat Litter - Marseille Soap
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-marseille-soap-64_Cat_litter_product_shot_2K_202607270256.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-marseille-soap-64_Cat_litter_product_shot_2K_202607270256.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-marseille-soap-64_Catron_s_logo_and_cat_artwork_202607270255.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-marseille-soap-64_Cat_litter_back_panel_details_202607270255.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '92d93511-bd22-4bfd-8fbb-bc0c693e28c2';

-- #68: Catron Bentonite Cat Litter - Cappuccino
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-cappuccino-67_White_Bentonite_Cat_Litter_2K_202607270246.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-cappuccino-67_White_Bentonite_Cat_Litter_2K_202607270246.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-cappuccino-67_Catron_logo_and_emblem_detail_202607270250.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/catron-bentonite-cat-litter-cappuccino-67_Back_panel_product_details_2K_202607270246.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = 'cbe25acb-599c-4f9e-a51d-ecef747762ad';

-- #69: Petfat Liquid 200 ml
UPDATE products
SET image_url = 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petfat-liquid-200-ml-6_Petfat_Health_Benefits_table_2K_202607281729.jpeg',
    images = ARRAY['https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petfat-liquid-200-ml-6_Petfat_Health_Benefits_table_2K_202607281729.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petfat-liquid-200-ml-6_Petfat_LIQUID_logo_detail_2K_202607281733.jpeg', 'https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/petfat-liquid-200-ml-6_Petfat_LIQUID_logo_product_2K_202607281729.jpeg']::TEXT[],
    updated_at = NOW()
WHERE id = '96c59ff9-e527-46d6-93d1-af755f689300';

COMMIT;
