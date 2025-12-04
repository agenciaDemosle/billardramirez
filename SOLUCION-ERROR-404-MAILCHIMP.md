# 🚨 Solución Error 404 - Mailchimp API

## El Problema

Estás viendo este error en la consola:
```
Failed to load resource: the server responded with a status of 404 ()
Error: Error al suscribir
```

Esto significa que el endpoint `/api/mailchimp/subscribe` no está accesible en tu servidor de producción.

---

## ✅ Solución Rápida (5 minutos)

### Paso 1: Verifica que el archivo existe

Conéctate a tu servidor (FTP o cPanel File Manager) y verifica que existe:

```
/public_html/api/mailchimp/subscribe.php
```

**¿No existe?** → Sube el archivo desde `dist/api/mailchimp/subscribe.php`

---

### Paso 2: Verifica los permisos

Via FTP o File Manager, haz clic derecho en el archivo → Permisos → Pon **644**

O via SSH:
```bash
chmod 644 public_html/api/mailchimp/subscribe.php
```

---

### Paso 3: Crea/Edita .htaccess

En la carpeta raíz de tu sitio (donde está index.html), crea o edita `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # IMPORTANTE: Permitir acceso a la API de Mailchimp
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]

  # React Router
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Habilitar PHP
<FilesMatch "\.php$">
  SetHandler application/x-httpd-php
</FilesMatch>
```

**IMPORTANTE:** La regla `/api/` DEBE ir ANTES de las reglas de React Router.

---

### Paso 4: Prueba el endpoint

Abre esta URL en tu navegador:
```
https://franciscal46.sg-host.com/api/mailchimp/subscribe
```

**Respuesta esperada (error 405 es OK):**
```json
{"error":"Method not allowed"}
```

Esto significa que el endpoint existe, solo no permite GET (necesita POST).

**Si ves 404:** El archivo no se está ejecutando, continúa con el Paso 5.

---

### Paso 5: Verifica PHP

#### Via cPanel:

1. Ve a **cPanel** → **Select PHP Version**
2. Asegúrate de que PHP esté habilitado (7.4 o superior recomendado)
3. Verifica que la extensión **cURL** esté habilitada (necesaria para Mailchimp)

#### Via .htaccess (alternativa):

Agrega esto a tu `.htaccess`:
```apache
AddHandler application/x-httpd-php .php
```

---

## 🧪 Prueba Final

### Prueba 1: Curl desde Terminal

```bash
curl -X POST https://franciscal46.sg-host.com/api/mailchimp/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","tags":["newsletter"]}'
```

**Respuesta esperada:**
```json
{"success":true,"message":"Suscripción exitosa"}
```

### Prueba 2: Newsletter en el Sitio

1. Ve a tu sitio: https://franciscal46.sg-host.com
2. Scroll hasta "SUSCRÍBETE Y RECIBE OFERTAS EXCLUSIVAS"
3. Ingresa un email de prueba
4. Haz clic en enviar
5. No deberías ver errores en la consola
6. Verifica en Mailchimp que el contacto se agregó

---

## 🔍 Diagnóstico Avanzado

### Si el archivo existe pero sigue dando 404:

#### Opción A: El servidor bloquea la ejecución de PHP en subdirectorios

**Solución:** Contacta a tu hosting y pide que habiliten PHP en la carpeta `/api/`

**O** mueve el endpoint a la raíz:
```
/public_html/mailchimp-subscribe.php
```

Y actualiza la URL en tu código frontend:
```javascript
const response = await fetch('/mailchimp-subscribe.php', {
```

#### Opción B: mod_rewrite no está habilitado

**Solución:** En cPanel → PHP Extensions → Habilitar mod_rewrite

#### Opción C: Conflicto con WordPress

Si tienes WordPress en la misma carpeta, puede haber conflictos.

**Solución:** Asegúrate de que la regla de API va ANTES de las reglas de WordPress en .htaccess

---

## 📞 Ayuda del Hosting

Si después de estos pasos sigue sin funcionar, contacta a tu hosting:

**Pregunta exacta para el soporte:**
> "Tengo un archivo PHP en /public_html/api/mailchimp/subscribe.php pero me da error 404 cuando intento acceder a él via URL. ¿Pueden verificar que PHP está habilitado en esa ruta y que no hay reglas que bloqueen el acceso?"

**SiteGround Support:**
- Chat 24/7 en el panel
- O abre un ticket en: https://my.siteground.com/support/tickets

---

## ✅ Checklist

- [ ] Archivo existe en `/public_html/api/mailchimp/subscribe.php`
- [ ] Permisos son 644
- [ ] `.htaccess` tiene regla para `/api/`
- [ ] PHP está habilitado (versión 7.4+)
- [ ] cURL está habilitado en PHP
- [ ] Endpoint responde (aunque sea con error 405)
- [ ] Prueba con curl funciona
- [ ] Newsletter en el sitio funciona

---

## 🎯 Archivos que Necesitas

Todos están en tu carpeta del proyecto:

1. **dist/api/mailchimp/subscribe.php** → Sube a servidor
2. **dist/.htaccess** → Sube a servidor (o crea uno nuevo)
3. **DESPLIEGUE-PRODUCCION.md** → Lee para instrucciones completas

---

## 💡 Tip Rápido

Si no quieres lidiar con PHP, puedes usar un servicio como:
- **Zapier** - Conecta formularios web con Mailchimp
- **Make (Integromat)** - Similar a Zapier
- **Formspree** - Maneja formularios y conecta con Mailchimp

Pero la solución actual es más rápida y no tiene costos adicionales.
