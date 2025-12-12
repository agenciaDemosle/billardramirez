# 🔧 Configuración Manual GTM - 3 Eventos Nuevos

**Tiempo estimado: 5-10 minutos**

---

## 📋 PASO 1: Crear Variables (2 minutos)

### Variable 1: DLV - search_term
1. En GTM, ve a **Variables** (menú izquierdo)
2. Click **New** en "User-Defined Variables"
3. Click en el área del nombre y pon: `DLV - search_term`
4. Click en configuración de variable
5. Selecciona: **Data Layer Variable**
6. Data Layer Variable Name: `search_term`
7. Click **Save**

### Variable 2: DLV - search_type
1. Click **New** otra vez
2. Nombre: `DLV - search_type`
3. Tipo: **Data Layer Variable**
4. Data Layer Variable Name: `search_type`
5. Click **Save**

---

## 🎯 PASO 2: Crear Triggers (3 minutos)

### Trigger 1: CE - select_item
1. Ve a **Triggers** (menú izquierdo)
2. Click **New**
3. Nombre: `CE - select_item`
4. Click en configuración de trigger
5. Selecciona: **Custom Event**
6. Event name: `select_item`
7. This trigger fires on: **All Custom Events**
8. Click **Save**

### Trigger 2: CE - remove_from_cart
1. Click **New**
2. Nombre: `CE - remove_from_cart`
3. Tipo: **Custom Event**
4. Event name: `remove_from_cart`
5. This trigger fires on: **All Custom Events**
6. Click **Save**

### Trigger 3: CE - search
1. Click **New**
2. Nombre: `CE - search`
3. Tipo: **Custom Event**
4. Event name: `search`
5. This trigger fires on: **All Custom Events**
6. Click **Save**

---

## 🏷️ PASO 3: Crear Tags (5 minutos)

### Tag 1: GA4 - select_item
1. Ve a **Tags** (menú izquierdo)
2. Click **New**
3. Nombre: `GA4 - select_item`
4. Click en configuración de tag
5. Selecciona: **Google Analytics: GA4 Event**
6. Configuration Tag: Selecciona tu configuración GA4 existente
7. Event Name: `select_item`
8. **✅ IMPORTANTE:** Marca el checkbox **"Send Ecommerce Data"**
9. Triggering: Selecciona `CE - select_item`
10. Click **Save**

### Tag 2: GA4 - remove_from_cart
1. Click **New**
2. Nombre: `GA4 - remove_from_cart`
3. Tipo: **Google Analytics: GA4 Event**
4. Configuration Tag: Tu configuración GA4
5. Event Name: `remove_from_cart`
6. **✅ Marca:** Send Ecommerce Data
7. Triggering: `CE - remove_from_cart`
8. Click **Save**

### Tag 3: GA4 - search
1. Click **New**
2. Nombre: `GA4 - search`
3. Tipo: **Google Analytics: GA4 Event**
4. Configuration Tag: Tu configuración GA4
5. Event Name: `search`
6. Ahora agrega **Event Parameters**:
   - Click **"Add Row"** en Event Parameters
   - Parameter Name: `search_term`
   - Value: `{{DLV - search_term}}`
   - Click **"Add Row"** otra vez
   - Parameter Name: `search_type`
   - Value: `{{DLV - search_type}}`
7. Triggering: `CE - search`
8. Click **Save**

---

## ✅ PASO 4: Probar (Preview Mode)

1. Click **Preview** (arriba a la derecha)
2. Ingresa tu URL: `https://billardramirez.cl`
3. Click **Connect**

### Prueba 1: select_item
- Haz clic en cualquier producto
- En GTM Preview, deberías ver el evento `select_item`
- Verifica que tenga datos de ecommerce

### Prueba 2: remove_from_cart
- Agrega un producto al carrito
- Abre el carrito (click en el ícono)
- Click en el ícono de basura para eliminar
- Deberías ver `remove_from_cart` con datos de ecommerce

### Prueba 3: search
- Busca algo en la barra de búsqueda
- Deberías ver `search` con `search_term` y `search_type: text`

---

## 🚀 PASO 5: Publicar

1. Si todo funciona bien, click **Submit** (arriba a la derecha)
2. Version Name: `Nuevos eventos GA4 - select_item, remove_from_cart, search`
3. Click **Publish**

---

## 📊 PASO 6: Marcar en GA4 como Conversión

Espera 24-48 horas para que los eventos aparezcan en GA4, luego:

1. Ve a **Google Analytics 4**
2. Admin → Events
3. Busca `select_item`
4. Click en el switch **"Mark as conversion"**

---

## 📝 Resumen Visual

```
VARIABLES (2)
├── DLV - search_term
└── DLV - search_type

TRIGGERS (3)
├── CE - select_item (Custom Event: select_item)
├── CE - remove_from_cart (Custom Event: remove_from_cart)
└── CE - search (Custom Event: search)

TAGS (3)
├── GA4 - select_item
│   ├── Event: select_item
│   ├── Send Ecommerce: ✅
│   └── Trigger: CE - select_item
├── GA4 - remove_from_cart
│   ├── Event: remove_from_cart
│   ├── Send Ecommerce: ✅
│   └── Trigger: CE - remove_from_cart
└── GA4 - search
    ├── Event: search
    ├── Parameters: search_term, search_type
    └── Trigger: CE - search
```

---

## ⚠️ Troubleshooting

**Si no ves los eventos en Preview:**
- Verifica que el código esté en producción
- Refresca la página
- Revisa la consola del navegador (F12)

**Si los eventos no llegan a GA4:**
- Verifica que el tag tenga el Configuration Tag correcto
- Asegúrate de que esté publicado
- Espera 24-48 horas para verlos en GA4

---

¡Listo! 🎉
