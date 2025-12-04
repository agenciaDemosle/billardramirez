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
  console.log('🔗 ASIGNACIÓN DE IMÁGENES - BILLARDRAMIREZ.CL');
  console.log('═'.repeat(60));
  console.log(`📍 Servidor: ${WOO_URL}\n`);

  // Verificar conexión
  console.log('🔌 Verificando conexión...');
  try {
    await wooRequest('GET', '/system_status');
    console.log('✅ Conectado\n');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }

  // Cargar mapeo de sincronización
  const mappingFile = path.join(EXPORT_DIR, 'sync-mapping.json');
  if (!fs.existsSync(mappingFile)) {
    console.error('❌ No se encontró sync-mapping.json');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  const syncedProducts = mapping.products;
  const productIds = Object.keys(syncedProducts);

  console.log(`📦 Productos a procesar: ${productIds.length}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < productIds.length; i++) {
    const oldId = productIds[i];
    const product = syncedProducts[oldId];
    const newId = product.newId; // ID en billardramirez.cl/demosle

    if (!product.oldImages || product.oldImages.length === 0) {
      continue;
    }

    console.log(`[${i + 1}/${productIds.length}] Producto ID: ${newId}`);

    // Construir array de imágenes usando las URLs originales
    const images = product.oldImages
      .filter(img => img.src)
      .map(img => ({
        src: img.src,
        name: img.name || '',
        alt: img.alt || ''
      }));

    if (images.length === 0) {
      console.log(`  ⏭️  Sin imágenes con URL`);
      skipped++;
      continue;
    }

    try {
      // Actualizar el producto en billardramirez.cl/demosle con sus imágenes
      await wooRequest('PUT', `/products/${newId}`, { images });
      console.log(`  ✅ ${images.length} imágenes asignadas`);
      updated++;

      // Procesar variaciones si existen
      if (product.variationMap) {
        for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
          if (variation.oldImage && variation.oldImage.src) {
            try {
              await wooRequest('PUT', `/products/${newId}/variations/${variation.newId}`, {
                image: {
                  src: variation.oldImage.src,
                  name: variation.oldImage.name || '',
                  alt: variation.oldImage.alt || ''
                }
              });
              await sleep(100);
            } catch (e) {
              // Silenciar errores de variaciones
            }
          }
        }
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message.substring(0, 50)}`);
      errors++;
    }

    await sleep(300);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ ASIGNACIÓN COMPLETADA');
  console.log('═'.repeat(60));
  console.log(`📦 Productos actualizados: ${updated}`);
  console.log(`⏭️  Sin imágenes: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
}

main().catch(console.error);
