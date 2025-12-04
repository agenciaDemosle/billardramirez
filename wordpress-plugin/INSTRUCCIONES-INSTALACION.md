# 🚀 Instrucciones de Instalación - Plugin CORS

## ✅ OPCIÓN 1: WordPress Admin (RECOMENDADA - 2 minutos)

### Pasos:

1. **Descarga el archivo:**
   - Busca el archivo `billard-ramirez-cors.zip` en tu computadora
   - (Ya lo tienes en: `Desktop/billard-ramirez/wordpress-plugin/billard-ramirez-cors.zip`)

2. **Ve a tu WordPress Admin:**
   ```
   https://billardramirez.cl/wp-admin
   ```

3. **Instala el plugin:**
   - En el menú lateral, ve a: **Plugins** → **Añadir nuevo**
   - Haz clic en el botón **Subir plugin** (arriba)
   - Haz clic en **Seleccionar archivo**
   - Selecciona `billard-ramirez-cors.zip`
   - Haz clic en **Instalar ahora**
   - Espera a que termine la instalación
   - Haz clic en **Activar plugin**

4. **Verifica:**
   - Ve a **Plugins** → **Plugins instalados**
   - Deberías ver "Billard Ramirez CORS Handler" con estado "Activo"

5. **Prueba:**
   - Abre tu sitio: https://franciscal46.sg-host.com
   - Abre la consola del navegador (F12)
   - Los errores de CORS deberían haber desaparecido ✅

---

## 📁 OPCIÓN 2: FTP/cPanel (5 minutos)

### A. Via cPanel File Manager:

1. **Accede a cPanel:**
   ```
   https://billardramirez.cl/cpanel
   ```

2. **Abre el File Manager**

3. **Navega a la carpeta de plugins:**
   ```
   public_html/wp-content/plugins/
   ```

4. **Sube el plugin:**
   - Opción A: Sube el ZIP y descomprímelo allí
   - Opción B: Crea carpeta `billard-ramirez-cors` y sube `billard-ramirez-cors.php` dentro

5. **Activa el plugin:**
   - Ve a: https://billardramirez.cl/wp-admin/plugins.php
   - Busca "Billard Ramirez CORS Handler"
   - Haz clic en "Activar"

### B. Via FTP (FileZilla, Cyberduck, etc.):

1. **Conéctate a tu servidor FTP:**
   - Host: Tu servidor FTP
   - Usuario: Tu usuario FTP
   - Contraseña: Tu contraseña FTP
   - Puerto: 21 (o 22 si es SFTP)

2. **Navega a:**
   ```
   /public_html/wp-content/plugins/
   ```

3. **Sube la carpeta completa:**
   - Arrastra la carpeta `billard-ramirez-cors` (que contiene `billard-ramirez-cors.php`)
   - O sube el archivo `billard-ramirez-cors.php` directamente dentro de una carpeta nueva llamada `billard-ramirez-cors`

4. **Activa el plugin:**
   - Ve a: https://billardramirez.cl/wp-admin/plugins.php
   - Busca "Billard Ramirez CORS Handler"
   - Haz clic en "Activar"

---

## 🔧 OPCIÓN 3: SSH/Terminal (Avanzado)

Si tienes acceso SSH:

```bash
# Conéctate a tu servidor
ssh usuario@billardramirez.cl

# Navega a la carpeta de plugins
cd public_html/wp-content/plugins/

# Crea la carpeta del plugin
mkdir billard-ramirez-cors

# Edita el archivo del plugin
nano billard-ramirez-cors/billard-ramirez-cors.php

# Pega el contenido del plugin (lo encuentras en tu computadora)
# Guarda con Ctrl+X, luego Y, luego Enter

# Verifica que el archivo existe
ls -la billard-ramirez-cors/

# Listo! Ahora activa el plugin desde WordPress Admin
```

---

## ✅ Verificación

Después de activar el plugin:

### 1. Verifica en WordPress:
```
https://billardramirez.cl/wp-admin/plugins.php
```
- Debe aparecer "Billard Ramirez CORS Handler" como **Activo**

### 2. Verifica en tu sitio frontend:
```
https://franciscal46.sg-host.com
```
- Abre la consola del navegador (F12)
- Navega por el sitio
- **NO deberían aparecer errores de CORS** ✅
- Los productos deberían cargarse correctamente

### 3. Verifica los headers (Opcional):
- Abre la consola (F12)
- Ve a la pestaña **Network**
- Haz clic en cualquier petición a `billardramirez.cl/wp-json/`
- En la pestaña **Headers**, busca:
  - `Access-Control-Allow-Origin: https://franciscal46.sg-host.com`
  - Si lo ves = ¡Funciona! ✅

---

## 🚨 Solución de Problemas

### El plugin no aparece en la lista
- Verifica que subiste el archivo a: `/wp-content/plugins/billard-ramirez-cors/`
- Verifica que el archivo se llama exactamente: `billard-ramirez-cors.php`
- Verifica los permisos del archivo (deben ser 644 o 755)

### El plugin está activo pero los errores persisten
1. **Limpia la caché de WordPress:**
   - Si usas WP Super Cache, W3 Total Cache, etc.
   - Ve a los ajustes del plugin de caché y limpia todo

2. **Limpia la caché del navegador:**
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Del
   - Safari: Cmd+Option+E

3. **Desactiva otros plugins de seguridad temporalmente:**
   - Wordfence, iThemes Security, etc.
   - Pueden estar bloqueando los headers CORS

4. **Verifica el archivo .htaccess:**
   - A veces tiene reglas que interfieren con CORS
   - Haz backup y prueba con un .htaccess limpio

### Error al activar el plugin
- Verifica que tu PHP es versión 7.0 o superior
- Revisa los logs de error de WordPress en: `/wp-content/debug.log`

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas con la instalación:

1. **Revisa los errores en la consola** del navegador
2. **Revisa los logs de WordPress** en `/wp-content/debug.log`
3. **Contacta al soporte del hosting** si no puedes subir archivos

---

## 📝 Archivos del Plugin

El plugin consiste en:

```
billard-ramirez-cors/
├── billard-ramirez-cors.php  (Archivo principal - 150 líneas)
└── README.md                  (Documentación)
```

**Ubicación final en el servidor:**
```
/public_html/wp-content/plugins/billard-ramirez-cors/billard-ramirez-cors.php
```

---

## 🎯 Resumen Rápido

1. ✅ Sube `billard-ramirez-cors.zip` via WordPress Admin → Plugins → Añadir nuevo
2. ✅ Activa el plugin
3. ✅ Refresca tu sitio frontend
4. ✅ Los errores de CORS desaparecen
5. ✅ Todo funciona correctamente

**Tiempo estimado: 2-3 minutos**
