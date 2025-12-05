# 📊 Datos Adicionales Recomendados para Analítica - Billard Ramirez

## 🎯 ¿Qué otros datos deberíamos enviar?

---

## 1. **DATOS DE PRODUCTO ADICIONALES** 🛍️

### Datos Disponibles que NO estamos enviando:

#### **SKU** (Stock Keeping Unit)
```javascript
dataLayer.push({
  event: 'view_content',
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Mesa Pool Profesional',
      item_brand: 'Billard Ramirez',
      item_category: 'Mesas de Pool',
      price: 850000,
      quantity: 1,
      // ✅ AGREGAR:
      sku: 'BR-MP-001',              // SKU del producto
    }]
  }
});
```

**¿Por qué es importante?**
- Identificación única del producto
- Útil para reportes de inventario
- Tracking de productos específicos

---

#### **Stock Status** (Estado de Stock)
```javascript
dataLayer.push({
  event: 'view_content',
  product_id: '123',
  product_name: 'Mesa Pool Profesional',
  // ✅ AGREGAR:
  stock_status: 'instock',         // instock | outofstock | onbackorder
  stock_quantity: 5,               // Cantidad disponible
});
```

**¿Por qué es importante?**
- Analizar qué productos se venden más rápido
- Identificar productos con bajo stock que generan conversiones
- Priorizar reabastecimiento

---

#### **Product Type** (Tipo de Producto)
```javascript
dataLayer.push({
  event: 'view_content',
  product_id: '123',
  // ✅ AGREGAR:
  product_type: 'simple',          // simple | variable | grouped
  is_featured: true,               // Producto destacado?
  is_on_sale: true,                // En oferta?
  discount_percentage: 15,         // % de descuento
});
```

**¿Por qué es importante?**
- Saber si productos en oferta convierten mejor
- Tracking de productos destacados
- Análisis de descuentos efectivos

---

#### **Product Tags** (Etiquetas)
```javascript
dataLayer.push({
  event: 'view_content',
  product_id: '123',
  // ✅ AGREGAR:
  product_tags: ['Profesional', 'Pizarra', 'Premium'],
});
```

**¿Por qué es importante?**
- Segmentación de productos
- Análisis de atributos que convierten mejor
- Remarketing más preciso

---

#### **Product Variants** (Variantes)
```javascript
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Taco de Billar Pro',
      // ✅ AGREGAR:
      item_variant: 'Maple - 19oz',  // Material y peso
      item_color: 'Natural',
      item_size: '58"',
    }]
  }
});
```

**¿Por qué es importante?**
- Saber qué variantes son más populares
- Optimizar inventario de variantes
- Personalización de anuncios

---

## 2. **DATOS DE NAVEGACIÓN Y COMPORTAMIENTO** 🧭

### **List Name / List Position** (Origen del Producto)
```javascript
dataLayer.push({
  event: 'view_content',
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Mesa Pool Profesional',
      // ✅ AGREGAR:
      item_list_name: 'Featured Products',    // De dónde vino
      item_list_id: 'featured_homepage',
      index: 1,                               // Posición en la lista
    }]
  }
});
```

**¿Por qué es importante?**
- Saber de dónde vienen las conversiones
- Optimizar ubicación de productos
- A/B testing de layouts

**Listas a trackear:**
- `featured_homepage` - Destacados en home
- `category_mesas` - Listado de mesas
- `search_results` - Resultados de búsqueda
- `related_products` - Productos relacionados
- `recently_viewed` - Vistos recientemente

---

### **Referrer / Traffic Source** (De dónde vienen)
```javascript
dataLayer.push({
  event: 'page_view',
  // ✅ AGREGAR:
  traffic_source: 'google_ads',
  referrer: document.referrer,
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'mesas_pool_2025',
});
```

**¿Por qué es importante?**
- Atribuir conversiones a campañas específicas
- ROI de cada canal
- Optimización de presupuesto publicitario

---

### **Search Terms** (Términos de Búsqueda)
```javascript
dataLayer.push({
  event: 'search',
  // ✅ AGREGAR:
  search_term: 'mesa pool profesional',
  search_results: 12,
  search_filter_category: 'Mesas de Pool',
  search_filter_price: '500000-1000000',
});
```

