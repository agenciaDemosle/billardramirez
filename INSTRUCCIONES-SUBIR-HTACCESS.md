# 📤 Instrucciones para Subir .htaccess

## El Problema

El endpoint de Mailchimp da **error 404** porque falta la configuración en `.htaccess` que permite el acceso a `/api/`.

## La Solución (5 minutos)

### Paso 1: Localiza el archivo

El archivo `.htaccess` ya está listo en tu computadora:

```
Desktop/billard-ramirez/dist/.htaccess
```

**IMPORTANTE:** Es un archivo oculto (empieza con punto).

---

### Paso 2: Sube el archivo al servidor

#### Opción A: Via cPanel File Manager

1. Accede a cPanel de **franciscal46.sg-host.com**
2. Abre **File Manager**
3. Ve a `/public_html/`
4. Haz clic en **Settings** (arriba a la derecha)
5. Marca **"Show Hidden Files (dotfiles)"**
6. Haz clic en **Save**
7. Si ya existe `.htaccess`, haz backup:
   - Clic derecho en `.htaccess` → Rename → `.htaccess.backup`
8. Haz clic en **Upload** (arriba)
9. Selecciona el archivo `dist/.htaccess` de tu computadora
10. Sube el archivo

#### Opción B: Via FTP (FileZilla, Cyberduck, etc)

1. Conéctate a **franciscal46.sg-host.com** via FTP
2. Ve a la carpeta `/public_html/`
3. En tu cliente FTP, habilita "Mostrar archivos ocultos"
   - **FileZilla:** Server → Force showing hidden files
   - **Cyberduck:** View → Show Hidden Files
4. Si ya existe `.htaccess`, descárgalo como backup
5. Sube el nuevo archivo `dist/.htaccess` a `/public_html/`
6. Verifica que el archivo se llamó `.htaccess` (no `.htaccess.txt`)

---

### Paso 3: Verifica los permisos

El archivo debe tener permisos **644**

**Via cPanel:**
1. Clic derecho en `.htaccess`
2. Change Permissions
3. Establece: **644**
4. Guarda

**Via FTP:**
1. Clic derecho en `.htaccess`
2. File Permissions
3. Establece: **644** o `rw-r--r--`

---

### Paso 4: Prueba el endpoint

#### Prueba 1: En el navegador

Abre esta URL:
```
https://franciscal46.sg-host.com/api/mailchimp/subscribe
```

**Respuesta esperada (405 es OK):**
```json
{"error":"Method not allowed"}
```

Esto significa que el endpoint existe. ✅

**Si sigues viendo 404:** Continúa al Paso 5

---

#### Prueba 2: Desde la terminal

```bash
curl -X POST https://franciscal46.sg-host.com/api/mailchimp/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","tags":["newsletter"]}'
```

**Respuesta esperada:**
```json
{"success":true,"message":"Suscripción exitosa"}
```

---

#### Prueba 3: En el sitio web

1. Ve a: https://franciscal46.sg-host.com
2. Scroll hasta "SUSCRÍBETE Y RECIBE OFERTAS EXCLUSIVAS"
3. Ingresa un email de prueba
4. Envía
5. Abre la consola del navegador (F12)
6. **No debe haber error 404**
7. Verifica en Mailchimp que se agregó el contacto

---

### Paso 5: Si sigue sin funcionar

#### Problema: PHP no está habilitado

**Solución:**

1. Ve a cPanel → **Select PHP Version**
2. Verifica que PHP **7.4 o superior** esté seleccionado
3. Ve a **Extensions**
4. Asegúrate de que **cURL** esté habilitado (tiene check ✓)
5. Guarda

#### Problema: mod_rewrite no está habilitado

**Solución:**

Contacta a soporte de SiteGround:

> "Tengo un archivo PHP en /public_html/api/mailchimp/subscribe.php pero obtengo error 404. Subí mi .htaccess con reglas mod_rewrite para permitir /api/ pero no funciona. ¿Pueden verificar que mod_rewrite está habilitado en mi cuenta?"

**Chat de soporte:** Disponible 24/7 en cPanel

---

## ✅ Checklist Final

- [ ] Archivo `.htaccess` subido a `/public_html/`
- [ ] Permisos son **644**
- [ ] Archivos ocultos están visibles (si usas cPanel/FTP)
- [ ] PHP 7.4+ está habilitado
- [ ] cURL está habilitado en PHP
- [ ] Endpoint responde (aunque sea con 405)
- [ ] Newsletter funciona en el sitio
- [ ] No hay errores 404 en la consola

---

## 📋 Resumen

**Qué cambió en .htaccess:**

Se agregaron 2 secciones críticas:

```apache
# 1. Permitir acceso a /api/ (líneas 9-14)
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# 2. Habilitar PHP (líneas 91-96)
<FilesMatch "\.php$">
  SetHandler application/x-httpd-php
</FilesMatch>
```

Estas líneas le dicen a Apache:
1. "Si la URL empieza con `/api/`, no la redirijas a index.html"
2. "Ejecuta los archivos .php como scripts PHP"

---

## 🎯 Estructura Final en el Servidor

```
franciscal46.sg-host.com/public_html/
├── .htaccess                      ← Subir este archivo
├── index.html
├── assets/
└── api/
    └── mailchimp/
        └── subscribe.php          ← Ya existe
```

---

## 💡 Tip Rápido

Si quieres verificar que `.htaccess` se subió correctamente:

1. Via cPanel File Manager, ve a `/public_html/`
2. Habilita "Show Hidden Files"
3. Haz clic en `.htaccess`
4. Clic en **Edit**
5. Verifica que veas estas líneas:

```apache
# IMPORTANTE: Permitir acceso a la API de Mailchimp
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]
```

Si no las ves, el archivo no se subió correctamente o se sobrescribió.

---

## 📞 Soporte

Si después de estos pasos sigue sin funcionar:

1. **Revisa la consola del navegador** (F12) para errores específicos
2. **Contacta a SiteGround Support** (chat 24/7 en cPanel)
3. **Verifica los logs del servidor** en cPanel → Error Log

---

**¡Listo!** Una vez subido el `.htaccess`, el endpoint de Mailchimp debería funcionar inmediatamente. 🎉
