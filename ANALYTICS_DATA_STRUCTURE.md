# 📊 Estructura de Datos de Analítica - Billard Ramirez

## 🎯 ¿Qué datos estamos enviando a GTM?

---

## 1. **View Content** (Ver Producto)

### Cuándo se dispara:
- Al cargar la página de un producto

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'view_content',

  // ✅ GA4 Format (Standard E-commerce)
  ecommerce: {
    items: [{
      item_id: '123',                    // ID del producto
      item_name: 'Mesa Pool Profesional', // Nombre del producto
      item_category: 'Mesas de Pool',     // Categoría
      price: 850000,                      // Precio unitario
      quantity: 1                         // Cantidad (siempre 1 en view)
    }]
  },

  // ✅ Meta Pixel Format (Backwards Compatible)
  product_id: '123',
  product_name: 'Mesa Pool Profesional',
  product_category: 'Mesas de Pool',
  value: 850000,
  currency: 'CLP',
  event_id: '1733404200000_abc123'       // ID único para deduplicación
});
```

### Variables GTM que capturan estos datos:
- `DL - Product ID` → `product_id`
- `DL - Product Name` → `product_name`
- `DL - Product Category` → `product_category`
- `DL - Value` → `value`
- `DL - Currency` → `currency`
- `DL - Event ID` → `event_id`

---

## 2. **Add to Cart** (Agregar al Carrito)

### Cuándo se dispara:
- Al hacer clic en "Agregar al carrito" (ProductDetail)
- Al hacer clic en "Agregar" en tarjetas de producto (ProductCard)

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'add_to_cart',

  // ✅ GA4 Format
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Mesa Pool Profesional',
      item_category: 'Mesas de Pool',
      price: 850000,                      // Precio unitario
      quantity: 2                         // Cantidad agregada
    }]
  },

  // ✅ Meta Pixel Format
  product_id: '123',
  product_name: 'Mesa Pool Profesional',
  product_category: 'Mesas de Pool',
  value: 1700000,                        // Precio total (precio × cantidad)
  currency: 'CLP',
  quantity: 2,
  event_id: '1733404200001_xyz789'
});
```

### Variables GTM que capturan estos datos:
- `DL - Product ID` → `product_id`
- `DL - Product Name` → `product_name`
- `DL - Product Category` → `product_category`
- `DL - Value` → `value`
- `DL - Currency` → `currency`
- `DL - Quantity` → `quantity` (nuevo)
- `DL - Event ID` → `event_id`

---

## 3. **Initiate Checkout** (Iniciar Checkout)

### Cuándo se dispara:
- Al llegar a la página `/checkout`

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'initiate_checkout',

  // ✅ GA4 Format (Multiple Items)
  ecommerce: {
    items: [
      {
        item_id: '123',
        item_name: 'Mesa Pool Profesional',
        item_category: 'Mesas de Pool',
        price: 850000,
        quantity: 1
      },
      {
        item_id: '456',
        item_name: 'Juego de Bolas Brunswick',
        item_category: 'Accesorios',
        price: 89990,
        quantity: 2
      }
    ]
  },

  // ✅ Meta Pixel Format
  value: 1033990,                        // Total del carrito (con envío)
  currency: 'CLP',
  num_items: 2,                          // Número de productos distintos
  product_ids: ['123', '456'],           // Array de IDs
  event_id: '1733404200002_def456'
});
```

### Variables GTM que capturan estos datos:
- `DL - Value` → `value`
- `DL - Currency` → `currency`
- `DL - Num Items` → `num_items`
- `DL - Product IDs` → `product_ids`
- `DL - Event ID` → `event_id`

---

## 4. **Purchase** (Compra Completada)

### Cuándo se dispara:
- Al llegar a la página `/pedido-confirmado`

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'purchase',

  // ✅ GA4 Format (Transaction + Items)
  ecommerce: {
    transaction_id: 'ORDER-1733404200003',  // ID único de la orden
    value: 1033990,                          // Total de la compra
    currency: 'CLP',
    items: [
      {
        item_id: '123',
        item_name: 'Mesa Pool Profesional',
        item_category: 'Mesas de Pool',
        price: 850000,
        quantity: 1
      },
      {
        item_id: '456',
        item_name: 'Juego de Bolas Brunswick',
        item_category: 'Accesorios',
        price: 89990,
        quantity: 2
      }
    ]
  },

  // ✅ Meta Pixel Format
  transaction_id: 'ORDER-1733404200003',
  value: 1033990,
  currency: 'CLP',
  num_items: 2,
  product_ids: ['123', '456'],
  event_id: '1733404200003_ghi789'
});
```

### Variables GTM que capturan estos datos:
- `DL - Transaction ID` → `transaction_id`
- `DL - Value` → `value`
- `DL - Currency` → `currency`
- `DL - Num Items` → `num_items`
- `DL - Product IDs` → `product_ids`
- `DL - Event ID` → `event_id`

---

## 5. **WhatsApp Click** (Clic en WhatsApp)

