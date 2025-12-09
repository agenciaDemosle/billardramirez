import https from 'https';

// Credenciales WooCommerce
const WOO_URL = 'https://billardramirez.cl/demosle/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_57c51a3c2900ff48d7575214327f91f0061cf49e';
const CONSUMER_SECRET = 'cs_780649d7149b939bfc874b7ac8301ca501300d20';

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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  try {
    // 1. Crear categoría Llaveros
    console.log('Creando/verificando categoría Llaveros...');
    const categories = await wooRequest('GET', '/products/categories?per_page=100');

    let llaverosCategory = categories.find(c => c.slug === 'llaveros');
    if (!llaverosCategory) {
      llaverosCategory = await wooRequest('POST', '/products/categories', {
        name: 'Llaveros',
        slug: 'llaveros',
        description: 'Llaveros decorativos de billar'
      });
      console.log(`  Categoría Llaveros creada con ID: ${llaverosCategory.id}`);
    } else {
      console.log(`  Categoría Llaveros ya existe con ID: ${llaverosCategory.id}`);
    }

    // 2. Crear categoría Ceniceros
    console.log('Creando/verificando categoría Ceniceros...');
    let cenicerosCategory = categories.find(c => c.slug === 'ceniceros');
    if (!cenicerosCategory) {
      cenicerosCategory = await wooRequest('POST', '/products/categories', {
        name: 'Ceniceros',
        slug: 'ceniceros',
        description: 'Ceniceros decorativos de billar'
      });
      console.log(`  Categoría Ceniceros creada con ID: ${cenicerosCategory.id}`);
    } else {
      console.log(`  Categoría Ceniceros ya existe con ID: ${cenicerosCategory.id}`);
    }

    // 3. Buscar y asignar productos de llaveros
    console.log('\nBuscando productos de llaveros...');
    const allProducts = await wooRequest('GET', '/products?per_page=100');

    const llaveroProducts = allProducts.filter(p =>
      p.name.toLowerCase().includes('llavero')
    );

    console.log(`  Encontrados ${llaveroProducts.length} productos de llaveros`);

    for (const product of llaveroProducts) {
      const hasCategory = product.categories.some(c => c.id === llaverosCategory.id);
      if (!hasCategory) {
        const updatedCategories = [
          ...product.categories.map(c => ({ id: c.id })),
          { id: llaverosCategory.id }
        ];
        await wooRequest('PUT', `/products/${product.id}`, { categories: updatedCategories });
        console.log(`  -> Agregado a Llaveros: ${product.name}`);
      } else {
        console.log(`  -> Ya en Llaveros: ${product.name}`);
      }
    }

    // 4. Buscar y asignar productos de ceniceros
    console.log('\nBuscando productos de ceniceros...');
    const ceniceroProducts = allProducts.filter(p =>
      p.name.toLowerCase().includes('cenicero')
    );

    console.log(`  Encontrados ${ceniceroProducts.length} productos de ceniceros`);

    for (const product of ceniceroProducts) {
      const hasCategory = product.categories.some(c => c.id === cenicerosCategory.id);
      if (!hasCategory) {
        const updatedCategories = [
          ...product.categories.map(c => ({ id: c.id })),
          { id: cenicerosCategory.id }
        ];
        await wooRequest('PUT', `/products/${product.id}`, { categories: updatedCategories });
        console.log(`  -> Agregado a Ceniceros: ${product.name}`);
      } else {
        console.log(`  -> Ya en Ceniceros: ${product.name}`);
      }
    }

    // 5. Actualizar conteos
    console.log('\nActualizando conteos de categorías...');
    await wooRequest('PUT', `/products/categories/${llaverosCategory.id}`, { description: 'Llaveros decorativos de billar' });
    await wooRequest('PUT', `/products/categories/${cenicerosCategory.id}`, { description: 'Ceniceros decorativos de billar' });

    console.log('\n¡Proceso completado!');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
