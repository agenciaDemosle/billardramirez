# 📊 Implementación de Analítica - Billard Ramirez

## ✅ Archivos Creados

### 1. Configuración GTM
- `/analytics/gtm-container-billard.json` - Contenedor completo de GTM con todos los tags, triggers y variables
- `/analytics/gtm-meta-pixel-deduplication.json` - Configuración de deduplicación para Meta Pixel

### 2. Hook de Analítica
- `/src/hooks/useAnalytics.ts` - Hook completo con todas las funciones de tracking

### 3. IDs Configurados
- **GTM ID**: `GTM-WM6F6DHP`
- **GA4 ID**: `G-XZJJ1KT7KJ`
- **Meta Pixel ID**: `1319147365456724`

---

## 🚀 Implementación Realizada

### ✅ 1. GTM Instalado
- Script de GTM agregado en `index.html` (head y body)
- Se ejecuta en todas las páginas

### ✅ 2. Hook useAnalytics Integrado
- Importado y ejecutado en `App.tsx` mediante `AnalyticsProvider`
- Auto-tracking activo para:
  - Page views
  - Scroll depth (25%, 50%, 75%, 100%)
  - Engagement time (10s, 30s, 1min, 2min, 5min)
  - Section visibility
  - Hash changes

### ✅ 3. Tracking de E-commerce
**ProductDetail.tsx**:
- ✅ `trackViewContent()` - Se ejecuta automáticamente al ver un producto
- ✅ `trackAddToCart()` - Se ejecuta al agregar al carrito

### ✅ 4. Tracking de Conversiones
**WhatsAppButton.tsx**:
- ✅ `trackWhatsAppClick()` - Tracking del botón flotante de WhatsApp

---

## 📝 Próximos Pasos para Completar

### 1. Importar Contenedor GTM
1. Ir a [Google Tag Manager](https://tagmanager.google.com/)
2. Seleccionar el contenedor `GTM-WM6F6DHP`
3. Ir a **Admin** → **Import Container**
4. Subir el archivo `/analytics/gtm-container-billard.json`
5. Elegir **Merge** y **Rename conflicting tags**
6. Publicar el contenedor

### 2. Configurar Meta Pixel (Server-Side)
Para evitar bloqueadores de anuncios, necesitas configurar el Meta Conversions API (CAPI):

**Opción A: Usar endpoint PHP propio**
1. Crear archivo `/api/capi.php` en tu servidor
2. Copiar el siguiente código:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Meta Pixel Conversions API
$PIXEL_ID = '1319147365456724';
$ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI'; // Obtener de Meta Business

$data = json_decode(file_get_contents('php://input'), true);

$url = "https://graph.facebook.com/v18.0/{$PIXEL_ID}/events?access_token={$ACCESS_TOKEN}";

$response = file_get_contents($url, false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data)
    ]
]));

echo $response;
?>
```

3. Obtener el Access Token:
   - Ir a [Meta Business Suite](https://business.facebook.com/)
   - Settings → Data Sources → Pixels
   - Seleccionar tu Pixel `1319147365456724`
   - Conversions API → Generate Access Token

4. Actualizar la variable de entorno:
```env
VITE_CAPI_ENDPOINT=/api/capi.php
```

**Opción B: Usar Zapier/Make (No-Code)**
1. Crear un Webhook en Zapier/Make
2. Conectar con Meta Conversions API
3. Actualizar la variable de entorno con la URL del webhook

### 3. Agregar Tracking Adicional (Opcional)

#### Checkout y Purchase
En `/src/pages/Checkout.tsx`:

```typescript
import { trackInitiateCheckout, trackPurchase } from '../hooks/useAnalytics';

// Al iniciar el checkout
useEffect(() => {
  trackInitiateCheckout({
    cart_total: totalAmount,
    num_items: cartItems.length,
    product_ids: cartItems.map(item => item.id.toString()),
  });
}, []);

// Al confirmar la compra
const handleConfirmPurchase = (orderId: string) => {
  trackPurchase({
    transaction_id: orderId,
    value: totalAmount,
    num_items: cartItems.length,
    product_ids: cartItems.map(item => item.id.toString()),
    product_names: cartItems.map(item => item.name),
    email: customerEmail,
    phone: customerPhone,
    firstName: customerFirstName,
    lastName: customerLastName,
  });
};
```

#### Formulario de Contacto
En `/src/pages/Contacto.tsx`:

```typescript
import { trackContactSubmit } from '../hooks/useAnalytics';

