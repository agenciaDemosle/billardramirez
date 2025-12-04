# Configuración de Mailchimp para Notificaciones de Stock

Este documento explica cómo configurar la integración con Mailchimp para capturar leads de productos agotados.

## 📋 Requisitos

- Cuenta de Mailchimp (gratuita o de pago)
- Acceso al panel de administración de Mailchimp
- Servidor con PHP habilitado

## 🔧 Pasos de Configuración

### 1. Obtener API Key de Mailchimp

1. Inicia sesión en tu cuenta de Mailchimp
2. Ve a **Profile** > **Extras** > **API keys**
   - URL directa: https://admin.mailchimp.com/account/api/
3. Haz clic en **Create A Key**
4. Copia la API Key generada (formato: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us21`)

### 2. Obtener List ID (Audience ID)

1. Ve a **Audience** > **All contacts**
   - URL directa: https://admin.mailchimp.com/lists/
2. Haz clic en **Settings** > **Audience name and defaults**
3. Busca el campo **Audience ID**
4. Copia el ID (formato: `xxxxxxxxxx`)

### 3. Configurar Campos Personalizados (Merge Fields)

1. Ve a tu Audience > **Settings** > **Audience fields and *|MERGE|* tags**
2. Agrega los siguientes campos personalizados:

   | Field Name    | Tag Name      | Type | Required |
   |--------------|---------------|------|----------|
   | Product ID   | PRODUCT_ID    | Text | No       |
   | Product Name | PRODUCT_NAME  | Text | No       |

### 4. Crear Tags

1. Ve a **Audience** > **Tags**
2. Crea los siguientes tags:
   - `stock-notification` - Para notificaciones de productos agotados
   - `newsletter` - Para suscriptores del newsletter
3. Estos tags te permitirán segmentar a los usuarios por tipo de suscripción

### 5. Configurar Variables de Entorno

Hay dos formas de configurar las credenciales:

#### Opción A: Variables de Entorno (Recomendado)

En tu servidor, configura las siguientes variables:

```bash
export MAILCHIMP_API_KEY="tu_api_key_aqui-us21"
export MAILCHIMP_LIST_ID="tu_list_id_aqui"
```

#### Opción B: Editar directamente el archivo PHP

Edita el archivo `public/api/mailchimp/subscribe.php`:

```php
$apiKey = 'tu_api_key_aqui-us21';
$listId = 'tu_list_id_aqui';
```

## 📧 Configurar Automatizaciones de Email

### Automatización 1: Notificación de Stock

1. Ve a **Automations** > **Create** > **Custom**
2. Configura el trigger:
   - **Trigger**: Tag added
   - **Tag**: `stock-notification`
3. Agrega un email con el contenido:

```
Subject: ¡{{PRODUCT_NAME}} está de vuelta en stock!

Hola,

¡Buenas noticias! El producto que estabas esperando ya está disponible:

**{{PRODUCT_NAME}}**

[Ver Producto](https://tudominio.com/producto/{{PRODUCT_ID}})

¡No te lo pierdas!

Saludos,
El equipo de Billard Ramirez
```

### Automatización 2: Bienvenida Newsletter

1. Ve a **Automations** > **Create** > **Welcome new subscribers**
2. Configura el trigger:
   - **Trigger**: Tag added
   - **Tag**: `newsletter`
3. Agrega un email de bienvenida:

```
Subject: ¡Bienvenido a Billard Ramirez! 🎱

Hola,

¡Gracias por suscribirte a nuestro newsletter!

Ahora recibirás:
✓ Ofertas exclusivas antes que nadie
✓ Novedades de productos
✓ Consejos y trucos de billar
✓ Descuentos especiales para suscriptores

Tu primer descuento: USA EL CÓDIGO NEWSLETTER10 para 10% OFF en tu próxima compra.

[Visitar Tienda](https://tudominio.com/tienda)

¡Que disfrutes!

El equipo de Billard Ramirez
```

## 🧪 Probar la Integración

### 1. Probar Notificación de Stock

Ejecuta el siguiente comando desde tu terminal:

```bash
curl -X POST http://localhost:5173/api/mailchimp/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "productId": 123,
    "productName": "Mesa de Pool Profesional",
    "tags": ["stock-notification"]
  }'
```

### 2. Probar Newsletter

Ejecuta el siguiente comando desde tu terminal:

```bash
curl -X POST http://localhost:5173/api/mailchimp/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newsletter@example.com",
    "tags": ["newsletter"]
  }'
```

### 3. Verificar en Mailchimp

1. Ve a tu Audience en Mailchimp
2. Busca los emails que acabas de agregar
3. Verifica que tengan:
   - El primer email: tag `stock-notification` + campos PRODUCT_ID y PRODUCT_NAME
   - El segundo email: tag `newsletter`

## 🔄 Flujos Completos

### Flujo 1: Notificación de Stock

1. Usuario visita un producto agotado
2. Usuario hace clic en "Avísame cuando llegue"
3. Usuario ingresa su email en el modal
4. Email se envía a Mailchimp con:
   - Email del usuario
   - ID del producto
   - Nombre del producto
   - Tag: stock-notification
5. Cuando el producto llegue:
   - Actualiza el stock en WooCommerce
   - Mailchimp enviará automáticamente un email a todos los usuarios con el tag correspondiente

### Flujo 2: Suscripción a Newsletter

1. Usuario ingresa su email en el formulario "SUSCRÍBETE Y RECIBE OFERTAS EXCLUSIVAS"
2. Usuario hace clic en enviar
3. Email se envía a Mailchimp con:
   - Email del usuario
   - Tag: newsletter
4. Usuario recibe confirmación visual en la página
5. Mailchimp puede enviar:
   - Email de bienvenida (configurar en automations)
   - Ofertas y promociones semanales/mensuales
   - Contenido exclusivo para suscriptores

## 📊 Reportes y Análisis

### Ver Leads Capturados

1. Ve a **Audience** > **All contacts**
2. Filtra por tags:
   - `stock-notification` - Usuarios esperando restock
   - `newsletter` - Suscriptores del newsletter
3. Exporta las listas si necesitas

### Crear Segmentos

Crea segmentos para analizar:

**Para stock-notification:**
- Productos más solicitados (por PRODUCT_NAME)
- Usuarios que esperan múltiples productos
- Tasa de conversión de notificaciones

**Para newsletter:**
- Suscriptores nuevos (últimos 30 días)
- Suscriptores activos (abren emails)
- Tasa de conversión de ofertas exclusivas
- Segmentar por productos de interés si combinan ambos tags

## 🚨 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que la API Key esté correcta
- Asegúrate de incluir el data center (ej: -us21)

### Error: "List does not exist"
- Verifica el List ID
- Asegúrate de que la lista esté activa

### No se envían emails
- Verifica que la automatización esté activada
- Revisa que el tag esté correctamente escrito
- Comprueba la carpeta de spam

## 📝 Notas Adicionales

- **Límite de API**: Mailchimp tiene límites de llamadas por hora según tu plan
- **GDPR**: Asegúrate de cumplir con las regulaciones de protección de datos
- **Opt-out**: Los usuarios pueden darse de baja en cualquier momento
- **Testing**: Usa una lista de prueba antes de ir a producción

## 🔗 Enlaces Útiles

- [Documentación de Mailchimp API](https://mailchimp.com/developer/marketing/api/)
- [Límites de API](https://mailchimp.com/help/about-api-keys/)
- [Automatizaciones de Mailchimp](https://mailchimp.com/help/create-automation/)
