import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Phone, Mail, ChevronDown, Box, Star, Package, Flame, Mic } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { wooApi } from '../../api/woocommerce';
import CategoryMenu from './CategoryMenu';

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSearchingVoice, setIsSearchingVoice] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();

  // Speech Recognition - Optimizado para respuesta rápida
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta búsqueda por voz. Prueba con Chrome o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CL';
    recognition.interimResults = true; // Resultados en tiempo real
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let searchTimeout: ReturnType<typeof setTimeout>;

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscript = '';
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
        } else {
          interimTranscript = transcript;
        }
      }

      // Mostrar texto mientras habla
      setSearchQuery(finalTranscript || interimTranscript);

      // Si es resultado final, buscar inmediatamente
      if (finalTranscript) {
        clearTimeout(searchTimeout);
        setIsListening(false);
        setIsSearchingVoice(true);

        // Buscar con delay mínimo
        searchTimeout = setTimeout(() => {
          const params = new URLSearchParams();
          params.set('buscar', finalTranscript.trim());
          navigate(`/tienda?${params.toString()}`);
          setSearchQuery('');
          setIsMenuOpen(false);
          setIsSearchingVoice(false);
        }, 300);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        // Silencioso si no detecta voz
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

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

              {/* Carrito y Menú - Estilo minimalista */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleCart}
                  className="relative text-white p-2.5 transition-all"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCart size={22} strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-[10px] font-medium bg-white text-[#00963c] h-4 w-4 flex items-center justify-center rounded-full">
                      {itemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-2.5 transition-colors"
                  aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                  {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
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
                  placeholder={isListening ? 'Escuchando...' : isSearchingVoice ? 'Buscando...' : 'Buscar productos...'}
                  className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm focus:outline-none placeholder:text-white/50"
                />
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`mr-3 p-1.5 rounded-full transition-all ${
                    isListening
                      ? 'bg-white text-[#00963c] animate-pulse'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Buscar por voz"
                >
                  <Mic size={16} />
                </button>
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
                  placeholder={isListening ? 'Escuchando...' : isSearchingVoice ? 'Buscando...' : 'Buscar productos...'}
                  className="flex-1 px-4 py-2.5 bg-transparent text-white text-sm focus:outline-none placeholder:text-white/50"
                />
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`mr-4 p-1.5 rounded-full transition-all ${
                    isListening
                      ? 'bg-white text-[#00963c] animate-pulse'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Buscar por voz"
                >
                  <Mic size={18} />
                </button>
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
      <div className="bg-black text-white py-2 sm:py-2.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center mx-4 sm:mx-6 text-[10px] sm:text-xs md:text-sm tracking-wide">
              <Link to="/tienda" className="font-medium uppercase hover:text-gray-300 transition-colors px-3 sm:px-5">
                Comprar
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/contacto" className="font-medium uppercase hover:text-gray-300 transition-colors px-3 sm:px-5">
                Ubicación
              </Link>
              <span className="mx-6 sm:mx-10 text-gray-500">•</span>
              <span className="hidden xs:inline">ENCUENTRA LA MEJOR CALIDAD AQUÍ</span>
              <span className="xs:hidden">CALIDAD</span>
              <span className="mx-6 sm:mx-10 text-gray-500">•</span>
              <span className="hidden sm:inline">SÁBADOS TIENDA ABIERTA</span>
              <span className="sm:hidden">SÁBADOS ABIERTO</span>
              <span className="mx-6 sm:mx-10 text-gray-500">•</span>
              <span className="hidden md:inline">ENVÍO GRATIS EN ACCESORIOS SOBRE LOS $100.000</span>
              <span className="md:hidden">ENVÍO GRATIS +$100K</span>
              <span className="mx-6 sm:mx-10 text-gray-500">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Full Screen Menu - Estilo Redecora */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header del menú */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block"
          >
            <img
              src="/images/logo.png"
              alt="Billard Ramirez"
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-black hover:opacity-60 transition-opacity"
            aria-label="Cerrar menú"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="h-[calc(100vh-65px)] overflow-y-auto">
          {/* Navegación Principal */}
          <nav className="px-5 py-6">
            <div className="space-y-0">
              <Link
                to="/"
                className="block py-3 text-2xl font-display uppercase tracking-wide text-black hover:opacity-60 transition-opacity border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/tienda"
                className="block py-3 text-2xl font-display uppercase tracking-wide text-black hover:opacity-60 transition-opacity border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Tienda
              </Link>
              <Link
                to="/tienda?categoria=mesas-de-pool"
                className="block py-3 text-2xl font-display uppercase tracking-wide text-black hover:opacity-60 transition-opacity border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Mesas de Pool
              </Link>
              <Link
                to="/tienda?categoria=accesorios"
                className="block py-3 text-2xl font-display uppercase tracking-wide text-black hover:opacity-60 transition-opacity border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Accesorios
              </Link>
              <Link
                to="/contacto"
                className="block py-3 text-2xl font-display uppercase tracking-wide text-black hover:opacity-60 transition-opacity border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </nav>

          {/* Categorías */}
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
              Categorías
            </p>
            <div className="space-y-0">
              {mainCategories.map((category) => {
                const hasSubcategories = category.subcategories.length > 0;
                const isExpanded = expandedCategory === category.slug;

                return (
                  <div key={category.slug} className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/tienda?categoria=${category.slug}`}
                        className="flex-1 py-3 text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      {hasSubcategories && (
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : category.slug)}
                          className="p-3 text-gray-400 hover:text-black transition-colors"
                          aria-label={isExpanded ? 'Contraer' : 'Expandir'}
                        >
                          <ChevronDown
                            size={16}
                            strokeWidth={1.5}
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Subcategorías */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-4 pb-3 space-y-0">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.slug}
                            to={`/tienda?categoria=${subcategory.slug}`}
                            className="block py-2 text-xs uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Cotizar */}
          <div className="px-5 py-6">
            <Link
              to="/tienda?categoria=mesas-de-pool"
              className="block w-full py-4 text-center text-xs uppercase tracking-[0.2em] bg-black text-white hover:bg-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cotizar Mesa
            </Link>
          </div>

          {/* Footer del menú */}
          <div className="px-5 py-6 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
              Contacto
            </p>
            <div className="space-y-3">
              <a
                href="tel:+56965839601"
                className="block text-sm text-gray-600 hover:text-black transition-colors"
              >
                +56 9 6583 9601
              </a>
              <a
                href="mailto:contacto@billardramirez.cl"
                className="block text-sm text-gray-600 hover:text-black transition-colors"
              >
                contacto@billardramirez.cl
              </a>
              <p className="text-sm text-gray-600">
                Maximiliano Ibáñez 1436, Quinta Normal
              </p>
            </div>

            {/* Horario */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                Horario
              </p>
              <p className="text-xs text-gray-500">
                Lun - Vie: 9:00 - 18:00
              </p>
              <p className="text-xs text-gray-500">
                Sábados: 11:00 - 15:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
