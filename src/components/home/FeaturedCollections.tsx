import { Link } from 'react-router-dom';
import FeaturedCard from './FeaturedCard';

export default function FeaturedCollections() {
  const featured = [
    {
      id: 1,
      title: 'MESAS DE POOL PROFESIONALES',
      description: 'Transforma tu espacio con nuestras mesas de pool de categoría profesional. Diseño premium y rendimiento excepcional.',
      buttonText: 'Explorar mesas',
      buttonLink: '/tienda?categoria=mesas-de-pool',
      imageUrl: '/images/fotos/happy-friends-playing-billiards-in-a-bowling-alley-2025-06-10-08-18-24-utc.jpg',
      size: 'full' as const
    },
    {
      id: 2,
      title: 'EQUIPAMIENTO PROFESIONAL',
      description: 'Tacos y accesorios profesionales para jugadores exigentes.',
      buttonText: 'Ver productos',
      buttonLink: '/tienda?categoria=tacos',
      imageUrl: '/images/fotos/billiard-equipment-2024-11-28-12-05-30-utc.jpg',
      size: 'half' as const
    },
    {
      id: 3,
      title: 'OFERTAS ESPECIALES',
      description: 'Descubre nuestras mejores ofertas en productos seleccionados.',
      buttonText: 'Ver ofertas',
      buttonLink: '/tienda?categoria=ofertas',
      imageUrl: '/images/fotos/weekend-fun-2024-10-18-04-42-55-utc.jpg',
      size: 'half' as const
    }
  ];

  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary uppercase">
            COLECCIONES DESTACADAS
          </h2>
          <Link to="/tienda">
            <button className="hidden md:block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Ver todas
            </button>
          </Link>
        </div>

        {/* Grid de tarjetas */}
        <div className="space-y-6">
          {/* Primera fila - Tarjeta grande full width */}
          <FeaturedCard {...featured[0]} />

          {/* Segunda fila - 2 tarjetas en columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeaturedCard {...featured[1]} />
            <FeaturedCard {...featured[2]} />
          </div>
        </div>

        {/* Botón móvil */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/tienda">
            <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto">
              Ver todas
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
