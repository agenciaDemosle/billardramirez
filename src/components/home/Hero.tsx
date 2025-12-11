import { useState, useEffect } from 'react';
import PoolTableTypeModal from './PoolTableTypeModal';
import TableRepairModal from '../product/TableRepairModal';
import { Link } from 'react-router-dom';
import { trackCTAClick } from '../../hooks/useAnalytics';

const heroImages = [
  '/images/fotos/heronavidad.webp',
  '/images/fotos/viejito-pascuero.webp',
];

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section - Altura optimizada para mobile */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] md:h-[750px] overflow-hidden bg-black">
        {/* Imágenes de fondo con transición */}
        {heroImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt="Navidad Billard Ramirez"
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay elegante - Más oscuro en mobile para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 md:from-black/80 md:via-black/30 md:to-black/20"></div>
          </div>
        ))}

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Contenido del hero - Centrado verticalmente */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
            {/* Subtítulo superior */}
            <p className="text-white/70 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 md:mb-6">
              Billard Ramirez
            </p>

            {/* Título principal - Tipografía fluida con clamp */}
            <h1 className="text-[clamp(1.75rem,6vw,5rem)] font-display text-white uppercase tracking-wide leading-[1.1] mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              El mejor regalo de Navidad
            </h1>

            {/* Subtítulo */}
            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light mb-6 sm:mb-8 md:mb-10 lg:mb-12 tracking-wide">
              Encuéntralo aquí
            </p>

            {/* Call to Action Buttons - Botones táctiles centrados */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
              <Link
                to="/tienda"
                onClick={() => trackCTAClick('Ver Regalos', 'hero', 'primary')}
                className="inline-flex items-center justify-center bg-white text-black hover:bg-black hover:text-white border-2 border-white font-medium px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 touch-target w-full sm:w-auto"
              >
                Ver Regalos
              </Link>
              <button
                onClick={() => {
                  trackCTAClick('Cotizar Mesa de Pool', 'hero', 'secondary');
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center bg-transparent text-white hover:bg-white hover:text-black border-2 border-white font-medium px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 touch-target w-full sm:w-auto"
              >
                Cotizar Mesa de Pool
              </button>
            </div>
          </div>
        </div>

        {/* Modal de selección de tipo de mesa */}
        <PoolTableTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </section>

      {/* Modal de reparación de mesa */}
      <TableRepairModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
      />

      {/* Sección ¿Qué estás buscando? - Estilo redecora full width */}
      <section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-white">
        {/* Título de la sección - Padding responsive */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
          <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4">
            Explora nuestras categorías
          </p>
          <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-display text-black uppercase tracking-wide">
            ¿Qué estás buscando?
          </h2>
        </div>

        {/* Grid de categorías - 2 columnas en mobile, gap reducido */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-0.5 sm:gap-1 md:gap-2">
            {/* Personaliza tu Taco */}
            <Link
              to="/tienda?categoria=tacos"
              className="group relative overflow-hidden aspect-square"
            >
              <img
                src="/images/fotos/personaliza-taco.webp"
                alt="Personaliza tu taco"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
                <h3 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-tight tracking-wide text-center">
                  <span className="font-script text-yellow-400 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl normal-case">Personaliza</span>
                  <br />tu taco
                </h3>
              </div>
            </Link>

            {/* Mesas de Pool Recreacionales */}
            <Link
              to="/tienda?categoria=superficie-en-madera"
              className="group relative overflow-hidden aspect-square"
            >
              <img
                src="/images/fotos/mesas-de-pool.webp"
                alt="Mesas de pool recreacionales"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
                <h3 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-tight tracking-wide text-center">
                  Mesas de Pool
                  <br /><span className="font-script text-yellow-400 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl normal-case">Recreacionales</span>
                </h3>
              </div>
            </Link>

            {/* Mesas de Pool Profesionales */}
            <Link
              to="/tienda?categoria=superficie-en-piedra"
              className="group relative overflow-hidden aspect-square"
            >
              <img
                src="/images/fotos/profesional.png"
                alt="Mesas de pool profesionales"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
                <h3 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-tight tracking-wide text-center">
                  Mesas de Pool
                  <br /><span className="font-script text-yellow-400 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl normal-case">Profesionales</span>
                </h3>
              </div>
            </Link>

            {/* Reparación de Mesa */}
            <button
              onClick={() => setIsRepairModalOpen(true)}
              className="group relative overflow-hidden aspect-square w-full"
            >
              <img
                src="/images/fotos/reparacion-mesas.webp"
                alt="Reparación de mesas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
                <h3 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-tight tracking-wide text-center">
                  <span className="font-script text-yellow-400 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl normal-case">Reparación</span>
                  <br />de mesa
                </h3>
              </div>
            </button>

            {/* Arriendo de Mesa */}
            <Link
              to="/contacto"
              className="group relative overflow-hidden aspect-square"
            >
              <img
                src="/images/fotos/arriendo-mesa.webp"
                alt="Arriendo de mesa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
                <h3 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-tight tracking-wide text-center">
                  <span className="font-script text-yellow-400 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl normal-case">Arriendo</span>
                  <br />de mesa
                </h3>
              </div>
            </Link>

            {/* Accesorios */}
            <Link
              to="/accesorios"
              className="group relative overflow-hidden aspect-square"
            >
              <img
                src="/images/fotos/accesorios.webp"
                alt="Accesorios"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
                <h3 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase leading-tight tracking-wide text-center">
                  <span className="font-script text-yellow-400 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl normal-case">Accesorios</span>
                </h3>
              </div>
            </Link>
        </div>
      </section>
    </>
  );
}
