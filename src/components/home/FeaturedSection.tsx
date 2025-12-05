import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { wooApi } from '../../api/woocommerce';
import type { Product } from '../../types/product';
import { trackViewContent } from '../../hooks/useAnalytics';

// Categorías de mesas de pool (padre + hijos)
const MESAS_POOL_SLUGS = ['mesas-de-pool', 'superficie-en-piedra', 'superficie-en-madera'];

export default function FeaturedSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Primero obtener las categorías para encontrar IDs de mesas
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => wooApi.getCategories(),
  });

  // Encontrar IDs de las categorías de mesas de pool
  const mesasCategoryIds = categories
    .filter(cat => MESAS_POOL_SLUGS.includes(cat.slug))
    .map(cat => cat.id);

  // Obtener productos de TODAS las categorías de mesas
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['pool-tables-featured-all', mesasCategoryIds],
    queryFn: async () => {
      if (mesasCategoryIds.length === 0) return [];
      // Traer todos los productos y filtrar por categorías de mesas
      const allProducts = await wooApi.getProducts({ per_page: 100 });
      return allProducts.filter((product: Product) => {
        const productCategoryIds = product.categories?.map(cat => cat.id) || [];
        return productCategoryIds.some(id => mesasCategoryIds.includes(id));
      });
    },
    enabled: mesasCategoryIds.length > 0,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // No mostrar si no hay productos
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      {/* Header - Con padding */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6 px-6 sm:px-8 lg:px-12">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-4">
            Nuestras mesas
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-black uppercase tracking-wide">
            Cotiza tu Mesa
          </h2>
        </div>

        {/* Navigation - Estilo minimalista */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all duration-300"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all duration-300"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel - Full width, sin espacios laterales */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product: Product, index: number) => (
            <Link
              key={product.id}
              to={`/producto/${product.slug}`}
              onClick={() => trackViewContent({
                product_id: product.id.toString(),
                product_name: product.name,
                product_category: product.categories[0]?.name || 'Mesas de Pool',
                product_price: parseFloat(product.price),
                item_list_name: 'Homepage Featured',
                item_list_id: 'homepage_featured',
                index: index,
              })}
              className="flex-shrink-0 w-[calc(100%-24px)] sm:w-[calc(50%-4px)] md:w-[calc(33.333%-5px)] lg:w-[calc(25%-6px)] snap-start group relative overflow-hidden aspect-[4/5] first:ml-3 sm:first:ml-0"
            >
              {/* Image */}
              <img
                src={product.images?.[0]?.src || 'https://placehold.co/400x500/f5f5f5/999?text=Mesa'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay oscuro para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent"></div>
              {/* Title - Arriba con primera palabra destacada */}
              <div className="absolute top-4 sm:top-8 left-0 right-0 p-3 sm:p-5">
                <h3 className="text-white font-display uppercase leading-tight tracking-wide text-center drop-shadow-lg">
                  <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wider mb-1">
                    {product.name.split(' ')[0]}
                  </span>
                  <span className="block text-sm sm:text-lg md:text-xl lg:text-2xl">
                    {product.name.split(' ').slice(1).join(' ')}
                  </span>
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View All Link - Estilo elegante */}
      <div className="text-center mt-12 px-6">
        <Link
          to="/tienda?categoria=mesas-de-pool"
          className="inline-flex items-center gap-3 text-sm uppercase tracking-wider text-black hover:gap-4 transition-all duration-300 border-b border-black pb-1"
        >
          Ver todas las mesas
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
