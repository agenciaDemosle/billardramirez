import { useState, useEffect } from 'react';
import { MapPin, Ruler, Palette, Truck, Calculator } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import Button from '../ui/Button';

interface PoolTableQuotationProps {
  basePrice: number;
  productName: string;
  description: string;
}

// Predefined table dimensions based on standard sizes
const tableDimensions = [
  { label: '7 pies (220 x 115 cm)', value: '220x115', priceAdjustment: 0 },
  { label: '8 pies (250 x 130 cm)', value: '250x130', priceAdjustment: 150000 },
  { label: '9 pies (270 x 146 cm)', value: '270x146', priceAdjustment: 300000 },
];

// Cloth/paño options with different qualities and colors
const clothOptions = [
  {
    name: 'Paño Estándar',
    colors: ['Verde', 'Azul', 'Rojo', 'Negro'],
    price: 0,
    description: 'Paño de calidad estándar, ideal para uso recreativo'
  },
  {
    name: 'Paño Premium',
    colors: ['Verde', 'Azul', 'Rojo', 'Negro', 'Gris'],
    price: 80000,
    description: 'Paño de alta calidad, mayor durabilidad y mejor deslizamiento'
  },
  {
    name: 'Paño Profesional',
    colors: ['Verde Torneo', 'Azul Torneo'],
    price: 150000,
    description: 'Paño profesional usado en competencias, máxima calidad'
  },
];

// Chilean regions for shipping calculation (approximate distances from Santiago)
const regions = [
  { name: 'Región Metropolitana', distance: 0 },
  { name: 'Región de Valparaíso', distance: 120 },
  { name: 'Región de O\'Higgins', distance: 90 },
  { name: 'Región del Maule', distance: 250 },
  { name: 'Región de Ñuble', distance: 400 },
  { name: 'Región del Biobío', distance: 500 },
  { name: 'Región de La Araucanía', distance: 650 },
  { name: 'Región de Los Ríos', distance: 800 },
  { name: 'Región de Los Lagos', distance: 1000 },
  { name: 'Región de Coquimbo', distance: 450 },
  { name: 'Región de Atacama', distance: 800 },
  { name: 'Región de Antofagasta', distance: 1350 },
  { name: 'Región de Tarapacá', distance: 2050 },
  { name: 'Región de Arica y Parinacota', distance: 2200 },
  { name: 'Región de Aysén', distance: 1600 },
  { name: 'Región de Magallanes', distance: 3000 },
];

