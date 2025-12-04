import { Link } from 'react-router-dom';
import CollectionCard from './CollectionCard';

export default function PopularCollections() {
  const collections = [
    {
      id: 1,
      title: 'MESAS DE POOL',
      link: '/tienda?categoria=mesas-de-pool',
      backgroundColor: '#00963c',
      layout: 'horizontal-multi' as const,
      pattern: 'none' as const,
      imageUrl: '/images/fotos/four-smiling-friends-in-bar-playing-billiard-toget-2025-01-29-08-00-02-utc.jpg'
    },
    {
      id: 2,
      title: 'TACOS PROFESIONALES',
      link: '/tienda?categoria=tacos',
      backgroundColor: '#007a31',
      layout: 'horizontal' as const,
      pattern: 'none' as const,
      imageUrl: '/images/fotos/billiard-equipment-2024-11-28-12-05-30-utc.jpg'
    },
    {
      id: 3,
      title: 'BOLAS DE POOL',
      link: '/tienda?categoria=bolas-de-pool',
      backgroundColor: '#00963c',
      layout: 'vertical' as const,
      pattern: 'none' as const,
      imageUrl: '/images/fotos/happy-friends-enjoying-playing-pool-2025-03-15-21-36-33-utc.jpg'
    },
    {
      id: 4,
      title: 'ESTUCHES Y TAQUERAS',
      link: '/tienda?categoria=estuches',
      backgroundColor: '#007a31',
      layout: 'horizontal' as const,
      pattern: 'none' as const,
      imageUrl: '/images/fotos/billiard-equipment-2024-11-28-12-05-30-utc.jpg'
    },
    {
      id: 5,
      title: 'LÁMPARAS Y DECORACIÓN',
      link: '/tienda?categoria=lamparas',
      backgroundColor: '#00963c',
      layout: 'horizontal' as const,
      pattern: 'none' as const,
      imageUrl: '/images/fotos/happy-friends-playing-billiards-in-a-bowling-alley-2025-06-10-08-18-24-utc.jpg'
    },
    {
      id: 6,
      title: 'ACCESORIOS',
      link: '/tienda?categoria=accesorios',
      backgroundColor: '#007a31',
      layout: 'horizontal' as const,
      pattern: 'none' as const,
      imageUrl: '/images/fotos/happy-friends-enjoying-playing-pool-2025-03-15-21-36-33-utc.jpg'
    }
  ];

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary uppercase">
            COLECCIONES POPULARES
          </h2>
          <Link to="/tienda">
            <button className="hidden md:block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Ver todas
            </button>
          </Link>
        </div>

        {/* Grid en Parejas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} {...collection} />
          ))}
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
