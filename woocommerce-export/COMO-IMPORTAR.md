# Importar Productos a Otra Tienda WooCommerce

## Archivos Disponibles

- `products.json` - 219 productos con todas sus variaciones
- `categories.json` - 29 categorías
- `images/` - 795 imágenes descargadas

## Opción 1: Script de Importación (Recomendado)

Crear un script `import-products.mjs` con las credenciales de la nueva tienda:

```javascript
// Configurar estas variables con la nueva tienda
const NEW_WOO_URL = 'https://nueva-tienda.com/wp-json/wc/v3';
const NEW_CONSUMER_KEY = 'ck_xxxxx';
const NEW_CONSUMER_SECRET = 'cs_xxxxx';
```

El script debe:
1. Crear las categorías primero
2. Subir las imágenes al media library de WordPress
3. Crear los productos simples
4. Crear los productos variables con sus variaciones

## Opción 2: Importación CSV desde WooCommerce

1. Convertir `products.json` a CSV
2. Ir a WooCommerce > Productos > Importar
3. Subir el CSV
4. Las imágenes deben estar accesibles vía URL o subirlas manualmente

## Opción 3: Plugin All-in-One WP Migration

1. Exportar solo la tabla `wp_posts` (productos) y `wp_postmeta`
2. Incluir la carpeta `wp-content/uploads` con las imágenes

## Datos Importantes de Esta Exportación

- **Fecha de extracción:** 2025-12-02
- **Tienda origen:** https://billardramirez.cl
- **Total productos:** 219 (174 simples + 45 variables)
- **Total variaciones:** 210
- **Total imágenes:** 795

## Estructura de Cada Producto en products.json

```json
{
  "id": 6345,
  "name": "Nombre del producto",
  "slug": "slug-producto",
  "type": "simple|variable",
  "status": "publish",
  "description": "...",
  "short_description": "...",
  "sku": "SKU123",
  "price": "50000",
  "regular_price": "50000",
  "sale_price": "",
  "categories": [...],
  "images": [
    {
      "id": 4636,
      "src": "https://...",
      "local_path": "images/product_6345_4636.png"
    }
  ],
  "attributes": [...],
  "variation_data": [...]  // Solo en productos variables
}
```

## Comando para Re-exportar

Si necesitas volver a exportar desde billardramirez.cl:

```bash
node scripts/extract-woocommerce-products.mjs
```

Las credenciales están en el archivo `.env` del proyecto.
