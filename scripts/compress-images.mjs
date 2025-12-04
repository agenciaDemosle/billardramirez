import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '..', 'woocommerce-export', 'images');
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 1200; // máximo 1200px

console.log('═'.repeat(60));
console.log('🗜️  COMPRESIÓN DE IMÁGENES');
console.log('═'.repeat(60));

const files = fs.readdirSync(IMAGES_DIR);
let compressed = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  const filePath = path.join(IMAGES_DIR, file);
  const stats = fs.statSync(filePath);

  if (stats.size <= MAX_SIZE) {
    continue;
  }

  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    continue;
  }

  console.log(`\n📷 ${file} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);

  try {
    // Redimensionar con sips (macOS)
    execSync(`sips --resampleHeightWidthMax ${MAX_DIMENSION} "${filePath}" --out "${filePath}"`, { stdio: 'pipe' });

    // Si es PNG y sigue siendo muy grande, convertir a JPG
    const newStats = fs.statSync(filePath);
    if (newStats.size > MAX_SIZE && ext === '.png') {
      const jpgPath = filePath.replace('.png', '.jpg');
      execSync(`sips -s format jpeg -s formatOptions 80 "${filePath}" --out "${jpgPath}"`, { stdio: 'pipe' });

      // Eliminar PNG y actualizar referencias
      fs.unlinkSync(filePath);
      console.log(`  ✅ Convertido a JPG: ${(fs.statSync(jpgPath).size / 1024 / 1024).toFixed(1)}MB`);
    } else {
      console.log(`  ✅ Redimensionado: ${(newStats.size / 1024 / 1024).toFixed(1)}MB`);
    }

    compressed++;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    errors++;
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`✅ Comprimidas: ${compressed}`);
console.log(`❌ Errores: ${errors}`);
console.log('═'.repeat(60));
