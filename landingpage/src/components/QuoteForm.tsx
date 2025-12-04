import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { QuoteFormData } from '../types'

interface QuoteFormProps {
  selectedModel: string
}

const QuoteForm = ({ selectedModel }: QuoteFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData>()

  // Update model when selectedModel prop changes
  useEffect(() => {
    if (selectedModel) {
      setValue('model', selectedModel)
    }
  }, [selectedModel, setValue])

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('=== COTIZACIÓN SOLICITADA ===')
      console.log('Datos:', data)
      console.log('============================')

      setIsSubmitted(true)
      toast.success('¡Cotización enviada exitosamente!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Hubo un error al enviar tu cotización. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    reset()
  }

  return (
    <section id="cotizacion" className="py-20 bg-gradient-to-br from-primary via-primary-light to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Info Section */}
          <div className="lg:col-span-2 text-white">
            <h2 className="text-4xl font-bold mb-4">Solicita tu Cotización</h2>
            <p className="text-lg mb-8 text-white/90">
              Completa el formulario y recibe una cotización personalizada en menos de 24 horas
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <strong className="block mb-1">Teléfono</strong>
                  <p className="text-white/90">+56 9 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <strong className="block mb-1">Email</strong>
                  <p className="text-white/90">contacto@billardramirez.cl</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <strong className="block mb-1">Dirección</strong>
                  <p className="text-white/90">Santiago, Chile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        {...register('name', { required: 'El nombre es requerido' })}
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          {...register('email', {
                            required: 'El email es requerido',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Email inválido',
                            },
                          })}
                          type="email"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          {...register('phone', { required: 'El teléfono es requerido' })}
                          type="tel"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Modelo de Mesa *
                      </label>
                      <select
                        {...register('model', { required: 'Selecciona un modelo' })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Selecciona un modelo</option>
                        <option value="profesional">Mesa Profesional - 8 pies</option>
                        <option value="premium">Mesa Premium - 7 pies</option>
                        <option value="clasica">Mesa Clásica - 6 pies</option>
                        <option value="personalizada">Mesa Personalizada</option>
                      </select>
                      {errors.model && (
                        <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
                      )}
                    </div>

                    {/* Table Cloth Color */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Color del Paño *
                      </label>
                      <select
                        {...register('tableCloth', { required: 'Selecciona un color' })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Selecciona un color</option>
                        <option value="verde">Verde Tradicional</option>
                        <option value="azul">Azul</option>
                        <option value="rojo">Rojo</option>
                        <option value="negro">Negro</option>
                        <option value="borgoña">Borgoña</option>
                      </select>
                      {errors.tableCloth && (
                        <p className="text-red-500 text-sm mt-1">{errors.tableCloth.message}</p>
                      )}
                    </div>

                    {/* Wood Finish */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Acabado de Madera *
                      </label>
                      <select
                        {...register('woodFinish', { required: 'Selecciona un acabado' })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Selecciona un acabado</option>
                        <option value="natural">Natural</option>
                        <option value="nogal">Nogal</option>
                        <option value="caoba">Caoba</option>
                        <option value="negro">Negro</option>
                        <option value="blanco">Blanco</option>
                      </select>
                      {errors.woodFinish && (
                        <p className="text-red-500 text-sm mt-1">{errors.woodFinish.message}</p>
                      )}
                    </div>

                    {/* Accessories */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Accesorios Adicionales
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'bolas', label: 'Incluir set de bolas profesionales' },
                          { value: 'tacos', label: 'Incluir 4 tacos de pool' },
                          { value: 'triangulo', label: 'Incluir triángulo y soporte para tacos' },
                          { value: 'funda', label: 'Incluir funda protectora' },
                        ].map((accessory) => (
                          <label key={accessory.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              {...register('accessories')}
                              type="checkbox"
                              value={accessory.value}
                              className="w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent"
                            />
                            <span className="text-gray-700">{accessory.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Region */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Región de Entrega *
                      </label>
                      <select
                        {...register('region', { required: 'Selecciona tu región' })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Selecciona tu región</option>
                        <option value="rm">Región Metropolitana</option>
                        <option value="valparaiso">Valparaíso</option>
                        <option value="ohiggins">O'Higgins</option>
                        <option value="maule">Maule</option>
                        <option value="biobio">Biobío</option>
                        <option value="otra">Otra región</option>
                      </select>
                      {errors.region && (
                        <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Comentarios o Requerimientos Especiales
                      </label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        placeholder="Cuéntanos más sobre lo que necesitas..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-6 rounded-full transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Enviando...' : 'Solicitar Cotización'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-primary mb-4">
                      ¡Cotización Enviada!
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Hemos recibido tu solicitud. Te contactaremos en las próximas 24 horas.
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
                    >
                      Enviar otra cotización
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteForm
