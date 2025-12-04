# Plugin CORS para Billard Ramirez

Este plugin soluciona los problemas de CORS (Cross-Origin Resource Sharing) al conectar el frontend de React con la API de WooCommerce en WordPress.

## 🔧 Instalación

### Método 1: Instalación Manual via FTP/cPanel

1. **Descarga el archivo** `billard-ramirez-cors.php`

2. **Conéctate a tu servidor** via FTP o cPanel File Manager

3. **Navega a la carpeta de plugins:**
   ```
   /wp-content/plugins/
   ```

4. **Crea una carpeta nueva:**
   ```
   /wp-content/plugins/billard-ramirez-cors/
   ```

5. **Sube el archivo** `billard-ramirez-cors.php` dentro de esa carpeta

6. **Activa el plugin:**
   - Ve a WordPress Admin → Plugins
   - Busca "Billard Ramirez CORS Handler"
   - Haz clic en "Activar"

### Método 2: Instalación via WordPress Admin

1. **Comprime el plugin en ZIP:**
   - Crea una carpeta llamada `billard-ramirez-cors`
   - Mueve `billard-ramirez-cors.php` dentro de la carpeta
   - Comprime la carpeta en `billard-ramirez-cors.zip`

2. **Sube el plugin:**
   - Ve a WordPress Admin → Plugins → Añadir nuevo
   - Haz clic en "Subir plugin"
   - Selecciona el archivo ZIP
   - Haz clic en "Instalar ahora"
   - Activa el plugin

## ✅ Verificación

Después de activar el plugin, verifica que funciona correctamente:

1. **Abre la consola del navegador** en tu sitio frontend
2. **Navega por el sitio** y verifica que ya no aparecen los errores de CORS
3. **Revisa las peticiones** en la pestaña Network:
   - Deberías ver el header `Access-Control-Allow-Origin` en las respuestas
   - Las peticiones OPTIONS deberían retornar 204 (No Content)

## 🌐 Dominios Permitidos

El plugin está configurado para permitir peticiones desde estos dominios:

- `https://franciscal46.sg-host.com` (Producción)
- `https://billardramirez.cl` (Dominio principal)
- `http://localhost:5173` (Desarrollo local Vite)
- `http://localhost:3000` (Desarrollo local alternativo)

### Agregar más dominios

Si necesitas permitir otros dominios, edita el archivo `billard-ramirez-cors.php` y agrega el dominio al array `$allowed_origins`:

```php
private $allowed_origins = [
    'https://franciscal46.sg-host.com',
    'https://billardramirez.cl',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://tu-nuevo-dominio.com', // ← Agregar aquí
];
```

## 🔍 Solución de Problemas

### El error de CORS persiste

1. **Limpia la caché** de WordPress si usas un plugin de caché
2. **Limpia la caché del navegador** (Ctrl+Shift+Delete)
3. **Verifica que el plugin está activo** en WordPress Admin → Plugins
4. **Revisa los logs de PHP** en tu servidor para ver si hay errores

### Las peticiones OPTIONS fallan

1. Verifica que tu servidor Apache/Nginx no esté bloqueando las peticiones OPTIONS
2. En Apache, asegúrate de que mod_headers esté habilitado
3. Revisa el archivo `.htaccess` para reglas que puedan interferir

### Error 401 Unauthorized

Si recibes errores de autenticación:

1. Verifica que las credenciales de WooCommerce (consumer_key y consumer_secret) sean correctas
2. Asegúrate de usar HTTPS si estás en producción
3. El plugin CORS no afecta la autenticación, solo los headers

## 📝 Notas Técnicas

### Headers CORS que agrega el plugin:

```
Access-Control-Allow-Origin: [origen-permitido]
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce
Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages
Access-Control-Max-Age: 86400
```

### Rutas afectadas:

El plugin aplica los headers CORS a todas las rutas que comienzan con:
- `/wp-json/*` (WordPress REST API)
- `/wp-json/wc/v3/*` (WooCommerce REST API)

## 🔒 Seguridad

El plugin solo permite peticiones desde los dominios especificados en `$allowed_origins`.

**IMPORTANTE:** No uses `*` (wildcard) en producción, ya que permitiría peticiones desde cualquier dominio.

## 📞 Soporte

Si tienes problemas con la instalación o configuración del plugin, contacta a:
- Email: contacto@billardramirez.cl
- Teléfono: +56 9 6583 9601

## 📄 Licencia

GPL v2 or later
