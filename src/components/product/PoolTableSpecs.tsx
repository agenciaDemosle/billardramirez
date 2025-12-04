import { Ruler, Maximize2, Home, ArrowUpDown } from 'lucide-react';

interface PoolTableSpec {
  exteriorSize: string;
  playArea: string;
  minRoomSpace: string;
  recommendedRoomSpace: string;
}

const poolTableSpecs: PoolTableSpec[] = [
  {
    exteriorSize: '220 x 115 cm',
    playArea: '198 x 93 cm',
    minRoomSpace: '460 x 355 cm',
    recommendedRoomSpace: '460 x 355 cm',
  },
  {
    exteriorSize: '250 x 130 cm',
    playArea: '228 x 108 cm',
    minRoomSpace: '490 x 370 cm',
    recommendedRoomSpace: '490 x 370 cm',
  },
  {
    exteriorSize: '270 x 146 cm',
    playArea: '248 x 124 cm',
    minRoomSpace: '510 x 386 cm',
    recommendedRoomSpace: '560 x 436 cm',
  },
];

export default function PoolTableSpecs() {
  return (
    <div className="mt-8">
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Guía de Medidas y Espacio
            </h3>
            <p className="text-sm text-gray-600">
              Especificaciones estándar de mesas de pool
            </p>
          </div>
        </div>

        {/* Desktop Card View */}
        <div className="hidden lg:block space-y-4">
          {/* Headers */}
          <div className="grid grid-cols-4 gap-4 px-2 mb-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-900 text-sm">Mesa Exterior</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-accent" />
              <span className="font-semibold text-gray-900 text-sm">Área de Juego</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-900 text-sm">Espacio Mínimo</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-900 text-sm">Espacio Recomendado</span>
            </div>
          </div>

          {/* Table Rows as Cards */}
          {poolTableSpecs.map((spec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border-2 border-primary/30 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">
                    {spec.exteriorSize}
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700 text-base">{spec.playArea}</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700 text-base">{spec.minRoomSpace}</p>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-green-50 border-2 border-green-500 rounded-lg px-4 py-2">
                    <p className="font-bold text-green-700 text-base">
                      {spec.recommendedRoomSpace}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-5">
          {poolTableSpecs.map((spec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border-2 border-primary/30 shadow-lg"
            >
              {/* Card Header with Number */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-primary/20">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">{index + 1}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Mesa {spec.exteriorSize}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpDown className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Mesa Exterior
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 text-base">{spec.exteriorSize}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Maximize2 className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Área de Juego
                    </span>
                  </div>
                  <p className="font-semibold text-gray-700 text-base">{spec.playArea}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Espacio Mínimo
                    </span>
                  </div>
                  <p className="font-semibold text-gray-700 text-base">{spec.minRoomSpace}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Espacio Rec.
                    </span>
                  </div>
                  <div className="inline-block bg-green-50 border-2 border-green-500 rounded-lg px-3 py-1">
                    <p className="font-bold text-green-700 text-base">
                      {spec.recommendedRoomSpace}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Importante para tu espacio
              </h4>
              <p className="text-sm text-blue-800">
                El espacio recomendado incluye 145cm en cada lado de la mesa
                para permitir el juego cómodo con tacos de tamaño estándar (145cm).
                El espacio mínimo considera tacos más cortos o juego limitado.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Espacio Ideal
            </h5>
            <p className="text-sm text-gray-600">
              Si tienes el espacio recomendado, podrás jugar cómodamente sin
              restricciones y usar tacos de tamaño profesional.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-blue-600">ℹ</span>
              Espacio Limitado
            </h5>
            <p className="text-sm text-gray-600">
              Con el espacio mínimo necesitarás tacos más cortos (100-120cm)
              o adaptarte en algunos ángulos de tiro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
