import { useState } from 'react';
import { ChevronRight, ChevronLeft, Ruler, Package, Palette, CheckCircle2 } from 'lucide-react';
import { trackPoolTableQuoteStart, trackPoolTableCustomization, trackPoolTableQuoteComplete } from '../../hooks/useAnalytics';

interface QuoteData {
  tableType: string;
  size: string;
  feltColor: string;
  accessories: string[];
  installation: boolean;
}

export default function PoolTableQuote() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    tableType: '',
    size: '',
    feltColor: '',
    accessories: [],
    installation: false
  });
  const [hasStartedQuote, setHasStartedQuote] = useState(false);

  const tableTypes = [
    {
      id: 'profesional',
      name: 'Profesional',
      description: 'Mesa de competición con paño de alta calidad y estructura reforzada',
      features: ['Paño Championship', 'Bandas Brunswick', 'Pizarra italiana 3 piezas', 'Garantía 5 años'],
      priceRange: '$3.500.000 - $6.000.000'
    },
    {
      id: 'semi-profesional',
      name: 'Semi-Profesional',
      description: 'Calidad premium para jugadores exigentes y espacios recreativos',
      features: ['Paño Tournament', 'Bandas premium', 'Pizarra brasileña 3 piezas', 'Garantía 3 años'],
      priceRange: '$2.000.000 - $3.500.000'
    },
    {
      id: 'recreativa',
      name: 'Recreativa',
      description: 'Ideal para hogares y espacios de entretenimiento',
      features: ['Paño estándar', 'Bandas de calidad', 'MDF resistente', 'Garantía 1 año'],
      priceRange: '$800.000 - $2.000.000'
    }
  ];

  const sizes = {
    profesional: [
      { id: '9ft', name: '9 pies (2.54m x 1.27m)', description: 'Tamaño de competición oficial' },
      { id: '8ft', name: '8 pies (2.44m x 1.22m)', description: 'Estándar profesional' }
    ],
    'semi-profesional': [
      { id: '8ft', name: '8 pies (2.44m x 1.22m)', description: 'Tamaño estándar' },
      { id: '7ft', name: '7 pies (2.13m x 1.07m)', description: 'Ideal para espacios medianos' }
    ],
    recreativa: [
      { id: '7ft', name: '7 pies (2.13m x 1.07m)', description: 'Tamaño estándar' },
      { id: '6ft', name: '6 pies (1.83m x 0.91m)', description: 'Compacta para hogares' }
    ]
  };

  const feltColors = [
    { id: 'verde-torneo', name: 'Verde Torneo', hex: '#00963c', popular: true },
    { id: 'azul-torneo', name: 'Azul Torneo', hex: '#1e40af', popular: true },
    { id: 'rojo-vino', name: 'Rojo Vino', hex: '#991b1b', popular: false },
    { id: 'negro', name: 'Negro', hex: '#0f172a', popular: false },
    { id: 'gris', name: 'Gris', hex: '#6b7280', popular: false },
    { id: 'verde-ingles', name: 'Verde Inglés', hex: '#065f46', popular: false }
  ];

  const accessories = [
    { id: 'juego-bolas-aramith', name: 'Juego de bolas Aramith Pro', price: 250000 },
    { id: 'set-tacos-profesional', name: 'Set 4 tacos profesionales', price: 180000 },
    { id: 'triangulo-madera', name: 'Triángulo de madera premium', price: 25000 },
    { id: 'taquera-pared', name: 'Taquera de pared (6 tacos)', price: 80000 },
    { id: 'cepillo-profesional', name: 'Cepillo profesional para paño', price: 35000 },
    { id: 'tizas-master-12un', name: 'Tizas Master (12 unidades)', price: 15000 }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate estimated value based on table type and accessories
    const tableTypePrices = {
      'profesional': 4500000,
      'semi-profesional': 2500000,
      'recreativa': 1200000,
    };

    const basePrice = tableTypePrices[quoteData.tableType as keyof typeof tableTypePrices] || 0;
    const accessoriesPrice = quoteData.accessories.reduce((sum, accId) => {
      const acc = accessories.find(a => a.id === accId);
      return sum + (acc?.price || 0);
    }, 0);
    const estimatedValue = basePrice + accessoriesPrice;

    // Get selected accessory names
    const selectedAccessoryNames = quoteData.accessories.map(accId => {
      const acc = accessories.find(a => a.id === accId);
      return acc?.name || accId;
    });

    // Track quote completion
    trackPoolTableQuoteComplete({
      table_type: quoteData.tableType,
      dimensions: quoteData.size,
      cloth_color: feltColors.find(c => c.id === quoteData.feltColor)?.name || quoteData.feltColor,
      accessories: selectedAccessoryNames,
      estimated_value: estimatedValue,
      contact_method: 'whatsapp',
    });

    // Aquí se enviaría la cotización
    const message = `
Cotización Mesa de Pool:
- Tipo: ${tableTypes.find(t => t.id === quoteData.tableType)?.name}
- Tamaño: ${quoteData.size}
- Color paño: ${feltColors.find(c => c.id === quoteData.feltColor)?.name}
- Accesorios: ${quoteData.accessories.join(', ') || 'Ninguno'}
- Instalación: ${quoteData.installation ? 'Sí' : 'No'}
    `.trim();

    const whatsappNumber = '56965839601';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return quoteData.tableType !== '';
      case 2:
        return quoteData.size !== '';
      case 3:
        return quoteData.feltColor !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStep);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-primary uppercase mb-3 sm:mb-4">
            Cotiza tu mesa de pool
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Configura tu mesa ideal en 4 simples pasos y recibe una cotización personalizada
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
                      currentStep === step
                        ? 'bg-[#00963c] text-white scale-110 shadow-lg'
                        : currentStep > step
                        ? 'bg-[#007a31] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle2 size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : step}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium ${currentStep >= step ? 'text-[#00963c]' : 'text-gray-400'}`}>
                    {step === 1 && 'Tipo'}
                    {step === 2 && 'Tamaño'}
                    {step === 3 && 'Color'}
                    {step === 4 && 'Extras'}
                  </span>
                </div>
                {step < 4 && (
                  <div className={`h-0.5 sm:h-1 flex-1 mx-1 sm:mx-2 ${currentStep > step ? 'bg-[#007a31]' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor del formulario */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-12 min-h-[400px] sm:min-h-[500px]">
          {/* Paso 1: Tipo de mesa */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <Package className="text-[#00963c]" size={24} />
                <h3 className="text-lg sm:text-2xl font-display font-bold text-gray-900">
                  Selecciona el tipo de mesa
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {tableTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setQuoteData({ ...quoteData, tableType: type.id, size: '' });

                      // Track quote start only once
                      if (!hasStartedQuote) {
                        trackPoolTableQuoteStart({
                          table_type: type.id,
                          location: 'quote_page',
                        });
                        setHasStartedQuote(true);
                      }
                    }}
                    className={`text-left p-4 sm:p-6 rounded-xl border-2 transition-all hover:shadow-lg active:scale-[0.98] ${
                      quoteData.tableType === type.id
                        ? 'border-[#00963c] bg-[#00963c]/5 shadow-lg'
                        : 'border-gray-200 hover:border-[#00963c]/50'
                    }`}
                  >
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{type.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{type.description}</p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00963c] flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-base sm:text-lg font-bold text-[#00963c]">{type.priceRange}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Tamaño */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <Ruler className="text-[#00963c]" size={24} />
                <h3 className="text-lg sm:text-2xl font-display font-bold text-gray-900">
                  Selecciona el tamaño
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl">
                {sizes[quoteData.tableType as keyof typeof sizes]?.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      setQuoteData({ ...quoteData, size: size.name });

                      // Track dimensions customization
                      trackPoolTableCustomization({
                        table_type: quoteData.tableType,
                        customization_type: 'dimensions',
                        customization_value: size.name,
                      });
                    }}
                    className={`text-left p-4 sm:p-6 rounded-xl border-2 transition-all hover:shadow-lg active:scale-[0.98] ${
                      quoteData.size === size.name
                        ? 'border-[#00963c] bg-[#00963c]/5 shadow-lg'
                        : 'border-gray-200 hover:border-[#00963c]/50'
                    }`}
                  >
                    <h4 className="text-base sm:text-xl font-bold text-gray-900 mb-2">{size.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{size.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Color del paño */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <Palette className="text-[#00963c]" size={24} />
                <h3 className="text-lg sm:text-2xl font-display font-bold text-gray-900">
                  Selecciona el color del paño
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl">
                {feltColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setQuoteData({ ...quoteData, feltColor: color.id });

                      // Track cloth color customization
                      trackPoolTableCustomization({
                        table_type: quoteData.tableType,
                        customization_type: 'cloth_color',
                        customization_value: color.name,
                      });
                    }}
                    className={`p-3 sm:p-6 rounded-xl border-2 transition-all hover:shadow-lg active:scale-[0.98] relative ${
                      quoteData.feltColor === color.id
                        ? 'border-[#00963c] shadow-lg'
                        : 'border-gray-200 hover:border-[#00963c]/50'
                    }`}
                  >
                    {color.popular && (
                      <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-[#00963c] text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <div
                      className="w-full h-16 sm:h-24 rounded-lg mb-2 sm:mb-3 border-2 border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 text-center">{color.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 4: Accesorios y extras */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <CheckCircle2 className="text-[#00963c]" size={24} />
                <h3 className="text-lg sm:text-2xl font-display font-bold text-gray-900">
                  Accesorios y servicios
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4 max-w-3xl">
                <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Accesorios opcionales:</h4>
                {accessories.map((accessory) => (
                  <label
                    key={accessory.id}
                    className="flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-[#00963c]/50 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={quoteData.accessories.includes(accessory.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQuoteData({
                              ...quoteData,
                              accessories: [...quoteData.accessories, accessory.id]
                            });

                            // Track accessory added
                            trackPoolTableCustomization({
                              table_type: quoteData.tableType,
                              customization_type: 'accessories',
                              customization_value: accessory.name,
                              customization_price: accessory.price,
                            });
                          } else {
                            setQuoteData({
                              ...quoteData,
                              accessories: quoteData.accessories.filter((a) => a !== accessory.id)
                            });
                          }
                        }}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#00963c] rounded focus:ring-[#00963c] mt-0.5 sm:mt-0 flex-shrink-0"
                      />
                      <span className="font-medium text-gray-900 text-xs sm:text-base">{accessory.name}</span>
                    </div>
                    <span className="text-[#00963c] font-bold text-xs sm:text-base ml-2 flex-shrink-0">
                      ${accessory.price.toLocaleString('es-CL')}
                    </span>
                  </label>
                ))}

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200">
                  <label className="flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-[#00963c]/50 cursor-pointer transition-all active:scale-[0.98]">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={quoteData.installation}
                        onChange={(e) => {
                          setQuoteData({ ...quoteData, installation: e.target.checked });

                          // Track installation selection
                          if (e.target.checked) {
                            trackPoolTableCustomization({
                              table_type: quoteData.tableType,
                              customization_type: 'installation',
                              customization_value: 'Instalación profesional',
                            });
                          }
                        }}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#00963c] rounded focus:ring-[#00963c] mt-0.5 sm:mt-0 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 block text-xs sm:text-base">Instalación profesional</span>
                        <span className="text-[11px] sm:text-sm text-gray-500">Incluye nivelación y armado completo</span>
                      </div>
                    </div>
                    <span className="text-[#00963c] font-bold text-xs sm:text-base ml-2 flex-shrink-0">Consultar</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex items-center justify-between mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-200 gap-3 sm:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }`}
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">Atrás</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  canProceed
                    ? 'bg-[#00963c] text-white hover:bg-[#007a31] shadow-lg active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Siguiente
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1 sm:gap-2 bg-[#00963c] text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-[#007a31] shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Solicitar cotización</span>
                <span className="sm:hidden">Cotizar</span>
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
