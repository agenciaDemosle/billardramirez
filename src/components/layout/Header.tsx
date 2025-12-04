import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Phone, Home, Store, Mail, ChevronDown, Box, Star, Package, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { wooApi } from '../../api/woocommerce';
import CategoryMenu from './CategoryMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();

  // Colores de bolas de billar según el número
  const getBallColor = (count: number) => {
    const ballColors = [
      { bg: '#FFD700', text: '#000000', border: '#FFA500' }, // 1: Amarillo/Oro
      { bg: '#0066CC', text: '#FFFFFF', border: '#003D7A' }, // 2: Azul
      { bg: '#DC143C', text: '#FFFFFF', border: '#8B0000' }, // 3: Rojo
      { bg: '#8B00FF', text: '#FFFFFF', border: '#5500AA' }, // 4: Púrpura
      { bg: '#FF6600', text: '#FFFFFF', border: '#CC5200' }, // 5: Naranja
      { bg: '#228B22', text: '#FFFFFF', border: '#145214' }, // 6: Verde
      { bg: '#8B4513', text: '#FFFFFF', border: '#5C2D0A' }, // 7: Marrón/Café
      { bg: '#000000', text: '#FFFFFF', border: '#333333' }, // 8: Negro
    ];

    if (count === 0) return { bg: '#00963c', text: '#FFFFFF', border: '#007a31' };

    // Si count > 8, repetir el ciclo
    const index = ((count - 1) % 8);
    return ballColors[index];
  };

  const ballColor = getBallColor(itemCount);

  // Obtener categorías desde WooCommerce
  const { data: wooCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => wooApi.getCategories({ per_page: 100, hide_empty: false }),
  });

  // Procesar categorías para estructura jerárquica - 4 principales
  const mainCategories = useMemo(() => {
    if (!wooCategories.length) return [];

    const categories = [
      {
        name: 'MESAS DE POOL',
        slug: 'mesas-de-pool',
        icon: Box,
        includeCategories: ['mesas-de-pool', 'superficie-en-piedra', 'superficie-en-madera']
      },
      {
        name: 'OTRAS MESAS',
        slug: 'otras-mesas',
        icon: Star,
        includeCategories: ['mesa-de-poker', 'mesa-air-hockey', 'mesa-futbolito']
      },
      {
        name: 'ACCESORIOS',
        slug: 'accesorios',
        icon: Package,
        includeCategories: ['tacos', 'bolas-de-pool', 'bolas', 'tizas', 'fundas-y-cubiertas', 'fundas', 'buchacas', 'accesorios', 'estuches', 'suelas']
      },
      {
        name: 'OFERTAS',
        slug: 'ofertas',
        icon: Flame,
        includeCategories: ['ofertas', 'promociones', 'descuentos']
      }
    ];

    return categories.map(mainCat => {
      const matchingCategories = wooCategories.filter(wooCat =>
        mainCat.includeCategories.some(slug =>
          wooCat.slug.includes(slug) || slug.includes(wooCat.slug)
        ) && wooCat.count > 0 && wooCat.slug !== 'uncategorized'
      );

      const mainWooCat = matchingCategories.find(cat => cat.slug === mainCat.slug);
      const subcategoriesMap = new Map();

      matchingCategories
        .filter(cat => cat.slug !== mainCat.slug)
        .forEach(cat => {
          subcategoriesMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          });
        });

      if (mainWooCat) {
        wooCategories
          .filter(cat => cat.parent === mainWooCat.id && cat.count > 0)
          .forEach(sub => {
            if (!subcategoriesMap.has(sub.id)) {
              subcategoriesMap.set(sub.id, {
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
              });
            }
          });
      }

      const subcategories = Array.from(subcategoriesMap.values());

      return {
        id: mainCat.slug,
        name: mainCat.name,
        slug: mainWooCat?.slug || mainCat.slug,
        icon: mainCat.icon,
        subcategories: subcategories
      };
    }).filter(cat => cat.subcategories.length > 0 || wooCategories.some(w => w.slug === cat.slug));
  }, [wooCategories]);

  // Cerrar el menú al cambiar de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('buscar', searchQuery.trim());
      navigate(`/tienda?${params.toString()}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set('buscar', suggestion);
    navigate(`/tienda?${params.toString()}`);
    setSearchQuery('');
  };

  // Sugerencias fijas de búsqueda
  const searchSuggestions = [
    'Mesas de Pool',
    'Mesas Profesionales',
    'Mesas Recreacionales',
    'Tacos',
    'Bolas de Pool',
    'Accesorios',
    'Mesa de Poker',
    'Mesa Air Hockey',
  ];


  // Calcular días para Navidad
  const getDaysUntilChristmas = () => {
    const today = new Date();
    const christmas = new Date(today.getFullYear(), 11, 25); // 25 de diciembre
    if (today > christmas) {
      christmas.setFullYear(christmas.getFullYear() + 1);
    }
    const diffTime = christmas.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilChristmas = getDaysUntilChristmas();

  return (
    <div className="sticky top-0 z-50 safe-area-top">
      {/* 1) Barra Superior - Cuenta regresiva Navidad - Más compacta en mobile */}
      <div className="bg-[#165B33] text-white py-1.5 sm:py-2 text-center px-3">
        <p className="text-[11px] sm:text-sm font-medium tracking-wide leading-tight">
          <span className="hidden xs:inline">FALTAN </span><span className="font-bold text-sm sm:text-lg">{daysUntilChristmas}</span> DÍAS PARA NAVIDAD<span className="hidden sm:inline"> - ¡Adelanta tus compras!</span>
        </p>
      </div>

      {/* 2) Header Principal - Verde */}
      <header className="bg-[#00963c]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
          {/* Layout Mobile - Optimizado táctil */}
          <div className="md:hidden">
            <div className="flex items-center justify-between gap-2">
              {/* Logo - Tamaño optimizado */}
              <Link to="/" className="flex-shrink-0 touch-target flex items-center">
                <img
                  src="/images/logo.png"
                  alt="Billard Ramirez"
                  className="h-9 xs:h-10 sm:h-12 w-auto brightness-0 invert"
                />
              </Link>

              {/* Carrito y Menú - Botones táctiles más grandes */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleCart}
                  className="relative text-white p-2.5 hover:bg-white/20 rounded-lg transition-colors active:scale-95 touch-target"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart size={24} strokeWidth={2.5} />
                  {itemCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 transition-all duration-300"
                      style={{
                        backgroundColor: ballColor.bg,
                        color: ballColor.text,
                        borderColor: ballColor.border
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-2.5 hover:bg-white/10 rounded-lg transition-colors touch-target"
                  aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Buscador Mobile - Estilo minimalista */}
            <div className="mt-2.5 relative">
              <form onSubmit={handleSearch} className="flex items-center border border-white/30 bg-transparent">
                <Search size={16} className="ml-3 text-white/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                  placeholder="Buscar productos..."
                  className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm focus:outline-none placeholder:text-white/50"
                />
              </form>

              {/* Sugerencias Mobile - Estilo minimalista */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg z-[100000] max-h-[60vh] overflow-y-auto">
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                      Sugerencias
                    </p>
                    <div className="space-y-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(suggestion);
                          }}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Layout Desktop */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
            {/* a) Izquierda - Logo */}
            <div className="md:col-span-3">
              <Link to="/" className="block">
                <img
                  src="/images/logo.png"
                  alt="Billard Ramirez"
                  className="h-16 md:h-20 w-auto brightness-0 invert"
                />
              </Link>
            </div>

            {/* b) Centro - Buscador estilo minimalista */}
            <div className="md:col-span-6 relative">
              <form onSubmit={handleSearch} className="flex items-center border border-white/30 bg-transparent">
                <Search size={18} className="ml-4 text-white/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                  placeholder="Buscar productos..."
                  className="flex-1 px-4 py-2.5 bg-transparent text-white text-sm focus:outline-none placeholder:text-white/50"
                />
              </form>

              {/* Sugerencias Desktop - Estilo minimalista */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg z-[100000]">
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                      Sugerencias
                    </p>
                    <div className="space-y-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(suggestion);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* c) Derecha - Cotizar + Carrito */}
            <div className="md:col-span-3 flex items-center justify-end gap-3">
              {/* Botón Cotizar - Estilo minimalista redecora */}
              <Link
                to="/tienda?categoria=mesas-de-pool"
                className="hidden lg:block text-white text-xs uppercase tracking-wider border border-white px-5 py-2.5 hover:bg-white hover:text-[#00963c] transition-all duration-300"
              >
                Cotizar Mesa
              </Link>

              {/* Carrito - Estilo minimalista */}
              <button
                onClick={toggleCart}
                className="relative text-white p-2 transition-all"
              >
                <ShoppingCart size={22} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-[10px] font-medium bg-white text-[#00963c] h-4 w-4 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3) Menú de Categorías */}
      <CategoryMenu />

      {/* 4) Marquee negro con Comprar y Ubicación incluidos - Visible en todas las pantallas */}
      <div className="bg-black text-white py-1.5 sm:py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center mx-2 sm:mx-4 text-[10px] sm:text-xs md:text-sm tracking-wide">
              <Link to="/tienda" className="font-medium uppercase hover:text-gray-300 transition-colors px-2 sm:px-4">
                Comprar
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/contacto" className="font-medium uppercase hover:text-gray-300 transition-colors px-2 sm:px-4">
                Ubicación
              </Link>
              <span className="mx-3 sm:mx-6 text-gray-500">•</span>
              <span className="hidden xs:inline">ENCUENTRA LA MEJOR CALIDAD AQUÍ</span>
              <span className="xs:hidden">CALIDAD</span>
              <span className="mx-3 sm:mx-6 text-gray-500">•</span>
              <span className="hidden sm:inline">SÁBADOS TIENDA ABIERTA</span>
              <span className="sm:hidden">SÁBADOS ABIERTO</span>
              <span className="mx-3 sm:mx-6 text-gray-500">•</span>
              <span className="hidden md:inline">ENVÍO GRATIS EN ACCESORIOS SOBRE LOS $100.000</span>
              <span className="md:hidden">ENVÍO GRATIS +$100K</span>
              <span className="mx-3 sm:mx-6 text-gray-500">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-[60] transition-opacity animate-in fade-in duration-200 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar - Ancho optimizado y scroll suave */}
          <div className="md:hidden fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto scroll-smooth-mobile slide-in-right safe-area-inset">
            {/* Header del Sidebar - Más compacto */}
            <div className="bg-[#00963c] px-4 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt="Billard Ramirez"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-white/10 p-2.5 rounded-lg transition-colors touch-target"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navegación Principal - Espaciado táctil optimizado */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Menú Principal
              </h3>

              {/* Botón destacado de cotización */}
              <Link
                to="/tienda?categoria=mesas-de-pool"
                className="flex items-center justify-center gap-2 mb-4 bg-accent hover:bg-accent/90 text-white font-bold px-4 py-3.5 rounded-lg transition-all duration-300 shadow-md touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Cotizar mi mesa de pool
              </Link>

              <nav className="space-y-1">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-[#00963c]/5 hover:text-[#00963c] rounded-lg transition-colors font-medium touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={22} />
                  Inicio
                </Link>
                <Link
                  to="/tienda"
                  className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-[#00963c]/5 hover:text-[#00963c] rounded-lg transition-colors font-medium touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store size={22} />
                  Tienda
                </Link>
                <Link
                  to="/tienda?categoria=tacos"
                  className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700 rounded-lg transition-all font-medium border-2 border-transparent hover:border-amber-300 touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles size={22} className="text-amber-500" />
                  <span>Personaliza tu Taco</span>
                </Link>
                <Link
                  to="/contacto"
                  className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-[#00963c]/5 hover:text-[#00963c] rounded-lg transition-colors font-medium touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Mail size={22} />
                  Contacto
                </Link>
              </nav>
            </div>

            {/* Categorías de Productos */}
            <div className="p-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Categorías
              </h3>
              <nav className="space-y-1">
                {mainCategories.map((category) => {
                  const IconComponent = category.icon;
                  const hasSubcategories = category.subcategories.length > 0;
                  const isExpanded = expandedCategory === category.slug;

                  return (
                    <div key={category.slug}>
                      {/* Categoría principal */}
                      <div className="flex items-center">
                        <Link
                          to={`/tienda?categoria=${category.slug}`}
                          className="flex-1 flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-[#00963c]/5 hover:text-[#00963c] rounded-lg transition-colors font-bold touch-target"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <IconComponent size={22} />
                          {category.name}
                        </Link>

                        {/* Botón expandir si tiene subcategorías */}
                        {hasSubcategories && (
                          <button
                            onClick={() => setExpandedCategory(isExpanded ? null : category.slug)}
                            className="p-3.5 text-gray-500 hover:text-[#00963c] transition-colors touch-target"
                            aria-label={isExpanded ? 'Contraer' : 'Expandir'}
                          >
                            <ChevronDown
                              size={22}
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Subcategorías expandibles */}
                      {hasSubcategories && isExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-[#00963c]/20 pl-3">
                          {category.subcategories.map((subcategory, index) => (
                            <Link
                              key={subcategory.slug}
                              to={`/tienda?categoria=${subcategory.slug}`}
                              className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-[#00963c] hover:bg-[#00963c]/5 rounded-lg transition-colors touch-target"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-[#00963c] flex items-center justify-center text-xs font-bold text-[#00963c] flex-shrink-0">
                                {index + 1}
                              </div>
                              <span className="truncate">{subcategory.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Información de Contacto - Más compacto */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 safe-area-bottom">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Contacto
              </h3>
              <div className="space-y-2">
                <a
                  href="tel:+56965839601"
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:text-[#00963c] hover:bg-[#00963c]/5 rounded-lg transition-colors touch-target"
                >
                  <Phone size={20} />
                  +56 9 6583 9601
                </a>
                <a
                  href="mailto:contacto@billardramirez.cl"
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:text-[#00963c] hover:bg-[#00963c]/5 rounded-lg transition-colors touch-target"
                >
                  <Mail size={20} />
                  contacto@billardramirez.cl
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
