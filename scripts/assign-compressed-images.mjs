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

// URL base donde subiste las imágenes comprimidas
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

// Mapeo de archivos comprimidos a productos/variaciones
// Basado en los nombres de archivo: product_OLDID_IMGID.jpg y variation_OLDVARID.jpg
const COMPRESSED_FILES = [
  'product_632_4770.jpg',
  'product_632_4771.jpg',
  'product_806_4728.jpg',
  'product_3722_5771.jpg',
  'product_4757_4763.jpg',
  'product_5742_6033.jpg',
  'product_6345_4636.jpg',
  'variation_5936.jpg',
  'variation_5937.jpg',
  'variation_5938.jpg',
  'variation_5939.jpg',
  'variation_5940.jpg',
  'variation_5941.jpg',
  'variation_5942.jpg',
  'variation_5943.jpg',
  'variation_6037.jpg',
  'variation_6038.jpg',
  'variation_6039.jpg'
];

async function main() {
  console.log('='.repeat(60));
  console.log('ASIGNANDO IMAGENES COMPRIMIDAS A PRODUCTOS');
  console.log('='.repeat(60));
  console.log(`Servidor: ${WOO_URL}`);
  console.log(`Imagenes en: ${IMAGES_BASE_URL}\n`);

  // Verificar conexion
  console.log('Verificando conexion...');
  try {
    await wooRequest('GET', '/system_status');
    console.log('Conectado\n');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  // Cargar mapeo
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  // Crear mapeo de oldId a newId para productos
  const productOldToNew = {};
  const variationOldToNew = {};

  for (const [oldId, product] of Object.entries(mapping.products)) {
    productOldToNew[oldId] = product.newId;

    if (product.variationMap) {
      for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
        variationOldToNew[oldVarId] = {
          newVarId: variation.newId,
          parentNewId: product.newId
        };
      }
    }
  }

  // Agrupar imagenes por producto
  const productImages = {};
  const variationImages = [];

  for (const filename of COMPRESSED_FILES) {
    if (filename.startsWith('product_')) {
      // Extraer oldProductId del nombre: product_OLDID_IMGID.jpg
      const match = filename.match(/product_(\d+)_(\d+)\.jpg/);
      if (match) {
        const oldProductId = match[1];
        const newProductId = productOldToNew[oldProductId];

        if (newProductId) {
          if (!productImages[newProductId]) {
            productImages[newProductId] = [];
          }
          productImages[newProductId].push({
            src: `${IMAGES_BASE_URL}/${filename}`,
            name: filename.replace('.jpg', ''),
            alt: ''
          });
        }
      }
    } else if (filename.startsWith('variation_')) {
      // Extraer oldVariationId del nombre: variation_OLDVARID.jpg
      const match = filename.match(/variation_(\d+)\.jpg/);
      if (match) {
        const oldVarId = match[1];
        const varInfo = variationOldToNew[oldVarId];

        if (varInfo) {
          variationImages.push({
            parentId: varInfo.parentNewId,
            variationId: varInfo.newVarId,
            image: {
              src: `${IMAGES_BASE_URL}/${filename}`,
              name: filename.replace('.jpg', ''),
              alt: ''
            }
          });
        }
      }
    }
  }

  console.log(`Productos a actualizar: ${Object.keys(productImages).length}`);
  console.log(`Variaciones a actualizar: ${variationImages.length}\n`);
  console.log('-'.repeat(60));

  let productsUpdated = 0;
  let variationsUpdated = 0;
  let errors = 0;

  // Actualizar productos
  for (const [newProductId, images] of Object.entries(productImages)) {
    console.log(`\nProducto #${newProductId}: ${images.length} imagen(es)`);

    try {
      await wooRequest('PUT', `/products/${newProductId}`, { images });
      console.log(`  OK`);
      productsUpdated++;
    } catch (error) {
      console.log(`  Error: ${error.message.substring(0, 50)}`);
      errors++;
    }

    await sleep(500);
  }

  // Actualizar variaciones
  console.log('\n' + '-'.repeat(60));
  console.log('Procesando variaciones...\n');

  for (const varImg of variationImages) {
    process.stdout.write(`Variacion #${varImg.variationId} (producto #${varImg.parentId})...`);

    try {
      await wooRequest('PUT', `/products/${varImg.parentId}/variations/${varImg.variationId}`, {
        image: varImg.image
      });
      console.log(' OK');
      variationsUpdated++;
    } catch (error) {
      console.log(` Error: ${error.message.substring(0, 40)}`);
      errors++;
    }

    await sleep(300);
  }

  console.log('\n' + '='.repeat(60));
  console.log('PROCESO COMPLETADO');
  console.log('='.repeat(60));
  console.log(`Productos actualizados: ${productsUpdated}`);
  console.log(`Variaciones actualizadas: ${variationsUpdated}`);
  console.log(`Errores: ${errors}`);
}

main().catch(console.error);
