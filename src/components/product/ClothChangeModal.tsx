import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';

interface ClothChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClothColor {
  id: string;
  name: string;
  color: string;
}

const CLOTH_COLORS: ClothColor[] = [
  { id: 'blue', name: 'Azul', color: '#1e3a8a' },
  { id: 'black', name: 'Negro', color: '#000000' },
  { id: 'green', name: 'Verde', color: '#047857' },
  { id: 'red', name: 'Rojo', color: '#dc2626' },
];

// Precio base por metro cuadrado
const PRICE_PER_SQM = 45000;

export default function ClothChangeModal({ isOpen, onClose }: ClothChangeModalProps) {
  const { addToCart } = useCart();
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [selectedColor, setSelectedColor] = useState<ClothColor | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Calcular área y precio
  const calculatePrice = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const area = (l * w) / 10000; // convertir cm² a m²
    return Math.ceil(area * PRICE_PER_SQM);
  };

  const price = calculatePrice();
  const isValid = length && width && selectedColor && price > 0;

  const handleAddToCart = () => {
    if (!isValid || !selectedColor) return;

    setIsAddingToCart(true);

    // Crear un producto virtual para el paño
    const clothProduct = {
      id: 999999,
      name: `Cambio de Paño ${selectedColor.name}`,
      slug: 'cambio-de-pano',
      permalink: '',
      type: 'simple' as const,
      status: 'publish' as const,
      featured: false,
      description: `Servicio de cambio de paño color ${selectedColor.name} para mesa de ${length}cm x ${width}cm`,
      short_description: `Paño ${selectedColor.name} - ${length}x${width}cm`,
      sku: `CLOTH-${selectedColor.id.toUpperCase()}`,
      price: price.toString(),
      regular_price: price.toString(),
      sale_price: '',
      on_sale: false,
      stock_status: 'instock' as const,
      stock_quantity: null,
      manage_stock: false,
      categories: [],
      tags: [],
      images: [
        {
          id: 1,
          src: '/images/fotos/cambia-pano.webp',
          name: 'Cambio de Paño',
          alt: 'Servicio de cambio de paño',
        },
      ],
      attributes: [],
      variations: [],
      average_rating: '5',
      rating_count: 0,
      related_ids: [],
      date_created: new Date().toISOString(),
      date_modified: new Date().toISOString(),
    };

    const customization = {
      clothChange: {
        dimensions: `${length} x ${width} cm`,
        color: selectedColor.name,
        colorId: selectedColor.id,
        area: ((parseFloat(length) * parseFloat(width)) / 10000).toFixed(2) + ' m²',
      },
    };

    addToCart(clothProduct, 1, undefined, undefined, customization);

    setTimeout(() => {
      setIsAddingToCart(false);
      setLength('');
      setWidth('');
      setSelectedColor(null);
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setLength('');
    setWidth('');
    setSelectedColor(null);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md bg-white shadow-xl">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-10"
                >
                  <X size={20} />
                </button>

                {/* Content */}
                <div className="p-8 pt-12">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
                      Servicio
                    </p>
                    <Dialog.Title className="text-2xl font-display uppercase tracking-wide">
                      Cambio de Paño
                    </Dialog.Title>
                  </div>

                  {/* Dimensions */}
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                      Medidas de tu mesa
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="length" className="block text-xs text-gray-500 mb-2">
                          Largo (cm)
                        </label>
                        <input
                          type="number"
                          id="length"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="254"
                          min="50"
                          max="500"
                          className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="width" className="block text-xs text-gray-500 mb-2">
                          Ancho (cm)
                        </label>
                        <input
                          type="number"
                          id="width"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="127"
                          min="50"
                          max="500"
                          className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                        />
                      </div>
                    </div>
                    {length && width && (
                      <p className="text-xs text-gray-400 mt-3">
                        Área: {((parseFloat(length) * parseFloat(width)) / 10000).toFixed(2)} m²
                      </p>
                    )}
                  </div>

                  {/* Color Selector */}
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                      Color del paño
                    </p>
                    <div className="flex gap-3">
                      {CLOTH_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          className={`relative w-12 h-12 transition-all ${
                            selectedColor?.id === color.id
                              ? 'ring-2 ring-black ring-offset-2'
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="text-xs text-gray-500 mt-3">
                        Seleccionado: {selectedColor.name}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  {isValid && (
                    <div className="border-t border-gray-200 pt-6 mb-8">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-2xl text-black">
                          {formatPrice(price)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        Incluye instalación
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!isValid || isAddingToCart}
                      className="w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isAddingToCart ? 'Agregando...' : 'Agregar al carrito'}
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full text-xs uppercase tracking-wider py-3 text-gray-500 hover:text-black transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
