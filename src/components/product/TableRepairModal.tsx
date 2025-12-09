import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

interface TableRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Servicio de mantención full
const MAINTENANCE_SERVICE = {
  name: 'Mantención Mesa de Pool Full',
  price: 350000,
  includesIVA: true,
  includes: [
    'Cambio completo de paño 6 bandas y superficie',
    'Rectificación de alturas de goma de banda',
    'Ajuste de sujeciones de bolsas de troneras',
    'Revisión y ajuste de elementos de sujeción de tapa baranda y piezas laterales',
    'Enmasillado y lijado de superficie',
    'Limpieza completa del mueble de madera',
    'Ajuste y renivelación final',
  ],
};

// Opciones de paño
const CLOTH_OPTIONS = [
  { id: 'brp-green', name: 'BRP Green', price: 69900 },
  { id: 'polyspeed', name: 'PolySpeed Cloth', price: 99900 },
  { id: 'lana-uruguaya', name: 'Lana Uruguaya', price: 149900 },
  { id: 'tournament-pro', name: 'Paño Tournament PRO', price: 249900 },
];

export default function TableRepairModal({ isOpen, onClose }: TableRepairModalProps) {
  const [wantsMaintenance, setWantsMaintenance] = useState(true);
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null);

  // Calcular total (IVA ya incluido en los precios)
  const maintenanceTotal = wantsMaintenance ? MAINTENANCE_SERVICE.price : 0;
  const clothTotal = selectedCloth
    ? CLOTH_OPTIONS.find(c => c.id === selectedCloth)?.price || 0
    : 0;
  const total = maintenanceTotal + clothTotal;

  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    let message = `Hola, me interesa cotizar el servicio de reparación/mantención de mesa de pool:\n\n`;

    if (wantsMaintenance) {
      message += `*SERVICIO MANTENCIÓN FULL* - ${formatPrice(MAINTENANCE_SERVICE.price)}\n`;
      message += `Incluye:\n`;
      MAINTENANCE_SERVICE.includes.forEach((item, index) => {
        message += `${index + 1}. ${item}\n`;
      });
      message += `\n`;
    }

    if (selectedCloth) {
      const cloth = CLOTH_OPTIONS.find(c => c.id === selectedCloth);
      if (cloth) {
        message += `*PAÑO SELECCIONADO:*\n`;
        message += `- ${cloth.name}: ${formatPrice(cloth.price)}\n\n`;
      }
    }

    message += `*TOTAL: ${formatPrice(total)}*\n\n`;
    message += `¿Me pueden confirmar disponibilidad?`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    if (!wantsMaintenance && !selectedCloth) return;
    const phoneNumber = '56965839601';
    const url = `https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
    handleClose();
  };

  const handleClose = () => {
    setWantsMaintenance(true);
    setSelectedCloth(null);
    onClose();
  };

  const hasSelection = wantsMaintenance || selectedCloth;

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
              <Dialog.Panel className="relative w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-10"
                >
                  <X size={20} />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8 pt-12">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
                      Servicio Técnico
                    </p>
                    <Dialog.Title className="text-xl sm:text-2xl font-display uppercase tracking-wide">
                      Reparación de Mesa
                    </Dialog.Title>
                  </div>

                  {/* Servicio de Mantención Full */}
                  <div className="mb-6">
                    <button
                      onClick={() => setWantsMaintenance(!wantsMaintenance)}
                      className={`w-full text-left p-4 border-2 transition-all ${
                        wantsMaintenance
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm sm:text-base mb-1">
                            {MAINTENANCE_SERVICE.name}
                          </h3>
                          <p className={`text-lg sm:text-xl font-display ${wantsMaintenance ? 'text-white' : 'text-black'}`}>
                            {formatPrice(MAINTENANCE_SERVICE.price)}
                          </p>
                        </div>
                        <div className={`w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 ${
                          wantsMaintenance ? 'border-white bg-white' : 'border-gray-300'
                        }`}>
                          {wantsMaintenance && <Check size={14} className="text-black" />}
                        </div>
                      </div>
                    </button>

                    {/* Detalles del servicio */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      wantsMaintenance ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="bg-gray-50 p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                          ¿Qué incluye?
                        </p>
                        <ul className="space-y-2">
                          {MAINTENANCE_SERVICE.includes.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                              <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Opciones de Paño */}
                  <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                      Elige tu paño
                    </p>
                    <div className="space-y-2">
                      {CLOTH_OPTIONS.map((cloth) => {
                        const isSelected = selectedCloth === cloth.id;
                        return (
                          <button
                            key={cloth.id}
                            onClick={() => setSelectedCloth(isSelected ? null : cloth.id)}
                            className={`w-full flex items-center justify-between p-3 border transition-all ${
                              isSelected
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-black' : 'border-gray-300'
                              }`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                              </div>
                              <span className="text-sm">{cloth.name}</span>
                            </div>
                            <span className="text-sm font-medium">{formatPrice(cloth.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resumen */}
                  {hasSelection && (
                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                        Resumen
                      </p>
                      <div className="space-y-2 text-sm">
                        {wantsMaintenance && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mantención Full</span>
                            <span>{formatPrice(MAINTENANCE_SERVICE.price)}</span>
                          </div>
                        )}
                        {selectedCloth && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              {CLOTH_OPTIONS.find(c => c.id === selectedCloth)?.name}
                            </span>
                            <span>{formatPrice(clothTotal)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-medium text-base">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleWhatsAppClick}
                      disabled={!hasSelection}
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
