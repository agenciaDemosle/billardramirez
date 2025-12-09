import { useState, useEffect } from 'react';
import { MapPin, Ruler, Palette, Truck, ChevronRight, Check, UtensilsCrossed } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

interface PoolTableQuotationProps {
  basePrice: number;
  productName: string;
  description: string;
  excludeDimensions?: string[]; // Dimensiones a excluir por modelo
  tableType?: 'profesional' | 'recreacional' | 'roma-giratoria'; // Tipo de mesa para cubierta
}

// Predefined table dimensions based on standard sizes
const tableDimensions = [
  { label: '7 pies', detail: '220 x 115 cm', value: '220x115', priceAdjustment: 0 },
  { label: '8 pies', detail: '250 x 130 cm', value: '250x130', priceAdjustment: 150000 },
  { label: '9 pies', detail: '270 x 146 cm', value: '270x146', priceAdjustment: 300000 },
];

// Cloth/paño options with different qualities and colors
const clothOptions = [
  {
    name: 'Estándar',
    colors: [
      { name: 'Verde', hex: '#00963c' },
      { name: 'Azul', hex: '#1e40af' },
      { name: 'Rojo', hex: '#991b1b' },
      { name: 'Negro', hex: '#1a1a1a' },
    ],
    price: 0,
    description: 'Uso recreativo'
  },
  {
    name: 'Premium',
    colors: [
      { name: 'Verde', hex: '#00963c' },
      { name: 'Azul', hex: '#1e40af' },
      { name: 'Rojo', hex: '#991b1b' },
      { name: 'Negro', hex: '#1a1a1a' },
      { name: 'Gris', hex: '#6b7280' },
    ],
    price: 80000,
    description: 'Alta durabilidad'
  },
  {
    name: 'Profesional',
    colors: [
      { name: 'Verde Torneo', hex: '#065f46' },
      { name: 'Azul Torneo', hex: '#1e3a8a' },
    ],
    price: 150000,
    description: 'Competencias'
  },
];

// Chilean regions for shipping calculation
const regions = [
  { name: 'Región Metropolitana', distance: 0 },
  { name: 'Valparaíso', distance: 120 },
  { name: 'O\'Higgins', distance: 90 },
  { name: 'Maule', distance: 250 },
  { name: 'Ñuble', distance: 400 },
  { name: 'Biobío', distance: 500 },
  { name: 'La Araucanía', distance: 650 },
  { name: 'Los Ríos', distance: 800 },
  { name: 'Los Lagos', distance: 1000 },
  { name: 'Coquimbo', distance: 450 },
  { name: 'Atacama', distance: 800 },
  { name: 'Antofagasta', distance: 1350 },
  { name: 'Tarapacá', distance: 2050 },
  { name: 'Arica y Parinacota', distance: 2200 },
  { name: 'Aysén', distance: 1600 },
  { name: 'Magallanes', distance: 3000 },
];

