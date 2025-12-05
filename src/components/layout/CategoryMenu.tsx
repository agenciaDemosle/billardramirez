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
      { id: 1, name: 'Superficie en Piedra', slug: 'superficie-en-piedra' },
      { id: 2, name: 'Superficie en Madera', slug: 'superficie-en-madera' },
    ]
  },
  {
    id: 'accesorios',
    name: 'ACCESORIOS',
    slug: 'accesorios',
    icon: Package,
    subcategories: [
      { id: 3, name: 'Tacos', slug: 'tacos' },
      { id: 4, name: 'Bolas de Pool', slug: 'bolas-de-pool' },
      { id: 5, name: 'Tizas', slug: 'tizas' },
      { id: 6, name: 'Fundas y Cubiertas', slug: 'fundas-y-cubiertas' },
      { id: 7, name: 'Estuches', slug: 'estuches' },
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

    // Estructura de 4 categorías principales con mapeo de slugs
    const mainCategories = [
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

    return mainCategories.map(mainCat => {
      // Encontrar todas las categorías de WooCommerce que pertenecen a esta categoría principal
      const matchingCategories = wooCategories.filter(wooCat =>
        mainCat.includeCategories.some(slug =>
          wooCat.slug.includes(slug) || slug.includes(wooCat.slug)
        ) && wooCat.count > 0 && wooCat.slug !== 'uncategorized'
      );

      // Si hay una categoría padre principal (como "mesas-de-pool"), úsala
      const mainWooCat = matchingCategories.find(cat => cat.slug === mainCat.slug);

      // Usar Set para evitar duplicados por ID
      const subcategoriesMap = new Map();

      // Primero agregar las categorías que coinciden (excluyendo la principal)
      matchingCategories
        .filter(cat => cat.slug !== mainCat.slug)
        .forEach(cat => {
          subcategoriesMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          });
        });

      // Si la categoría principal existe, agregar sus subcategorías de WooCommerce
      if (mainWooCat) {
        wooCategories
          .filter(cat => cat.parent === mainWooCat.id && cat.count > 0)
          .forEach(sub => {
            // Solo agregar si no existe ya en el map
            if (!subcategoriesMap.has(sub.id)) {
              subcategoriesMap.set(sub.id, {
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
              });
            }
          });
      }

      // Convertir el Map a array
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
      <nav className="bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const hasSubcategories = category.subcategories.length > 0;
              const IconComponent = category.icon;

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
                    className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wider"
                  >
                    <span>{category.name}</span>
                    {hasSubcategories && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${openDropdown === category.slug ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}

            {/* Personaliza tu Taco - Enlace especial */}
            <Link
              to="/tienda?categoria=tacos"
              className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wider"
            >
              <span>PERSONALIZA TU TACO</span>
            </Link>

            {/* Cambia tu Paño - Botón modal */}
            <button
              onClick={() => setShowClothModal(true)}
              className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wider"
            >
              <span>CAMBIA TU PAÑO</span>
            </button>

            {/* Contacto */}
            <Link
              to="/contacto"
              className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-black hover:text-gray-500 transition-all duration-200 whitespace-nowrap uppercase tracking-wider"
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
