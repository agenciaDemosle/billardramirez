import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales nueva tienda WooCommerce
const WOO_URL = 'https://billardramirez.cl/demosle/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_947e023f1ba9971e157c4b4d434d687d3d52d21d';
const CONSUMER_SECRET = 'cs_21641a05eecab3f979a3958036985e5f69f076cf';

// Directorio de datos exportados
const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');

// Mapeo de IDs antiguos a nuevos
const categoryMap = new Map();
const productMap = new Map();

/**
 * Hacer petición a la API de WooCommerce
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
      headers: {
        'Content-Type': 'application/json',
      }
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
          reject(new Error(`Error parsing response: ${e.message} - ${responseData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Esperar un tiempo
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Importar categorías (sin imágenes)
 */
async function importCategories() {
  console.log('\n📂 IMPORTANDO CATEGORÍAS...\n');

  const categoriesFile = path.join(EXPORT_DIR, 'categories.json');
  const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));

  // Ordenar por parent (primero las raíz)
  const sortedCategories = categories.sort((a, b) => a.parent - b.parent);

  for (const cat of sortedCategories) {
    try {
      const newCatData = {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        parent: cat.parent ? (categoryMap.get(cat.parent) || 0) : 0
      };

      const newCat = await wooRequest('POST', '/products/categories', newCatData);
      categoryMap.set(cat.id, newCat.id);
      console.log(`  ✅ ${cat.name} (${cat.id} → ${newCat.id})`);

      await sleep(200);
    } catch (error) {
      if (error.message.includes('already exists')) {
        const existing = await wooRequest('GET', `/products/categories?slug=${cat.slug}`);
        if (existing && existing.length > 0) {
          categoryMap.set(cat.id, existing[0].id);
          console.log(`  ⏭️  ${cat.name} ya existe (${cat.id} → ${existing[0].id})`);
        }
      } else {
        console.log(`  ❌ Error en ${cat.name}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Categorías procesadas: ${categoryMap.size}/${categories.length}`);
}

/**
 * Preparar datos del producto para importar (SIN IMÁGENES)
 */
function prepareProductData(product) {
  const data = {
    name: product.name,
    slug: product.slug,
    type: product.type,
    status: product.status,
    featured: product.featured,
    catalog_visibility: product.catalog_visibility,
    description: product.description,
    short_description: product.short_description,
    sku: product.sku || '',
    regular_price: product.regular_price || '',
    sale_price: product.sale_price || '',
    manage_stock: product.manage_stock,
    stock_quantity: product.stock_quantity,
    stock_status: product.stock_status,
    weight: product.weight || '',
    dimensions: product.dimensions || {},
    tax_status: product.tax_status,
    tax_class: product.tax_class,
  };

  // Mapear categorías
  if (product.categories && product.categories.length > 0) {
    data.categories = product.categories
      .map(cat => ({ id: categoryMap.get(cat.id) }))
      .filter(cat => cat.id);
  }

  // Atributos para productos variables
  if (product.type === 'variable' && product.attributes) {
    data.attributes = product.attributes.map(attr => ({
      name: attr.name,
      position: attr.position,
      visible: attr.visible,
      variation: attr.variation,
      options: attr.options
    }));
  }

  return data;
}

/**
 * Preparar datos de variación (SIN IMÁGENES)
 */
function prepareVariationData(variation) {
  return {
    sku: variation.sku || '',
    regular_price: variation.regular_price || '',
    sale_price: variation.sale_price || '',
    manage_stock: variation.manage_stock,
    stock_quantity: variation.stock_quantity,
    stock_status: variation.stock_status,
    weight: variation.weight || '',
    dimensions: variation.dimensions || {},
    attributes: variation.attributes.map(attr => ({
      name: attr.name,
      option: attr.option
    }))
  };
}

/**
 * Importar un producto
 */
async function importProduct(product, index, total) {
  const prefix = `[${index + 1}/${total}]`;

  try {
    console.log(`${prefix} ${product.name}`);

    const productData = prepareProductData(product);
    const newProduct = await wooRequest('POST', '/products', productData);
    productMap.set(product.id, {
      newId: newProduct.id,
      oldImages: product.images,
      variations: product.variation_data
    });

    console.log(`  ✅ Creado (ID: ${newProduct.id})`);

    // Si es variable, crear variaciones
    if (product.type === 'variable' && product.variation_data && product.variation_data.length > 0) {
      console.log(`  📊 Creando ${product.variation_data.length} variaciones...`);

      for (const variation of product.variation_data) {
        try {
          const variationData = prepareVariationData(variation);
          const newVar = await wooRequest('POST', `/products/${newProduct.id}/variations`, variationData);

          // Guardar mapeo de variación para imágenes después
          if (!productMap.get(product.id).variationMap) {
            productMap.get(product.id).variationMap = new Map();
          }
          productMap.get(product.id).variationMap.set(variation.id, {
            newId: newVar.id,
            oldImage: variation.image
          });

          await sleep(150);
        } catch (varError) {
          console.log(`    ❌ Error variación: ${varError.message.substring(0, 50)}`);
        }
      }
    }

    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message.substring(0, 100)}`);
    return false;
  }
}

/**
 * Importar todos los productos
 */
async function importProducts() {
  console.log('\n📦 IMPORTANDO PRODUCTOS (sin imágenes)...\n');

  const productsFile = path.join(EXPORT_DIR, 'products.json');
  const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

  let success = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const result = await importProduct(products[i], i, products.length);
    if (result) {
      success++;
    } else {
      failed++;
    }
    await sleep(300);
  }

  console.log(`\n✅ Productos importados: ${success}`);
  console.log(`❌ Productos fallidos: ${failed}`);
}

/**
 * Función principal
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('🛒 IMPORTADOR DE PRODUCTOS WOOCOMMERCE');
  console.log('═'.repeat(60));
  console.log(`📍 Destino: ${WOO_URL}`);
  console.log(`📁 Datos desde: ${EXPORT_DIR}`);
  console.log('⚠️  Importando SIN imágenes (se subirán después)\n');

  // Verificar conexión
  console.log('🔌 Verificando conexión...');
  try {
    const status = await wooRequest('GET', '/system_status');
    console.log(`✅ Conectado a WooCommerce ${status.environment?.version || 'OK'}\n`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }

  // Importar categorías primero
  await importCategories();

  // Importar productos
  await importProducts();

  // Guardar mapeo para referencia e importación de imágenes
  const mappingFile = path.join(EXPORT_DIR, 'import-mapping.json');

  // Convertir Maps a objetos para JSON
  const productMapObj = {};
  productMap.forEach((value, key) => {
    productMapObj[key] = {
      newId: value.newId,
      oldImages: value.oldImages,
      variationMap: value.variationMap ? Object.fromEntries(value.variationMap) : null
    };
  });

  fs.writeFileSync(mappingFile, JSON.stringify({
    imported_at: new Date().toISOString(),
    destination: WOO_URL,
    categories: Object.fromEntries(categoryMap),
    products: productMapObj
  }, null, 2));

  console.log('\n' + '═'.repeat(60));
  console.log('✅ IMPORTACIÓN COMPLETADA (sin imágenes)');
  console.log('═'.repeat(60));
  console.log(`📄 Mapeo guardado en: ${mappingFile}`);
  console.log('\n⚠️  Las imágenes deben subirse manualmente o via FTP a wp-content/uploads');
  console.log('   Luego ejecutar script de actualización de imágenes.');
}

main().catch(console.error);
