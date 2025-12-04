# Billard Ramirez - E-commerce

Tienda online especializada en billar y pool, construida con React, TypeScript y WooCommerce headless.

## Stack Tecnológico

- **React 18.3.1** - Framework UI
- **TypeScript 5.6.2** - Tipado estático
- **Vite 5.4.10** - Build tool
- **Tailwind CSS 3.4.17** - Estilos
- **React Router 7.8.2** - Enrutamiento SPA
- **Zustand 5.0.7** - Gestión de estado
- **TanStack Query 5.84.1** - Data fetching y caché
- **Framer Motion 12.23.12** - Animaciones
- **React Hook Form 7.62.0** - Formularios
- **Zod 4.1.5** - Validación
- **Axios 1.11.0** - HTTP client

## Características

- ✅ Integración headless con WooCommerce
- ✅ Carrito de compras persistente (localStorage)
- ✅ Filtros y búsqueda de productos
- ✅ Responsive design (mobile-first)
- ✅ SEO optimizado
- ✅ Animaciones fluidas
- ✅ Validación de formularios
- ✅ Notificaciones toast
- ✅ Lazy loading de imágenes

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/billard-ramirez.git
cd billard-ramirez
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y configura tus credenciales de WooCommerce:
```env
VITE_WOO_URL=https://billardramirez.cl/wp-json/wc/v3
VITE_WOO_CONSUMER_KEY=tu_consumer_key
VITE_WOO_CONSUMER_SECRET=tu_consumer_secret
```

## Desarrollo

Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para Producción

1. Genera el build:
```bash
npm run build
```

2. Los archivos optimizados estarán en la carpeta `dist/`

## Deploy en SiteGround

1. Ejecuta el build de producción
2. Sube el contenido de la carpeta `dist/` a tu servidor
3. Asegúrate de que el archivo `.htaccess` esté en la raíz
4. Configura las variables de entorno en el servidor

### Estructura de archivos en el servidor:
```
/public_html/
  ├── index.html
  ├── .htaccess
  ├── robots.txt
  ├── sitemap.xml
  ├── assets/
  └── ...
```

## Configuración de WooCommerce

### Generar API Keys:

1. Accede a tu panel de WordPress
2. Ve a **WooCommerce > Ajustes > Avanzado > REST API**
3. Crea una nueva clave con permisos de **Lectura/Escritura**
4. Copia el Consumer Key y Consumer Secret

### Permisos necesarios:
- Lectura: Productos, Categorías, Variaciones
- Escritura: Pedidos

## Estructura del Proyecto

```
/src
  ├── /api              # Integración WooCommerce
  ├── /components       # Componentes reutilizables
  │   ├── /layout       # Header, Footer, CartDrawer
  │   ├── /product      # Componentes de productos
  │   └── /ui           # Componentes UI base
  ├── /hooks            # Custom hooks
  ├── /pages            # Páginas de la app
  ├── /store            # Zustand stores
  ├── /types            # TypeScript types
  ├── /utils            # Funciones auxiliares
  ├── App.tsx           # Componente principal
  └── main.tsx          # Entry point
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter de código

## SEO

El proyecto incluye:
- Meta tags dinámicos con React Helmet
- Sitemap.xml
- Robots.txt
- Schema.org JSON-LD (pendiente implementar en componentes)

## Funcionalidades Pendientes

- [ ] Implementar wishlist
- [ ] Agregar comparador de productos
- [ ] Sistema de reseñas completo
- [ ] Integración con pasarelas de pago
- [ ] Panel de seguimiento de pedidos
- [ ] Newsletter subscription funcional
- [ ] Búsqueda con autocompletado
- [ ] Filtro por rango de precios

## Soporte

Para reportar bugs o solicitar features, crea un issue en el repositorio.

## Contacto

- Web: [billardramirez.cl](https://billardramirez.cl)
- Teléfono: +56 9 7466 4281
- Email: contacto@billardramirez.cl

## Licencia

© 2025 Billard Ramirez. Todos los derechos reservados.
