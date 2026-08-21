const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'products');
const largeFiles = [
  'p55_catron_bentonite_cat_litter_grey_co_1.jpg',
  'p56_catron_bentonite_cat_litter_lavende_1.png',
  'p63_catron_bentonite_cat_litter_baby_po_1.png',
  'p64_catron_bentonite_cat_litter_marseil_1.png',
  'p65_catron_bentonite_cat_litter_green_a_1.png'
];

async function run() {
  for (const file of largeFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    const tempPath = filePath + '.tmp';
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    let pipeline = image.resize({ width: 1000, withoutEnlargement: true });
    if (file.endsWith('.png')) {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
    } else {
      pipeline = pipeline.jpeg({ quality: 82 });
    }
    
    await pipeline.toFile(tempPath);
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    
    const newStats = fs.statSync(filePath);
    console.log(`Optimized ${file}: ${(newStats.size / 1024).toFixed(1)} KB`);
  }
}

run().catch(console.error);
