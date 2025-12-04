import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');
const IMAGES_DIR = path.join(EXPORT_DIR, 'images');
const COMPRESSED_DIR = path.join(EXPORT_DIR, 'images-compressed-21');

// IDs de productos que fallaron (newId en billardramirez.cl/demosle)
const FAILED_PRODUCT_IDS = [435, 431, 427, 423, 419, 410, 405, 360, 351, 332, 264, 256, 240, 229, 153, 148, 143, 80, 43, 38, 10];

async function main() {
  console.log('='.repeat(60));
  console.log('COMPRIMIENDO IMAGENES DE 21 PRODUCTOS FALLIDOS');
  console.log('='.repeat(60));

  // Crear directorio para imagenes comprimidas
  if (!fs.existsSync(COMPRESSED_DIR)) {
    fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
  }

  // Cargar mapeo
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  // Buscar productos fallidos
  const failedProducts = [];
  for (const [oldId, product] of Object.entries(mapping.products)) {
    if (FAILED_PRODUCT_IDS.includes(product.newId)) {
      failedProducts.push({ oldId, ...product });
    }
  }

  console.log(`\nProductos a procesar: ${failedProducts.length}\n`);

  const imagesToCompress = [];

  // Recolectar todas las imagenes PNG de productos fallidos
  for (const product of failedProducts) {
    if (product.oldImages) {
      for (const img of product.oldImages) {
        if (img.local_path && img.local_path.endsWith('.png')) {
          imagesToCompress.push({
            productId: product.newId,
            localPath: img.local_path,
            name: img.name || ''
          });
        }
      }
    }
    if (product.variationMap) {
      for (const [varId, variation] of Object.entries(product.variationMap)) {
        if (variation.oldImage && variation.oldImage.local_path && variation.oldImage.local_path.endsWith('.png')) {
          imagesToCompress.push({
            productId: product.newId,
            variationId: variation.newId,
            localPath: variation.oldImage.local_path,
            name: variation.oldImage.name || ''
          });
        }
      }
    }
  }

  // Eliminar duplicados por localPath
  const uniqueImages = [...new Map(imagesToCompress.map(item => [item.localPath, item])).values()];

  console.log(`Imagenes PNG unicas a comprimir: ${uniqueImages.length}\n`);
  console.log('-'.repeat(60));

  let compressed = 0;
  let errors = 0;

  for (let i = 0; i < uniqueImages.length; i++) {
    const img = uniqueImages[i];
    const inputPath = path.join(EXPORT_DIR, img.localPath);
    const filename = path.basename(img.localPath);
    const jpgFilename = filename.replace('.png', '.jpg');
    const outputPath = path.join(COMPRESSED_DIR, jpgFilename);

    if (!fs.existsSync(inputPath)) {
      console.log(`[${i + 1}/${uniqueImages.length}] No existe: ${filename}`);
      errors++;
      continue;
    }

    const inputStats = fs.statSync(inputPath);
    const inputSizeMB = inputStats.size / 1024 / 1024;

    process.stdout.write(`[${i + 1}/${uniqueImages.length}] ${filename} (${inputSizeMB.toFixed(1)}MB)...`);

    try {
      // Usar sips de macOS para convertir PNG a JPG con calidad 80
      execSync(`sips -s format jpeg -s formatOptions 80 "${inputPath}" --out "${outputPath}"`, { stdio: 'pipe' });

      const outputStats = fs.statSync(outputPath);
      const outputSizeMB = outputStats.size / 1024 / 1024;

      console.log(` -> ${jpgFilename} (${outputSizeMB.toFixed(1)}MB)`);
      compressed++;
    } catch (error) {
      console.log(` ERROR`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPRESION COMPLETADA');
  console.log('='.repeat(60));
  console.log(`Imagenes comprimidas: ${compressed}`);
  console.log(`Errores: ${errors}`);
  console.log(`\nDirectorio de salida: ${COMPRESSED_DIR}`);

  // Listar archivos resultantes
  const compressedFiles = fs.readdirSync(COMPRESSED_DIR);
  console.log(`\nArchivos generados (${compressedFiles.length}):`);

  let totalSize = 0;
  for (const file of compressedFiles) {
    const filePath = path.join(COMPRESSED_DIR, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    console.log(`  ${file} - ${(stats.size / 1024).toFixed(0)}KB`);
  }
  console.log(`\nTamano total: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
}

main().catch(console.error);
