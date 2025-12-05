# 📊 List Name & Position Tracking + Pool Table Quotation - Billard Ramirez

## ✅ IMPLEMENTADO COMPLETAMENTE

---

## 🎯 1. **List Name & Position Tracking**

### ¿Qué es?
Tracking de **dónde** y en **qué posición** los usuarios ven y hacen clic en los productos.

### ¿Por qué es importante?
- **Saber qué ubicaciones convierten mejor** (Homepage vs Categoría vs Búsqueda)
- **Optimizar la posición de productos** (¿Los primeros convierten más?)
- **Identificar listas efectivas** (Featured, Related, Recently Viewed)
- **Mejorar layouts** basándose en datos reales

---

## 📍 **Dónde se trackea**

### **Eventos que ahora incluyen List Context:**

#### 1. **View Content** (Ver Producto)
```javascript
dataLayer.push({
  event: 'view_content',
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Mesa Pool Profesional',
      item_category: 'Mesas de Pool',
      price: 850000,
      quantity: 1,
      // ✅ NUEVO:
      item_list_name: 'Category: mesas-de-pool',  // Nombre descriptivo
      item_list_id: 'category_mesas-de-pool',     // ID único
      index: 2                                     // Posición (0-indexed)
    }]
  }
});
```

#### 2. **Add to Cart** (Agregar al Carrito)
```javascript
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    items: [{
      item_id: '123',
      item_name: 'Mesa Pool Profesional',
      // ... otros datos
      // ✅ NUEVO:
      item_list_name: 'Shop',
      item_list_id: 'shop_all',
      index: 0
    }]
  }
});
```

---

## 📋 **Listas Trackeadas Actualmente**

### 1. **Shop Page** (Página de Tienda)
**List Name**: `"Shop"` o `"Category: {category_slug}"`
**List ID**: `"shop_all"` o `"category_{category_slug}"`

**Ejemplos:**
- Sin filtro: `listName: 'Shop'`, `listId: 'shop_all'`
- Con categoría: `listName: 'Category: mesas-de-pool'`, `listId: 'category_mesas-de-pool'`

**Implementación:**
```typescript
// /src/pages/Shop.tsx:608-609
<ProductGrid
  products={products || []}
  listName={categoryParam ? `Category: ${categoryParam}` : 'Shop'}
  listId={categoryParam ? `category_${categoryParam}` : 'shop_all'}
/>
```

### 2. **Homepage Featured** (Destacados en Home)
**List Name**: `"Homepage Featured"`
**List ID**: `"homepage_featured"`

**Para implementar:**
```typescript
// En /src/components/home/FeaturedSection.tsx
<Link
  to={`/producto/${product.slug}`}
  onClick={() => trackViewContent({
    product_id: product.id.toString(),
    product_name: product.name,
    product_category: product.categories[0]?.name || 'Mesas de Pool',
    product_price: parseFloat(product.price),
    item_list_name: 'Homepage Featured',
    item_list_id: 'homepage_featured',
    index: index
  })}
>
```

### 3. **Related Products** (Productos Relacionados)
**List Name**: `"Related Products"`
**List ID**: `"related_products"`

**Para implementar en ProductPage:**
```typescript
<ProductGrid
  products={relatedProducts || []}
  listName="Related Products"
  listId="related_products"
/>
```

### 4. **Search Results** (Resultados de Búsqueda)
**List Name**: `"Search: {search_term}"`
**List ID**: `"search_results"`

**Para implementar:**
```typescript
<ProductGrid
  products={searchResults || []}
  listName={searchQuery ? `Search: ${searchQuery}` : 'Shop'}
  listId="search_results"
/>
```

---

## 🎱 **2. Pool Table Quotation Tracking**

### ¿Qué es?
Tracking completo del **flujo de cotización** de mesas de pool con customizaciones.

### ¿Por qué es importante?
- **Saber cuántas personas inician cotizaciones**
- **Tracking de customizaciones populares** (dimensiones, colores de paño, accesorios)
- **Valor estimado de cotizaciones**
- **Método de contacto preferido**
- **Conversión de cotización a lead**

---

## 📊 **Eventos de Cotización**

### **1. Quote Start** (Iniciar Cotización)
**Cuándo**: Al abrir el modal/cotizador
```javascript
trackPoolTableQuoteStart({
  table_type: 'profesional',           // profesional | recreacional
  location: 'hero'                     // hero | product_page | category
});
```

**DataLayer:**
```javascript
{
  event: 'pool_table_quote_start',
  table_type: 'profesional',
  quote_location: 'hero',
  quote_step: 1,
  quote_step_name: 'table_type_selection'
}
```

---

### **2. Customization** (Seleccionar Customización)
**Cuándo**: Al elegir dimensiones, color de paño, accesorios, etc.
```javascript
trackPoolTableCustomization({
  table_type: 'profesional',
  customization_type: 'dimensions',    // dimensions | cloth_color | accessories
  customization_value: '2.40m x 1.20m',
  customization_price: 0               // Costo adicional (si aplica)
});
```

