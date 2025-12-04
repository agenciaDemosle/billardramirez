import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Bell, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';
import { subscribeToStockNotification } from '../../api/mailchimp';

interface StockNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: number;
}

export default function StockNotificationModal({
  isOpen,
  onClose,
  productName,
  productId,
}: StockNotificationModalProps) {
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
      // Suscribir a Mailchimp usando el plugin de WordPress
      const result = await subscribeToStockNotification(email, productId, productName);

      if (result.success) {
        setIsSuccess(true);
        toast.success('¡Te notificaremos cuando esté disponible!');

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setEmail('');
        }, 2000);
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                {/* Close button */}
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors"
                  onClick={onClose}
                >
                  <span className="sr-only">Cerrar</span>
                  <X size={24} />
                </button>

                {!isSuccess ? (
                  <>
                    {/* Icon */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Bell className="h-8 w-8 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="mt-4 text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-display font-bold text-gray-900 mb-2"
                      >
                        Avísame cuando esté disponible
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mb-4">
                        Te notificaremos por email cuando <span className="font-semibold">{productName}</span> vuelva a estar en stock
                      </p>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="text-center"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Enviando...' : 'Notificarme'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            className="w-full"
                            onClick={onClose}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>

                      {/* Privacy notice */}
                      <p className="mt-4 text-xs text-gray-500">
                        Al suscribirte aceptas recibir notificaciones por email. Puedes cancelar en cualquier momento.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success state */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="mt-4 text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-display font-bold text-gray-900 mb-2"
                      >
                        ¡Listo!
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">
                        Te enviaremos un email cuando el producto esté disponible
                      </p>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
