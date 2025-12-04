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

// Normalizar nombre para comparación
function normalizeName(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getAllProducts() {
  let page = 1;
  let allProducts = [];

  while (true) {
    const products = await wooRequest('GET', `/products?per_page=100&page=${page}`);
    if (products.length === 0) break;
    allProducts.push(...products);
    page++;
    await sleep(200);
  }

  return allProducts;
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔗 ASIGNACIÓN DE IMÁGENES POR NOMBRE');
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

  // Obtener todos los productos del servidor destino
  console.log('📥 Obteniendo productos del servidor...');
  const serverProducts = await getAllProducts();
  console.log(`  📦 ${serverProducts.length} productos encontrados\n`);

  // Crear mapa por nombre normalizado
  const productMap = new Map();
  for (const p of serverProducts) {
    const normalized = normalizeName(p.name);
    productMap.set(normalized, p);
  }

  // Cargar mapeo de sincronización (tiene las imágenes originales)
  const mappingFile = path.join(EXPORT_DIR, 'sync-mapping.json');
  if (!fs.existsSync(mappingFile)) {
    console.error('❌ No se encontró sync-mapping.json');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  // Cargar productos originales para obtener nombres
  const productsFile = path.join(EXPORT_DIR, 'products.json');
  const originalProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

  // Crear mapa de productos originales por ID
  const originalMap = new Map();
  for (const p of originalProducts) {
    originalMap.set(p.id.toString(), p);
  }

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  const syncedProducts = mapping.products;
  const productIds = Object.keys(syncedProducts);

  console.log(`📦 Productos a procesar: ${productIds.length}\n`);

  for (let i = 0; i < productIds.length; i++) {
    const oldId = productIds[i];
    const syncData = syncedProducts[oldId];

    // Obtener nombre del producto original
    const originalProduct = originalMap.get(oldId);
    if (!originalProduct) {
      continue;
    }

    const productName = originalProduct.name;
    const normalizedName = normalizeName(productName);

    // Buscar en el servidor destino
    const targetProduct = productMap.get(normalizedName);

    if (!targetProduct) {
      console.log(`[${i + 1}/${productIds.length}] ❌ No encontrado: ${productName.substring(0, 40)}`);
      notFound++;
      continue;
    }

    if (!syncData.oldImages || syncData.oldImages.length === 0) {
      continue;
    }

    console.log(`[${i + 1}/${productIds.length}] ${targetProduct.name.substring(0, 40)} (ID: ${targetProduct.id})`);

    // Construir array de imágenes usando las URLs originales
    const images = syncData.oldImages
      .filter(img => img.src)
      .map(img => ({
        src: img.src,
        name: img.name || '',
        alt: img.alt || ''
      }));

    if (images.length === 0) {
      continue;
    }

    try {
      await wooRequest('PUT', `/products/${targetProduct.id}`, { images });
      console.log(`  ✅ ${images.length} imágenes asignadas`);
      updated++;

      // Procesar variaciones si existen
      if (syncData.variationMap && targetProduct.type === 'variable') {
        // Obtener variaciones del producto destino
        const targetVariations = await wooRequest('GET', `/products/${targetProduct.id}/variations?per_page=100`);

        for (const [oldVarId, variation] of Object.entries(syncData.variationMap)) {
          if (variation.oldImage && variation.oldImage.src) {
            // Buscar variación correspondiente (por atributos o posición)
            // Por simplicidad, asignamos a todas las variaciones la misma imagen si coincide
            for (const tv of targetVariations) {
              if (!tv.image || !tv.image.id) {
                try {
                  await wooRequest('PUT', `/products/${targetProduct.id}/variations/${tv.id}`, {
                    image: {
                      src: variation.oldImage.src,
                      name: variation.oldImage.name || '',
                      alt: variation.oldImage.alt || ''
                    }
                  });
                  await sleep(100);
                } catch (e) {
                  // Silenciar
                }
              }
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
  console.log(`🔍 No encontrados: ${notFound}`);
  console.log(`❌ Errores: ${errors}`);
}

main().catch(console.error);