**DataLayer:**
```javascript
{
  event: 'pool_table_customization',
  table_type: 'profesional',
  customization_type: 'dimensions',
  customization_value: '2.40m x 1.20m',
  customization_price: 0,
  currency: 'CLP'
}
```

**Tipos de Customization:**
- `dimensions` - Dimensiones de la mesa
- `cloth_color` - Color del paño
- `accessories` - Accesorios adicionales
- `installation` - Servicio de instalación

---

### **3. Quote Complete** (Completar Cotización)
**Cuándo**: Al enviar la cotización por WhatsApp/Email
```javascript
trackPoolTableQuoteComplete({
  table_type: 'profesional',
  dimensions: '2.40m x 1.20m',
  cloth_color: 'Verde Torneo',
  accessories: ['Juego de Bolas', 'Tacos x4', 'Triángulo'],
  estimated_value: 1850000,
  contact_method: 'whatsapp'           // whatsapp | email | phone
});
```

**DataLayer:**
```javascript
{
  event: 'pool_table_quote_complete',
  table_type: 'profesional',
  dimensions: '2.40m x 1.20m',
  cloth_color: 'Verde Torneo',
  accessories: ['Juego de Bolas', 'Tacos x4', 'Triángulo'],
  accessories_count: 3,
  estimated_value: 1850000,
  currency: 'CLP',
  contact_method: 'whatsapp',
  quote_step: 'final',
  quote_step_name: 'quote_completed',
  event_id: 'unique_id_123'
}
```

**Se envía también a Meta CAPI como Lead:**
```javascript
Meta Event: 'Lead'
content_name: 'Pool Table Quote - profesional'
content_category: 'pool_table_customization'
value: 1850000
currency: 'CLP'
```

---

## 🛠️ **Cómo Implementar**

### **En Hero.tsx** (Modal de Cotización)
```typescript
import {
  trackPoolTableQuoteStart,
  trackPoolTableCustomization,
  trackPoolTableQuoteComplete
} from '../../hooks/useAnalytics';

// Al abrir modal
const handleOpenModal = (tableType: 'profesional' | 'recreacional') => {
  trackPoolTableQuoteStart({
    table_type: tableType,
    location: 'hero'
  });
  setIsModalOpen(true);
};

// Al seleccionar dimensiones
const handleDimensionSelect = (dimensions: string) => {
  trackPoolTableCustomization({
    table_type: selectedTableType,
    customization_type: 'dimensions',
    customization_value: dimensions,
  });
  setSelectedDimensions(dimensions);
};

// Al seleccionar color de paño
const handleClothColorSelect = (color: string) => {
  trackPoolTableCustomization({
    table_type: selectedTableType,
    customization_type: 'cloth_color',
    customization_value: color,
  });
  setSelectedClothColor(color);
};

// Al enviar cotización por WhatsApp
const handleSendQuote = () => {
  trackPoolTableQuoteComplete({
    table_type: selectedTableType,
    dimensions: selectedDimensions,
    cloth_color: selectedClothColor,
    accessories: selectedAccessories,
    estimated_value: calculateEstimatedValue(),
    contact_method: 'whatsapp'
  });

  // Luego abrir WhatsApp
  window.open(whatsappUrl, '_blank');
};
```

---

### **En ProductDetail.tsx** (Para productos de mesa)
```typescript
const isPoolTable = product.categories.some(cat =>
  cat.slug.includes('mesa') || cat.slug.includes('pool')
);

if (isPoolTable) {
  // Al hacer clic en "Cotizar"
  const handleQuoteClick = () => {
    trackPoolTableQuoteStart({
      table_type: determineTableType(product),
      location: 'product_page'
    });
    setIsQuoteModalOpen(true);
  };
}
```

---

## 📈 **Reportes que podrás generar**

### **Con List Tracking:**
1. **Conversión por Lista**
   - ¿Homepage Featured convierte mejor que Related Products?
   - ¿Qué categoría genera más ventas?

2. **Posición óptima**
   - ¿Los productos en posición 0-2 convierten más?
   - ¿Hasta qué posición la gente hace scroll?

3. **A/B Testing**
   - Comparar diferentes ordenamientos
   - Optimizar featured products

### **Con Pool Table Quotation:**
1. **Funnel de Cotización**
   ```
   Quote Start (100%)
   → Customizations (80%)
   → Quote Complete (40%)
   → WhatsApp Lead (40%)
   ```

2. **Customizaciones Populares**
   - Color de paño más elegido
   - Dimensiones más solicitadas
   - Accesorios más agregados

3. **Valor Promedio**
   - Valor promedio de cotizaciones
   - Identificar cotizaciones de alto valor
   - Segmentar leads por valor

4. **Método de Contacto**
   - ¿WhatsApp convierte mejor que Email?
   - Optimizar CTAs

---

## 🔍 **Verificación en Consola**

