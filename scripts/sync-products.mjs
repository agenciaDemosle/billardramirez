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

// Mapeo de IDs
const categoryMap = new Map();

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

async function getExistingProducts() {
  console.log('📥 Obteniendo productos existentes en el servidor...\n');

  let page = 1;
  let allProducts = [];

  while (true) {
    const products = await wooRequest('GET', `/products?per_page=100&page=${page}`);
    if (products.length === 0) break;
    allProducts.push(...products);
    console.log(`  Página ${page}: ${products.length} productos`);
    page++;
    await sleep(200);
  }

  return allProducts;
}

async function getExistingCategories() {
  console.log('📂 Obteniendo categorías existentes...\n');

  let page = 1;
  let allCategories = [];

  while (true) {
    const categories = await wooRequest('GET', `/products/categories?per_page=100&page=${page}`);
    if (categories.length === 0) break;
    allCategories.push(...categories);
    page++;
    await sleep(200);
  }

  return allCategories;
}

async function syncCategories(savedCategories, existingCategories) {
  console.log('\n📂 SINCRONIZANDO CATEGORÍAS...\n');

  // Crear mapa de categorías existentes por slug
  const existingBySlug = new Map();
  for (const cat of existingCategories) {
    existingBySlug.set(cat.slug, cat);
  }

  // Ordenar por parent (primero las raíz)
  const sortedCategories = savedCategories.sort((a, b) => a.parent - b.parent);

  let created = 0;
  let skipped = 0;

  for (const cat of sortedCategories) {
    if (existingBySlug.has(cat.slug)) {
      // Ya existe
      categoryMap.set(cat.id, existingBySlug.get(cat.slug).id);
      console.log(`  ⏭️  ${cat.name} (ya existe)`);
      skipped++;
    } else {
      // Crear nueva
      try {
        const newCatData = {
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          parent: cat.parent ? (categoryMap.get(cat.parent) || 0) : 0
        };

        const newCat = await wooRequest('POST', '/products/categories', newCatData);
        categoryMap.set(cat.id, newCat.id);
        console.log(`  ✅ ${cat.name} (creada)`);
        created++;
        await sleep(200);
      } catch (error) {
        if (error.message.includes('already exists')) {
          const existing = await wooRequest('GET', `/products/categories?slug=${cat.slug}`);
          if (existing && existing.length > 0) {
            categoryMap.set(cat.id, existing[0].id);
            console.log(`  ⏭️  ${cat.name} (encontrada)`);
            skipped++;
          }
        } else {
          console.log(`  ❌ Error en ${cat.name}: ${error.message}`);
        }
      }
    }
  }

  console.log(`\n✅ Categorías: ${created} creadas, ${skipped} existentes`);
}

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

  if (product.categories && product.categories.length > 0) {
    data.categories = product.categories
      .map(cat => ({ id: categoryMap.get(cat.id) }))
      .filter(cat => cat.id);
  }

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

async function main() {
  console.log('═'.repeat(60));
  console.log('🔄 SINCRONIZACIÓN DE PRODUCTOS WOOCOMMERCE');
  console.log('═'.repeat(60));
  console.log(`📍 Servidor: ${WOO_URL}\n`);

  // Verificar conexión
  console.log('🔌 Verificando conexión...');
  try {
    await wooRequest('GET', '/system_status');
    console.log('✅ Conectado\n');
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }

  // Cargar productos guardados
  const productsFile = path.join(EXPORT_DIR, 'products.json');
  const categoriesFile = path.join(EXPORT_DIR, 'categories.json');

  const savedProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  const savedCategories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));

  console.log(`📦 Productos guardados: ${savedProducts.length}`);
  console.log(`📂 Categorías guardadas: ${savedCategories.length}\n`);

  // Obtener productos existentes
  const existingProducts = await getExistingProducts();
  const existingCategories = await getExistingCategories();

  console.log(`\n📦 Productos en servidor: ${existingProducts.length}`);
  console.log(`📂 Categorías en servidor: ${existingCategories.length}`);

  // Crear mapa de productos existentes por nombre (normalizado)
  const existingByName = new Map();
  for (const prod of existingProducts) {
    existingByName.set(prod.name.toLowerCase().trim(), prod);
  }

  // También por slug
  const existingBySlug = new Map();
  for (const prod of existingProducts) {
    existingBySlug.set(prod.slug, prod);
  }

  // Identificar productos faltantes
  const missingProducts = [];
  for (const prod of savedProducts) {
    const nameKey = prod.name.toLowerCase().trim();
    if (!existingByName.has(nameKey) && !existingBySlug.has(prod.slug)) {
      missingProducts.push(prod);
    }
  }

  console.log(`\n🔍 Productos faltantes: ${missingProducts.length}`);

  if (missingProducts.length === 0) {
    console.log('\n✅ Todos los productos ya están en el servidor!');
    return;
  }

  // Sincronizar categorías primero
  await syncCategories(savedCategories, existingCategories);

  // Importar solo los productos faltantes
  console.log('\n📦 IMPORTANDO PRODUCTOS FALTANTES...\n');

  let success = 0;
  let failed = 0;
  const productMap = new Map();

  for (let i = 0; i < missingProducts.length; i++) {
    const product = missingProducts[i];
    const prefix = `[${i + 1}/${missingProducts.length}]`;

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

      success++;
    } catch (error) {
      console.log(`  ❌ Error: ${error.message.substring(0, 100)}`);
      failed++;
    }

    await sleep(300);
  }

  // Guardar mapeo para las imágenes
  const mappingFile = path.join(EXPORT_DIR, 'sync-mapping.json');

  const productMapObj = {};
  productMap.forEach((value, key) => {
    productMapObj[key] = {
      newId: value.newId,
      oldImages: value.oldImages,
      variationMap: value.variationMap ? Object.fromEntries(value.variationMap) : null
    };
  });

  fs.writeFileSync(mappingFile, JSON.stringify({
    synced_at: new Date().toISOString(),
    destination: WOO_URL,
    categories: Object.fromEntries(categoryMap),
    products: productMapObj
  }, null, 2));

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SINCRONIZACIÓN COMPLETADA');
  console.log('═'.repeat(60));
  console.log(`📦 Productos creados: ${success}`);
  console.log(`❌ Fallidos: ${failed}`);
  console.log(`📄 Mapeo guardado en: ${mappingFile}`);
}

main().catch(console.error);
