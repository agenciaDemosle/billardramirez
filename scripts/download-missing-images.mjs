import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');
const DOWNLOAD_DIR = path.join(EXPORT_DIR, 'images-downloaded');
const COMPRESSED_DIR = path.join(EXPORT_DIR, 'images-compressed-remaining');

// IDs de productos que aún faltan (los 15 restantes)
const REMAINING_PRODUCT_IDS = [431, 427, 423, 419, 405, 360, 351, 332, 264, 256, 229, 148, 143, 80, 38];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const file = fs.createWriteStream(destPath);

    protocol.get(url, (response) => {
      // Manejar redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function compressImage(inputPath, outputPath) {
  try {
    execSync(`sips -s format jpeg -s formatOptions 80 "${inputPath}" --out "${outputPath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('DESCARGANDO IMAGENES FALTANTES');
  console.log('='.repeat(60));

  // Crear directorios
  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  if (!fs.existsSync(COMPRESSED_DIR)) fs.mkdirSync(COMPRESSED_DIR, { recursive: true });

  // Cargar mapeo
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  // Buscar productos faltantes y sus imágenes
  const imagesToDownload = [];

  for (const [oldId, product] of Object.entries(mapping.products)) {
    if (!REMAINING_PRODUCT_IDS.includes(product.newId)) continue;

    if (product.oldImages) {
      for (const img of product.oldImages) {
        if (img.src) {
          imagesToDownload.push({
            type: 'product',
            productNewId: product.newId,
            oldProductId: oldId,
            url: img.src,
            name: img.name || '',
            localPath: img.local_path
          });
        }
      }
    }

    if (product.variationMap) {
      for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
        if (variation.oldImage && variation.oldImage.src) {
          imagesToDownload.push({
            type: 'variation',
            productNewId: product.newId,
            variationNewId: variation.newId,
            oldVarId: oldVarId,
            url: variation.oldImage.src,
            name: variation.oldImage.name || '',
            localPath: variation.oldImage.local_path
          });
        }
      }
    }
  }

  // Eliminar duplicados por URL
  const uniqueImages = [...new Map(imagesToDownload.map(item => [item.url, item])).values()];

  console.log(`\nImagenes unicas a descargar: ${uniqueImages.length}\n`);
  console.log('-'.repeat(60));

  let downloaded = 0;
  let compressed = 0;
  let errors = 0;

  const downloadedFiles = [];

  for (let i = 0; i < uniqueImages.length; i++) {
    const img = uniqueImages[i];
    const urlFilename = path.basename(new URL(img.url).pathname);
    const ext = path.extname(urlFilename).toLowerCase();

    // Crear nombre único basado en el localPath esperado o URL
    let baseFilename;
    if (img.localPath) {
      baseFilename = path.basename(img.localPath, path.extname(img.localPath));
    } else {
      baseFilename = `img_${i}_${urlFilename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    }

    const downloadFilename = `${baseFilename}${ext}`;
    const downloadPath = path.join(DOWNLOAD_DIR, downloadFilename);

    process.stdout.write(`[${i + 1}/${uniqueImages.length}] ${urlFilename.substring(0, 30)}...`);

    try {
      await downloadFile(img.url, downloadPath);

      const stats = fs.statSync(downloadPath);
      const sizeMB = stats.size / 1024 / 1024;

      console.log(` ${sizeMB.toFixed(1)}MB`);
      downloaded++;

      // Comprimir a JPG
      const jpgFilename = `${baseFilename}.jpg`;
      const compressedPath = path.join(COMPRESSED_DIR, jpgFilename);

      if (ext === '.png' || sizeMB > 0.5) {
        if (compressImage(downloadPath, compressedPath)) {
          const compStats = fs.statSync(compressedPath);
          console.log(`    -> Comprimido: ${(compStats.size / 1024).toFixed(0)}KB`);
          compressed++;

          downloadedFiles.push({
            ...img,
            compressedFilename: jpgFilename
          });
        }
      } else {
        // Copiar JPG pequeño directamente
        fs.copyFileSync(downloadPath, compressedPath);
        downloadedFiles.push({
          ...img,
          compressedFilename: jpgFilename
        });
        compressed++;
      }
    } catch (error) {
      console.log(` ERROR: ${error.message}`);
      errors++;
    }
  }

  // Guardar mapeo de archivos descargados
  const mappingOutput = path.join(EXPORT_DIR, 'downloaded-images-mapping.json');
  fs.writeFileSync(mappingOutput, JSON.stringify(downloadedFiles, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('DESCARGA COMPLETADA');
  console.log('='.repeat(60));
  console.log(`Descargadas: ${downloaded}`);
  console.log(`Comprimidas: ${compressed}`);
  console.log(`Errores: ${errors}`);
  console.log(`\nArchivos en: ${COMPRESSED_DIR}`);
  console.log(`Mapeo guardado en: ${mappingOutput}`);

  // Listar archivos comprimidos
  const compressedFiles = fs.readdirSync(COMPRESSED_DIR);
  console.log(`\nArchivos listos para subir (${compressedFiles.length}):`);

  let totalSize = 0;
  for (const file of compressedFiles) {
    const filePath = path.join(COMPRESSED_DIR, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  }
  console.log(`Tamano total: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
}

main().catch(console.error);
