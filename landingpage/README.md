# Landing Page - Billard Ramírez (React + TypeScript)

Landing page moderna desarrollada con React, TypeScript y Tailwind CSS, enfocada 100% en cotización de mesas de pool.

## Tecnologías

- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de datos
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos

## Estructura del Proyecto

```
landingpage/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navegación principal
│   │   ├── Hero.tsx            # Sección hero
│   │   ├── Benefits.tsx        # Beneficios
│   │   ├── Models.tsx          # Catálogo de modelos
│   │   ├── QuoteForm.tsx       # Formulario de cotización
│   │   ├── Testimonials.tsx    # Testimonios
│   │   ├── CTA.tsx             # Call to action final
│   │   └── Footer.tsx          # Footer
│   ├── types/
│   │   └── index.ts            # Tipos de TypeScript
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Estilos globales
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Características

### Componentes Principales

1. **Header**
   - Navegación sticky responsive
   - Menú móvil con animaciones
   - Scroll suave a secciones

2. **Hero**
   - Diseño atractivo con gradiente
   - Imagen de fondo
   - CTA principal
   - Animaciones de entrada

3. **Benefits**
   - 4 beneficios clave
   - Iconos de Lucide React
   - Animaciones al aparecer en viewport

4. **Models**
   - 3 modelos de mesas
   - Modelo destacado (Premium)
   - Características detalladas
   - Botones de cotización que pre-seleccionan el modelo

5. **QuoteForm**
   - Formulario completo con validación
   - React Hook Form + validación en tiempo real
   - Campos personalizables:
     - Datos personales (nombre, email, teléfono)
     - Selección de modelo
     - Color de paño
     - Acabado de madera
     - Accesorios opcionales (checkboxes)
     - Región de entrega
     - Comentarios adicionales
   - Mensaje de éxito animado
   - Estado de carga

6. **Testimonials**
   - 3 testimonios de clientes
   - Sistema de calificación con estrellas
   - Diseño de tarjetas

7. **CTA**
   - Llamada a la acción final
   - Botón que dirige al formulario

8. **Footer**
   - Información de contacto
   - Horarios
   - Copyright dinámico

## Instalación

```bash
cd landingpage
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:3001`

## Build

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## Preview

```bash
npm run preview
```

## Personalización

### Colores

Los colores se configuran en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#1a4d2e',    // Verde principal
    dark: '#0f2818',       // Verde oscuro
    light: '#4f772d',      // Verde claro
  },
  accent: {
    DEFAULT: '#90a955',    // Verde acento
    light: '#a8c078',      // Verde acento claro
  },
}
```

### Modelos de Mesas

Edita el array `models` en `src/components/Models.tsx`:

```typescript
const models: TableModel[] = [
  {
    id: 'profesional',
    name: 'Mesa Profesional',
    size: '8 pies (244 x 137 cm)',
    features: [...],
    image: 'URL_DE_IMAGEN',
    featured: false
  },
  // ...más modelos
]
```

### Testimonios

Edita el array `testimonials` en `src/components/Testimonials.tsx`:

```typescript
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Nombre Cliente',
    location: 'Ciudad',
    rating: 5,
    text: 'Testimonio...'
  },
  // ...más testimonios
]
```

### Información de Contacto

Actualiza en los siguientes archivos:
- `src/components/QuoteForm.tsx` (líneas con Phone, Mail, MapPin)
- `src/components/Footer.tsx`

## Integración con Backend

Para conectar el formulario con tu backend, modifica la función `onSubmit` en `src/components/QuoteForm.tsx`:

```typescript
const onSubmit = async (data: QuoteFormData) => {
  setIsLoading(true)

  try {
    const response = await fetch('https://tu-api.com/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      setIsSubmitted(true)
      toast.success('¡Cotización enviada exitosamente!')
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error('Hubo un error al enviar tu cotización.')
  } finally {
    setIsLoading(false)
  }
}
```

## Optimizaciones

### Imágenes

- Las imágenes actualmente usan Unsplash placeholders
- Reemplaza con tus propias imágenes optimizadas
- Usa formatos modernos como WebP
- Implementa lazy loading si es necesario

### SEO

Agrega en `index.html`:

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://billardramirez.cl/">
<meta property="og:title" content="Billard Ramírez - Mesas de Pool">
<meta property="og:description" content="Cotiza tu mesa de pool personalizada">
<meta property="og:image" content="https://billardramirez.cl/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="Billard Ramírez">
<meta property="twitter:description" content="Cotiza tu mesa de pool">
<meta property="twitter:image" content="https://billardramirez.cl/twitter.jpg">
```

### Analytics

Para agregar Google Analytics, añade en `index.html` antes del cierre de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Arrastra la carpeta dist/ a Netlify
```

### GitHub Pages

```bash
npm run build
# Sube la carpeta dist/ a la rama gh-pages
```

## Responsive Design

La landing page está optimizada para:
- 📱 Mobile: 320px - 767px
- 📲 Tablet: 768px - 1023px
- 💻 Desktop: 1024px+

## Navegadores Soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Features Adicionales

- ✅ Scroll suave entre secciones
- ✅ Animaciones con Framer Motion
- ✅ Formulario con validación en tiempo real
- ✅ Notificaciones toast
- ✅ Pre-selección de modelo desde catálogo
- ✅ Diseño completamente responsive
- ✅ Tipado estático con TypeScript
- ✅ Performance optimizado con Vite

## Próximas Mejoras

- [ ] Integración con API de cotización
- [ ] Calculadora de precios en tiempo real
- [ ] Galería de imágenes con lightbox
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Tests unitarios
- [ ] Tests E2E con Playwright

## Soporte

Para dudas sobre la implementación:
- Email: contacto@billardramirez.cl
- Teléfono: +56 9 1234 5678

---

Desarrollado con ❤️ para Billard Ramírez - 2024
