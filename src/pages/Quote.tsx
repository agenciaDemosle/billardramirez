import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Calculator, CheckCircle, Ruler, Home, DollarSign, Truck, Send, ArrowRight, ArrowLeft, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { trackPoolTableQuoteStart, trackPoolTableCustomization, trackPoolTableQuoteComplete } from '../hooks/useAnalytics';

// Schema de validación por pasos
const step1Schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  deliveryAddress: z.string().min(5, 'Ingresa una dirección válida'),
});

const step2Schema = z.object({
  tableSize: z.string().min(1, 'Selecciona un tamaño de mesa'),
  tableType: z.string().min(1, 'Selecciona un tipo de mesa'),
});

const step3Schema = z.object({
  installationNeeded: z.string().min(1, 'Selecciona una opción'),
  budget: z.string().optional(),
  comments: z.string().optional(),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type QuoteFormData = z.infer<typeof fullSchema>;

export default function Quote() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasStartedQuote, setHasStartedQuote] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    getValues,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
  });

  const totalSteps = 3;

  const tableSizes = [
    { value: '7ft', label: '7 pies (2.13m)', description: 'Ideal para hogares pequeños y espacios compactos' },
    { value: '8ft', label: '8 pies (2.44m)', description: 'Tamaño estándar para el hogar' },
    { value: '9ft', label: '9 pies (2.74m)', description: 'Mesa profesional de torneo' },
    { value: '12ft', label: '12 pies (3.66m)', description: 'Mesa de snooker profesional' },
  ];

  const tableTypes = [
    {
      value: 'recreativa',
      label: 'Mesa Recreativa',
      description: 'Perfecta para uso casual en el hogar',
      icon: '🏠'
    },
    {
      value: 'semi-profesional',
      label: 'Mesa Semi-Profesional',
      description: 'Para jugadores entusiastas y uso frecuente',
      icon: '⭐'
    },
    {
      value: 'profesional',
      label: 'Mesa Profesional',
      description: 'Calidad de torneo para competición',
      icon: '🏆'
    },
    {
      value: 'comercial',
      label: 'Mesa Comercial',
      description: 'Resistente para bar, restaurante o club',
      icon: '🏪'
    },
  ];

  const nextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(['name', 'email', 'phone', 'deliveryAddress']);
    } else if (currentStep === 2) {
      isValid = await trigger(['tableSize', 'tableType']);

      // Track customizations when moving from step 2 to 3
      if (isValid) {
        const values = getValues();

        // Track quote start if not already tracked
        if (!hasStartedQuote && values.tableType) {
          trackPoolTableQuoteStart({
            table_type: values.tableType,
            location: 'quote_form_page',
          });
          setHasStartedQuote(true);
        }

        // Track table size
        if (values.tableSize) {
          trackPoolTableCustomization({
            table_type: values.tableType || 'unknown',
            customization_type: 'dimensions',
            customization_value: values.tableSize,
          });
        }
      }
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    // Calculate estimated value based on table type
    const tableTypePrices = {
      'recreativa': 1200000,
      'semi-profesional': 2500000,
      'profesional': 4500000,
      'comercial': 3000000,
    };

    const estimatedValue = tableTypePrices[data.tableType as keyof typeof tableTypePrices] || 2000000;

    // Track installation customization
    if (data.installationNeeded === 'si') {
      trackPoolTableCustomization({
        table_type: data.tableType,
        customization_type: 'installation',
        customization_value: 'Instalación profesional',
      });
    }

    // Track quote completion
    trackPoolTableQuoteComplete({
      table_type: data.tableType,
      dimensions: data.tableSize,
      estimated_value: estimatedValue,
      contact_method: 'email',
    });

    try {
      const response = await fetch('/api/quote/send.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        toast.success('¡Cotización enviada con éxito! Te contactaremos pronto.');
        reset();
        setCurrentStep(1);
        setHasStartedQuote(false);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error(result.error || 'Error al enviar la cotización');
      }
    } catch (error) {
      console.error('Error al enviar cotización:', error);
      toast.error('Error al enviar la cotización. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para obtener el color del paso
  const getStepColor = (step: number) => {
    if (step < currentStep) return 'bg-green-500 border-green-500';
    if (step === currentStep) return 'bg-accent border-accent';
    return 'bg-gray-200 border-gray-300';
  };

  const getStepTextColor = (step: number) => {
    if (step <= currentStep) return 'text-gray-900 font-bold';
    return 'text-gray-400';
  };

  return (
    <>
      <Helmet>
        <title>Cotizar Mesa de Pool - Billard Ramirez</title>
        <meta
          name="description"
          content="Solicita una cotización personalizada para tu mesa de pool. Mesas profesionales, recreativas y comerciales. Instalación incluida."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
              <Calculator className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cotiza tu Mesa de Pool
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Completa estos {totalSteps} simples pasos para recibir una cotización personalizada
            </p>
          </div>

          {/* Indicador de Pasos */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg font-bold transition-all duration-300 ${getStepColor(step)}`}
                    >
                      {step < currentStep ? (
                        <CheckCircle className="w-6 h-6 text-gray-900" />
                      ) : (
                        <span className={step <= currentStep ? 'text-gray-900' : 'text-gray-400'}>
                          {step}
                        </span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs sm:text-sm font-medium ${getStepTextColor(step)}`}>
                      {step === 1 && 'Tus Datos'}
                      {step === 2 && 'Tu Mesa'}
                      {step === 3 && 'Detalles'}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Beneficios */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Truck className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Instalación Incluida</h3>
              <p className="text-sm text-gray-600">Instalación profesional sin costo adicional</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <DollarSign className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Financiamiento</h3>
              <p className="text-sm text-gray-600">Planes de pago flexibles disponibles</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <CheckCircle className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Garantía</h3>
              <p className="text-sm text-gray-600">Garantía extendida en todas nuestras mesas</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {submitSuccess ? (
              <div className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cotización Enviada!</h2>
                <p className="text-gray-600 mb-6">
                  Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Enviar otra cotización
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Paso 1: Información Personal */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Información de Contacto
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre Completo *
                        </label>
                        <input
                          {...register('name')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Juan Pérez"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="+56 9 1234 5678"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="juan@ejemplo.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección de Entrega *
                        </label>
                        <input
                          {...register('deliveryAddress')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Ej: Maximiliano Ibáñez 1436, Quinta Normal"
                        />
                        {errors.deliveryAddress && (
                          <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 2: Características de la Mesa */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Ruler className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Características de la Mesa
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Tamaño de Mesa *
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {tableSizes.map((size) => (
                          <label
                            key={size.value}
                            className="relative flex flex-col p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-all group"
                          >
                            <input
                              {...register('tableSize')}
                              type="radio"
                              value={size.value}
                              className="sr-only peer"
                            />
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-primary peer-checked:border-[6px] transition-all mt-0.5" />
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 mb-1">{size.label}</div>
                                <div className="text-sm text-gray-600">{size.description}</div>
                              </div>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-lg pointer-events-none" />
                          </label>
                        ))}
                      </div>
                      {errors.tableSize && (
                        <p className="mt-2 text-sm text-red-600">{errors.tableSize.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Tipo de Mesa *
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {tableTypes.map((type) => (
                          <label
                            key={type.value}
                            className="relative flex flex-col p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-all group"
                          >
                            <input
                              {...register('tableType')}
                              type="radio"
                              value={type.value}
                              className="sr-only peer"
                            />
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{type.icon}</div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 mb-1">{type.label}</div>
                                <div className="text-sm text-gray-600">{type.description}</div>
                              </div>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 rounded-lg pointer-events-none" />
                          </label>
                        ))}
                      </div>
                      {errors.tableType && (
                        <p className="mt-2 text-sm text-red-600">{errors.tableType.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Paso 3: Detalles Adicionales */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Detalles Adicionales
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        ¿Necesitas Instalación? *
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'si', label: 'Sí, necesito instalación profesional' },
                          { value: 'no', label: 'No, instalaré por mi cuenta' },
                          { value: 'consultar', label: 'No estoy seguro, necesito asesoría' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="relative flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-all"
                          >
                            <input
                              {...register('installationNeeded')}
                              type="radio"
                              value={option.value}
                              className="sr-only peer"
                            />
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-primary peer-checked:border-[6px] transition-all" />
                              <span className="font-medium text-gray-900">{option.label}</span>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 rounded-lg pointer-events-none" />
                          </label>
                        ))}
                      </div>
                      {errors.installationNeeded && (
                        <p className="mt-2 text-sm text-red-600">{errors.installationNeeded.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presupuesto Aproximado (Opcional)
                      </label>
                      <select
                        {...register('budget')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="">Selecciona un rango</option>
                        <option value="500-1000">$500.000 - $1.000.000</option>
                        <option value="1000-2000">$1.000.000 - $2.000.000</option>
                        <option value="2000-3000">$2.000.000 - $3.000.000</option>
                        <option value="3000+">Más de $3.000.000</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentarios o Solicitudes Especiales (Opcional)
                      </label>
                      <textarea
                        {...register('comments')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Cuéntanos más sobre tus necesidades o cualquier consulta específica..."
                      />
                    </div>
                  </div>
                )}

                {/* Botones de Navegación */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Anterior
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 bg-accent hover:bg-[#f7d117] text-white font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Siguiente
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 bg-accent hover:bg-[#f7d117] text-white font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar Cotización
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Información Adicional */}
          <div className="mt-12 text-center text-gray-600">
            <p className="mb-2">
              ¿Tienes preguntas? Llámanos al{' '}
              <a href="tel:+56965839601" className="text-primary font-bold hover:underline">
                +56 9 6583 9601
              </a>
            </p>
            <p className="text-sm">
              También puedes escribirnos a{' '}
              <a href="mailto:contacto@billardramirez.cl" className="text-primary hover:underline">
                contacto@billardramirez.cl
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
