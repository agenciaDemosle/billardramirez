import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Circle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Página no encontrada | Billard Ramirez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Billiard Balls Animation */}
          <div className="mb-8 relative">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Circle className="w-20 h-20 text-gray-800 fill-gray-800 animate-bounce" style={{ animationDelay: '0s' }} />
              <Circle className="w-20 h-20 text-primary fill-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              <Circle className="w-20 h-20 text-gray-600 fill-gray-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-8xl md:text-9xl font-display font-bold text-gray-900 mb-4">
            404
          </h1>

          {/* Pool-themed Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              ¡Raspaste! 🎱
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              La bola que buscabas se fue fuera de la mesa
            </p>
            <p className="text-gray-500">
              Esta página no existe o fue movida a otra buchaca.
            </p>
          </div>

          {/* Fun Pool Facts */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-700 italic">
              "En el pool, como en la web, cada tiro cuenta.
              No te preocupes, hasta los profesionales fallan a veces."
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home size={20} />
              Volver al Inicio
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow hover:shadow-lg"
            >
              <ArrowLeft size={20} />
              Volver Atrás
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              ¿Buscabas algo en específico? Prueba estos enlaces:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/tienda"
                className="text-sm text-primary hover:text-primary-dark hover:underline"
              >
                Tienda
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/mesas-de-pool"
                className="text-sm text-primary hover:text-primary-dark hover:underline"
              >
                Mesas de Pool
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/accesorios"
                className="text-sm text-primary hover:text-primary-dark hover:underline"
              >
                Accesorios
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/contacto"
                className="text-sm text-primary hover:text-primary-dark hover:underline"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
