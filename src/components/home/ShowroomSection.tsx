import { Truck, Trophy, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShowroomSection() {
  return (
    <>
      {/* 1) Banner Showroom - Estilo elegante */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src="/images/fotos/showroom-bg.png"
            alt="Showroom Billard Ramirez"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay degradado elegante */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* Contenido */}
        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center">
          <div className="max-w-2xl">
            {/* Línea pequeña superior */}
            <p className="text-white/80 text-xs font-medium mb-6 uppercase tracking-[0.3em]">
              Visita nuestro showroom
            </p>

            {/* Título principal - Estilo editorial */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-8 uppercase leading-[1.1] tracking-wide">
              EXPERIMENTA LA DIFERENCIA
            </h2>

            {/* Párrafo corto */}
            <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed font-light max-w-lg">
              Prueba nuestros productos en persona. Visítanos para recibir asesoría personalizada y encontrar el equipo perfecto para ti.
            </p>

            {/* Botones - Estilo elegante negro/blanco */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contacto">
                <button className="bg-white text-black hover:bg-black hover:text-white border-2 border-white font-medium px-8 py-4 uppercase text-sm tracking-wider transition-all duration-300">
                  Agendar visita
                </button>
              </Link>
              <Link to="/contacto">
                <button className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white font-medium px-8 py-4 uppercase text-sm tracking-wider transition-all duration-300">
                  Ver ubicación
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Franja de beneficios - Estilo limpio y espacioso */}
      <section className="bg-[#f8f8f8] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Tarjetas de beneficios - Grid 4 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tarjeta 1 - Envío */}
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Truck className="text-black" size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg uppercase tracking-wide text-black mb-2">Envío Express</h3>
              <p className="text-gray-500 text-sm">Recibe en 24-48 horas</p>
            </div>

            {/* Tarjeta 2 - Garantía */}
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="text-black" size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg uppercase tracking-wide text-black mb-2">Garantía</h3>
              <p className="text-gray-500 text-sm">Productos certificados</p>
            </div>

            {/* Tarjeta 3 - Calidad */}
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Trophy className="text-black" size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg uppercase tracking-wide text-black mb-2">Calidad Premium</h3>
              <p className="text-gray-500 text-sm">Materiales de primera</p>
            </div>

            {/* Tarjeta 4 - Soporte */}
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Headphones className="text-black" size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg uppercase tracking-wide text-black mb-2">Asesoría</h3>
              <p className="text-gray-500 text-sm">Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
