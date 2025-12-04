# Instalación del Plugin de Personalización de Tacos

## Descripción

Este plugin gestiona la personalización de tacos con grabado láser en el sitio de Billard Ramirez. Permite:

- Configurar el precio del grabado láser desde WordPress
- Exponer el precio via API REST para el frontend
- Guardar automáticamente la metadata de personalización en pedidos de WooCommerce
- Mostrar la personalización en el carrito y pedidos

## Requisitos

- WordPress 5.8 o superior
- WooCommerce 5.0 o superior
- PHP 7.4 o superior

## Instalación

### Método 1: Instalación por panel de WordPress (Recomendado)

1. Accede al panel de administración de WordPress
2. Ve a **Plugins > Añadir nuevo**
3. Haz clic en **Subir plugin**
4. Selecciona el archivo `billard-ramirez-customization.zip`
5. Haz clic en **Instalar ahora**
6. Una vez instalado, haz clic en **Activar plugin**

### Método 2: Instalación manual por FTP

1. Descomprime el archivo `billard-ramirez-customization.zip`
2. Sube la carpeta resultante a `/wp-content/plugins/`
3. Ve a **Plugins** en el panel de WordPress
4. Busca **Billard Ramirez - Personalización de Tacos**
5. Haz clic en **Activar**

### Método 3: Instalación manual sin ZIP

1. Sube el archivo `billard-ramirez-customization.php` directamente a `/wp-content/plugins/`
2. Ve a **Plugins** en el panel de WordPress
3. Busca **Billard Ramirez - Personalización de Tacos**
4. Haz clic en **Activar**

## Configuración

1. Una vez activado, ve a **WooCommerce > Personalización Tacos**
2. Configura el precio del grabado láser (por defecto: $10.000 CLP)
3. Haz clic en **Guardar Configuración**

## Uso

### Para el Frontend (React/Vite)

El plugin expone un endpoint REST API que el frontend puede consumir:

```
GET /wp-json/billard/v1/customization/laser-price
```

Respuesta:
```json
{
  "price": 10000,
  "formatted": "$10.000"
}
```

### Para WooCommerce

El plugin automáticamente:
- Agrega el precio del grabado láser al producto en el carrito
- Muestra la personalización en el carrito
- Guarda la metadata en los pedidos
- Muestra la información en los detalles del pedido

## Metadata Guardada en Pedidos

El plugin guarda la siguiente metadata en cada item del pedido que tenga personalización:

- **Grabado Láser**: Texto visible en el pedido (ej: "Juan Pérez")
- **_laser_engraving_text**: Texto del grabado (metadata oculta)
- **_laser_engraving_price**: Precio del grabado (metadata oculta)

## Verificación

Para verificar que el plugin está funcionando correctamente:

1. Visita en tu navegador:
   ```
   https://tu-dominio.com/wp-json/billard/v1/customization/laser-price
   ```

2. Deberías ver una respuesta JSON con el precio configurado

3. En el frontend, al visitar un producto de la categoría "tacos", deberías ver la opción de grabado láser

## Solución de Problemas

### El plugin no aparece en la lista

- Verifica que WooCommerce esté instalado y activado
- Revisa los permisos de los archivos (644 para archivos, 755 para carpetas)

### El endpoint API no responde

- Verifica que los permalinks estén configurados correctamente en WordPress
- Ve a **Ajustes > Enlaces permanentes** y haz clic en **Guardar cambios**

### El precio no se actualiza en el frontend

- Verifica que la configuración esté guardada en **WooCommerce > Personalización Tacos**
- Limpia la caché del navegador y del servidor si aplica

### La metadata no aparece en los pedidos

- Verifica que el frontend esté enviando los datos de personalización correctamente
- Revisa los logs de WooCommerce en **WooCommerce > Estado > Registros**

## Desinstalación

Para desinstalar el plugin:

1. Desactiva el plugin desde **Plugins**
2. Haz clic en **Eliminar**

**Nota:** La configuración del precio se mantendrá en la base de datos. Si deseas eliminarla completamente, ejecuta esta query en la base de datos:

```sql
DELETE FROM wp_options WHERE option_name = 'billard_ramirez_laser_engraving_price';
```

## Soporte

Para soporte o consultas, contacta a:
- Email: contacto@billardramirez.cl
- Teléfono: +56 9 6583 9601
- Sitio web: https://billardramirez.cl

## Changelog

### Versión 1.0.0 (2025-01-20)
- Lanzamiento inicial
- Configuración de precio desde admin
- API REST para obtener precio
- Guardado de metadata en pedidos WooCommerce
- Cálculo automático de precios en carrito
