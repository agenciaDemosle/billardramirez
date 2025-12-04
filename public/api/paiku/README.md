# Integración de Paiku para Billard Ramirez

Esta integración personalizada permite procesar pagos con Paiku directamente desde tu checkout personalizado, sin depender del checkout de WooCommerce.

## Estructura de Archivos

```
api/paiku/
├── config.php              # Configuración y funciones compartidas
├── create-transaction.php  # Endpoint para crear transacciones
├── webhook.php             # Webhook para recibir notificaciones
├── get-transaction.php     # Endpoint para consultar estado
├── transactions/           # Almacén temporal de transacciones
└── paiku.log              # Archivo de logs (generado automáticamente)
```

## Configuración

### 1. Token de Paiku

El token está configurado en `config.php`:
```php
define('PAIKU_TOKEN', 'tkpu84e1e040c4aa7be0a1b234750852');
```

### 2. Entorno (Producción / Sandbox)

Por defecto está en **producción**. Para usar sandbox (pruebas):

```php
// config.php línea 17-18
define('PAIKU_BASE_URL', 'https://des.payku.cl'); // Sandbox
// define('PAIKU_BASE_URL', 'https://app.payku.cl'); // Producción
```

### 3. Configuración de Moneda

Chile usa CLP:
```php
define('PAIKU_CURRENCY', 'CLP');
```

### 4. ID del Método de Pago

Verifica el ID correcto en el panel de Paiku:
```php
define('PAIKU_PAYMENT_METHOD', 1);
```

## Cómo Funciona

### Flujo de Pago

1. **Usuario completa el checkout** → Selecciona Paiku como método de pago
2. **Frontend llama** a `/api/paiku/create-transaction.php`
3. **PHP crea transacción** en Paiku y devuelve URL de pago
4. **Usuario es redirigido** a Paiku para completar el pago
5. **Usuario paga** en la plataforma de Paiku
6. **Paiku notifica** el resultado a `/api/paiku/webhook.php`
7. **Webhook procesa** la notificación y actualiza el estado
8. **Usuario regresa** a la página de confirmación

### Endpoints Disponibles

#### 1. Crear Transacción
```
POST /api/paiku/create-transaction.php

Payload:
{
  "order_id": "ORDER-123456",
  "email": "cliente@ejemplo.com",
  "amount": 25000,
  "billing": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+56912345678",
    "address_1": "Av. Principal 123",
    "city": "Santiago"
  },
  "line_items": [
    {
      "product_id": 123,
      "name": "Producto 1",
      "quantity": 2,
      "price": 10000
    }
  ]
}

Respuesta:
{
  "success": true,
  "transaction_id": "trx123...",
  "payment_url": "https://app.payku.cl/...",
  "status": "register",
  "order_id": "ORDER-123456"
}
```

#### 2. Webhook (Notificación de Paiku)
```
POST /api/paiku/webhook.php

Paiku envía automáticamente:
{
  "transaction_id": "trx123...",
  "order": "ORDER-123456",
  "status": "success", // o "failed", "pending"
  "verification_key": "abc123..."
}
```

#### 3. Consultar Estado
```
GET /api/paiku/get-transaction.php?order_id=ORDER-123456

Respuesta:
{
  "success": true,
  "order_id": "ORDER-123456",
  "status": "success",
  "transaction_id": "trx123...",
  "amount": 25000,
  "verified": true
}
```

## Desarrollo Local

### Iniciar Servidores

1. **Servidor PHP** (puerto 8080):
```bash
php -S localhost:8080 -t .
```

2. **Servidor Vite** (puerto 5173):
```bash
npm run dev
```

El servidor Vite tiene configurado un proxy que redirige `/api/paiku/*` al servidor PHP.

## Logs y Debugging

Los logs se guardan automáticamente en `paiku.log`. Para ver los logs en tiempo real:

```bash
tail -f api/paiku/paiku.log
```

## Seguridad

### Protección de Archivos

- `transactions/` está protegido con `.htaccess`
- Los archivos de transacciones son JSON con permisos restrictivos
- Los logs no contienen información sensible de tarjetas

### En Producción

1. **Mover transacciones a base de datos** en lugar de archivos JSON
2. **Usar HTTPS** para todos los endpoints
3. **Configurar URL de producción** en `config.php`:
   ```php
   define('SITE_URL', 'https://billardramirez.cl');
   ```
4. **Deshabilitar logs detallados** o protegerlos adecuadamente

## Integración con WooCommerce

El webhook puede crear automáticamente órdenes en WooCommerce cuando el pago es exitoso. Para habilitar esto, descomenta y configura la sección en `webhook.php` línea 95-101.

## Testing

### Montos de Prueba (Solo Sandbox)

Según la documentación de Paiku:
- **Aprobados**: 1000, 2000, 3000
- **Rechazados**: 1500, 2500, 3500

## Soporte

Para problemas con Paiku:
- Documentación: https://docs.payku.com
- Soporte: contacto@payku.com
- Panel: https://app.payku.cl

## Notas Importantes

1. **Verificar método de pago en Paiku**: El `PAIKU_PAYMENT_METHOD` debe coincidir con tu configuración
2. **URLs de webhook deben ser públicas**: En desarrollo, usa ngrok o similar para exponer el webhook
3. **IDs únicos**: Asegúrate de que cada `order_id` sea único
