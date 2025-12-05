import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import Input from '../components/ui/Input';
import SEO from '../components/SEO';
import { trackContactSubmit, trackWhatsAppClick } from '../hooks/useAnalytics';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  contactMethod: z.enum(['email', 'whatsapp']),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contacto() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp'>('email');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contactMethod: 'email',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.contactMethod === 'whatsapp') {
      // Track WhatsApp contact
      trackWhatsAppClick({
        click_location: 'contact_form',
        button_text: 'Enviar por WhatsApp',
        service_interested: data.subject,
      });

      // Abrir WhatsApp con el mensaje
      const message = encodeURIComponent(
        `Hola, soy ${data.name}.\n\n` +
        `Asunto: ${data.subject}\n\n` +
        `${data.message}\n\n` +
        `Mi email: ${data.email}\n` +
        `Mi teléfono: ${data.phone}`
      );
      window.open(`https://wa.me/56965839601?text=${message}`, '_blank');
      toast.success('Redirigiendo a WhatsApp...');
      reset();
      return;
    }

    // Enviar por email
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
        // Track contact form submission
        trackContactSubmit({
          form_name: 'contact_form',
          service_interested: data.subject,
          email: data.email,
          phone: data.phone,
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' '),
        });

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

      <div className="bg-white">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-16 md:py-24">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">
              Estamos para ayudarte
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-wide mb-6">
              Contáctanos
            </h1>
            <p className="text-gray-500 max-w-xl">
              ¿Tienes alguna pregunta o necesitas ayuda? Elige cómo prefieres comunicarte y te responderemos lo antes posible.
            </p>
          </div>
        </div>

        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Información de Contacto */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">
                    Información
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Phone size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Teléfono</p>
                        <a
                          href="tel:+56965839601"
                          className="text-sm hover:text-[#00963c] transition-colors"
                        >
                          +56 9 6583 9601
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <a
                          href="mailto:contacto@billardramirez.cl"
                          className="text-sm hover:text-[#00963c] transition-colors"
                        >
                          contacto@billardramirez.cl
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Showroom</p>
                        <p className="text-sm">
                          Maximiliano Ibáñez 1436<br />
                          Quinta Normal, Santiago
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Horario</p>
                        <p className="text-sm">
                          Lun - Vie: 9:00 - 18:00<br />
                          Sáb: 11:00 - 15:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mapa o imagen */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0!2d-70.7!3d-33.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI1JzQ4LjAiUyA3MMKwNDInMDAuMCJX!5e0!3m2!1ses!2scl!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Billard Ramirez"
                  />
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Selector de método de contacto */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                    ¿Cómo prefieres que te contactemos?
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`relative flex items-center justify-center gap-3 p-5 border cursor-pointer transition-all ${
                        contactMethod === 'whatsapp'
                          ? 'border-[#00963c] bg-[#00963c]/5'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('contactMethod')}
                        value="whatsapp"
                        checked={contactMethod === 'whatsapp'}
                        onChange={() => setContactMethod('whatsapp')}
                        className="sr-only"
                      />
                      <MessageCircle size={20} className={contactMethod === 'whatsapp' ? 'text-[#00963c]' : 'text-gray-400'} />
                      <div>
                        <p className={`text-sm font-medium ${contactMethod === 'whatsapp' ? 'text-[#00963c]' : ''}`}>
                          WhatsApp
                        </p>
                        <p className="text-[10px] text-gray-400">Respuesta inmediata</p>
                      </div>
                    </label>

                    <label
                      className={`relative flex items-center justify-center gap-3 p-5 border cursor-pointer transition-all ${
                        contactMethod === 'email'
                          ? 'border-black'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('contactMethod')}
                        value="email"
                        checked={contactMethod === 'email'}
                        onChange={() => setContactMethod('email')}
                        className="sr-only"
                      />
                      <Mail size={20} className={contactMethod === 'email' ? 'text-black' : 'text-gray-400'} />
                      <div>
                        <p className={`text-sm font-medium ${contactMethod === 'email' ? 'text-black' : ''}`}>
                          Email
                        </p>
                        <p className="text-[10px] text-gray-400">Respuesta en 24h</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Campos del formulario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Teléfono *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Asunto *
                    </label>
                    <input
                      {...register('subject')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="¿En qué te podemos ayudar?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 text-sm uppercase tracking-wider py-4 transition-all ${
                    contactMethod === 'whatsapp'
                      ? 'bg-[#00963c] text-white hover:bg-[#007a31]'
                      : 'bg-black text-white hover:bg-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : contactMethod === 'whatsapp' ? (
                    <>
                      <MessageCircle size={16} />
                      Abrir WhatsApp
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar mensaje
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  Al enviar este formulario aceptas nuestra política de privacidad
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
