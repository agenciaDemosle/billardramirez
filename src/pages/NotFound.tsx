import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Página no encontrada | Billard Ramirez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] bg-white flex items-center justify-center px-5 py-16 md:py-24">
        <div className="max-w-xl w-full text-center">
          {/* Pool balls illustration */}
          <div className="flex justify-center items-center gap-3 mb-12">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
              <span className="text-white text-2xl font-display">4</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#00963c] flex items-center justify-center">
              <span className="text-white text-2xl font-display">0</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
              <span className="text-white text-2xl font-display">4</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">
            Página no encontrada
          </p>

          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wide mb-6">
            La bola se fue fuera de la mesa
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed mb-12 max-w-md mx-auto">
            La página que buscas no existe o ha sido movida.
            No te preocupes, hasta los profesionales fallan un tiro de vez en cuando.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm uppercase tracking-wider px-8 py-4 hover:bg-gray-900 transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm uppercase tracking-wider px-8 py-4 hover:border-black transition-colors"
            >
              <Search size={14} />
              Explorar tienda
            </Link>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">
              Enlaces populares
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <Link
                to="/mesas-de-pool"
                className="text-sm text-gray-600 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
              >
                Mesas de Pool
              </Link>
              <Link
                to="/accesorios"
                className="text-sm text-gray-600 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
              >
                Accesorios
              </Link>
              <Link
                to="/cotizador"
                className="text-sm text-gray-600 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
              >
                Cotizador
              </Link>
              <Link
                to="/contacto"
                className="text-sm text-gray-600 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mt-12"
          >
            <ArrowLeft size={12} />
            Volver a la página anterior
          </button>
        </div>
      </div>
    </>
  );
}
