import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales WooCommerce - billardramirez.cl/demosle
const WOO_URL = 'https://billardramirez.cl/demosle/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_57c51a3c2900ff48d7575214327f91f0061cf49e';
const CONSUMER_SECRET = 'cs_780649d7149b939bfc874b7ac8301ca501300d20';

// URL base donde están las imágenes subidas
const IMAGES_BASE_URL = 'https://billardramirez.cl/demosle/wp-content/uploads/2025/12';

const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🖼️  ASIGNACIÓN DE IMÁGENES A PRODUCTOS');
  console.log('═'.repeat(60));
  console.log(`📍 Servidor: ${WOO_URL}`);
  console.log(`📷 Imágenes en: ${IMAGES_BASE_URL}\n`);

  // Verificar conexión WooCommerce
  console.log('🔌 Verificando conexión...');
  try {
    await wooRequest('GET', '/system_status');
    console.log('✅ Conectado\n');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }

  // Cargar mapeo de importación (billardramirez.cl/demosle)
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');
  if (!fs.existsSync(mappingFile)) {
    console.error('❌ No se encontró import-mapping.json');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  const syncedProducts = mapping.products;
  const productIds = Object.keys(syncedProducts);

  console.log(`📦 Productos a procesar: ${productIds.length}\n`);
  console.log('─'.repeat(60));

  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let variationsUpdated = 0;

  for (let i = 0; i < productIds.length; i++) {
    const oldId = productIds[i];
    const product = syncedProducts[oldId];
    const newId = product.newId;

    const hasImages = product.oldImages && product.oldImages.length > 0;
    const hasVariations = product.variationMap && Object.keys(product.variationMap).length > 0;

    if (!hasImages && !hasVariations) {
      continue;
    }

    process.stdout.write(`[${i + 1}/${productIds.length}] Producto #${newId}...`);

    // Procesar imágenes del producto principal
    if (hasImages) {
      const images = [];

      for (const oldImg of product.oldImages) {
        if (!oldImg.local_path) continue;

        // Obtener nombre del archivo
        let filename = path.basename(oldImg.local_path);

        // Construir URL de la imagen
        const imageUrl = `${IMAGES_BASE_URL}/${filename}`;

        images.push({
          src: imageUrl,
          name: oldImg.name || filename.replace(/\.[^.]+$/, ''),
          alt: oldImg.alt || ''
        });
      }

      if (images.length > 0) {
        try {
          await wooRequest('PUT', `/products/${newId}`, { images: images });
          console.log(` ✅ ${images.length} img(s)`);
          updated++;
        } catch (error) {
          console.log(` ❌ ${error.message.substring(0, 50)}`);
          errors++;
        }
      } else {
        console.log(` ⏭️ Sin imágenes`);
        skipped++;
      }
    } else {
      console.log(` (variaciones)`);
    }

    // Procesar variaciones
    if (hasVariations) {
      for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
        if (!variation.oldImage || !variation.oldImage.local_path) continue;

        const filename = path.basename(variation.oldImage.local_path);
        const imageUrl = `${IMAGES_BASE_URL}/${filename}`;

        try {
          await wooRequest('PUT', `/products/${newId}/variations/${variation.newId}`, {
            image: {
              src: imageUrl,
              name: variation.oldImage.name || '',
              alt: variation.oldImage.alt || ''
            }
          });
          variationsUpdated++;
        } catch (error) {
          // Silenciar errores de variaciones
        }
      }
    }

    await sleep(300);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ ASIGNACIÓN COMPLETADA');
  console.log('═'.repeat(60));
  console.log(`📦 Productos actualizados: ${updated}`);
  console.log(`📦 Variaciones actualizadas: ${variationsUpdated}`);
  console.log(`⏭️  Sin imágenes: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
}

main().catch(console.error);
