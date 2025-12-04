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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('='.repeat(60));
  console.log('CORRECCION DE 21 PRODUCTOS - USANDO URLs ORIGINALES');
  console.log('='.repeat(60));
  console.log(`Servidor: ${WOO_URL}\n`);

  // Cargar mapeo
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  // Verificar conexion WooCommerce
  console.log('Verificando conexion...');
  try {
    await wooRequest('GET', '/system_status');
    console.log('Conectado\n');
  } catch (error) {
    console.error(`Error: ${error.message}`);
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

    // Usar las URLs originales de billardramirez.cl
    // Las imagenes PNG grandes probablemente no se pueden importar
    // pero las JPG si deberian funcionar
    const images = [];

    for (const img of product.oldImages) {
      // Verificar si es PNG (probablemente fallo) o JPG
      const isPNG = img.src && img.src.toLowerCase().endsWith('.png');

      if (isPNG) {
        // Intentar usar una version mas pequena si existe (thumbnail o 1024)
        if (img.srcset) {
          // Buscar version 1024x1024 o 900x900
          const match = img.srcset.match(/([^\s]+(?:1024x1024|900x900)[^\s]+\.(?:jpg|png))/i);
          if (match) {
            console.log(`  Usando version reducida: ${path.basename(match[1])}`);
            images.push({
              src: match[1],
              name: img.name || '',
              alt: img.alt || ''
            });
            continue;
          }
        }
        console.log(`  PNG grande saltado: ${img.name || path.basename(img.src)}`);
      } else {
        // JPG - usar directamente
        images.push({
          src: img.src,
          name: img.name || '',
          alt: img.alt || ''
        });
      }
    }

    if (images.length === 0) {
      console.log('  Todas las imagenes son PNG grandes, no se pueden importar');
      errors++;
      continue;
    }

    try {
      console.log(`  Asignando ${images.length} imagen(es)...`);
      await wooRequest('PUT', `/products/${product.newId}`, { images });
      console.log(`  OK`);
      updated++;
    } catch (error) {
      console.log(`  Error: ${error.message.substring(0, 60)}`);
      errors++;
    }

    await sleep(500);
  }

  // Ahora intentar con variaciones
  console.log('\n' + '-'.repeat(60));
  console.log('Procesando variaciones...');

  let variationsUpdated = 0;

  for (const product of failedProducts) {
    if (!product.variationMap) continue;

    for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
      if (!variation.oldImage || !variation.oldImage.src) continue;

      const isPNG = variation.oldImage.src.toLowerCase().endsWith('.png');
      if (isPNG) continue; // Saltar PNGs grandes

      try {
        await wooRequest('PUT', `/products/${product.newId}/variations/${variation.newId}`, {
          image: {
            src: variation.oldImage.src,
            name: variation.oldImage.name || '',
            alt: variation.oldImage.alt || ''
          }
        });
        variationsUpdated++;
        await sleep(200);
      } catch (e) {
        // Silenciar
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('PROCESO COMPLETADO');
  console.log('='.repeat(60));
  console.log(`Productos actualizados: ${updated}`);
  console.log(`Variaciones actualizadas: ${variationsUpdated}`);
  console.log(`Errores/Sin imagenes JPG: ${errors}`);
}

main().catch(console.error);
