import https from 'https';

// Credenciales WooCommerce
const WOO_URL = 'https://billardramirez.cl/demosle/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_57c51a3c2900ff48d7575214327f91f0061cf49e';
const CONSUMER_SECRET = 'cs_780649d7149b939bfc874b7ac8301ca501300d20';

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
          reject(new Error(`Parse error: ${responseData}`));
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

async function main() {
  try {
    // 1. Verificar si la categoría "Boquillas" ya existe
    console.log('Buscando categoría Boquillas...');
    const categories = await wooRequest('GET', '/products/categories?per_page=100');
    let boquillasCategory = categories.find(c => c.slug === 'boquillas');

    if (!boquillasCategory) {
      // Crear la categoría
      console.log('Creando categoría Boquillas...');
      boquillasCategory = await wooRequest('POST', '/products/categories', {
        name: 'Boquillas',
        slug: 'boquillas',
        description: 'Boquillas y suelas embutidas para tacos de billar'
      });
      console.log(`Categoría creada con ID: ${boquillasCategory.id}`);
    } else {
      console.log(`Categoría Boquillas ya existe con ID: ${boquillasCategory.id}`);
    }

    // 2. Buscar el producto "Caja de Suelas Embutidas"
    console.log('\nBuscando producto "Caja de Suelas Embutidas"...');
    const products = await wooRequest('GET', '/products?search=Suelas%20Embutidas&per_page=10');

    const suelasEmbutidas = products.find(p =>
      p.name.includes('Suelas Embutidas') || p.name.includes('suelas embutidas')
    );

    if (!suelasEmbutidas) {
      console.log('Producto no encontrado. Buscando por slug...');
      const productBySlug = await wooRequest('GET', '/products?slug=suela-embutida-en-10mm-11mm-y-12mm-100-unidades');
      if (productBySlug.length > 0) {
        const product = productBySlug[0];
        await updateProductCategory(product, boquillasCategory.id);
      } else {
        console.log('Producto no encontrado');
      }
    } else {
      await updateProductCategory(suelasEmbutidas, boquillasCategory.id);
    }

    // 3. También agregar "Boquilla de Fibra de Carbono" a la categoría
    console.log('\nBuscando producto "Boquilla de Fibra de Carbono"...');
    const boquillaProducts = await wooRequest('GET', '/products?search=Boquilla%20Fibra&per_page=10');

    for (const product of boquillaProducts) {
      if (product.name.toLowerCase().includes('boquilla')) {
        await updateProductCategory(product, boquillasCategory.id);
      }
    }

    console.log('\n¡Proceso completado!');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function updateProductCategory(product, boquillasCategoryId) {
  console.log(`\nActualizando producto: ${product.name} (ID: ${product.id})`);

  // Verificar si ya tiene la categoría
  const hasCategory = product.categories.some(c => c.id === boquillasCategoryId);

  if (hasCategory) {
    console.log('  -> Ya tiene la categoría Boquillas');
    return;
  }

  // Agregar la categoría manteniendo las existentes
  const updatedCategories = [
    ...product.categories.map(c => ({ id: c.id })),
    { id: boquillasCategoryId }
  ];

  await wooRequest('PUT', `/products/${product.id}`, {
    categories: updatedCategories
  });

  console.log('  -> Categoría Boquillas agregada');
}

main();