export default function PoolTableQuotation({ basePrice, productName, description, excludeDimensions = [], tableType }: PoolTableQuotationProps) {
  // Filtrar dimensiones excluidas para este modelo
  const availableDimensions = tableDimensions.filter(d => !excludeDimensions.includes(d.value));
  const [selectedDimension, setSelectedDimension] = useState(availableDimensions[0]);
  const [selectedCloth, setSelectedCloth] = useState(clothOptions[0]);
  const [selectedClothColor, setSelectedClothColor] = useState(clothOptions[0].colors[0]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [customDimensions, setCustomDimensions] = useState({ width: '', length: '' });
  const [useCustomDimensions, setUseCustomDimensions] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [wantsDiningCover, setWantsDiningCover] = useState(tableType === 'roma-giratoria');

  // Configuración de cubierta de comedor según tipo de mesa
  const diningCoverConfig = {
    'roma-giratoria': { price: 0, label: 'Incluida' },
    'recreacional': { price: 289900, label: `Desde ${formatPrice(289900)}` },
    'profesional': { price: 389000, label: `Desde ${formatPrice(389000)}` },
  };

  const isRomaGiratoria = tableType === 'roma-giratoria';
  const coverPrice = isRomaGiratoria ? 0 : (wantsDiningCover && tableType ? diningCoverConfig[tableType].price : 0);

  // Check if product description mentions customization
  const isCustomizable = description.toLowerCase().includes('personaliz') ||
                         description.toLowerCase().includes('medida');

  // Calculate total price
  const tablePrice = basePrice + selectedDimension.priceAdjustment;
  const clothPrice = selectedCloth.price;
  const totalPrice = tablePrice + clothPrice + coverPrice;

  // Update cloth color when cloth type changes
  useEffect(() => {
    setSelectedClothColor(selectedCloth.colors[0]);
  }, [selectedCloth]);

  const handleWhatsAppQuote = () => {
    const coverText = isRomaGiratoria
      ? 'Cubierta de comedor: Incluida\n'
      : (wantsDiningCover && tableType ? `Cubierta de comedor: ${formatPrice(coverPrice)}\n` : '');

    const message = encodeURIComponent(
      `Hola! Me interesa cotizar la siguiente mesa de pool:\n\n` +
      `Producto: ${productName}\n` +
      `Dimensiones: ${useCustomDimensions && customDimensions.width && customDimensions.length
        ? `${customDimensions.width} x ${customDimensions.length} cm (Personalizada)`
        : `${selectedDimension.label} (${selectedDimension.detail})`}\n` +
      `Paño: ${selectedCloth.name} - ${selectedClothColor.name}\n` +
      (isRomaGiratoria || wantsDiningCover ? `Cubierta de comedor: ${isRomaGiratoria ? 'Incluida' : 'Sí'}\n` : '') +
      `Región de envío: ${selectedRegion.name}\n\n` +
      `COTIZACIÓN:\n` +
      `Mesa: ${formatPrice(tablePrice)}\n` +
      `Paño: ${clothPrice === 0 ? 'Incluido' : formatPrice(clothPrice)}\n` +
      coverText +
      `Envío: Por confirmar\n` +
      `SUBTOTAL: ${formatPrice(totalPrice)}\n\n` +
      (additionalNotes ? `Notas: ${additionalNotes}\n\n` : '') +
      `¿Podrían confirmar esta cotización?`
    );

    window.open(`https://wa.me/56965839601?text=${message}`, '_blank');
  };

  return (
    <div className="border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
          Personaliza tu mesa
        </p>
        <h3 className="text-lg font-display uppercase tracking-wide">
          Cotizador
        </h3>
      </div>

      <div className="p-6 space-y-8">
        {/* Step 1: Dimensions */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center">
              1
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={14} className="text-gray-400" />
              <span className="text-xs uppercase tracking-wider text-gray-600">Dimensiones</span>
            </div>
          </div>

          <div className={`grid gap-2 ${availableDimensions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {availableDimensions.map((dimension) => (
              <button
                key={dimension.value}
                onClick={() => {
                  setSelectedDimension(dimension);
                  setUseCustomDimensions(false);
                }}
                className={`relative p-4 border transition-all text-center ${
                  !useCustomDimensions && selectedDimension.value === dimension.value
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="text-sm font-medium">{dimension.label}</p>
                <p className={`text-[10px] mt-1 ${
                  !useCustomDimensions && selectedDimension.value === dimension.value
                    ? 'text-gray-300'
                    : 'text-gray-400'
                }`}>
                  {dimension.detail}
                </p>
                {dimension.priceAdjustment > 0 && (
                  <p className={`text-[10px] mt-2 ${
                    !useCustomDimensions && selectedDimension.value === dimension.value
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}>
                    +{formatPrice(dimension.priceAdjustment)}
                  </p>
                )}
                {!useCustomDimensions && selectedDimension.value === dimension.value && (
                  <Check size={12} className="absolute top-2 right-2" />
                )}
              </button>
            ))}
          </div>

          {isCustomizable && (
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={useCustomDimensions}
                  onChange={(e) => setUseCustomDimensions(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded-none text-black focus:ring-black"
                />
                <span className="text-xs text-gray-600 group-hover:text-black transition-colors">
                  Medidas personalizadas
                </span>
              </label>

              {useCustomDimensions && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <input
                      type="number"
                      value={customDimensions.width}
                      onChange={(e) => setCustomDimensions({ ...customDimensions, width: e.target.value })}
                      placeholder="Ancho (cm)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={customDimensions.length}
                      onChange={(e) => setCustomDimensions({ ...customDimensions, length: e.target.value })}
                      placeholder="Largo (cm)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Cloth */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center">
              2
            </div>
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-gray-400" />
              <span className="text-xs uppercase tracking-wider text-gray-600">Paño</span>
            </div>
          </div>

          {/* Cloth Type */}
          <div className="flex gap-2 mb-4">
            {clothOptions.map((cloth) => (
              <button
                key={cloth.name}
                onClick={() => setSelectedCloth(cloth)}
                className={`flex-1 p-3 border text-center transition-all ${
                  selectedCloth.name === cloth.name
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="text-xs font-medium">{cloth.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{cloth.description}</p>
                {cloth.price > 0 && (
                  <p className="text-[10px] text-gray-500 mt-1">+{formatPrice(cloth.price)}</p>
                )}
              </button>
            ))}
          </div>

          {/* Color Selection */}
          <div className="flex gap-2 flex-wrap">
            {selectedCloth.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedClothColor(color)}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                  selectedClothColor.name === color.name
                    ? 'border-black scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedClothColor.name === color.name && (
                  <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow-md" />
                )}
              </button>
            ))}
            <span className="flex items-center text-xs text-gray-500 ml-2">
              {selectedClothColor.name}
            </span>
          </div>
        </div>

        {/* Step 3: Dining Cover */}
        {tableType && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center">
                3
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={14} className="text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-600">Cubierta de Comedor</span>
              </div>
            </div>

            {isRomaGiratoria ? (
              <div className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Incluida con tu mesa</p>
                    <p className="text-xs text-green-600">La Roma Giratoria incluye cubierta de comedor</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={wantsDiningCover}
                    onChange={(e) => setWantsDiningCover(e.target.checked)}
                    className="mt-0.5 w-4 h-4 border-gray-300 rounded-none text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Agregar cubierta de comedor</span>
                      <span className="text-sm text-gray-600">
                        {tableType && diningCoverConfig[tableType].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Convierte tu mesa de pool en mesa de comedor
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Step: Shipping */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center">
              {tableType ? 4 : 3}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-xs uppercase tracking-wider text-gray-600">Envío</span>
            </div>
          </div>

          <select
            value={selectedRegion.name}
            onChange={(e) => {
              const region = regions.find(r => r.name === e.target.value);
              if (region) setSelectedRegion(region);
            }}
            className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-black transition-colors bg-white appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            {regions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Truck size={12} />
            <span>Costo de envío por confirmar</span>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Notas adicionales (opcional)"
            rows={2}
            className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        {/* Summary */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mesa {selectedDimension.label}</span>
              <span>{formatPrice(tablePrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Paño {selectedCloth.name}</span>
              <span>{clothPrice === 0 ? 'Incluido' : formatPrice(clothPrice)}</span>
            </div>
            {(isRomaGiratoria || wantsDiningCover) && tableType && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cubierta de comedor</span>
                <span>{isRomaGiratoria ? 'Incluida' : formatPrice(coverPrice)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Envío</span>
              <span>Por confirmar</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline py-4 border-t border-gray-200">
            <span className="text-xs uppercase tracking-wider text-gray-500">Subtotal</span>
            <span className="text-2xl font-display">{formatPrice(totalPrice)}</span>
          </div>

          <p className="text-[10px] text-gray-400 mb-6">
            IVA incluido. Precio referencial sujeto a confirmación.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleWhatsAppQuote}
            className="w-full bg-[#00963c] text-white text-sm uppercase tracking-wider py-4 flex items-center justify-center gap-2 hover:bg-[#007a31] transition-colors"
          >
            Solicitar cotización
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
