import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { subscribeToNewsletter } from '../../api/mailchimp';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await subscribeToNewsletter(email);

      if (result.success) {
        setIsSuccess(true);
        toast.success('¡Gracias por suscribirte! 🎉');
        setEmail('');

        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Error al suscribir');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Mail size={20} />
        Newsletter
      </h4>
      <p className="text-sm text-gray-400 mb-4">
        Suscríbete y recibe ofertas exclusivas, novedades y consejos de billar
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={isSubmitting || isSuccess}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
          {isSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="text-green-500" size={20} />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSubmitting ? 'Enviando...' : isSuccess ? '¡Suscrito!' : 'Suscribirse'}
        </button>
      </form>

      {isSuccess && (
        <p className="mt-3 text-sm text-green-400 animate-fade-in">
          ✓ ¡Revisa tu email para confirmar tu suscripción!
        </p>
      )}
    </div>
  );
}
