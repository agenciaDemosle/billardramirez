# 🚀 Guía de Despliegue a Producción

Esta guía explica cómo desplegar correctamente el frontend de React y el endpoint PHP de Mailchimp.

## 📦 Preparación

### 1. Build de Producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos optimizados.

---

## 🌐 Estructura del Servidor

Tu servidor debe tener esta estructura:

```
public_html/
├── index.html                          (Frontend React)
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── api/
│   └── mailchimp/
│       └── subscribe.php               (Endpoint Mailchimp)
└── images/                             (Imágenes del sitio)
```

---

## 📁 Opción 1: Despliegue en Subdirectorio (franciscal46.sg-host.com)

Si el frontend está en un subdirectorio separado del WordPress:

### Estructura Recomendada:

```
public_html/
├── wp-admin/                           (WordPress Admin)
├── wp-content/                         (WordPress Content)
├── wp-includes/                        (WordPress Core)
├── app/                                ← Frontend React aquí
│   ├── index.html
│   ├── assets/
│   └── api/
│       └── mailchimp/
│           └── subscribe.php
└── index.php                           (WordPress)
```

### Pasos:

1. **Sube el contenido de `dist/` a `/public_html/app/`**

2. **Verifica permisos del archivo PHP:**
   ```bash
   chmod 644 public_html/app/api/mailchimp/subscribe.php
   ```

3. **Prueba el endpoint:**
   ```
   https://franciscal46.sg-host.com/app/api/mailchimp/subscribe
   ```

### Configurar .htaccess en /public_html/app/

Crea o edita `.htaccess` en la carpeta `app/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /app/

  # Permitir acceso a la API de Mailchimp
  RewriteCond %{REQUEST_URI} ^/app/api/
  RewriteRule ^ - [L]

  # Redirigir todo lo demás a index.html (React Router)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Habilitar PHP
<FilesMatch "\.php$">
  SetHandler application/x-httpd-php
</FilesMatch>

# Headers CORS para API local
<IfModule mod_headers.c>
  <FilesMatch "\.(php)$">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
  </FilesMatch>
</IfModule>
```

---

## 📁 Opción 2: Despliegue en Dominio Principal

Si el frontend reemplaza completamente el sitio en el dominio principal:

### Estructura:

```
public_html/
├── index.html                          (Frontend React)
├── assets/
├── api/
│   └── mailchimp/
│       └── subscribe.php
└── .htaccess
```

### Pasos:

1. **Respalda WordPress** (si existe)

2. **Sube el contenido de `dist/` a `/public_html/`**

3. **Configura .htaccess:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Permitir acceso a la API de Mailchimp
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]

  # Redirigir todo lo demás a index.html (React Router)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Habilitar PHP
<FilesMatch "\.php$">
  SetHandler application/x-httpd-php
</FilesMatch>

# Headers CORS para API local
<IfModule mod_headers.c>
  <FilesMatch "\.(php)$">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
  </FilesMatch>
</IfModule>
```

---

## 🔧 Solución de Problemas

### Error 404 en /api/mailchimp/subscribe

#### Causa 1: PHP no está habilitado

**Solución:**
```apache
# Agrega esto a .htaccess
<FilesMatch "\.php$">
  SetHandler application/x-httpd-php
</FilesMatch>
```

#### Causa 2: mod_rewrite interfiere con la ruta

**Solución:**
```apache
# Agrega ANTES de las reglas de React Router
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]
```

#### Causa 3: Permisos incorrectos

**Solución:**
```bash
chmod 644 api/mailchimp/subscribe.php
```

#### Causa 4: Archivo no existe

**Verificar:**
```bash
ls -la public_html/api/mailchimp/subscribe.php
```

---

### Error: "Call to undefined function curl_init"

PHP no tiene cURL habilitado.

**Solución:**

1. Contacta a tu hosting para habilitar cURL
2. O verifica en cPanel → PHP Extensions → Habilitar cURL

---

### Error: Newsletter/Stock Notification no funciona

#### 1. Verifica que el endpoint responde:

```bash
curl -X POST https://franciscal46.sg-host.com/api/mailchimp/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","tags":["newsletter"]}'
```

**Respuesta esperada:**
```json
{"success":true,"message":"Suscripción exitosa"}
```

#### 2. Verifica las credenciales de Mailchimp:

Edita `api/mailchimp/subscribe.php` y verifica que:
- API Key esté correcta
- List ID esté correcto

#### 3. Verifica los logs de PHP:

En cPanel → Error Logs → Busca errores relacionados con Mailchimp

---

## ✅ Verificación Post-Despliegue

### 1. Frontend carga correctamente
```
✅ https://franciscal46.sg-host.com/
```

### 2. API de Mailchimp responde
```
✅ https://franciscal46.sg-host.com/api/mailchimp/subscribe
```

### 3. API de WooCommerce funciona (con plugin CORS)
```
✅ https://billardramirez.cl/wp-json/wc/v3/products
```

### 4. Newsletter funciona
- Ve al formulario "SUSCRÍBETE Y RECIBE OFERTAS EXCLUSIVAS"
- Ingresa un email de prueba
- No debería haber errores en la consola
- Verifica en Mailchimp que el contacto se agregó

### 5. Notificaciones de stock funcionan
- Ve a un producto agotado
- Haz clic en "Avísame cuando llegue"
- Ingresa un email
- Verifica en Mailchimp que el contacto se agregó con tag "stock-notification"

---

## 🔄 Actualizar en Producción

Cuando hagas cambios:

1. **Hacer build:**
   ```bash
   npm run build
   ```

2. **Subir solo archivos modificados:**
   - Si cambiaste frontend: Sube `dist/index.html` y `dist/assets/`
   - Si cambiaste API: Sube solo `dist/api/mailchimp/subscribe.php`

3. **Limpia caché del navegador:**
   - Ctrl+Shift+Delete
   - O agrega `?v=2` a la URL para forzar recarga

---

## 📞 Soporte del Hosting

Si tienes problemas que no puedes resolver:

1. **SiteGround Support:**
   - Chat en vivo disponible 24/7
   - Email: support@siteground.com
   - Teléfono: Disponible en el panel de control

2. **Preguntas útiles para el soporte:**
   - "¿PHP está habilitado en mi dominio?"
   - "¿Cómo habilito cURL en PHP?"
   - "¿Cómo configuro archivos PHP para que se ejecuten en una subcarpeta?"
   - "¿Por qué obtengo 404 en archivos .php?"

---

## 🎯 Resumen Rápido

```bash
# 1. Build
npm run build

# 2. Sube dist/ a tu servidor via FTP/cPanel
# Ubicación: /public_html/app/ (o /public_html/ si es dominio principal)

# 3. Crea/edita .htaccess con la configuración de arriba

# 4. Verifica permisos
chmod 644 api/mailchimp/subscribe.php

# 5. Prueba el endpoint
curl https://tu-dominio.com/api/mailchimp/subscribe

# 6. ¡Listo!
```

---

## 📝 Checklist de Despliegue

- [ ] Build completado (`npm run build`)
- [ ] Contenido de `dist/` subido al servidor
- [ ] `.htaccess` configurado correctamente
- [ ] Permisos de archivos verificados
- [ ] Plugin CORS instalado en WordPress
- [ ] Endpoint Mailchimp responde (status 200)
- [ ] Frontend carga sin errores
- [ ] Productos de WooCommerce cargan
- [ ] Newsletter funciona
- [ ] Notificaciones de stock funcionan
- [ ] Imágenes cargan correctamente
- [ ] Navegación funciona (React Router)
