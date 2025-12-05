import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type PaymentStatus = 'loading' | 'success' | 'failed' | 'pending' | 'error';

export default function VerifyingPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [message, setMessage] = useState('Verificando el estado de tu pago...');
  const orderId = searchParams.get('order');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        setStatus('error');
        setMessage('No se encontró el número de orden');
        return;
      }

      try {
        // Verificar el estado del pago con Paiku
        const response = await fetch(`/api/paiku/get-transaction.php?order_id=${orderId}`);
        const data = await response.json();

        if (data.success && data.transaction) {
          const paymentStatus = data.transaction.status?.toLowerCase();

          if (paymentStatus === 'success' || paymentStatus === 'paid' || paymentStatus === 'completed') {
            setStatus('success');
            setMessage('¡Pago exitoso!');
            // Redirigir a pedido confirmado después de 2 segundos
            setTimeout(() => {
              navigate(`/pedido-confirmado?order=${orderId}`);
            }, 2000);
          } else if (paymentStatus === 'failed' || paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
            setStatus('failed');
            setMessage('El pago fue cancelado o rechazado');
          } else if (paymentStatus === 'pending') {
            setStatus('pending');
            setMessage('Tu pago está pendiente de confirmación');
          } else {
            // Estado desconocido, asumir cancelado
            setStatus('failed');
            setMessage('El pago no fue completado');
          }
        } else {
          // No se encontró la transacción o hubo error
          setStatus('failed');
          setMessage('No se pudo verificar el estado del pago');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        setStatus('error');
        setMessage('Error al verificar el pago');
      }
    };

    // Esperar un momento antes de verificar (dar tiempo a Paiku)
    const timer = setTimeout(checkPaymentStatus, 1500);
    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-[#00963c] mx-auto mb-6" />
            <h1 className="text-xl font-display uppercase tracking-wide mb-3">
              Verificando pago
            </h1>
            <p className="text-sm text-gray-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-6" />
            <h1 className="text-xl font-display uppercase tracking-wide mb-3">
              ¡Pago exitoso!
            </h1>
            <p className="text-sm text-gray-500">Redirigiendo a tu pedido...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-6" />
            <h1 className="text-xl font-display uppercase tracking-wide mb-3">
              Pago no completado
            </h1>
            <p className="text-sm text-gray-500 mb-8">{message}</p>
            <div className="space-y-3">
              <Link
                to="/tienda"
                className="block w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors"
              >
                Volver a la tienda
              </Link>
              <Link
                to="/"
                className="block w-full text-xs uppercase tracking-wider py-3 text-gray-500 hover:text-black transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <AlertCircle size={48} className="text-yellow-500 mx-auto mb-6" />
            <h1 className="text-xl font-display uppercase tracking-wide mb-3">
              Pago pendiente
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              {message}. Te notificaremos por email cuando se confirme.
            </p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-6" />
            <h1 className="text-xl font-display uppercase tracking-wide mb-3">
              Error
            </h1>
            <p className="text-sm text-gray-500 mb-8">{message}</p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </>
        )}

        {orderId && (
          <p className="text-xs text-gray-400 mt-8">
            Orden: {orderId}
          </p>
        )}
      </div>
    </div>
  );
}
