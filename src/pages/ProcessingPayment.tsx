import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ProcessingPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentUrl = searchParams.get('redirect');
  const orderId = searchParams.get('order');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 40);

    // Redirigir después de 2.5 segundos
    const redirectTimeout = setTimeout(() => {
      if (paymentUrl) {
        window.location.href = decodeURIComponent(paymentUrl);
      } else {
        navigate(orderId ? `/pedido-confirmado?order=${orderId}` : '/tienda');
      }
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [paymentUrl, orderId, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        {/* Spinner */}
        <div className="mb-10">
          <div className="w-16 h-16 border border-black border-t-transparent mx-auto animate-spin" />
        </div>

        {/* Text */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
          Procesando
        </p>
        <h1 className="text-2xl md:text-3xl font-display uppercase tracking-wide mb-4">
          Redirigiendo al pago
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Estás siendo redirigido a la plataforma de pago seguro.
          <br />
          Por favor, no cierres esta ventana.
        </p>

        {/* Progress bar */}
        <div className="w-full h-px bg-gray-200 mb-10">
          <div
            className="h-full bg-black transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Security indicators */}
        <div className="flex items-center justify-center gap-8 text-xs text-gray-400 uppercase tracking-wider">
          <span>Seguro</span>
          <span>Encriptado</span>
          <span>Verificado</span>
        </div>
      </div>
    </div>
  );
}
