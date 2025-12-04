import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Credenciales
const WOO_URL = 'https://franciscal46.sg-host.com/demosle/wp-json/wc/v3';
const WP_URL = 'https://franciscal46.sg-host.com/demosle/wp-json/wp/v2';
const CONSUMER_KEY = 'ck_242164facc9f783593eefe77dd2528bca417617b';
const CONSUMER_SECRET = 'cs_90a59117ac53a889e186a6b79f4451b4b411b29a';
const WP_USER = 'demosle';
const WP_PASS = 'iEGV hOBi OWBb 3Y7t Q9Mf fyJn';
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

const EXPORT_DIR = path.join(__dirname, '..', 'woocommerce-export');
const IMAGES_DIR = path.join(EXPORT_DIR, 'images');
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function uploadToWordPress(filePath, filename) {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      reject(new Error(`Archivo muy grande: ${(stats.size / 1024 / 1024).toFixed(1)}MB`));
      return;
    }
    if (stats.size === 0) {
      reject(new Error('Archivo vacío'));
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';

    const url = new URL(`${WP_URL}/media`);
    const options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Authorization': `Basic ${WP_AUTH}`,
        'Content-Length': fileBuffer.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 400) {
            reject(new Error(`WP ${res.statusCode}: ${parsed.message || 'Error'}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

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

async function main() {
  console.log('═'.repeat(60));
  console.log('🖼️  SUBIDA DE IMÁGENES DE VARIACIONES');
  console.log('═'.repeat(60));

  // Cargar mapeo
  const mappingFile = path.join(EXPORT_DIR, 'sync-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const [oldProductId, product] of Object.entries(mapping.products)) {
    if (!product.variationMap) continue;

    const parentId = product.newId;

    for (const [oldVarId, variation] of Object.entries(product.variationMap)) {
      if (!variation.oldImage || !variation.oldImage.local_path) continue;

      let fullPath = path.join(EXPORT_DIR, variation.oldImage.local_path);

      // Si PNG no existe, buscar JPG
      if (!fs.existsSync(fullPath) && fullPath.endsWith('.png')) {
        const jpgPath = fullPath.replace('.png', '.jpg');
        if (fs.existsSync(jpgPath)) fullPath = jpgPath;
      }

      if (!fs.existsSync(fullPath)) {
        console.log(`⏭️  Variación ${variation.newId}: archivo no existe`);
        skipped++;
        continue;
      }

      try {
        // Verificar si la variación ya tiene imagen
        const currentVar = await wooRequest('GET', `/products/${parentId}/variations/${variation.newId}`);

        if (currentVar.image && currentVar.image.id) {
          console.log(`⏭️  Variación ${variation.newId}: ya tiene imagen (ID: ${currentVar.image.id})`);
          skipped++;
          await sleep(100);
          continue;
        }

        // Subir imagen
        const filename = path.basename(fullPath);
        console.log(`📤 Variación ${variation.newId}: subiendo ${filename}...`);

        const mediaResponse = await uploadToWordPress(fullPath, filename);

        // Asignar a la variación
        await wooRequest('PUT', `/products/${parentId}/variations/${variation.newId}`, {
          image: { id: mediaResponse.id, src: mediaResponse.source_url }
        });

        console.log(`  ✅ Imagen asignada (Media ID: ${mediaResponse.id})`);
        uploaded++;
        await sleep(300);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message.substring(0, 50)}`);
        errors++;
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ PROCESO COMPLETADO');
  console.log('═'.repeat(60));
  console.log(`📤 Subidas: ${uploaded}`);
  console.log(`⏭️  Saltadas: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
}

main().catch(console.error);
