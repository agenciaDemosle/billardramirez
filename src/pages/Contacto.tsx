import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contacto() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/send.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        reset();
      } else {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto - Billard Ramirez",
    "description": "Página de contacto de Billard Ramirez",
    "url": "https://billardramirez.cl/contacto",
    "mainEntity": {
      "@type": "Organization",
      "name": "Billard Ramirez",
      "telephone": "+56965839601",
      "email": "contacto@billardramirez.cl",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Maximiliano Ibáñez 1436",
        "addressLocality": "Quinta Normal",
        "addressRegion": "Región Metropolitana",
        "addressCountry": "CL"
      }
    }
  };

  return (
    <>
      <SEO
        title="Contacto - Billard Ramirez"
        description="Contáctanos para cotizar mesas de pool, resolver dudas o agendar una visita a nuestro showroom en Santiago. Teléfono: +56 9 6583 9601. Atención personalizada."
        canonical="https://billardramirez.cl/contacto"
        keywords="contacto billard ramirez, teléfono mesas de pool, cotizar mesa pool, showroom billar santiago, atencion cliente pool"
        structuredData={contactStructuredData}
        breadcrumbs={[
          { name: 'Inicio', url: 'https://billardramirez.cl/' },
          { name: 'Contacto', url: 'https://billardramirez.cl/contacto' }
        ]}
      />
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ti.
            Completa el formulario y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de Contacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Información de Contacto
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Teléfono</h3>
                    <a
                      href="tel:+56965839601"
                      className="text-gray-600 hover:text-primary"
                    >
                      +56 9 6583 9601
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                    <a
                      href="mailto:contacto@billardramirez.cl"
                      className="text-gray-600 hover:text-primary"
                    >
                      contacto@billardramirez.cl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-600">
                      Maximiliano Ibáñez 1436
                      <br />
                      Quinta Normal, Santiago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Horario de Atención
                    </h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 9:00 - 18:00
                      <br />
                      Sábados: 10:00 - 14:00
                      <br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Nombre completo"
                    {...register('name')}
                    error={errors.name?.message}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Teléfono"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    required
                  />
                  <Input
                    label="Asunto"
                    {...register('subject')}
                    error={errors.subject?.message}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