export default function PoolTableQuotation({ basePrice, productName, description }: PoolTableQuotationProps) {
  const [selectedDimension, setSelectedDimension] = useState(tableDimensions[0]);
  const [selectedCloth, setSelectedCloth] = useState(clothOptions[0]);
  const [selectedClothColor, setSelectedClothColor] = useState(clothOptions[0].colors[0]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [customDimensions, setCustomDimensions] = useState({ width: '', length: '' });
  const [useCustomDimensions, setUseCustomDimensions] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Check if product description mentions customization
  const isCustomizable = description.toLowerCase().includes('personaliz') ||
                         description.toLowerCase().includes('medida');

  // Calculate shipping cost (1,000 pesos per km)
  const shippingCost = selectedRegion.distance * 1000;

  // Calculate total price (shipping not included when distance > 0)
  const tablePrice = basePrice + selectedDimension.priceAdjustment;
  const clothPrice = selectedCloth.price;
  const totalPrice = tablePrice + clothPrice; // Shipping excluded - will be quoted separately

  // Update cloth color when cloth type changes
  useEffect(() => {
    setSelectedClothColor(selectedCloth.colors[0]);
  }, [selectedCloth]);

  const handleWhatsAppQuote = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa cotizar la siguiente mesa de pool:\n\n` +
      `Producto: ${productName}\n` +
      `Dimensiones: ${useCustomDimensions && customDimensions.width && customDimensions.length
        ? `${customDimensions.width} x ${customDimensions.length} cm (Personalizada)`
        : selectedDimension.label}\n` +
      `Paño: ${selectedCloth.name} - Color ${selectedClothColor}\n` +
      `Región de envío: ${selectedRegion.name}\n` +
      `Distancia estimada: ${selectedRegion.distance} km\n\n` +
      `COTIZACIÓN:\n` +
      `Mesa: ${formatPrice(tablePrice)}\n` +
      `Paño: ${clothPrice === 0 ? 'Incluido' : formatPrice(clothPrice)}\n` +
      `Envío: ${selectedRegion.distance === 0 ? 'Gratis (Región Metropolitana)' : 'A cotizar'}\n` +
      `SUBTOTAL (sin envío): ${formatPrice(totalPrice)}\n\n` +
      (additionalNotes ? `Notas adicionales: ${additionalNotes}\n\n` : '') +
      `¿Podrían confirmar esta cotización y darme el valor del despacho?`
    );

    window.open(`https://wa.me/56965839601?text=${message}`, '_blank');
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-2xl border-2 border-primary/20 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary text-white p-3 rounded-xl">
          <Calculator className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Cotizador Personalizado
          </h3>
          <p className="text-sm text-gray-600">
            Personaliza tu mesa y calcula el costo total con envío incluido
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dimensions Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-gray-900">
              1. Selecciona las Dimensiones
            </h4>
          </div>

          <div className="space-y-3">
            {tableDimensions.map((dimension) => (
              <label
                key={dimension.value}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  !useCustomDimensions && selectedDimension.value === dimension.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="dimension"
                    checked={!useCustomDimensions && selectedDimension.value === dimension.value}
                    onChange={() => {
                      setSelectedDimension(dimension);
                      setUseCustomDimensions(false);
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{dimension.label}</p>
                    {dimension.priceAdjustment > 0 && (
                      <p className="text-sm text-gray-600">
                        +{formatPrice(dimension.priceAdjustment)}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            ))}

            {isCustomizable && (
              <div className="mt-4 pt-4 border-t">
                <label className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={useCustomDimensions}
                    onChange={(e) => setUseCustomDimensions(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="font-medium text-gray-900">
                    Dimensiones Personalizadas
                  </span>
                </label>

                {useCustomDimensions && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ancho (cm)
                      </label>
                      <input
                        type="number"
                        value={customDimensions.width}
                        onChange={(e) => setCustomDimensions({ ...customDimensions, width: e.target.value })}
                        placeholder="ej: 250"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Largo (cm)
                      </label>
                      <input
                        type="number"
                        value={customDimensions.length}
                        onChange={(e) => setCustomDimensions({ ...customDimensions, length: e.target.value })}
                        placeholder="ej: 130"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cloth Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-gray-900">
              2. Selecciona el Paño
            </h4>
          </div>

          <div className="space-y-3 mb-4">
            {clothOptions.map((cloth) => (
              <label
                key={cloth.name}
                className={`flex items-start justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCloth.name === cloth.name
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="cloth"
                    checked={selectedCloth.name === cloth.name}
                    onChange={() => setSelectedCloth(cloth)}
                    className="w-4 h-4 text-primary mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{cloth.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{cloth.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {cloth.price === 0 ? 'Incluido' : `+${formatPrice(cloth.price)}`}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color del Paño
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedCloth.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedClothColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                    selectedClothColor === color
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-700 hover:border-primary/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Region */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-gray-900">
              3. Región de Envío
            </h4>
          </div>

          <select
            value={selectedRegion.name}
            onChange={(e) => {
              const region = regions.find(r => r.name === e.target.value);
              if (region) setSelectedRegion(region);
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
          >
            {regions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name} {region.distance > 0 ? `(~${region.distance} km)` : ''}
              </option>
            ))}
          </select>

          {selectedRegion.distance > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <p>
                Distancia aproximada: <span className="font-semibold">{selectedRegion.distance} km</span>
                {' '}· Costo de envío: <span className="font-semibold text-primary">Valor a cotizar</span>
              </p>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="¿Necesitas alguna personalización adicional? ¿Preguntas sobre instalación?"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Resumen de Cotización</h4>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Mesa base:</span>
              <span className="font-medium">{formatPrice(tablePrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Paño {selectedCloth.name}:</span>
              <span className="font-medium">
                {clothPrice === 0 ? 'Incluido' : formatPrice(clothPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Envío a {selectedRegion.name}:</span>
              <span className="font-medium">
                {selectedRegion.distance === 0 ? 'Gratis' : 'A cotizar'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/30">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">SUBTOTAL:</span>
              <span className="text-3xl font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-white/80 mt-2">
              *IVA incluido. {selectedRegion.distance > 0 ? 'Envío no incluido, valor a cotizar.' : ''} Precio referencial sujeto a confirmación.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full text-lg font-semibold bg-accent hover:bg-accent/90 shadow-xl"
          onClick={handleWhatsAppQuote}
        >
          Solicitar Cotización por WhatsApp
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Al solicitar la cotización, te contactaremos para confirmar los detalles y coordinar el pedido
        </p>
      </div>
    </div>
  );
}
