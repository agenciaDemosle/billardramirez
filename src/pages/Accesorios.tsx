import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { wooApi } from '../api/woocommerce';
import ProductCard from '../components/product/ProductCard';
import SEO from '../components/SEO';
import { Loader2, ChevronRight, Package, Circle, Zap, Sparkles, Shield, Box } from 'lucide-react';

// Subcategorías de accesorios
const ACCESSORY_SUBCATEGORIES = [
  { slug: 'tacos', name: 'Tacos', icon: Zap, description: 'Tacos profesionales y recreacionales' },
  { slug: 'bolas-de-pool', name: 'Bolas de Pool', icon: Circle, description: 'Sets de bolas para todo nivel' },
  { slug: 'tizas', name: 'Tizas', icon: Sparkles, description: 'Tizas de alta calidad' },
  { slug: 'fundas-y-cubiertas', name: 'Fundas', icon: Shield, description: 'Protege tu mesa' },
  { slug: 'estuches', name: 'Estuches', icon: Box, description: 'Estuches para tacos' },
  { slug: 'buchacas', name: 'Buchacas', icon: Package, description: 'Buchacas de repuesto' },
];

export default function Accesorios() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubcategory = searchParams.get('sub') || 'all';

  // Obtener categorías de WooCommerce
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => wooApi.getCategories({ per_page: 100, hide_empty: false }),
  });

  // Encontrar IDs de las subcategorías de accesorios
  const subcategoryIds = useMemo(() => {
    const ids: { [key: string]: number } = {};
    ACCESSORY_SUBCATEGORIES.forEach(sub => {
      const found = categories.find(cat => cat.slug === sub.slug || cat.slug.includes(sub.slug));
      if (found) {
        ids[sub.slug] = found.id;
      }
    });
    return ids;
  }, [categories]);

  // Obtener el ID de la categoría seleccionada
  const categoryIdForQuery = selectedSubcategory !== 'all' ? subcategoryIds[selectedSubcategory] : undefined;

  // Obtener productos
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['accesorios-products', selectedSubcategory, categoryIdForQuery],
    queryFn: async () => {
      // Si hay subcategoría seleccionada, filtrar por ella
      if (categoryIdForQuery) {
        return wooApi.getProducts({ category: categoryIdForQuery, per_page: 50 });
      }

      // Si no, obtener productos de todas las subcategorías de accesorios
      const allCategoryIds = Object.values(subcategoryIds);
      if (allCategoryIds.length > 0) {
        // Obtener productos de todas las categorías de accesorios
        const promises = allCategoryIds.map(id =>
          wooApi.getProducts({ category: id, per_page: 20 })
        );
        const results = await Promise.all(promises);

        // Combinar y eliminar duplicados
        const allProducts = results.flat();
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.id === product.id)
        );
        return uniqueProducts;
      }

      return [];
    },
    enabled: Object.keys(subcategoryIds).length > 0,
  });

  const handleSubcategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('sub');
    } else {
      searchParams.set('sub', slug);
    }
    setSearchParams(searchParams);
  };

  const selectedSubcategoryInfo = ACCESSORY_SUBCATEGORIES.find(s => s.slug === selectedSubcategory);

  return (
    <>
      <SEO
        title="Accesorios de Billar - Tacos, Bolas, Tizas y Más"
        description="Encuentra todos los accesorios para tu mesa de pool: tacos profesionales, bolas de pool, tizas, fundas, estuches y más. Envío a todo Chile."
        canonical="https://billardramirez.cl/accesorios"
        keywords="accesorios billar, tacos pool, bolas pool, tizas billar, fundas mesa pool, estuches tacos, accesorios chile"
        breadcrumbs={[
          { name: 'Inicio', url: 'https://billardramirez.cl/' },
          { name: 'Accesorios', url: 'https://billardramirez.cl/accesorios' }
        ]}
        collection={{
          name: 'Accesorios de Billar',
          description: 'Colección completa de accesorios para mesas de pool',
          itemCount: products.length,
          category: 'Accesorios'
        }}
        pageType="category"
      />

      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
              <ChevronRight size={12} />
              <span className="text-black">Accesorios</span>
              {selectedSubcategoryInfo && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-black">{selectedSubcategoryInfo.name}</span>
                </>
              )}
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">
              Todo para tu mesa de pool
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-wide mb-4">
              Accesorios
            </h1>
            <p className="text-gray-500 max-w-xl">
              {selectedSubcategoryInfo
                ? selectedSubcategoryInfo.description
                : 'Encuentra todo lo que necesitas para equipar tu mesa de pool: tacos, bolas, tizas, fundas y más.'}
            </p>
          </div>
        </div>

        {/* Filtros de subcategorías */}
        <div className="border-b border-gray-200">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
              {/* Todos */}
              <button
                onClick={() => handleSubcategoryChange('all')}
                className={`flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all ${
                  selectedSubcategory === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Package size={14} />
                Todos
              </button>

              {/* Subcategorías */}
              {ACCESSORY_SUBCATEGORIES.map((sub) => {
                const IconComponent = sub.icon;
                const isActive = selectedSubcategory === sub.slug;

                return (
                  <button
                    key={sub.slug}
                    onClick={() => handleSubcategoryChange(sub.slug)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent size={14} />
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-12 md:py-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron productos en esta categoría</p>
              <button
                onClick={() => handleSubcategoryChange('all')}
                className="mt-4 text-sm text-black underline hover:no-underline"
              >
                Ver todos los accesorios
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-8">
                {products.length} {products.length === 1 ? 'producto' : 'productos'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA Section */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-12 md:py-16">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">
                ¿Necesitas ayuda?
              </p>
              <h2 className="text-2xl md:text-3xl font-display uppercase tracking-wide mb-4">
                Asesoría Personalizada
              </h2>
              <p className="text-gray-500 mb-8">
                Nuestro equipo puede ayudarte a elegir los mejores accesorios para tu mesa de pool.
              </p>
              <Link
                to="/contacto"
                className="inline-block bg-black text-white text-sm uppercase tracking-wider px-8 py-4 hover:bg-gray-900 transition-colors"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para ocultar scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