**¿Por qué es importante?**
- Entender qué buscan los usuarios
- Optimizar catálogo de productos
- Mejorar SEO interno

---

### **User Engagement** (Engagement del Usuario)
```javascript
dataLayer.push({
  event: 'user_engagement',
  // ✅ AGREGAR:
  pages_viewed: 5,                    // Páginas vistas en sesión
  time_on_site: 180,                  // Segundos en el sitio
  products_viewed: 3,                 // Productos vistos
  returning_visitor: true,            // Usuario recurrente?
  session_number: 2,                  // Número de sesión
});
```

**¿Por qué es importante?**
- Identificar usuarios de alta intención
- Remarketing a usuarios comprometidos
- Optimizar customer journey

---

## 3. **DATOS DE CARRITO Y CHECKOUT** 🛒

### **Cart Events Mejorados**
```javascript
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: { items: [...] },
  // ✅ AGREGAR:
  cart_total_items: 3,                // Total de items en carrito
  cart_total_value: 1500000,          // Valor total del carrito
  cart_total_quantity: 5,             // Cantidad total
  add_method: 'quick_add',            // quick_add | detail_page | related
});
```

**¿Por qué es importante?**
- Analizar comportamiento de carrito
- Identificar puntos de abandono
- Average Order Value (AOV)

---

### **Remove from Cart** (Remover del Carrito)
```javascript
dataLayer.push({
  event: 'remove_from_cart',
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Mesa Pool Profesional',
      price: 850000,
      quantity: 1
    }]
  },
  // ✅ AGREGAR:
  removal_reason: 'price_too_high',   // price | changed_mind | found_better
});
```

**¿Por qué es importante?**
- Entender por qué abandonan productos
- Optimizar precios
- Reducir cart abandonment

---

### **Checkout Step Tracking** (Pasos del Checkout)
```javascript
dataLayer.push({
  event: 'begin_checkout',
  ecommerce: { items: [...] },
  // ✅ AGREGAR:
  checkout_step: 1,                   // Paso del checkout
  checkout_step_name: 'info',         // info | shipping | payment
});

dataLayer.push({
  event: 'add_shipping_info',
  ecommerce: { items: [...] },
  shipping_tier: 'Region Metropolitana',
  shipping_cost: 4000,
});

dataLayer.push({
  event: 'add_payment_info',
  ecommerce: { items: [...] },
  payment_method: 'payku',
});
```

**¿Por qué es importante?**
- Identificar en qué paso se pierde la gente
- Optimizar cada paso del checkout
- Reducir abandono

---

## 4. **DATOS DE CONVERSIÓN MEJORADOS** 💰

### **Lead Quality Score**
```javascript
dataLayer.push({
  event: 'contact_submit',
  form_name: 'contact_form',
  // ✅ AGREGAR:
  lead_score: 8,                      // Score 1-10 basado en:
  lead_quality: 'hot',                // hot | warm | cold
  lead_source: 'organic_search',
  lead_value: 850000,                 // Valor estimado del lead
  products_interested: ['123', '456'],
});
```

**¿Por qué es importante?**
- Priorizar leads de alta calidad
- Optimizar campañas para leads valiosos
- ROI más preciso

---

### **Customer Lifetime Value (CLV)**
```javascript
dataLayer.push({
  event: 'purchase',
  ecommerce: { ... },
  // ✅ AGREGAR:
  customer_ltv: 2500000,              // Valor histórico del cliente
  is_first_purchase: true,
  purchase_count: 1,
  customer_segment: 'new',            // new | returning | vip
});
```

**¿Por qué es importante?**
- Identificar mejores clientes
- Remarketing a clientes VIP
- Optimizar CAC vs LTV

---

## 5. **DATOS DE EXPERIENCIA DE USUARIO** 👤

### **Device & Performance**
```javascript
dataLayer.push({
  event: 'page_view',
  // ✅ AGREGAR:
  device_type: 'mobile',              // mobile | tablet | desktop
  device_model: 'iPhone 13',
  browser: 'Safari',
  os: 'iOS 17',
  screen_resolution: '390x844',
  connection_type: '4g',
  page_load_time: 1.2,                // Segundos
});
```