### Cuándo se dispara:
- Al hacer clic en el botón flotante de WhatsApp
- Al seleccionar "Enviar por WhatsApp" en el formulario de contacto

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'whatsapp_click',

  // ✅ Datos del click
  click_location: 'floating_button',     // Ubicación: floating_button | contact_form
  button_text: '¿Necesitas ayuda?',      // Texto del botón
  service_interested: 'general',         // Servicio de interés
  value: 0,                              // Valor (opcional)
  currency: 'CLP',
  event_id: '1733404200004_jkl012'
});
```

### Variables GTM que capturan estos datos:
- `DL - Click Location` → `click_location`
- `DL - Button Text` → `button_text`
- `DL - Service Interested` → `service_interested`
- `DL - Event ID` → `event_id`

---

## 6. **Contact Submit** (Envío de Formulario)

### Cuándo se dispara:
- Al enviar el formulario de contacto por email

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'contact_submit',

  // ✅ Datos del formulario
  form_name: 'contact_form',
  service_interested: 'Consulta sobre Mesa Pool',
  event_id: '1733404200005_mno345'
});
```

### Variables GTM que capturan estos datos:
- `DL - Form Name` → `form_name`
- `DL - Service Interested` → `service_interested`
- `DL - Event ID` → `event_id`

**Nota**: Los datos personales (email, teléfono, nombre) se envían directamente a Meta CAPI (hasheados) pero NO se pushean al dataLayer por privacidad.

---

## 7. **CTA Click** (Clic en CTA)

### Cuándo se dispara:
- Al hacer clic en CTAs importantes (Hero, etc.)

### Datos enviados al DataLayer:

```javascript
dataLayer.push({
  event: 'cta_click',

  // ✅ Datos del CTA
  cta_text: 'Ver Regalos',
  button_text: 'Ver Regalos',
  cta_location: 'hero',
  click_location: 'hero',
  cta_type: 'primary'                    // primary | secondary
});
```

### Variables GTM que capturan estos datos:
- `DL - CTA Text` → `cta_text`
- `DL - Button Text` → `button_text`
- `DL - CTA Location` → `cta_location`
- `DL - Click Location` → `click_location`

---

## 📋 Resumen de Datos por Evento

| Evento | Product Info | Price | Category | Quantity | Transaction ID | Customer Info |
|--------|--------------|-------|----------|----------|----------------|---------------|
| view_content | ✅ | ✅ | ✅ | ✅ (1) | ❌ | ❌ |
| add_to_cart | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| initiate_checkout | ✅ (array) | ✅ | ✅ | ✅ | ❌ | ❌ |
| purchase | ✅ (array) | ✅ | ✅ | ✅ | ✅ | ✅ (CAPI) |
| whatsapp_click | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| contact_submit | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (CAPI) |
| cta_click | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🔍 Verificación de Datos en la Consola

Para verificar qué datos se están enviando, abre la consola del navegador y ejecuta:

```javascript
// Ver todos los eventos del dataLayer
console.table(window.dataLayer);

// Ver el último evento
console.log(window.dataLayer[window.dataLayer.length - 1]);

// Filtrar solo eventos de e-commerce
window.dataLayer.filter(item => item.ecommerce).forEach(item => {
  console.log('Event:', item.event);
  console.log('Items:', item.ecommerce.items);
  console.log('---');
});
```

---

## 🎯 Campos Importantes para GA4

GA4 utiliza el objeto `ecommerce.items[]` con los siguientes campos:

### Campos Obligatorios:
- `item_id` - ID del producto (string)
- `item_name` - Nombre del producto (string)

### Campos Recomendados:
- `item_category` - Categoría del producto
- `price` - Precio unitario (number)
- `quantity` - Cantidad (number)

### Campos Opcionales:
- `item_brand` - Marca (ej: "Billard Ramirez")
- `item_variant` - Variante (ej: color, talla)
- `item_list_name` - Lista donde se vio el producto
- `item_list_id` - ID de la lista
- `index` - Posición en la lista

---

## 🎯 Campos Importantes para Meta Pixel

Meta Pixel utiliza campos planos en el dataLayer:

### Campos Principales:
- `product_id` - ID del producto
- `product_name` - Nombre del producto
- `value` - Valor total (precio × cantidad)
- `currency` - Moneda (siempre 'CLP')
- `event_id` - ID único para deduplicación

### Campos para CAPI (enviados hasheados):
- `email` - Email del cliente (SHA-256)
- `phone` - Teléfono del cliente (SHA-256)
- `firstName` - Nombre (SHA-256)
- `lastName` - Apellido (SHA-256)

---

## 🔐 Datos Sensibles y Privacidad

### Datos que NO se envían al dataLayer público:
- ❌ Email del cliente
- ❌ Teléfono del cliente
- ❌ Nombre completo del cliente
- ❌ Dirección del cliente
- ❌ Datos de pago

### Datos que SÍ se envían (hasheados) a Meta CAPI:
- ✅ Email (SHA-256)
- ✅ Teléfono (SHA-256)
- ✅ Nombre (SHA-256)
- ✅ Apellido (SHA-256)

Estos datos solo se envían server-side mediante Meta CAPI para mejorar el match rate de conversiones.

---

## ✅ Conclusión

**Todos los datos críticos se están enviando:**

### E-commerce:
- ✅ Product ID
- ✅ Product Name
- ✅ Product Category
- ✅ Product Price
- ✅ Quantity
- ✅ Transaction ID (en purchase)
- ✅ Total Value
- ✅ Currency

### Conversiones:
- ✅ Click Location
- ✅ Button Text
- ✅ Form Name
- ✅ Service Interested

### Deduplicación:
- ✅ Event ID único para cada evento

**El tracking está completo y listo para producción.** 🎉

---

**Última actualización**: 2025-12-05
**Desarrollador**: Agencia Demosle