### **Ver List Tracking:**
```javascript
// Último evento de view_content
const lastViewContent = window.dataLayer
  .filter(item => item.event === 'view_content')
  .pop();

console.log('List Name:', lastViewContent.ecommerce.items[0].item_list_name);
console.log('List ID:', lastViewContent.ecommerce.items[0].item_list_id);
console.log('Position:', lastViewContent.ecommerce.items[0].index);
```

### **Ver Quote Tracking:**
```javascript
// Eventos de cotización
window.dataLayer
  .filter(item => item.event?.includes('pool_table'))
  .forEach(item => {
    console.log('Event:', item.event);
    console.log('Data:', item);
  });
```

---

## 📊 **Variables GTM a Crear**

### **Para List Tracking:**
1. `DL - Item List Name` → `ecommerce.items.0.item_list_name`
2. `DL - Item List ID` → `ecommerce.items.0.item_list_id`
3. `DL - Item Index` → `ecommerce.items.0.index`

### **Para Pool Table Quotation:**
1. `DL - Table Type` → `table_type`
2. `DL - Quote Location` → `quote_location`
3. `DL - Customization Type` → `customization_type`
4. `DL - Customization Value` → `customization_value`
5. `DL - Accessories Count` → `accessories_count`
6. `DL - Contact Method` → `contact_method`

---

## ✅ **Estado de Implementación**

### **✅ COMPLETADO:**
- [x] Funciones de tracking en `useAnalytics.ts`
- [x] ProductCard acepta listName, listId, index
- [x] ProductGrid pasa contexto a ProductCard
- [x] Shop page envía list context
- [x] Tracking de pool table quotation (3 eventos)
- [x] FeaturedSection (Homepage) - Tracking de clicks implementado
- [x] Related Products en ProductPage - List context agregado
- [x] PoolTableQuote component - Tracking completo del flujo de cotización
- [x] Quote page form - Tracking completo del formulario de cotización
- [x] PoolTableTypeModal - Tracking de inicio de cotización

### **⚠️ PENDIENTE DE IMPLEMENTAR (Opcional):**
- [ ] Search Results - Si se implementa búsqueda en el futuro

---

## 🚀 **Próximos Pasos - Configuración GTM**

### **1. Crear tags en GTM** (15 min)
- Tag para `pool_table_quote_start`
- Tag para `pool_table_customization`
- Tag para `pool_table_quote_complete`

### **2. Configurar variables en GTM** (10 min)
- `DL - Item List Name` → `ecommerce.items.0.item_list_name`
- `DL - Item List ID` → `ecommerce.items.0.item_list_id`
- `DL - Item Index` → `ecommerce.items.0.index`
- `DL - Table Type` → `table_type`
- `DL - Quote Location` → `quote_location`
- `DL - Customization Type` → `customization_type`
- `DL - Customization Value` → `customization_value`
- `DL - Accessories Count` → `accessories_count`
- `DL - Contact Method` → `contact_method`

### **3. Testing completo** (15 min)
- Verificar list context en diferentes páginas (Shop, Homepage, Related Products)
- Verificar eventos de cotización en ambos flujos (PoolTableQuote y Quote page)
- Verificar en GA4 Real-time
- Verificar en Meta Events Manager
- Probar flujo completo desde inicio hasta WhatsApp/Email

---

## 🎉 **Beneficios**

Con esta implementación podrás:

### **List Tracking:**
✅ Saber exactamente de dónde vienen las conversiones
✅ Optimizar posición de productos
✅ Comparar efectividad de listas
✅ Tomar decisiones basadas en datos

### **Pool Table Quotation:**
✅ Medir funnel completo de cotización
✅ Identificar customizaciones populares
✅ Calcular valor promedio de leads
✅ Optimizar proceso de cotización
✅ Segmentar leads de alto valor

---

## 📝 **Resumen de Implementación Completa**

### **Tracking de List Name & Position implementado en:**
1. ✅ **Shop page** - Category tracking con filtros
2. ✅ **FeaturedSection** (Homepage) - Homepage Featured tracking
3. ✅ **ProductPage** - Related Products tracking
4. ✅ **ProductCard** - Acepta y envía list context en view_content y add_to_cart

### **Tracking de Pool Table Quotation implementado en:**
1. ✅ **PoolTableTypeModal** - Quote start tracking al seleccionar tipo
2. ✅ **PoolTableQuote** - Tracking completo de:
   - Quote start (paso 1)
   - Dimensions customization (paso 2)
   - Cloth color customization (paso 3)
   - Accessories customization (paso 4)
   - Installation customization (paso 4)
   - Quote complete con valor estimado (WhatsApp)
3. ✅ **Quote page form** - Tracking completo de:
   - Quote start
   - Dimensions customization
   - Installation customization
   - Quote complete (Email/Form)

---

**Última actualización**: 2025-12-05
**Desarrollador**: Agencia Demosle
**Estado**: ✅ **IMPLEMENTACIÓN COMPLETA** - Listo para configurar en GTM y testing