**¿Por qué es importante?**
- Optimizar para dispositivos populares
- Identificar problemas de performance
- Mejorar UX

---

### **Errors & Issues**
```javascript
dataLayer.push({
  event: 'error',
  // ✅ AGREGAR:
  error_type: '404',                  // 404 | 500 | form_error | payment_error
  error_message: 'Product not found',
  error_url: '/producto/mesa-xyz',
  error_fatal: false,
});
```

**¿Por qué es importante?**
- Identificar y resolver errores rápido
- Mejorar experiencia del usuario
- Reducir frustración

---

## 6. **DATOS DE CUSTOMIZACIÓN** 🎨

### **Product Customization** (Grabado Láser, etc.)
```javascript
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: { items: [...] },
  // ✅ AGREGAR:
  has_customization: true,
  customization_type: 'laser_engraving',
  customization_value: 10000,         // Costo de la customización
  customization_text: 'Juan Pérez',
});
```

**¿Por qué es importante?**
- Analizar demanda de customizaciones
- Revenue adicional por customizaciones
- Optimizar precios de custom

---

## 7. **DATOS DE PROMOCIONES Y CUPONES** 🎟️

### **Coupon Usage**
```javascript
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: { items: [...] },
  // ✅ AGREGAR:
  coupon_code: 'VERANO2025',
  coupon_discount: 50000,
  coupon_type: 'percentage',          // percentage | fixed | free_shipping
});
```

**¿Por qué es importante?**
- ROI de promociones
- Qué cupones funcionan mejor
- Optimizar estrategia de descuentos

---

## 📋 **PRIORIZACIÓN DE IMPLEMENTACIÓN**

### **🔥 ALTA PRIORIDAD** (Implementar YA)
1. ✅ **SKU** - Fácil y muy útil
2. ✅ **Stock Status** - Crítico para inventario
3. ✅ **Product Type & Discounts** - Análisis de ofertas
4. ✅ **List Name / Position** - Saber de dónde vienen conversiones
5. ✅ **Remove from Cart** - Reducir abandono

### **🟡 MEDIA PRIORIDAD** (Siguiente iteración)
6. ⚠️ **Search Tracking** - Si tienen búsqueda interna
7. ⚠️ **Checkout Steps** - Optimizar funnel
8. ⚠️ **Device & Performance** - Mejorar UX
9. ⚠️ **Customization Tracking** - Si es significativo

### **🟢 BAJA PRIORIDAD** (Nice to have)
10. 💡 **Lead Scoring** - Requiere modelo de scoring
11. 💡 **CLV Tracking** - Requiere histórico
12. 💡 **Error Tracking** - Pueden usar Sentry/LogRocket

---

## 🚀 **IMPLEMENTACIÓN RÁPIDA**

### **Paso 1: Actualizar trackViewContent**
```typescript
export async function trackViewContent(params: {
  product_id: string;
  product_name: string;
  product_category: string;
  product_price: number;
  // ✅ AGREGAR:
  sku?: string;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  is_on_sale?: boolean;
  discount_percentage?: number;
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
}) {
  // ...
}
```

### **Paso 2: Actualizar ProductDetail.tsx**
```typescript
trackViewContent({
  product_id: product.id.toString(),
  product_name: product.name,
  product_category: product.categories[0]?.name || 'Sin categoría',
  product_price: price,
  // ✅ AGREGAR:
  sku: product.sku,
  stock_status: product.stock_status,
  is_on_sale: product.on_sale,
  discount_percentage: discount,
});
```

---

## ✅ **RESUMEN: Top 5 Datos a Agregar AHORA**

1. **SKU** - Identificación única
2. **Stock Status** - Gestión de inventario
3. **Discount Info** - Análisis de ofertas
4. **List Name/Position** - Origen de conversiones
5. **Remove from Cart** - Reducir abandono

¿Quieres que implemente alguno de estos? 🚀

---

**Última actualización**: 2025-12-05
**Desarrollador**: Agencia Demosle
