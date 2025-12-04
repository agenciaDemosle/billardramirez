import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales WooCommerce
const WOO_URL = 'https://billardramirez.cl/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_4482581507c1579a02cabd2be1fcb7c39e9edbb1';
const CONSUMER_SECRET = 'cs_edf7df5719807ee8b4405f2ee5b31f31cca7fac8';

// Directorio para guardar datos
const OUTPUT_DIR = path.join(__dirname, '..', 'woocommerce-export');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

// Crear directorios si no existen
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Hacer petición a la API de WooCommerce
 */
function wooRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WOO_URL}${endpoint}`);
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    https.get(url.toString(), (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const totalPages = res.headers['x-wp-totalpages'];
          const totalItems = res.headers['x-wp-total'];
          resolve({
            data: JSON.parse(data),
            totalPages: parseInt(totalPages) || 1,
            totalItems: parseInt(totalItems) || 0
          });
        } catch (e) {
          reject(new Error(`Error parsing response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Descargar imagen
 */
function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(IMAGES_DIR, filename);

    // Si ya existe, no descargar de nuevo
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭️  Imagen ya existe: ${filename}`);
      resolve(filepath);
      return;
    }

    const file = fs.createWriteStream(filepath);

    https.get(imageUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Seguir redirección
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`  ✅ Descargada: ${filename}`);
            resolve(filepath);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`  ✅ Descargada: ${filename}`);
          resolve(filepath);
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Obtener todas las variaciones de un producto
 */
async function getProductVariations(productId) {
  const variations = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data, totalPages } = await wooRequest(`/products/${productId}/variations`, {
      per_page: 100,
      page: page
    });

    variations.push(...data);
    hasMore = page < totalPages;
    page++;
  }

  return variations;
}

/**
 * Obtener todos los productos
 */
async function getAllProducts() {
  const products = [];
  let page = 1;
  let hasMore = true;

  console.log('🔍 Obteniendo productos de WooCommerce...\n');

  // Primera petición para saber el total
  const firstResponse = await wooRequest('/products', { per_page: 100, page: 1 });
  console.log(`📦 Total de productos encontrados: ${firstResponse.totalItems}`);
  console.log(`📄 Total de páginas: ${firstResponse.totalPages}\n`);

  while (hasMore) {
    console.log(`📥 Descargando página ${page}/${firstResponse.totalPages}...`);

    const { data, totalPages } = await wooRequest('/products', {
      per_page: 100,
      page: page
    });

    products.push(...data);
    hasMore = page < totalPages;
    page++;
  }

  return products;
}

/**
 * Obtener todas las categorías
 */
async function getAllCategories() {
  const categories = [];
  let page = 1;
  let hasMore = true;

  console.log('\n📂 Obteniendo categorías...');

  while (hasMore) {
    const { data, totalPages } = await wooRequest('/products/categories', {
      per_page: 100,
      page: page
    });

    categories.push(...data);
    hasMore = page < totalPages;
    page++;
  }

  console.log(`✅ ${categories.length} categorías encontradas\n`);
  return categories;
}

/**
 * Obtener todos los atributos
 */
async function getAllAttributes() {
  console.log('🏷️  Obteniendo atributos...');

  const { data: attributes } = await wooRequest('/products/attributes', { per_page: 100 });

  // Para cada atributo, obtener sus términos
  for (const attr of attributes) {
    const { data: terms } = await wooRequest(`/products/attributes/${attr.id}/terms`, { per_page: 100 });
    attr.terms = terms;
  }

  console.log(`✅ ${attributes.length} atributos encontrados\n`);
  return attributes;
}

/**
 * Función principal
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('🛒 EXTRACTOR DE PRODUCTOS WOOCOMMERCE');
  console.log('═'.repeat(60));
  console.log(`📍 Tienda: ${WOO_URL}`);
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}\n`);

  try {
    // 1. Obtener categorías
    const categories = await getAllCategories();

    // 2. Obtener atributos
    const attributes = await getAllAttributes();

    // 3. Obtener todos los productos
    const products = await getAllProducts();

    console.log('\n🔄 Procesando productos y variaciones...\n');

    // 4. Para cada producto, obtener variaciones si es variable
    const productsWithVariations = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`[${i + 1}/${products.length}] ${product.name}`);

      // Si es un producto variable, obtener variaciones
      if (product.type === 'variable' && product.variations.length > 0) {
        console.log(`  📊 Obteniendo ${product.variations.length} variaciones...`);
        product.variation_data = await getProductVariations(product.id);
      }

      // Descargar imágenes del producto
      if (product.images && product.images.length > 0) {
        console.log(`  🖼️  Descargando ${product.images.length} imágenes...`);

        for (const image of product.images) {
          if (image.src) {
            const ext = path.extname(new URL(image.src).pathname) || '.jpg';
            const filename = `product_${product.id}_${image.id}${ext}`;

            try {
              await downloadImage(image.src, filename);
              image.local_path = `images/${filename}`;
            } catch (err) {
              console.log(`  ❌ Error descargando imagen: ${err.message}`);
            }
          }
        }
      }

      // Descargar imágenes de variaciones
      if (product.variation_data) {
        for (const variation of product.variation_data) {
          if (variation.image && variation.image.src) {
            const ext = path.extname(new URL(variation.image.src).pathname) || '.jpg';
            const filename = `variation_${variation.id}${ext}`;

            try {
              await downloadImage(variation.image.src, filename);
              variation.image.local_path = `images/${filename}`;
            } catch (err) {
              console.log(`  ❌ Error descargando imagen de variación: ${err.message}`);
            }
          }
        }
      }

      productsWithVariations.push(product);
    }

    // 5. Guardar todo en archivos JSON
    console.log('\n💾 Guardando datos...\n');

    // Productos completos
    const productsFile = path.join(OUTPUT_DIR, 'products.json');
    fs.writeFileSync(productsFile, JSON.stringify(productsWithVariations, null, 2));
    console.log(`✅ Productos guardados en: ${productsFile}`);

    // Categorías
    const categoriesFile = path.join(OUTPUT_DIR, 'categories.json');
    fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
    console.log(`✅ Categorías guardadas en: ${categoriesFile}`);

    // Atributos
    const attributesFile = path.join(OUTPUT_DIR, 'attributes.json');
    fs.writeFileSync(attributesFile, JSON.stringify(attributes, null, 2));
    console.log(`✅ Atributos guardados en: ${attributesFile}`);

    // Resumen
    const summary = {
      extracted_at: new Date().toISOString(),
      source_url: WOO_URL,
      totals: {
        products: productsWithVariations.length,
        categories: categories.length,
        attributes: attributes.length,
        variable_products: productsWithVariations.filter(p => p.type === 'variable').length,
        simple_products: productsWithVariations.filter(p => p.type === 'simple').length,
        total_variations: productsWithVariations.reduce((acc, p) => acc + (p.variation_data?.length || 0), 0)
      }
    };

    const summaryFile = path.join(OUTPUT_DIR, 'summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

    console.log('\n' + '═'.repeat(60));
    console.log('✅ EXTRACCIÓN COMPLETADA');
    console.log('═'.repeat(60));
    console.log(`📦 Productos: ${summary.totals.products}`);
    console.log(`   - Simples: ${summary.totals.simple_products}`);
    console.log(`   - Variables: ${summary.totals.variable_products}`);
    console.log(`   - Total variaciones: ${summary.totals.total_variations}`);
    console.log(`📂 Categorías: ${summary.totals.categories}`);
    console.log(`🏷️  Atributos: ${summary.totals.attributes}`);
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('401')) {
      console.error('   Las credenciales de la API pueden ser inválidas.');
    }
    process.exit(1);
  }
}

main();
