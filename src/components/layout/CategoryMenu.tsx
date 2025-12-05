import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { wooApi } from '../../api/woocommerce';
import ClothChangeModal from '../product/ClothChangeModal';
import {
  ChevronDown,
  Target,
  Zap,
  Package,
  Shield,
  Circle,
  Flame,
  Box,
  Star,
  Sparkles,
  Scissors
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type IconType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// Categorías estáticas predefinidas para carga instantánea
const STATIC_CATEGORIES = [
  {
    id: 'mesas-de-pool',
    name: 'MESAS DE POOL',
    slug: 'mesas-de-pool',
    icon: Box,
    subcategories: [
      { id: 40, name: 'Profesional', slug: 'superficie-en-piedra' },
      { id: 39, name: 'Premium Recreacional', slug: 'superficie-en-madera' },
    ]
  },
  {
    id: 'accesorios',
    name: 'ACCESORIOS',
    slug: 'accesorios',
    icon: Package,
    subcategories: [
      { id: 36, name: 'Tacos', slug: 'tacos' },
      { id: 16, name: 'Bolas de Pool', slug: 'bolas-de-pool' },
      { id: 35, name: 'Suelas', slug: 'suelas' },
      { id: 21, name: 'Fundas y Cubiertas', slug: 'fundas-de-mesa' },
      { id: 37, name: 'Tizas', slug: 'tizas' },
      { id: 17, name: 'Buchacas', slug: 'buchacas' },
      { id: 20, name: 'Estuches', slug: 'estuches' },
    ]
  },
  {
    id: 'repuestos',
    name: 'REPUESTOS',
    slug: 'repuestos',
    icon: Shield,
    subcategories: [
      { id: 30, name: 'Paños', slug: 'pano' },
      { id: 22, name: 'Goma de Banda', slug: 'banda-de-goma' },
      { id: 18, name: 'Diablitos', slug: 'diablitos' },
      { id: 19, name: 'Escobillas', slug: 'escobillas' },
      { id: 38, name: 'Triángulos', slug: 'triangulos' },
      { id: 24, name: 'Guantes', slug: 'guantes' },
      { id: 23, name: 'Grip', slug: 'grip' },
    ]
  },
  {
    id: 'muebles',
    name: 'MUEBLES',
    slug: 'muebles-y-decoracion',
    icon: Star,
    subcategories: [
      { id: 42, name: 'Banquetas y Sillas', slug: 'banquetas-y-sillas' },
      { id: 44, name: 'Taqueras', slug: 'taqueras' },
      { id: 43, name: 'Lámparas', slug: 'lamparas' },
    ]
  },
  {
    id: 'ofertas',
    name: 'OFERTAS',
    slug: 'ofertas',
    icon: Flame,
    subcategories: []
  },
];

// Mapeo de iconos según el slug de la categoría
const getIconForCategory = (slug: string): IconType => {
  const iconMap: { [key: string]: IconType } = {
    'ofertas': Flame,
    'tacos': Zap,
    'mesas-de-pool': Box,
    'mesas': Box,
    'suelas': Shield,
    'fundas-y-cubiertas': Package,
    'fundas': Package,
    'bolas-de-pool': Circle,
    'bolas': Circle,
    'buchacas': Target,
    'tizas': Sparkles,
    'accesorios': Star,
    'estuches': Package,
  };

  // Buscar coincidencia exacta o parcial
  const exactMatch = iconMap[slug.toLowerCase()];
  if (exactMatch) return exactMatch;

  // Buscar si el slug contiene alguna palabra clave
  const partialMatch = Object.keys(iconMap).find(key =>
    slug.toLowerCase().includes(key) || key.includes(slug.toLowerCase())
  );

  return partialMatch ? iconMap[partialMatch] : Star;
};

export default function CategoryMenu() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showClothModal, setShowClothModal] = useState(false);
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Obtener categorías desde WooCommerce (en background)
  const { data: wooCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => wooApi.getCategories({ per_page: 100, hide_empty: false }),
    staleTime: 1000 * 60 * 10, // Cache por 10 minutos
  });

  // Procesar categorías para estructura jerárquica - Solo 4 principales
  // Usar categorías estáticas si WooCommerce aún no ha cargado
  const categories = useMemo(() => {
    if (!wooCategories.length) return STATIC_CATEGORIES;

    // Estructura de categorías principales con subcategorías
    const mainCategories = [
      {
        name: 'MESAS DE POOL',
        slug: 'mesas-de-pool',
        icon: Box,
        subcategorySlugs: ['superficie-en-piedra', 'superficie-en-madera']
      },
      {
        name: 'ACCESORIOS',
        slug: 'accesorios',
        icon: Package,
        subcategorySlugs: ['tacos', 'bolas-de-pool', 'suelas', 'fundas-de-mesa', 'tizas', 'buchacas', 'estuches']
      },
      {
        name: 'REPUESTOS',
        slug: 'repuestos',
        icon: Shield,
        subcategorySlugs: ['pano', 'banda-de-goma', 'diablitos', 'escobillas', 'triangulos', 'guantes', 'grip']
      },
      {
        name: 'MUEBLES',
        slug: 'muebles-y-decoracion',
        icon: Star,
        subcategorySlugs: ['banquetas-y-sillas', 'taqueras', 'lamparas']
      },
      {
        name: 'OFERTAS',
        slug: 'ofertas',
        icon: Flame,
        subcategorySlugs: []
      }
    ];

    return mainCategories.map(mainCat => {
      // Buscar subcategorías por slug exacto
      const subcategories: { id: number; name: string; slug: string }[] = [];

      for (const slug of mainCat.subcategorySlugs) {
        const cat = wooCategories.find(wc => wc.slug === slug);
        if (cat && cat.count > 0) {
          subcategories.push({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          });
        }
      }

      return {
        id: mainCat.slug,
        name: mainCat.name,
        slug: mainCat.slug,
        icon: mainCat.icon,
        subcategories: subcategories
      };
    });
  }, [wooCategories]);

  // Calcular posición del dropdown cuando se abre
  useEffect(() => {
    if (openDropdown && buttonRefs.current[openDropdown]) {
      const rect = buttonRefs.current[openDropdown]!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left
      });
    }
  }, [openDropdown]);

  return (
    <>
      <nav className="bg-white hidden lg:block border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-center gap-1 xl:gap-4">
            {categories.map((category) => {
              const hasSubcategories = category.subcategories.length > 0;

              return (
                <div
                  key={category.slug}
                  className="relative"
                  ref={(el) => (buttonRefs.current[category.slug] = el)}
                  onMouseEnter={() => hasSubcategories && setOpenDropdown(category.slug)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/* Categoría principal */}
                  <Link
                    to={`/tienda?categoria=${category.slug}`}
                    className="flex items-center gap-1 px-3 py-3 text-xs xl:text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wide"
                  >
                    <span>{category.name}</span>
                    {hasSubcategories && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${openDropdown === category.slug ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}

            {/* Separador visual */}
            <div className="h-4 w-px bg-gray-200 mx-1"></div>

            {/* Personaliza tu Taco - Enlace especial */}
            <Link
              to="/tienda?categoria=tacos"
              className="flex items-center gap-1 px-3 py-3 text-xs xl:text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wide"
            >
              <span>TACOS</span>
            </Link>

            {/* Cambia tu Paño - Botón modal */}
            <button
              onClick={() => setShowClothModal(true)}
              className="flex items-center gap-1 px-3 py-3 text-xs xl:text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wide"
            >
              <span>CAMBIO PAÑO</span>
            </button>

            {/* Contacto */}
            <Link
              to="/contacto"
              className="flex items-center gap-1 px-3 py-3 text-xs xl:text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wide"
            >
              <span>CONTACTO</span>
            </Link>
          </div>
        </div>

        {/* CSS para ocultar scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </nav>

      {/* Dropdown de subcategorías - Estilo minimalista */}
      {openDropdown && categories.find(c => c.slug === openDropdown)?.subcategories.length! > 0 && (
        <div
          className="fixed bg-white shadow-xl py-4 min-w-[220px]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 99999,
          }}
          onMouseEnter={() => setOpenDropdown(openDropdown)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {categories.find(c => c.slug === openDropdown)?.subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              to={`/tienda?categoria=${subcategory.slug}`}
              className="block px-6 py-2.5 text-sm text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-200"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      )}

      {/* Modal de Cambio de Paño */}
      <ClothChangeModal isOpen={showClothModal} onClose={() => setShowClothModal(false)} />
    </>
  );
}
