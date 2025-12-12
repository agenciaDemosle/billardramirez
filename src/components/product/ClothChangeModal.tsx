import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { trackWhatsAppClick } from '../../hooks/useAnalytics';

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

export default function ClothChangeModal({ isOpen, onClose }: ClothChangeModalProps) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [selectedColor, setSelectedColor] = useState<ClothColor | null>(null);

  const isValid = length && width && selectedColor;

  // Generar mensaje de WhatsApp con los datos
  const generateWhatsAppMessage = () => {
    const area = ((parseFloat(length) * parseFloat(width)) / 10000).toFixed(2);
    const message = `Hola, quiero cotizar un cambio de paño para mi mesa de pool:

📏 Medidas: ${length} x ${width} cm
📐 Área: ${area} m²
🎨 Color: ${selectedColor?.name}

¿Me pueden dar el precio?`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = async () => {
    if (!isValid) return;

    // Calculate approximate service value (for tracking purposes)
    const area = (parseFloat(length) * parseFloat(width)) / 10000;
    const estimatedValue = area * 50000; // Estimación aproximada

    // Track WhatsApp click for cloth change service
    await trackWhatsAppClick({
      click_location: 'cloth_change_modal',
      button_text: 'Solicitar Cotización',
      service_interested: 'Cambio de Paño',
      value: estimatedValue,
    });

    const phoneNumber = '56965839601';
    const url = `https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
    handleClose();
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

                  {/* Resumen */}
                  {isValid && (
                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                        Resumen de tu cotización
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Medidas:</span>
                          <span>{length} x {width} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Área:</span>
                          <span>{((parseFloat(length) * parseFloat(width)) / 10000).toFixed(2)} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Color:</span>
                          <span className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 inline-block"
                              style={{ backgroundColor: selectedColor?.color }}
                            />
                            {selectedColor?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleWhatsAppClick}
                      disabled={!isValid}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs uppercase tracking-wider py-4 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Cotizar por WhatsApp
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
