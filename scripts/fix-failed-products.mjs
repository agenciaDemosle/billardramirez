import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales WooCommerce - billardramirez.cl/demosle
const WOO_URL = 'https://billardramirez.cl/demosle/wp-json/wc/v3';
const WP_URL = 'https://billardramirez.cl/demosle/wp-json/wp/v2';
const CONSUMER_KEY = 'ck_57c51a3c2900ff48d7575214327f91f0061cf49e';
const CONSUMER_SECRET = 'cs_780649d7149b939bfc874b7ac8301ca501300d20';

// Credenciales WordPress
const WP_USER = 'rodrigo';
const WP_PASS = '2x)0h)roV9htw4YxVx&JanJ2';
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');
const IMAGES_DIR = path.join(EXPORT_DIR, 'images');
const COMPRESSED_DIR = path.join(EXPORT_DIR, 'images-compressed');

// IDs de productos que fallaron (newId en billardramirez.cl/demosle)
const FAILED_PRODUCT_IDS = [435, 431, 427, 423, 419, 410, 405, 360, 351, 332, 264, 256, 240, 229, 153, 148, 143, 80, 43, 38, 10];

function wooRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WOO_URL}${endpoint}`);
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);

    const options = {
      method: method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 400) {
            reject(new Error(`API Error ${res.statusCode}: ${parsed.message || JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Error parsing: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function uploadToWordPress(filePath, filename) {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      reject(new Error('Archivo vacio'));
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';

    const url = new URL(`${WP_URL}/media`);
    const options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Authorization': `Basic ${WP_AUTH}`,
        'Content-Length': fileBuffer.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 400) {
            reject(new Error(`WP ${res.statusCode}: ${parsed.message || JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${responseData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Comprimir PNG a JPG usando sips (macOS)
function compressImage(inputPath, outputPath) {
  try {
    // Usar sips de macOS para convertir y comprimir
    execSync(`sips -s format jpeg -s formatOptions 80 "${inputPath}" --out "${outputPath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error comprimiendo ${inputPath}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('CORRECCION DE 21 PRODUCTOS FALLIDOS');
  console.log('='.repeat(60));
  console.log(`Servidor: ${WOO_URL}\n`);

  // Crear directorio para imagenes comprimidas
  if (!fs.existsSync(COMPRESSED_DIR)) {
    fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
  }

  // Cargar mapeo
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  // Verificar conexion WooCommerce
  console.log('Verificando conexion WooCommerce...');
  try {
    await wooRequest('GET', '/system_status');
    console.log('Conectado a WooCommerce\n');
  } catch (error) {
    console.error(`Error WooCommerce: ${error.message}`);
    process.exit(1);
  }

  // Verificar conexion WordPress
  console.log('Verificando conexion WordPress...');
  try {
    const testUrl = new URL(`${WP_URL}/users/me`);
    const testReq = await new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        hostname: testUrl.hostname,
        path: testUrl.pathname,
        headers: { 'Authorization': `Basic ${WP_AUTH}` }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`WP Auth error ${res.statusCode}`));
          } else {
            resolve(JSON.parse(data));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
    console.log(`Conectado como: ${testReq.name}\n`);
  } catch (error) {
    console.error(`Error WordPress: ${error.message}`);
    process.exit(1);
  }

  // Buscar productos fallidos en el mapeo
  const failedProducts = [];
  for (const [oldId, product] of Object.entries(mapping.products)) {
    if (FAILED_PRODUCT_IDS.includes(product.newId)) {
      failedProducts.push({ oldId, ...product });
    }
  }

  console.log(`Productos fallidos encontrados: ${failedProducts.length}\n`);
  console.log('-'.repeat(60));

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < failedProducts.length; i++) {
    const product = failedProducts[i];
    console.log(`\n[${i + 1}/${failedProducts.length}] Producto #${product.newId}`);

    if (!product.oldImages || product.oldImages.length === 0) {
      console.log('  Sin imagenes');
      continue;
    }

    const uploadedImages = [];

    for (const img of product.oldImages) {
      if (!img.local_path) continue;

      const originalPath = path.join(EXPORT_DIR, img.local_path);

      if (!fs.existsSync(originalPath)) {
        console.log(`  Archivo no existe: ${img.local_path}`);
        continue;
      }

      const stats = fs.statSync(originalPath);
      const sizeMB = stats.size / 1024 / 1024;
      const isPNG = originalPath.toLowerCase().endsWith('.png');

      let uploadPath = originalPath;
      let uploadFilename = path.basename(originalPath);

      // Si es PNG grande, comprimir a JPG
      if (isPNG && sizeMB > 1) {
        console.log(`  Comprimiendo ${uploadFilename} (${sizeMB.toFixed(1)}MB)...`);
        const jpgFilename = uploadFilename.replace('.png', '.jpg');
        const compressedPath = path.join(COMPRESSED_DIR, jpgFilename);

        if (compressImage(originalPath, compressedPath)) {
          uploadPath = compressedPath;
          uploadFilename = jpgFilename;
          const newStats = fs.statSync(compressedPath);
          console.log(`  Comprimido: ${(newStats.size / 1024 / 1024).toFixed(1)}MB`);
        }
      }

      try {
        console.log(`  Subiendo ${uploadFilename}...`);
        const mediaResponse = await uploadToWordPress(uploadPath, uploadFilename);
        console.log(`  Subido: Media ID ${mediaResponse.id}`);

        uploadedImages.push({
          id: mediaResponse.id,
          src: mediaResponse.source_url,
          name: img.name || '',
          alt: img.alt || ''
        });

        await sleep(500);
      } catch (error) {
        console.log(`  Error subiendo: ${error.message}`);
      }
    }

    if (uploadedImages.length > 0) {
      try {
        console.log(`  Asignando ${uploadedImages.length} imagenes al producto...`);
        await wooRequest('PUT', `/products/${product.newId}`, { images: uploadedImages });
        console.log(`  Producto actualizado!`);
        updated++;
      } catch (error) {
        console.log(`  Error asignando: ${error.message}`);
        errors++;
      }
    }

    await sleep(300);
  }

  console.log('\n' + '='.repeat(60));
  console.log('PROCESO COMPLETADO');
  console.log('='.repeat(60));
  console.log(`Productos actualizados: ${updated}`);
  console.log(`Errores: ${errors}`);
}

main().catch(console.error);
