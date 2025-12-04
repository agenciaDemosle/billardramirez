<?xml version="1.0" encoding="UTF-8"?>
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
</xsl:stylesheet>