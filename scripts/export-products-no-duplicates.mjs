import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales WooCommerce
const WOO_URL = 'https://billardramirez.cl/demosle/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_947e023f1ba9971e157c4b4d434d687d3d52d21d';
const CONSUMER_SECRET = 'cs_21641a05eecab3f979a3958036985e5f69f076cf';

// Directorio de datos exportados
const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');

// Agente HTTPS que ignora certificados
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  secureProtocol: 'TLSv1_2_method'
});

/**
 * Hacer petición a la API de WooCommerce usando fetch
 */
async function wooRequest(method, endpoint, data = null) {
  const url = new URL(`${WOO_URL}${endpoint}`);
  url.searchParams.append('consumer_key', CONSUMER_KEY);
  url.searchParams.append('consumer_secret', CONSUMER_SECRET);

  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    agent: httpsAgent
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url.toString(), options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${responseData.message || JSON.stringify(responseData)}`);
  }

  return {
    data: responseData,
    headers: Object.fromEntries(response.headers.entries())
  };
}

/**
 * Esperar un tiempo
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtener todos los productos existentes en WooCommerce
 */
async function getExistingProducts() {
  console.log('🔍 Obteniendo productos existentes en WooCommerce...\n');

  const existingProducts = new Map();
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const { data: products, headers } = await wooRequest('GET', `/products?per_page=100&page=${page}`);

      if (products.length === 0) {
        hasMore = false;
      } else {
        for (const product of products) {
          // Guardamos por slug y por SKU para detectar duplicados
          existingProducts.set(product.slug, {
            id: product.id,
            name: product.name,
            sku: product.sku
          });

          if (product.sku) {
            existingProducts.set(`sku:${product.sku}`, {
              id: product.id,
              name: product.name,
              slug: product.slug
            });
          }
        }

        console.log(`  📦 Página ${page}: ${products.length} productos`);

        const totalPages = parseInt(headers['x-wp-totalpages']) || 1;
        if (page >= totalPages) {
          hasMore = false;
        } else {
          page++;
        }

        await sleep(200);
      }
    } catch (error) {
      console.error(`  ❌ Error en página ${page}: ${error.message}`);
      hasMore = false;
    }
  }

  console.log(`\n✅ Total productos existentes: ${existingProducts.size / 2} (aprox)\n`);
  return existingProducts;
}

/**
 * Obtener todas las categorías existentes
 */
async function getExistingCategories() {
  console.log('🔍 Obteniendo categorías existentes...\n');

  const existingCategories = new Map();

  try {
    const { data: categories } = await wooRequest('GET', '/products/categories?per_page=100');

    for (const cat of categories) {
      existingCategories.set(cat.slug, {
        id: cat.id,
        name: cat.name
      });
    }

    console.log(`✅ Total categorías existentes: ${existingCategories.size}\n`);
  } catch (error) {
    console.error(`❌ Error obteniendo categorías: ${error.message}`);
  }

  return existingCategories;
}

/**
 * Filtrar productos del archivo local que no existen en WooCommerce
 */
function filterNewProducts(localProducts, existingProducts) {
  const newProducts = [];
  const duplicates = [];

  for (const product of localProducts) {
    const existsBySlug = existingProducts.has(product.slug);
    const existsBySku = product.sku && existingProducts.has(`sku:${product.sku}`);

    if (existsBySlug || existsBySku) {
      duplicates.push({
        name: product.name,
        slug: product.slug,
        reason: existsBySlug ? 'slug duplicado' : 'SKU duplicado'
      });
    } else {
      newProducts.push(product);
    }
  }

  return { newProducts, duplicates };
}

/**
 * Exportar productos nuevos a un archivo JSON
 */
function exportProductsToJson(products, filename) {
  const outputPath = path.join(EXPORT_DIR, filename);
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
  console.log(`📄 Exportado a: ${outputPath}`);
  return outputPath;
}

/**
 * Función principal
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('🛒 EXPORTADOR DE PRODUCTOS SIN DUPLICADOS');
  console.log('═'.repeat(60));
  console.log(`📍 WooCommerce: ${WOO_URL}`);
  console.log(`📁 Datos desde: ${EXPORT_DIR}\n`);

  // Verificar conexión
  console.log('🔌 Verificando conexión...');
  try {
    const { data: status } = await wooRequest('GET', '/system_status');
    console.log(`✅ Conectado a WooCommerce ${status.environment?.version || 'OK'}\n`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }

  // Leer productos del archivo local
  const productsFile = path.join(EXPORT_DIR, 'products.json');
  if (!fs.existsSync(productsFile)) {
    console.error(`❌ No se encontró el archivo: ${productsFile}`);
    process.exit(1);
  }

  console.log('📖 Leyendo productos locales...');
  const localProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  console.log(`   Total productos en archivo local: ${localProducts.length}\n`);

  // Obtener productos y categorías existentes
  const existingProducts = await getExistingProducts();
  const existingCategories = await getExistingCategories();

  // Filtrar productos nuevos
  console.log('🔄 Filtrando productos duplicados...\n');
  const { newProducts, duplicates } = filterNewProducts(localProducts, existingProducts);

  // Mostrar resumen
  console.log('═'.repeat(60));
  console.log('📊 RESUMEN');
  console.log('═'.repeat(60));
  console.log(`📦 Productos en archivo local: ${localProducts.length}`);
  console.log(`✅ Productos nuevos (a importar): ${newProducts.length}`);
  console.log(`⏭️  Productos duplicados (omitidos): ${duplicates.length}`);
  console.log('');

  // Mostrar duplicados encontrados
  if (duplicates.length > 0) {
    console.log('📋 Productos duplicados omitidos:');
    duplicates.slice(0, 20).forEach((dup, i) => {
      console.log(`   ${i + 1}. ${dup.name} (${dup.reason})`);
    });
    if (duplicates.length > 20) {
      console.log(`   ... y ${duplicates.length - 20} más`);
    }
    console.log('');
  }

  // Exportar productos nuevos
  if (newProducts.length > 0) {
    console.log('💾 Exportando productos nuevos...');
    const outputFile = exportProductsToJson(newProducts, 'products-to-import.json');

    // También exportar el mapeo de categorías
    const categoryMapping = {};
    existingCategories.forEach((value, key) => {
      categoryMapping[key] = value;
    });

    const mappingFile = path.join(EXPORT_DIR, 'category-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(categoryMapping, null, 2));
    console.log(`📄 Mapeo de categorías: ${mappingFile}`);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ EXPORTACIÓN COMPLETADA');
    console.log('═'.repeat(60));
    console.log(`\n📌 Siguiente paso: Ejecutar el script de importación con:`);
    console.log(`   node scripts/import-to-woocommerce.mjs`);
    console.log(`\n   O para importar solo los productos nuevos:`);
    console.log(`   node scripts/import-new-products.mjs`);
  } else {
    console.log('\n✅ No hay productos nuevos para importar.');
    console.log('   Todos los productos del archivo local ya existen en WooCommerce.');
  }

  // Guardar reporte
  const reportFile = path.join(EXPORT_DIR, 'export-report.json');
  fs.writeFileSync(reportFile, JSON.stringify({
    date: new Date().toISOString(),
    source: productsFile,
    totalLocal: localProducts.length,
    existingInWoo: existingProducts.size / 2,
    newProducts: newProducts.length,
    duplicates: duplicates.length,
    duplicatesList: duplicates
  }, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportFile}`);
}

main().catch(console.error);
