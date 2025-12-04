/**
 * GENERADOR DE SITEMAP AVANZADO - BILLARD RAMIREZ
 * ================================================
 * Genera un sitemap.xml optimizado para SEO con:
 * - Prioridades inteligentes por tipo de contenido
 * - Imágenes con metadatos completos
 * - Frecuencias de actualización dinámicas
 * - Soporte para Google Image Sitemap
 * - XSL stylesheet para visualización
 *
 * Ejecutar: node scripts/generate-sitemap.mjs
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WOO_URL = process.env.VITE_WOO_URL;
const CONSUMER_KEY = process.env.VITE_WOO_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_WOO_CONSUMER_SECRET;
const SITE_URL = 'https://billardramirez.cl';

const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

// Prioridades por categoría
const CATEGORY_PRIORITIES = {
  'mesas-de-pool': 0.9,
  'superficie-en-piedra': 0.9,
  'superficie-en-madera': 0.85,
  'tacos': 0.8,
  'bolas-de-pool': 0.8,
  'accesorios': 0.75,
  'tapas-comedor': 0.7,
  'fundas': 0.7,
  'luces': 0.7,
};

async function wooRequest(endpoint) {
  const url = `${WOO_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}` },
  });
  return response.json();
}

async function getAllProducts() {
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const products = await wooRequest(`/products?per_page=100&page=${page}&status=publish`);
    if (products.length === 0) {
      hasMore = false;
    } else {
      allProducts = [...allProducts, ...products];
      page++;
      console.log(`  Obtenidos ${allProducts.length} productos...`);
    }
  }

  return allProducts;
}

async function getAllCategories() {
  let allCategories = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const categories = await wooRequest(`/products/categories?per_page=100&page=${page}&hide_empty=true`);
    if (categories.length === 0) {
      hasMore = false;
    } else {
      allCategories = [...allCategories, ...categories];
      page++;
    }
  }

  return allCategories.filter(cat => cat.slug !== 'uncategorized');
}

function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Determinar prioridad del producto basada en categoría y precio
function getProductPriority(product) {
  const categorySlug = product.categories?.[0]?.slug || '';

  // Mesas de pool tienen máxima prioridad
  if (categorySlug.includes('mesa') || categorySlug.includes('pool') || categorySlug.includes('piedra')) {
    return 0.9;
  }

  // Prioridad por categoría
  if (CATEGORY_PRIORITIES[categorySlug]) {
    return CATEGORY_PRIORITIES[categorySlug];
  }

  // Productos en oferta tienen más prioridad
  if (product.on_sale) {
    return 0.8;
  }

  // Productos destacados
  if (product.featured) {
    return 0.8;
  }

  return 0.7;
}

// Determinar frecuencia de cambio
function getChangeFreq(product) {
  if (product.on_sale) return 'daily';
  if (product.featured) return 'daily';

  const categorySlug = product.categories?.[0]?.slug || '';
  if (categorySlug.includes('mesa')) return 'weekly';

  return 'weekly';
}

async function generateSitemap() {
  console.log('');
  console.log('========================================');
  console.log(' GENERADOR DE SITEMAP AVANZADO');
  console.log(' Billard Ramirez - SEO Optimizado');
  console.log('========================================');
  console.log('');

  const today = new Date().toISOString().split('T')[0];

  // Páginas estáticas con prioridades optimizadas
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0', name: 'Inicio' },
    { loc: '/tienda', changefreq: 'daily', priority: '0.95', name: 'Tienda' },
    { loc: '/mesas-de-pool', changefreq: 'weekly', priority: '0.9', name: 'Mesas de Pool' },
    { loc: '/accesorios', changefreq: 'weekly', priority: '0.85', name: 'Accesorios' },
    { loc: '/cotizador', changefreq: 'monthly', priority: '0.85', name: 'Cotizador' },
    { loc: '/contacto', changefreq: 'monthly', priority: '0.8', name: 'Contacto' },
    { loc: '/atencion-cliente', changefreq: 'monthly', priority: '0.6', name: 'Atención al Cliente' },
    { loc: '/politicas-envio', changefreq: 'monthly', priority: '0.5', name: 'Políticas de Envío' },
    { loc: '/devoluciones', changefreq: 'monthly', priority: '0.5', name: 'Devoluciones' },
    { loc: '/garantia', changefreq: 'monthly', priority: '0.5', name: 'Garantía' },
    { loc: '/terminos-condiciones', changefreq: 'yearly', priority: '0.4', name: 'Términos y Condiciones' },
    { loc: '/politica-privacidad', changefreq: 'yearly', priority: '0.4', name: 'Política de Privacidad' },
  ];

  console.log('Obteniendo datos de WooCommerce...');

  // Obtener productos y categorías
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);

  console.log('');
  console.log(`Total productos: ${products.length}`);
  console.log(`Total categorías: ${categories.length}`);
  console.log('');

  // Generar XML con namespaces completos
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- ============================================ -->
  <!-- SITEMAP BILLARD RAMIREZ                      -->
  <!-- Generado: ${new Date().toISOString()}        -->
  <!-- ============================================ -->

  <!-- PÁGINAS PRINCIPALES -->
`;

  // Agregar páginas estáticas
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Agregar categorías con prioridades inteligentes
  xml += `
  <!-- CATEGORÍAS DE PRODUCTOS -->
`;
  for (const category of categories) {
    const priority = CATEGORY_PRIORITIES[category.slug] || 0.7;
    xml += `  <url>
    <loc>${SITE_URL}/tienda?categoria=${escapeXml(category.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>
`;
  }

  // Separar productos por categoría para mejor organización
  const mesasPool = products.filter(p =>
    p.categories?.some(c => c.slug?.includes('mesa') || c.slug?.includes('pool') || c.slug?.includes('piedra') || c.slug?.includes('madera'))
  );
  const otrosProductos = products.filter(p =>
    !p.categories?.some(c => c.slug?.includes('mesa') || c.slug?.includes('pool') || c.slug?.includes('piedra') || c.slug?.includes('madera'))
  );

  // Agregar mesas de pool primero (mayor prioridad)
  xml += `
  <!-- MESAS DE POOL (${mesasPool.length} productos) - ALTA PRIORIDAD -->
`;
  for (const product of mesasPool) {
    const lastmod = formatDate(product.date_modified || product.date_created);
    const hasImage = product.images && product.images.length > 0;
    const priority = getProductPriority(product);
    const changefreq = getChangeFreq(product);

    xml += `  <url>
    <loc>${SITE_URL}/producto/${escapeXml(product.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>`;

    // Agregar imágenes con metadatos completos
    if (hasImage) {
      for (const image of product.images.slice(0, 5)) {
        const caption = stripHtml(product.short_description || product.description || '').substring(0, 200);
        xml += `
    <image:image>
      <image:loc>${escapeXml(image.src)}</image:loc>
      <image:title>${escapeXml(product.name)} - Billard Ramirez Chile</image:title>
      <image:caption>${escapeXml(caption || `Comprar ${product.name} en Billard Ramirez con envío a todo Chile`)}</image:caption>
    </image:image>`;
      }
    }

    xml += `
  </url>
`;
  }

  // Agregar otros productos
  xml += `
  <!-- OTROS PRODUCTOS (${otrosProductos.length} productos) -->
`;
  for (const product of otrosProductos) {
    const lastmod = formatDate(product.date_modified || product.date_created);
    const hasImage = product.images && product.images.length > 0;
    const priority = getProductPriority(product);
    const changefreq = getChangeFreq(product);

    xml += `  <url>
    <loc>${SITE_URL}/producto/${escapeXml(product.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>`;

    if (hasImage) {
      for (const image of product.images.slice(0, 3)) {
        const caption = stripHtml(product.short_description || '').substring(0, 200);
        xml += `
    <image:image>
      <image:loc>${escapeXml(image.src)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
      <image:caption>${escapeXml(caption || product.name)}</image:caption>
    </image:image>`;
      }
    }

    xml += `
  </url>
`;
  }

  xml += `
</urlset>`;

  // Guardar sitemap
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  // Generar XSL stylesheet para visualización
  await generateXslStylesheet();

  // Estadísticas
  const totalUrls = staticPages.length + categories.length + products.length;

  console.log('========================================');
  console.log(' SITEMAP GENERADO EXITOSAMENTE');
  console.log('========================================');
  console.log('');
  console.log(`Archivo: ${outputPath}`);
  console.log('');
  console.log('Estadísticas:');
  console.log(`  - Páginas estáticas: ${staticPages.length}`);
  console.log(`  - Categorías: ${categories.length}`);
  console.log(`  - Mesas de Pool: ${mesasPool.length}`);
  console.log(`  - Otros productos: ${otrosProductos.length}`);
  console.log(`  - TOTAL URLs: ${totalUrls}`);
  console.log('');

  return { totalUrls, products: products.length, categories: categories.length };
}

async function generateXslStylesheet() {
  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Sitemap XML - Billard Ramirez</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="robots" content="noindex, follow" />
        <style type="text/css">
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 1400px;
            margin: 0 auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          header {
            background: linear-gradient(135deg, #00963c 0%, #006b2b 100%);
            color: white;
            padding: 40px;
          }
          header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
          }
          header p {
            margin: 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .stats {
            display: flex;
            gap: 20px;
            margin-top: 25px;
            flex-wrap: wrap;
          }
          .stat {
            background: rgba(255,255,255,0.15);
            padding: 15px 25px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
          .stat strong {
            font-size: 32px;
            display: block;
            font-weight: 700;
          }
          .stat span {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
          }
          .legend {
            padding: 20px 40px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
          }
          .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          }
          .priority-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }
          .priority-high { background: #28a745; }
          .priority-medium { background: #ffc107; }
          .priority-low { background: #6c757d; }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #f8f9fa;
            text-align: left;
            padding: 15px 20px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #666;
            border-bottom: 2px solid #dee2e6;
            position: sticky;
            top: 0;
          }
          td {
            padding: 12px 20px;
            border-bottom: 1px solid #eee;
            vertical-align: middle;
          }
          tr:hover td {
            background: #f8f9fa;
          }
          a {
            color: #00963c;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .priority-badge.high { background: #d4edda; color: #155724; }
          .priority-badge.medium { background: #fff3cd; color: #856404; }
          .priority-badge.low { background: #e9ecef; color: #495057; }
          .images-count {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: #6c757d;
            background: #f1f3f5;
            padding: 3px 10px;
            border-radius: 12px;
          }
          .changefreq {
            font-size: 12px;
            color: #666;
            text-transform: capitalize;
          }
          footer {
            padding: 30px 40px;
            background: #f8f9fa;
            text-align: center;
            font-size: 13px;
            color: #666;
          }
          footer a {
            color: #00963c;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Sitemap XML - Billard Ramirez</h1>
            <p>Mapa del sitio optimizado para motores de búsqueda. Este archivo ayuda a Google a descubrir e indexar todas las páginas de nuestro sitio.</p>
            <div class="stats">
              <div class="stat">
                <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
                <span>URLs Totales</span>
              </div>
              <div class="stat">
                <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority >= 0.8])"/></strong>
                <span>Alta Prioridad</span>
              </div>
              <div class="stat">
                <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url/image:image)"/></strong>
                <span>Imágenes</span>
              </div>
            </div>
          </header>
          <div class="legend">
            <div class="legend-item">
              <div class="priority-dot priority-high"></div>
              <span>Prioridad Alta (0.8-1.0)</span>
            </div>
            <div class="legend-item">
              <div class="priority-dot priority-medium"></div>
              <span>Prioridad Media (0.5-0.79)</span>
            </div>
            <div class="legend-item">
              <div class="priority-dot priority-low"></div>
              <span>Prioridad Baja (0-0.49)</span>
            </div>
          </div>
          <table>
            <tr>
              <th style="width: 50%">URL</th>
              <th>Prioridad</th>
              <th>Frecuencia</th>
              <th>Modificado</th>
              <th>Imágenes</th>
            </tr>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <xsl:sort select="sitemap:priority" order="descending" data-type="number"/>
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sitemap:priority &gt;= 0.8">
                      <span class="priority-badge high"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority &gt;= 0.5">
                      <span class="priority-badge medium"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="priority-badge low"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
                <td class="changefreq"><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td>
                  <xsl:if test="count(image:image) &gt; 0">
                    <span class="images-count">
                      <xsl:value-of select="count(image:image)"/> img
                    </span>
                  </xsl:if>
                </td>
              </tr>
            </xsl:for-each>
          </table>
          <footer>
            <p>Generado automáticamente por <a href="https://billardramirez.cl">Billard Ramirez</a> | <a href="https://search.google.com/search-console" target="_blank">Google Search Console</a></p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xsl');
  fs.writeFileSync(outputPath, xsl, 'utf-8');
  console.log('XSL Stylesheet generado: sitemap.xsl');
}

// Ejecutar
generateSitemap()
  .then((stats) => {
    console.log('Próximos pasos:');
    console.log('1. Despliega los cambios a producción');
    console.log('2. Ve a Google Search Console');
    console.log('3. Envía el sitemap: https://billardramirez.cl/sitemap.xml');
    console.log('');
  })
  .catch(console.error);
