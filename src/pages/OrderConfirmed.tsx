import { useSearchParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function OrderConfirmed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') || searchParams.get('id');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[600px] mx-auto px-5 py-20 md:py-32">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 border border-black flex items-center justify-center">
            <Check size={32} strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
            Pedido confirmado
          </p>
          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wide mb-4">
            Gracias por tu compra
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Hemos recibido tu pedido y te enviaremos un correo con los detalles de seguimiento.
          </p>
        </div>

        {/* Order Number */}
        {orderId && (
          <div className="border-t border-b border-gray-200 py-6 mb-12">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Número de pedido</span>
              <span className="text-sm font-medium">{orderId}</span>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-6 mb-12">
          <div className="flex gap-4">
            <div className="w-8 h-8 border border-black flex items-center justify-center flex-shrink-0">
              <Check size={14} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Pedido confirmado</p>
              <p className="text-xs text-gray-400">Tu pago ha sido procesado</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 border border-gray-300 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Preparando pedido</p>
              <p className="text-xs text-gray-400">Empacando tus productos</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 border border-gray-200 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">En camino</p>
              <p className="text-xs text-gray-300">Envío a tu dirección</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border border-gray-200 p-6 mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
            ¿Necesitas ayuda?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Si tienes preguntas sobre tu pedido, contáctanos:
          </p>
          <div className="flex gap-4">
            <a
              href="https://wa.me/56965839601"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider border-b border-black pb-0.5 hover:text-gray-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="mailto:contacto@billardramirez.cl"
              className="text-xs uppercase tracking-wider border-b border-black pb-0.5 hover:text-gray-600 transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/tienda"
            className="inline-block bg-black text-white text-xs uppercase tracking-wider px-8 py-4 hover:bg-gray-900 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
