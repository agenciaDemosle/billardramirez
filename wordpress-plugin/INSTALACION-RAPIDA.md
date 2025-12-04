# ⚡ Instalación Rápida - Plugin CORS

## 📦 Opción 1: Subir ZIP desde WordPress (RECOMENDADO)

1. Descarga el archivo `billard-ramirez-cors.zip`

2. Ve a tu WordPress Admin:
   ```
   https://billardramirez.cl/wp-admin
   ```

3. Ve a: **Plugins** → **Añadir nuevo** → **Subir plugin**

4. Selecciona el archivo `billard-ramirez-cors.zip`

5. Haz clic en **Instalar ahora**

6. Haz clic en **Activar plugin**

7. ¡Listo! Refresca tu sitio frontend y los errores de CORS deberían desaparecer

---

## 📁 Opción 2: FTP/cPanel

1. Conéctate a tu servidor via FTP o cPanel File Manager

2. Navega a:
   ```
   /public_html/wp-content/plugins/
   ```

3. Crea una carpeta nueva:
   ```
   billard-ramirez-cors
   ```

4. Sube el archivo `billard-ramirez-cors.php` dentro de esa carpeta

5. Ve a WordPress Admin → Plugins

6. Busca "Billard Ramirez CORS Handler" y actívalo

---

## ✅ Verificación Rápida

Después de activar el plugin:

1. Abre tu sitio frontend: `https://franciscal46.sg-host.com`

2. Abre la consola del navegador (F12)

3. Navega por el sitio

4. **Si ya no ves errores de CORS = ¡Funciona!** ✅

---

## 🚨 Si el problema persiste

1. **Limpia la caché:**
   - WordPress Admin → Plugins → Busca tu plugin de caché → Limpiar caché
   - O desactiva temporalmente el plugin de caché

2. **Limpia la caché del navegador:**
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Del
   - Safari: Cmd+Option+E

3. **Verifica que el plugin está activo:**
   - WordPress Admin → Plugins
   - Debe decir "Activado" bajo "Billard Ramirez CORS Handler"

4. **Revisa el archivo .htaccess:**
   - A veces las reglas de Apache pueden interferir
   - Contacta a tu hosting si no estás seguro

---

## 📞 ¿Necesitas ayuda?

Si después de estos pasos el problema persiste:

- **Email:** contacto@billardramirez.cl
- **Teléfono:** +56 9 6583 9601

---

## 🎯 Dominios Configurados

El plugin ya está configurado para permitir estos dominios:

✅ `https://franciscal46.sg-host.com` (Tu sitio de producción)
✅ `https://billardramirez.cl` (Dominio principal)
✅ `http://localhost:5173` (Desarrollo local)

Si necesitas agregar más dominios, edita el archivo del plugin.
