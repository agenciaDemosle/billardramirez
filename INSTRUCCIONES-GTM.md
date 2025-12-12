# 📊 Instrucciones para Configurar Nuevos Eventos en GTM

## ✅ Eventos Agregados al Código

Se agregaron 3 nuevos eventos de tracking:

1. **select_item** - Cuando hacen clic en un producto
2. **remove_from_cart** - Cuando eliminan producto del carrito
3. **search** - Cuando buscan (texto o voz)

---

## 📥 OPCIÓN 1: Importar JSON (Recomendado - 2 minutos)

### Paso 1: Importar el archivo JSON
1. Abre Google Tag Manager
2. Ve a **Admin** (engranaje abajo a la izquierda)
3. Click en **Import Container**
4. Selecciona el archivo `gtm-nuevos-eventos.json`
5. Selecciona workspace: **Existing** → Elige tu workspace actual
6. Import option: **Merge** → Rename conflicting tags/triggers/variables
7. Click **Confirm**

### Paso 2: Revisar y Publicar
1. Revisa los 3 tags nuevos que se crearon
2. Revisa los 3 triggers nuevos
3. Revisa las 2 variables nuevas (search_term, search_type)
4. **Importante:** Verifica que la variable `{{GA4 Measurement ID}}` exista y tenga tu ID
5. Click **Submit** para publicar

---

## 🔧 OPCIÓN 2: Configuración Manual (10 minutos)

Si prefieres hacerlo manual, aquí están los pasos:

### 1. Variables (Data Layer Variables)

Crea 2 variables nuevas:

#### Variable 1: DLV - search_term
- Tipo: **Data Layer Variable**
- Data Layer Variable Name: `search_term`

#### Variable 2: DLV - search_type
- Tipo: **Data Layer Variable**
- Data Layer Variable Name: `search_type`

---

### 2. Triggers (Custom Events)

Crea 3 triggers nuevos:

#### Trigger 1: CE - select_item
- Tipo: **Custom Event**
- Event name: `select_item`

#### Trigger 2: CE - remove_from_cart
- Tipo: **Custom Event**
- Event name: `remove_from_cart`

#### Trigger 3: CE - search
- Tipo: **Custom Event**
- Event name: `search`

---

### 3. Tags (GA4 Event)

Crea 3 tags nuevos:

#### Tag 1: GA4 - select_item
- Tipo: **Google Analytics: GA4 Event**
- Configuration Tag: `{{GA4 Configuration}}`
- Event Name: `select_item`
- **✅ Marcar:** Send Ecommerce Data
- Triggering: `CE - select_item`

#### Tag 2: GA4 - remove_from_cart
- Tipo: **Google Analytics: GA4 Event**
- Configuration Tag: `{{GA4 Configuration}}`
- Event Name: `remove_from_cart`
- **✅ Marcar:** Send Ecommerce Data
- Triggering: `CE - remove_from_cart`

#### Tag 3: GA4 - search
- Tipo: **Google Analytics: GA4 Event**
- Configuration Tag: `{{GA4 Configuration}}`
- Event Name: `search`
- Event Parameters:
  - **search_term**: `{{DLV - search_term}}`
  - **search_type**: `{{DLV - search_type}}`
- Triggering: `CE - search`

---

## 🧪 Probar los Eventos

### Usar GTM Preview Mode

1. En GTM click **Preview**
2. Ingresa tu URL: `https://billardramirez.cl`
3. Prueba cada evento:

#### ✅ Probar select_item:
- Haz clic en cualquier producto del catálogo
- Deberías ver en GTM Preview: `select_item` con datos de ecommerce

#### ✅ Probar remove_from_cart:
- Agrega un producto al carrito
- Abre el carrito
- Click en el ícono de basura para eliminar
- Deberías ver: `remove_from_cart` con datos de ecommerce

#### ✅ Probar search:
- Busca algo en la barra de búsqueda
- Deberías ver: `search` con `search_term` y `search_type: text`
- Prueba también la búsqueda por voz (ícono del micrófono)
- Deberías ver: `search` con `search_type: voice`

---

## 📈 Marcar como Conversiones en GA4

Una vez que los eventos estén funcionando:

1. Ve a **Google Analytics 4**
2. Admin → Events
3. Busca estos eventos:
   - `select_item`
   - `remove_from_cart`
   - `search`
4. Haz clic en cada uno y marca **"Mark as conversion"**

### Recomendación:
- ✅ **select_item** - Marca como conversión (mide interés)
- ⏸️ **remove_from_cart** - NO marcar (es métrica, no conversión)
- ⏸️ **search** - NO marcar (es métrica, no conversión)

---

## 📋 Resumen de Todos los Eventos

### Eventos que YA TENÍAS (arreglados):
1. ✅ purchase
2. ✅ initiate_checkout
3. ✅ add_to_cart
4. ✅ view_content
5. ✅ whatsapp_click
6. ✅ phone_click
7. ✅ contact_submit
8. ✅ pool_table_quote_complete

### Eventos NUEVOS:
9. ✅ select_item
10. ✅ remove_from_cart
11. ✅ search

---

## 🎯 Conversiones Recomendadas para Marcar en GA4

### Alta Prioridad:
1. ⭐⭐⭐ **purchase** - Compra completada
2. ⭐⭐⭐ **whatsapp_click** - Contacto vía WhatsApp
3. ⭐⭐⭐ **pool_table_quote_complete** - Cotización completada
4. ⭐⭐⭐ **select_item** - Interés en producto

### Media Prioridad:
5. ⭐⭐ **contact_submit** - Formulario de contacto
6. ⭐⭐ **initiate_checkout** - Inicio checkout
7. ⭐ **phone_click** - Llamada telefónica

### NO Marcar (son métricas):
- ❌ add_to_cart
- ❌ view_content
- ❌ remove_from_cart
- ❌ search

---

## 🚀 ¿Listo para Publicar?

1. ✅ Código actualizado
2. ✅ JSON de GTM generado
3. ⏳ Importar JSON a GTM
4. ⏳ Probar en Preview Mode
5. ⏳ Publicar en GTM
6. ⏳ Marcar conversiones en GA4

¡Todo listo! 🎉