const handleSubmit = (data: FormData) => {
  trackContactSubmit({
    form_name: 'contacto',
    service_interested: data.interest,
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
  });
};
```

#### CTAs Personalizados
Para cualquier botón importante:

```typescript
import { trackCTAClick } from '../hooks/useAnalytics';

<button onClick={() => {
  trackCTAClick(
    'Ver Catálogo',
    'hero_section',
    'primary'
  );
}}>
  Ver Catálogo
</button>
```

---

## 🧪 Testing y Verificación

### 1. Verificar GTM
1. Instalar [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Abrir tu sitio web
3. Click en la extensión → **Enable** → **Record**
4. Navegar por el sitio
5. Verificar que los tags se disparen correctamente

### 2. Verificar GA4
1. Ir a [Google Analytics](https://analytics.google.com/)
2. Reportes → Tiempo real
3. Navegar por el sitio y ver eventos en tiempo real

### 3. Verificar Meta Pixel
1. Instalar [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Abrir tu sitio web
3. Click en la extensión
4. Verificar eventos:
   - PageView (automático)
   - ViewContent (al ver producto)
   - AddToCart (al agregar al carrito)
   - Contact (al hacer clic en WhatsApp)

### 4. Verificar DataLayer
Abrir la consola del navegador y ejecutar:
```javascript
console.log(window.dataLayer);
```

Deberías ver eventos como:
```javascript
[
  { event: 'page_view', page_path: '/', page_type: 'home' },
  { event: 'view_content', product_id: '123', product_name: 'Mesa Pool' },
  { event: 'add_to_cart', product_id: '123', value: 500000 },
  // etc...
]
```

---

## 📊 Eventos Configurados

### E-commerce Events
| Evento | Trigger | Ubicación |
|--------|---------|-----------|
| `view_content` | Al ver producto | ProductDetail.tsx |
| `add_to_cart` | Al agregar al carrito | ProductDetail.tsx |
| `initiate_checkout` | Al ir a checkout | (Por implementar) |
| `purchase` | Al completar compra | (Por implementar) |

### Conversion Events
| Evento | Trigger | Ubicación |
|--------|---------|-----------|
| `whatsapp_click` | Click en WhatsApp | WhatsAppButton.tsx |
| `phone_click` | Click en teléfono | (Por implementar) |
| `contact_submit` | Enviar formulario | (Por implementar) |

### Engagement Events
| Evento | Trigger | Ubicación |
|--------|---------|-----------|
| `page_view` | Cambio de página | Auto (useAnalytics) |
| `scroll_depth` | Scroll 25/50/75/100% | Auto (useAnalytics) |
| `engagement_time` | 10s/30s/1min/2min/5min | Auto (useAnalytics) |
| `section_view` | Sección visible 50% | Auto (useAnalytics) |

---

## 🔧 Troubleshooting

### Los eventos no aparecen en GA4
1. Verificar que GTM esté publicado
2. Verificar que el GA4 ID sea correcto en GTM
3. Esperar 24-48 horas para datos históricos

### Los eventos no aparecen en Meta
1. Verificar que el Pixel ID sea correcto
2. Verificar que el dominio esté verificado en Meta Business
3. Revisar la consola del navegador para errores

### CAPI no funciona
1. Verificar que el Access Token sea válido
2. Verificar que el endpoint CAPI esté accesible
3. Revisar logs del servidor PHP

---

## 📚 Recursos

- [Documentación GTM](https://support.google.com/tagmanager)
- [Documentación GA4](https://support.google.com/analytics)
- [Documentación Meta Pixel](https://developers.facebook.com/docs/meta-pixel)
- [Documentación Meta CAPI](https://developers.facebook.com/docs/marketing-api/conversions-api)

---

## ✅ Checklist de Implementación

- [x] GTM instalado en index.html
- [x] Hook useAnalytics creado
- [x] Hook useAnalytics integrado en App.tsx
- [x] Tracking de productos (view_content, add_to_cart)
- [x] Tracking de WhatsApp
- [ ] Importar contenedor GTM
- [ ] Publicar contenedor GTM
- [ ] Configurar Meta CAPI
- [ ] Agregar tracking de checkout
- [ ] Agregar tracking de purchase
- [ ] Agregar tracking de formulario de contacto
- [ ] Testear todos los eventos
- [ ] Verificar eventos en GA4
- [ ] Verificar eventos en Meta

---

**Última actualización**: 2025-12-05
**Desarrollador**: Agencia Demosle
