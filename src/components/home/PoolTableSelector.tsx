import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductsByCategory } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/helpers';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function PoolTableSelector() {
  const [currentStep, setCurrentStep] = useState(0);

  // Obtener productos de la categoría mesas de pool (ID 27)
  const { data: poolTables, isLoading } = useProductsByCategory(27, { perPage: 12 });

  const totalSteps = poolTables ? Math.ceil(poolTables.length / 3) : 1;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Obtener productos para el paso actual
  const currentProducts = poolTables?.slice(currentStep * 3, (currentStep + 1) * 3) || [];

  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary uppercase mb-4">
            Encuentra tu Mesa de Pool Ideal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestra selección de mesas de pool profesionales y elige la perfecta para tu espacio
          </p>
        </div>

        {/* Indicador de pasos */}
        {!isLoading && totalSteps > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <span className="text-sm text-gray-600 font-medium">
              Paso {currentStep + 1} de {totalSteps}
            </span>
            <div className="flex gap-2 ml-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contenedor del wizard */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Spinner size="lg" />
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
              <p className="text-xl mb-4">No hay mesas de pool disponibles en este momento</p>
              <Link to="/tienda">
                <Button variant="primary">Ver todos los productos</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Grid de productos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Imagen */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-white">
                      <img
                        src={product.images[0]?.src || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.on_sale && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          OFERTA
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Categoría */}
                      {product.categories[0] && (
                        <p className="text-xs text-gray-500 mb-3">
                          {product.categories[0].name}
                        </p>
                      )}

                      {/* Precio */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product.price, product.id)}
                        </span>
                        {product.on_sale && product.regular_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.regular_price, product.id)}
                          </span>
                        )}
                      </div>

                      {/* Botón */}
                      <Link to={`/producto/${product.slug}`}>
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full"
                          leftIcon={<Eye size={16} />}
                        >
                          Ver Detalles y Cotizar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controles de navegación */}
              {totalSteps > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    leftIcon={<ChevronLeft size={20} />}
                  >
                    Anterior
                  </Button>

                  <div className="hidden sm:block text-sm text-gray-600">
                    Mostrando {currentStep * 3 + 1} - {Math.min((currentStep + 1) * 3, poolTables?.length || 0)} de {poolTables?.length || 0} mesas
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentStep === totalSteps - 1}
                    rightIcon={<ChevronRight size={20} />}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA para ver todas */}
        <div className="text-center mt-8">
          <Link to="/tienda?categoria=mesas-de-pool">
            <Button variant="primary" size="lg">
              Ver Todas las Mesas de Pool
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
