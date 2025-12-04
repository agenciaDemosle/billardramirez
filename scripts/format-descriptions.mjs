/**
 * Script para formatear las descripciones de productos WooCommerce
 * - Quita emojis
 * - Organiza el contenido de forma profesional
 * - NO modifica los textos originales
 */

import 'dotenv/config';

const WOO_URL = process.env.VITE_WOO_URL;
const CONSUMER_KEY = process.env.VITE_WOO_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_WOO_CONSUMER_SECRET;

const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

// Función para hacer requests a WooCommerce
async function wooRequest(endpoint, method = 'GET', data = null) {
  const url = `${WOO_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Función para quitar emojis del texto
function removeEmojis(text) {
  if (!text) return text;

  // Regex comprehensivo para emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]/gu;

  return text.replace(emojiRegex, '').trim();
}

// Función para limpiar y formatear HTML
function formatDescription(html) {
  if (!html || html.trim() === '') return html;

  // Quitar emojis
  let cleaned = removeEmojis(html);

  // Normalizar espacios múltiples
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Limpiar espacios antes/después de tags
  cleaned = cleaned.replace(/>\s+</g, '><');
  cleaned = cleaned.replace(/\s+>/g, '>');
  cleaned = cleaned.replace(/<\s+/g, '<');

  // Limpiar párrafos vacíos
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p>&nbsp;<\/p>/gi, '');

  // Limpiar br múltiples
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');

  // Limpiar espacios dentro de párrafos
  cleaned = cleaned.replace(/<p>\s+/gi, '<p>');
  cleaned = cleaned.replace(/\s+<\/p>/gi, '</p>');

  // Convertir strong/b a formato consistente
  cleaned = cleaned.replace(/<b>/gi, '<strong>');
  cleaned = cleaned.replace(/<\/b>/gi, '</strong>');

  // Limpiar strong vacíos
  cleaned = cleaned.replace(/<strong>\s*<\/strong>/gi, '');

  // Quitar : después de títulos en strong (ej: "Características:" -> "Características")
  // Solo si está al final del strong
  cleaned = cleaned.replace(/<strong>([^<]+):\s*<\/strong>/gi, '<strong>$1</strong>');

  // Asegurar que los headers estén bien formateados
  cleaned = cleaned.replace(/<h(\d)>\s*/gi, '<h$1>');
  cleaned = cleaned.replace(/\s*<\/h(\d)>/gi, '</h$1>');

  // Limpiar listas
  cleaned = cleaned.replace(/<li>\s*/gi, '<li>');
  cleaned = cleaned.replace(/\s*<\/li>/gi, '</li>');
  cleaned = cleaned.replace(/<ul>\s*/gi, '<ul>');
  cleaned = cleaned.replace(/\s*<\/ul>/gi, '</ul>');

  // Quitar atributos de estilo inline (mantener la estructura)
  cleaned = cleaned.replace(/\s*style="[^"]*"/gi, '');

  // Quitar clases inline
  cleaned = cleaned.replace(/\s*class="[^"]*"/gi, '');

  // Trim final
  cleaned = cleaned.trim();

  return cleaned;
}

// Función para formatear descripción corta
function formatShortDescription(html) {
  if (!html || html.trim() === '') return html;

  let cleaned = removeEmojis(html);

  // Mismas limpiezas básicas
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p>&nbsp;<\/p>/gi, '');
  cleaned = cleaned.replace(/\s*style="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*class="[^"]*"/gi, '');

  return cleaned.trim();
}

// Obtener todos los productos
async function getAllProducts() {
  const allProducts = [];
  let page = 1;
  const perPage = 100;

  console.log('Obteniendo productos de WooCommerce...\n');

  while (true) {
    const products = await wooRequest(`/products?per_page=${perPage}&page=${page}&status=publish`);

    if (products.length === 0) break;

    allProducts.push(...products);
    console.log(`  Página ${page}: ${products.length} productos`);
    page++;

    if (products.length < perPage) break;
  }

  console.log(`\nTotal: ${allProducts.length} productos\n`);
  return allProducts;
}

// Procesar un producto
async function processProduct(product, dryRun = true) {
  const originalDesc = product.description || '';
  const originalShortDesc = product.short_description || '';

  const newDesc = formatDescription(originalDesc);
  const newShortDesc = formatShortDescription(originalShortDesc);

  // Verificar si hay cambios
  const descChanged = originalDesc !== newDesc;
  const shortDescChanged = originalShortDesc !== newShortDesc;

  if (!descChanged && !shortDescChanged) {
    return { changed: false };
  }

  if (dryRun) {
    return {
      changed: true,
      descChanged,
      shortDescChanged,
      original: { description: originalDesc, short_description: originalShortDesc },
      new: { description: newDesc, short_description: newShortDesc }
    };
  }

  // Actualizar producto
  const updateData = {};
  if (descChanged) updateData.description = newDesc;
  if (shortDescChanged) updateData.short_description = newShortDesc;

  await wooRequest(`/products/${product.id}`, 'PUT', updateData);

  return { changed: true, updated: true };
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  const showDetails = args.includes('--details');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  console.log('='.repeat(60));
  console.log('FORMATEO DE DESCRIPCIONES - WOOCOMMERCE');
  console.log('='.repeat(60));
  console.log(`Modo: ${dryRun ? 'SIMULACIÓN (dry-run)' : 'APLICAR CAMBIOS'}`);
  if (limit) console.log(`Límite: ${limit} productos`);
  console.log('');

  if (!dryRun) {
    console.log('⚠️  ATENCIÓN: Se aplicarán los cambios en 5 segundos...');
    console.log('    Presiona Ctrl+C para cancelar\n');
    await new Promise(r => setTimeout(r, 5000));
  }

  try {
    let products = await getAllProducts();

    if (limit) {
      products = products.slice(0, limit);
      console.log(`Procesando solo ${limit} productos\n`);
    }

    let changedCount = 0;
    let unchangedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const progress = `[${i + 1}/${products.length}]`;

      try {
        const result = await processProduct(product, dryRun);

        if (result.changed) {
          changedCount++;
          console.log(`${progress} ✓ ${product.name} (ID: ${product.id})`);

          if (showDetails && dryRun) {
            if (result.descChanged) {
              console.log('    Descripción larga: CAMBIOS DETECTADOS');
            }
            if (result.shortDescChanged) {
              console.log('    Descripción corta: CAMBIOS DETECTADOS');
            }
          }
        } else {
          unchangedCount++;
          if (showDetails) {
            console.log(`${progress} - ${product.name} (sin cambios)`);
          }
        }

        // Rate limiting
        if (!dryRun && (i + 1) % 10 === 0) {
          await new Promise(r => setTimeout(r, 1000));
        }

      } catch (error) {
        errorCount++;
        console.log(`${progress} ✗ ${product.name} - Error: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('RESUMEN');
    console.log('='.repeat(60));
    console.log(`Total productos: ${products.length}`);
    console.log(`Con cambios: ${changedCount}`);
    console.log(`Sin cambios: ${unchangedCount}`);
    console.log(`Errores: ${errorCount}`);

    if (dryRun && changedCount > 0) {
      console.log('\nPara aplicar los cambios, ejecuta:');
      console.log('  node scripts/format-descriptions.mjs --apply');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
