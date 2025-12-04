# Integración de Mailchimp con WordPress (SIN PHP)

Esta guía explica cómo conectar tu aplicación React con el plugin de Mailchimp instalado en WordPress.

## ✅ Lo que ya está hecho

1. **Plugin de Mailchimp instalado** en https://billardramirez.cl/
2. **Código React configurado** para conectarse al plugin
3. **Formulario de Newsletter** agregado en el Footer
4. **Modal de notificación de stock** actualizado

## 🔧 Configuración del Plugin de Mailchimp en WordPress

### Paso 1: Verificar que el plugin esté activo

1. Ingresa al panel de WordPress: https://billardramirez.cl/wp-admin/
2. Ve a **Plugins** > **Plugins instalados**
3. Busca el plugin de Mailchimp (puede ser "Mailchimp for WordPress", "MC4WP", o similar)
4. Asegúrate de que esté **activado**

### Paso 2: Configurar el plugin de Mailchimp

1. Ve a **Mailchimp for WP** (o el nombre del plugin) en el menú lateral
2. Ve a la sección de **Integraciones** o **API**
3. Ingresa tu **API Key** de Mailchimp
4. Selecciona la **Lista** (Audience) donde se guardarán los suscriptores

### Paso 3: Habilitar AJAX endpoint (IMPORTANTE)

Algunos plugins de Mailchimp requieren configuración adicional para exponer el endpoint AJAX. Verifica lo siguiente:

1. Ve a las **Configuraciones** del plugin
2. Busca una opción como "Enable AJAX submissions" o "AJAX mode"
3. **Actívala** si está disponible

### Paso 4: Configurar campos personalizados en Mailchimp

Para que funcione la notificación de stock, necesitas agregar campos personalizados en tu audiencia de Mailchimp:

1. Ve a Mailchimp.com
2. Selecciona tu **Audience**
3. Ve a **Settings** > **Audience fields and *|MERGE|* tags**
4. Agrega estos campos:

| Field Name    | Tag        | Type | Required |
|--------------|------------|------|----------|
| Product ID   | PRODUCT_ID | Text | No       |
| Product Name | PRODUCT_NAME | Text | No       |
| Tags         | TAGS       | Text | No       |

### Paso 5: Crear Tags en Mailchimp

1. Ve a tu **Audience** en Mailchimp
2. Ve a **Tags**
3. Crea estos tags:
   - `newsletter` - Para suscriptores del newsletter
   - `stock-notification` - Para notificaciones de stock

## 🧪 Probar la integración

### Opción 1: Probar desde la aplicación local

1. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:5173
3. Ve al Footer y prueba el formulario de newsletter
4. Ve a un producto agotado y prueba "Avísame cuando llegue"

### Opción 2: Probar en producción

1. Compila el proyecto:
   ```bash
   npm run build
   ```

2. Sube los archivos de `dist/` a tu servidor
3. Prueba en https://billardramirez.cl/

## 🔍 Solución de problemas

### Error: "Action not found" o 404

**Causa**: El plugin no está exponiendo el endpoint AJAX correctamente.

**Solución**:
1. Verifica que el plugin esté activo
2. Puede que necesites usar un plugin diferente o configurar un endpoint personalizado
3. Alternativa: Usar el archivo PHP que ya tienes en `public/api/mailchimp/subscribe.php`

### Error: "Invalid API Key"

**Causa**: La API Key no está configurada en el plugin de WordPress.

**Solución**:
1. Ve a WordPress Admin > Plugin de Mailchimp > Settings
2. Ingresa tu API Key correcta
3. Guarda los cambios

### Los emails no llegan a Mailchimp

**Causa**: Puede ser CORS o configuración del plugin.

**Solución temporal - Usar el endpoint PHP**:

Si el plugin de WordPress no funciona, puedes usar el archivo PHP ya creado:

1. Edita `src/api/mailchimp.ts`
2. Cambia la URL del endpoint:

```typescript
// En lugar de usar admin-ajax.php
const response = await fetch(`${WORDPRESS_URL}/wp-admin/admin-ajax.php`, {

// Usa el endpoint PHP directo
const response = await fetch(`https://billardramirez.cl/api/mailchimp/subscribe.php`, {
```

3. También necesitarás cambiar el método de envío de FormData a JSON:

```typescript
const response = await fetch(`https://billardramirez.cl/api/mailchimp/subscribe.php`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: data.email,
    productId: data.productId,
    productName: data.productName,
    tags: data.tags,
  }),
});
```

## 📋 Plugins de Mailchimp recomendados para WordPress

Si aún no tienes un plugin instalado, estos son los más populares:

1. **MC4WP: Mailchimp for WordPress** (Recomendado)
   - Gratis
   - Fácil de configurar
   - Expone endpoint AJAX automáticamente

2. **Newsletter, SMTP, Email marketing and Subscribe forms**
   - Alternativa gratuita
   - Integración con múltiples servicios

3. **Mailchimp for WooCommerce** (Si usas WooCommerce)
   - Integración específica para tiendas
   - Sincroniza clientes automáticamente

## 🚀 Próximos pasos

1. Configura **automatizaciones** en Mailchimp:
   - Email de bienvenida para tag `newsletter`
   - Email de notificación para tag `stock-notification`

2. Prueba el flujo completo:
   - Suscripción → Email de confirmación → Email de bienvenida

3. Monitorea los suscriptores en Mailchimp

## 📞 Contacto

Si necesitas ayuda adicional, verifica:
- La documentación del plugin de Mailchimp que instalaste
- Los logs de errores en WordPress (WP Debug)
- La consola del navegador para errores AJAX
