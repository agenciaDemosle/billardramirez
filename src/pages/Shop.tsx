import { useState } from 'react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import SEO from '../components/SEO';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get('categoria') || '';
  const searchQuery = searchParams.get('buscar') || '';
  const sortParam = searchParams.get('orden') || 'date';
  const pageParam = parseInt(searchParams.get('pagina') || '1');
  const tipoParam = searchParams.get('tipo') || '';
  const usoParam = searchParams.get('uso') || '';
  const superficieParam = searchParams.get('superficie') || '';
  const acabadoParam = searchParams.get('acabado') || '';

  const { data: categories } = useCategories();

  // Categorías de mesas de pool (padre + hijos)
  const MESAS_POOL_SLUGS = ['mesas-de-pool', 'superficie-en-piedra', 'superficie-en-madera'];
  const isMesasPoolCategory = MESAS_POOL_SLUGS.includes(categoryParam);

  // Calcular filtros directamente usando useMemo para que reaccionen a cambios de URL
  const filters = React.useMemo(() => {
    // Calcular categoryId
    let newCategoryId = '';
    if (categoryParam) {
      const cat = categories?.find((c) => c.slug === categoryParam);
      newCategoryId = cat?.id?.toString() || '';
    }

    // Calcular orden
    let orderby = sortParam;
    let order: 'asc' | 'desc' = 'desc';

    if (sortParam === 'price') {
      orderby = 'price';
      order = 'asc';
    } else if (sortParam === 'price-desc') {
      orderby = 'price';
      order = 'desc';
    } else if (sortParam === 'title-desc') {
      orderby = 'title';
      order = 'desc';
    } else if (sortParam === 'title') {
      orderby = 'title';
      order = 'asc';
    }

    return {
      category: newCategoryId,
      search: searchQuery,
      orderby: orderby,
      order: order,
      page: pageParam,
      perPage: isMesasPoolCategory ? 100 : 12,
    };
  }, [categoryParam, searchQuery, sortParam, pageParam, categories, isMesasPoolCategory]);

  const { data: allProducts, isLoading } = useProducts(filters);

  // Filtrar productos del lado del cliente (solo para filtros adicionales)
  const products = React.useMemo(() => {
    if (!allProducts) return allProducts;

    let filtered = allProducts;

    // Aplicar filtros adicionales si estamos en categoría de mesas de pool
    if (isMesasPoolCategory) {
      if (usoParam) {
        filtered = filtered.filter(product => {
          const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();
          if (usoParam === 'casa') {
            return searchText.includes('casa') || searchText.includes('hogar') || searchText.includes('familiar') || searchText.includes('recreacional') || searchText.includes('madera');
          } else if (usoParam === 'profesional') {
            return searchText.includes('profesional') || searchText.includes('competencia') || searchText.includes('torneo') || searchText.includes('pizarra') || searchText.includes('piedra');
          }
          return true;
        });
      }

      if (superficieParam) {
        filtered = filtered.filter(product => {
          const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();
          if (superficieParam === 'pizarra') {
            return searchText.includes('pizarra') || searchText.includes('piedra');
          } else if (superficieParam === 'madera') {
            return searchText.includes('madera') || searchText.includes('mdf');
          }
          return true;
        });
      }

      if (acabadoParam) {
        filtered = filtered.filter(product => {
          const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();
          if (acabadoParam === 'tallado') {
            return searchText.includes('tallado') || searchText.includes('tallada') || searchText.includes('artesanal');
          } else if (acabadoParam === 'estandar') {
            return !searchText.includes('tallado') && !searchText.includes('tallada') && !searchText.includes('artesanal');
          }
          return true;
        });
      }
    }

    return filtered;
  }, [allProducts, usoParam, superficieParam, acabadoParam, isMesasPoolCategory]);

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (categorySlug) {
      params.set('categoria', categorySlug);
    } else {
      params.delete('categoria');
    }
    params.set('pagina', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }
    params.set('pagina', '1');
    setSearchParams(params);
  };

  const handleSortChange = (orderby: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('orden', orderby);
    params.set('pagina', '1');
    setSearchParams(params);
  };

  const handleSearchChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;

    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('buscar', search);
    } else {
      params.delete('buscar');
    }
    params.set('pagina', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount =
    (categoryParam ? 1 : 0) + (searchQuery ? 1 : 0) + (tipoParam ? 1 : 0) +
    (usoParam ? 1 : 0) + (superficieParam ? 1 : 0) + (acabadoParam ? 1 : 0);

  // SEO dinámico avanzado basado en filtros
  const generateSEOContent = () => {
    let title = 'Tienda - Mesas de Pool y Accesorios';
    let description = 'Descubre nuestra amplia selección de mesas de pool profesionales, recreacionales y accesorios de billar. Showroom en Santiago con envío a todo Chile. Precios competitivos y garantía.';
    let keywords = 'mesas pool chile, accesorios billar, tacos pool, bolas pool, comprar mesa pool chile, tienda billar santiago, mesa pool precio';
    let collectionName = 'Todos los Productos';
    let collectionDescription = description;

    const categoryData: Record<string, { title: string; desc: string; keywords: string }> = {
      'mesas-de-pool': {
        title: 'Mesas de Pool - Profesionales y Recreacionales',
        desc: 'Mesas de pool profesionales con superficie de pizarra y recreacionales para el hogar. Variedad de tamaños y acabados. Instalación incluida en Santiago. Envío a todo Chile.',
        keywords: 'mesas de pool, mesa pool profesional, mesa pool recreacional, mesa billar chile, comprar mesa pool, mesa pool pizarra, mesa pool madera'
      },
      'superficie-en-piedra': {
        title: 'Mesas de Pool con Superficie de Piedra - Profesionales',
        desc: 'Mesas de pool profesionales con superficie de pizarra italiana. Rebote perfecto y máxima durabilidad. Ideales para torneos y uso intensivo. Envío e instalación a todo Chile.',
        keywords: 'mesa pool pizarra, mesa pool piedra, mesa billar profesional, mesa pool torneo, pizarra italiana'
      },
      'superficie-en-madera': {
        title: 'Mesas de Pool con Superficie de Madera - Para el Hogar',
        desc: 'Mesas de pool con superficie de madera MDF, perfectas para uso recreacional en casa. Excelente relación precio-calidad. Fácil armado y envío a todo Chile.',
        keywords: 'mesa pool madera, mesa pool mdf, mesa pool casa, mesa pool económica, mesa billar hogar'
      },
      'tacos': {
        title: 'Tacos de Billar - Profesionales y Recreacionales',
        desc: 'Tacos de billar de alta calidad en diferentes materiales y pesos. Tacos profesionales de arce y tacos recreacionales. Envío a todo Chile.',
        keywords: 'tacos billar, taco pool, taco profesional, taco arce, palos de pool chile'
      },
      'bolas-de-pool': {
        title: 'Bolas de Pool - Sets Profesionales y Recreacionales',
        desc: 'Sets de bolas de pool en diferentes calidades. Bolas de resina profesionales y sets recreacionales. Numeradas y lisas disponibles. Envío a todo Chile.',
        keywords: 'bolas pool, set bolas billar, bolas pool profesionales, bolas aramith, bolas resina'
      },
      'accesorios': {
        title: 'Accesorios de Billar - Todo para tu Mesa de Pool',
        desc: 'Accesorios de billar: tizas, portatizas, guantes, paños, triángulos, cepillos y más. Todo lo que necesitas para tu mesa de pool. Envío gratis sobre $100.000.',
        keywords: 'accesorios billar, tiza pool, guantes billar, paño mesa pool, triángulo pool, cepillo mesa'
      },
      'fundas': {
        title: 'Fundas para Mesa de Pool - Protección Premium',
        desc: 'Fundas protectoras para mesas de pool en diferentes tamaños. Material resistente al agua y polvo. Protege tu inversión. Envío a todo Chile.',
        keywords: 'funda mesa pool, cobertor mesa billar, protector mesa pool, funda impermeable'
      },
      'luces': {
        title: 'Lámparas para Mesa de Pool - Iluminación Profesional',
        desc: 'Lámparas y luces para mesas de pool. Iluminación profesional Tiffany y moderna. Diferentes estilos y tamaños. Envío a todo Chile.',
        keywords: 'lampara mesa pool, luz billar, iluminación pool, lampara tiffany billar'
      },
      'tapas-comedor': {
        title: 'Tapas Comedor para Mesa de Pool - 2 en 1',
        desc: 'Tapas comedor para convertir tu mesa de pool en mesa de comedor. Máximo aprovechamiento del espacio. Diferentes acabados disponibles.',
        keywords: 'tapa comedor mesa pool, mesa pool comedor, convertidor mesa pool, tapa mesa billar'
      }
    };

    if (categoryParam && categoryData[categoryParam]) {
      const data = categoryData[categoryParam];
      title = data.title;
      description = data.desc;
      keywords = data.keywords;
      collectionName = categories?.find(cat => cat.slug === categoryParam)?.name || categoryParam;
      collectionDescription = data.desc;
    } else if (categoryParam) {
      const categoryName = categories?.find(cat => cat.slug === categoryParam)?.name || categoryParam;
      title = `${categoryName} - Billard Ramirez`;
      description = `Explora nuestra selección de ${categoryName.toLowerCase()}. Productos de calidad premium con envío a todo Chile y garantía.`;
      collectionName = categoryName;
      collectionDescription = description;
    }

    if (searchQuery) {
      title = `Resultados para "${searchQuery}" - Billard Ramirez`;
      description = `Encuentra ${searchQuery} y más productos de pool y billar en Billard Ramirez. Envío a todo Chile.`;
      collectionName = `Búsqueda: ${searchQuery}`;
    }

    if (tipoParam) {
      const tipoCapitalized = tipoParam.charAt(0).toUpperCase() + tipoParam.slice(1);
      title = `Mesas de Pool ${tipoCapitalized}es - Billard Ramirez`;
      description = `Descubre nuestras mesas de pool ${tipoParam}es de alta calidad. Precios competitivos y envío a todo Chile.`;
      keywords = `mesas pool ${tipoParam}, mesa billar ${tipoParam} chile, ${tipoParam} pool`;
      collectionName = `Mesas ${tipoCapitalized}es`;
    }

    return { title, description, keywords, collectionName, collectionDescription };
  };

  const seoContent = generateSEOContent();

  // Get current category name for header
  const currentCategoryName = categoryParam
    ? categories?.find(cat => cat.slug === categoryParam)?.name
    : null;

  // Breadcrumbs para SEO
  const breadcrumbs = [
    { name: 'Inicio', url: 'https://billardramirez.cl/' },
    { name: 'Tienda', url: 'https://billardramirez.cl/tienda' },
    ...(categoryParam && currentCategoryName ? [{
      name: currentCategoryName,
      url: `https://billardramirez.cl/tienda?categoria=${categoryParam}`
    }] : [])
  ];

  return (
    <>
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical={`https://billardramirez.cl/tienda${categoryParam ? `?categoria=${categoryParam}` : ''}`}
        breadcrumbs={breadcrumbs}
        pageType="category"
        collection={{
          name: seoContent.collectionName,
          description: seoContent.collectionDescription,
          itemCount: products?.length || 0,
          category: currentCategoryName || 'Productos de Billar'
        }}
      />

      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="border-b border-gray-200">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-12 md:py-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              {currentCategoryName ? 'Colección' : 'Tienda'}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-black uppercase tracking-wide">
              {tipoParam
                ? `Mesas ${tipoParam.charAt(0).toUpperCase() + tipoParam.slice(1)}es`
                : currentCategoryName || 'Todos los Productos'
              }
            </h1>
            {(products && !isLoading) && (
              <p className="text-sm text-gray-500 mt-4">
                {products.length} {products.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-gray-200 sticky top-0 bg-white z-40">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16">
            <div className="flex items-center justify-between py-4">
              {/* Left: Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                <SlidersHorizontal size={16} />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Right: Sort */}
              <div className="relative">
                <select
                  value={sortParam}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-transparent text-sm uppercase tracking-wider pr-6 cursor-pointer focus:outline-none"
                >
                  <option value="date">Más recientes</option>
                  <option value="popularity">Más populares</option>
                  <option value="price">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="title">A - Z</option>
                  <option value="title-desc">Z - A</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16">
          <div className="flex gap-12 lg:gap-16">
            {/* Sidebar Filters */}
            <aside
              className={`fixed inset-0 bg-white z-50 lg:relative lg:inset-auto lg:bg-transparent lg:z-auto transition-transform duration-300 ${
                showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              } ${showFilters ? 'lg:w-64 lg:flex-shrink-0' : 'lg:hidden'}`}
            >
              <div className="h-full overflow-y-auto lg:sticky lg:top-20 py-8 lg:py-12 px-5 lg:px-0">
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between mb-8 lg:hidden">
                  <span className="text-sm uppercase tracking-wider font-medium">Filtros</span>
                  <button onClick={() => setShowFilters(false)} className="p-2">
                    <X size={20} />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-8">
                  <form onSubmit={handleSearchChange}>
                    <input
                      name="search"
                      type="search"
                      placeholder="Buscar..."
                      defaultValue={searchQuery}
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                  </form>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                    Categorías
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`block text-sm transition-colors ${
                        !categoryParam ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      Todas
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`block text-sm transition-colors ${
                          categoryParam === cat.slug ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pool Table Specific Filters */}
                {(categoryParam === 'mesas-de-pool' || categoryParam === 'superficie-en-piedra' || categoryParam === 'superficie-en-madera') && (
                  <>
                    {/* Uso */}
                    <div className="mb-8">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Tipo de Uso
                      </h3>
                      <div className="space-y-3">
                        {[
                          { value: '', label: 'Todos' },
                          { value: 'casa', label: 'Hogar' },
                          { value: 'profesional', label: 'Profesional' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('uso', option.value)}
                            className={`block text-sm transition-colors ${
                              usoParam === option.value ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Superficie */}
                    <div className="mb-8">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Superficie
                      </h3>
                      <div className="space-y-3">
                        {[
                          { value: '', label: 'Todas' },
                          { value: 'pizarra', label: 'Pizarra' },
                          { value: 'madera', label: 'Madera' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('superficie', option.value)}
                            className={`block text-sm transition-colors ${
                              superficieParam === option.value ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Acabado */}
                    <div className="mb-8">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Acabado
                      </h3>
                      <div className="space-y-3">
                        {[
                          { value: '', label: 'Todos' },
                          { value: 'tallado', label: 'Tallado a mano' },
                          { value: 'estandar', label: 'Estándar' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('acabado', option.value)}
                            className={`block text-sm transition-colors ${
                              acabadoParam === option.value ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </aside>

            {/* Products */}
            <main className="flex-1 py-12">
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categoryParam && (
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs uppercase tracking-wider hover:border-black transition-colors"
                    >
                      {categoryParam}
                      <X size={12} />
                    </button>
                  )}
                  {usoParam && (
                    <button
                      onClick={() => handleFilterChange('uso', '')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs uppercase tracking-wider hover:border-black transition-colors"
                    >
                      {usoParam === 'casa' ? 'Hogar' : 'Profesional'}
                      <X size={12} />
                    </button>
                  )}
                  {superficieParam && (
                    <button
                      onClick={() => handleFilterChange('superficie', '')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs uppercase tracking-wider hover:border-black transition-colors"
                    >
                      {superficieParam}
                      <X size={12} />
                    </button>
                  )}
                  {acabadoParam && (
                    <button
                      onClick={() => handleFilterChange('acabado', '')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs uppercase tracking-wider hover:border-black transition-colors"
                    >
                      {acabadoParam === 'tallado' ? 'Tallado' : 'Estándar'}
                      <X size={12} />
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete('buscar');
                        setSearchParams(params);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs uppercase tracking-wider hover:border-black transition-colors"
                    >
                      "{searchQuery}"
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}

              {/* Products Grid */}
              <ProductGrid
                products={products || []}
                isLoading={isLoading}
                columns={showFilters ? 3 : 4}
                listName={categoryParam ? `Category: ${categoryParam}` : 'Shop'}
                listId={categoryParam ? `category_${categoryParam}` : 'shop_all'}
              />

              {/* No Results */}
              {products && products.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <p className="text-gray-500 mb-6">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
      </div>
    </>
  );
}
