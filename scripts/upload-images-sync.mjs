import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales WooCommerce - NUEVO SERVIDOR
const WOO_URL = 'https://franciscal46.sg-host.com/demosle/wp-json/wc/v3';
const WP_URL = 'https://franciscal46.sg-host.com/demosle/wp-json/wp/v2';
const CONSUMER_KEY = 'ck_242164facc9f783593eefe77dd2528bca417617b';
const CONSUMER_SECRET = 'cs_90a59117ac53a889e186a6b79f4451b4b411b29a';

// Credenciales WordPress para subir media
const WP_USER = 'demosle';
const WP_PASS = 'iEGV hOBi OWBb 3Y7t Q9Mf fyJn';
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// Directorios
const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');
const IMAGES_DIR = path.join(EXPORT_DIR, 'images');

// Límite de tamaño de archivo (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * Subir imagen a WordPress Media Library
 */
function uploadToWordPress(filePath, filename) {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      reject(new Error(`Archivo muy grande: ${(stats.size / 1024 / 1024).toFixed(1)}MB`));
      return;
    }

    if (stats.size === 0) {
      reject(new Error('Archivo vacío'));
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

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
            reject(new Error(`WP ${res.statusCode}: ${parsed.message || 'Error'}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

/**
 * Petición a WooCommerce
 */
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
          reject(new Error(`Error parsing response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Procesar imágenes de un producto
 */
async function processProductImages(oldImages) {
  const uploadedImages = [];

  for (const img of oldImages) {
    if (!img.local_path) continue;

    let fullPath = path.join(EXPORT_DIR, img.local_path);

    // Si el archivo PNG no existe, buscar versión JPG (comprimida)
    if (!fs.existsSync(fullPath) && fullPath.endsWith('.png')) {
      const jpgPath = fullPath.replace('.png', '.jpg');
      if (fs.existsSync(jpgPath)) {
        fullPath = jpgPath;
      }
    }

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    try {
      const filename = path.basename(fullPath);
      const mediaResponse = await uploadToWordPress(fullPath, filename);

      uploadedImages.push({
        id: mediaResponse.id,
        src: mediaResponse.source_url,
        name: img.name || filename,
        alt: img.alt || ''
      });

      await sleep(200);
    } catch (error) {
      // Silenciar errores de imágenes muy grandes
    }
  }

  return uploadedImages;
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🖼️  SUBIDA DE IMÁGENES - PRODUCTOS SINCRONIZADOS');
  console.log('═'.repeat(60));
  console.log(`📍 Servidor: ${WP_URL}\n`);

  // Verificar autenticación WordPress
  console.log('🔐 Verificando credenciales WordPress...');
  try {
    const testUrl = new URL(`${WP_URL}/users/me`);
    const testReq = await new Promise((resolve, reject) => {
      const req = https.request({
        method: 'GET',
        hostname: testUrl.hostname,
        path: testUrl.pathname,
        headers: { 'Authorization': `Basic ${WP_AUTH}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`Auth failed: ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
    console.log(`✅ Autenticado como: ${testReq.name}\n`);
  } catch (error) {
    console.error(`❌ Error de autenticación: ${error.message}`);
    process.exit(1);
  }

  // Cargar mapeo de sincronización
  const mappingFile = path.join(EXPORT_DIR, 'sync-mapping.json');
  if (!fs.existsSync(mappingFile)) {
    console.error('❌ No se encontró el archivo sync-mapping.json');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  const products = mapping.products;
  const productIds = Object.keys(products);

  console.log(`📦 Productos a procesar: ${productIds.length}\n`);

  let successProducts = 0;
  let totalImages = 0;

  for (let i = 0; i < productIds.length; i++) {
    const oldId = productIds[i];
    const product = products[oldId];
    const newId = product.newId;

    // Saltar si no tiene imágenes
    if (!product.oldImages || product.oldImages.length === 0) {
      continue;
    }

    const imagesWithPath = product.oldImages.filter(img => img.local_path);
    if (imagesWithPath.length === 0) continue;

    console.log(`[${i + 1}/${productIds.length}] Producto ID: ${newId} (${imagesWithPath.length} imgs)`);

    try {
      // Subir imágenes a WordPress Media
      const uploadedImages = await processProductImages(product.oldImages);

      if (uploadedImages.length > 0) {
        // Actualizar producto con las imágenes subidas
        await wooRequest('PUT', `/products/${newId}`, { images: uploadedImages });
        console.log(`  ✅ ${uploadedImages.length} imágenes subidas`);
        successProducts++;
        totalImages += uploadedImages.length;
      }

      // Procesar variaciones si existen
      if (product.variationMap) {
        for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
          if (variation.oldImage && variation.oldImage.local_path) {
            let fullPath = path.join(EXPORT_DIR, variation.oldImage.local_path);

            // Si PNG no existe, buscar JPG
            if (!fs.existsSync(fullPath) && fullPath.endsWith('.png')) {
              const jpgPath = fullPath.replace('.png', '.jpg');
              if (fs.existsSync(jpgPath)) fullPath = jpgPath;
            }

            if (fs.existsSync(fullPath)) {
              const stats = fs.statSync(fullPath);
              if (stats.size <= MAX_FILE_SIZE && stats.size > 0) {
                try {
                  const filename = path.basename(fullPath);
                  const mediaResponse = await uploadToWordPress(fullPath, filename);
                  await wooRequest('PUT', `/products/${newId}/variations/${variation.newId}`, {
                    image: { id: mediaResponse.id, src: mediaResponse.source_url }
                  });
                  totalImages++;
                  await sleep(150);
                } catch (e) {
                  // Silenciar
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.log(`  ❌ ${error.message.substring(0, 40)}`);
    }

    await sleep(300);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SUBIDA DE IMÁGENES COMPLETADA');
  console.log('═'.repeat(60));
  console.log(`📦 Productos actualizados: ${successProducts}`);
  console.log(`🖼️  Total imágenes subidas: ${totalImages}`);
}

main().catch(console.error);
