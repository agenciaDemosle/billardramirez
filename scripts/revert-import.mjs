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

function wooRequest(method, endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WOO_URL}${endpoint}`);
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);
    url.searchParams.append('force', 'true');

    const options = {
      method: method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`Error ${res.statusCode}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🗑️  REVIRTIENDO IMPORTACIÓN...\n');

  // Obtener todos los productos
  let page = 1;
  let allProducts = [];

  while (true) {
    const products = await wooRequest('GET', `/products?per_page=100&page=${page}`);
    if (products.length === 0) break;
    allProducts.push(...products);
    page++;
  }

  console.log(`📦 Productos a eliminar: ${allProducts.length}\n`);

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    try {
      await wooRequest('DELETE', `/products/${product.id}?force=true`);
      console.log(`[${i + 1}/${allProducts.length}] ✅ Eliminado: ${product.name}`);
      await sleep(200);
    } catch (e) {
      console.log(`[${i + 1}/${allProducts.length}] ❌ Error: ${product.name}`);
    }
  }

  // Eliminar categorías creadas
  console.log('\n📂 Eliminando categorías...');
  const categories = await wooRequest('GET', '/products/categories?per_page=100');

  for (const cat of categories) {
    if (cat.id > 15) { // Solo las nuevas
      try {
        await wooRequest('DELETE', `/products/categories/${cat.id}?force=true`);
        console.log(`  ✅ ${cat.name}`);
        await sleep(100);
      } catch (e) {}
    }
  }

  console.log('\n✅ REVERSIÓN COMPLETADA');
}

main().catch(console.error);
