import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales WooCommerce
const WOO_URL = 'https://franciscal46.sg-host.com/demosle/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_242164facc9f783593eefe77dd2528bca417617b';
const CONSUMER_SECRET = 'cs_90a59117ac53a889e186a6b79f4451b4b411b29a';

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

// Obtener todos los medios de WordPress via WooCommerce system status
async function getAllMedia() {
  console.log('📥 Obteniendo medios existentes...\n');

  // Usamos la API de WooCommerce para obtener productos con imágenes
  // y extraemos las URLs de las imágenes que ya existen
  let page = 1;
  let allProducts = [];

  while (true) {
    const products = await wooRequest('GET', `/products?per_page=100&page=${page}`);
    if (products.length === 0) break;
    allProducts.push(...products);
    page++;
    await sleep(200);
  }

  // Crear mapa de imágenes existentes por nombre de archivo
  const mediaMap = new Map();

  for (const product of allProducts) {
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        // Extraer nombre del archivo de la URL
        const urlParts = img.src.split('/');
        const filename = urlParts[urlParts.length - 1].split('?')[0];
        // Normalizar nombre (quitar dimensiones como -300x300)
        const normalizedName = filename.replace(/-\d+x\d+\./, '.');

        mediaMap.set(normalizedName, {
          id: img.id,
          src: img.src,
          name: img.name,
          alt: img.alt
        });

        // También guardar con nombre original
        mediaMap.set(filename, {
          id: img.id,
          src: img.src,
          name: img.name,
          alt: img.alt
        });
      }
    }
  }

  console.log(`  📷 ${mediaMap.size} imágenes únicas encontradas en productos\n`);
  return mediaMap;
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔗 ASIGNACIÓN DE IMÁGENES A PRODUCTOS SINCRONIZADOS');
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

  console.log(`📦 Productos sincronizados a procesar: ${productIds.length}\n`);

  // Obtener medios existentes
  const mediaMap = await getAllMedia();

  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < productIds.length; i++) {
    const oldId = productIds[i];
    const product = syncedProducts[oldId];
    const newId = product.newId;

    if (!product.oldImages || product.oldImages.length === 0) {
      continue;
    }

    console.log(`[${i + 1}/${productIds.length}] Producto ID: ${newId}`);

    // Buscar imágenes correspondientes en los medios existentes
    const matchedImages = [];

    for (const oldImg of product.oldImages) {
      if (!oldImg.local_path) continue;

      // Obtener nombre del archivo local
      let localFilename = path.basename(oldImg.local_path);

      // Intentar buscar con extensión .jpg si era .png (por compresión)
      const jpgFilename = localFilename.replace('.png', '.jpg');

      // Buscar en el mapa de medios
      let found = mediaMap.get(localFilename) || mediaMap.get(jpgFilename);

      // Si no se encuentra, buscar por patrón del ID del producto
      if (!found) {
        // El formato es product_OLDID_IMAGEID.ext
        const pattern = localFilename.replace(/\.[^.]+$/, '');
        for (const [key, value] of mediaMap.entries()) {
          if (key.includes(pattern) || key.replace(/-\d+x\d+/, '').includes(pattern)) {
            found = value;
            break;
          }
        }
      }

      if (found) {
        matchedImages.push({
          id: found.id,
          src: found.src,
          name: oldImg.name || found.name,
          alt: oldImg.alt || found.alt || ''
        });
      }
    }

    if (matchedImages.length > 0) {
      try {
        await wooRequest('PUT', `/products/${newId}`, { images: matchedImages });
        console.log(`  ✅ ${matchedImages.length} imágenes asignadas`);
        updated++;
      } catch (error) {
        console.log(`  ❌ Error: ${error.message.substring(0, 50)}`);
      }
    } else {
      console.log(`  ⏭️  Sin imágenes coincidentes`);
      skipped++;
    }

    await sleep(300);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ ASIGNACIÓN COMPLETADA');
  console.log('═'.repeat(60));
  console.log(`📦 Productos actualizados: ${updated}`);
  console.log(`⏭️  Sin imágenes: ${skipped}`);
}

main().catch(console.error);
