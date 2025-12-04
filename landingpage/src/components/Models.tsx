import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { TableModel } from '../types'

interface ModelsProps {
  onSelectModel: (modelId: string) => void
}

const models: TableModel[] = [
  {
    id: 'profesional',
    name: 'Mesa Profesional',
    size: '8 pies (244 x 137 cm)',
    features: [
      'Tablero de pizarra italiana 3 piezas',
      'Paño Simonis importado',
      'Madera de roble maciza',
      'Sistema de nivelación profesional',
    ],
    image: 'https://images.unsplash.com/photo-1604726488664-26cabf50ead8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'premium',
    name: 'Mesa Premium',
    size: '7 pies (213 x 122 cm)',
    features: [
      'Tablero de pizarra 1 pieza',
      'Paño profesional de alta calidad',
      'Madera de cedro tratada',
      'Bandas de goma natural',
    ],
    image: 'https://images.unsplash.com/photo-1566666313093-54bde6ebcb72?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'clasica',
    name: 'Mesa Clásica',
    size: '6 pies (183 x 107 cm)',
    features: [
      'Tablero de MDF reforzado',
      'Paño de calidad comercial',
      'Madera tratada',
      'Perfecta para espacios reducidos',
    ],
    image: 'https://images.unsplash.com/photo-1604167193165-b0e6039b8b6d?auto=format&fit=crop&w=800&q=80',
  },
]

const Models = ({ onSelectModel }: ModelsProps) => {
  const scrollToQuote = (modelId: string) => {
    onSelectModel(modelId)
    const element = document.querySelector('#cotizacion')
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section id="modelos" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-primary mb-4">
          Nuestros Modelos
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12">
          Elige el modelo perfecto para tu espacio
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                model.featured ? 'ring-4 ring-accent' : ''
              } relative`}
            >
              {model.featured && (
                <div className="absolute top-5 -right-10 bg-accent text-primary-dark font-bold text-sm py-1 px-12 rotate-45 z-10 shadow-md">
                  Más Popular
                </div>
              )}

              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {model.name}
                </h3>
                <p className="text-gray-600 font-semibold mb-4">{model.size}</p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => scrollToQuote(model.id)}
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                    model.featured
                      ? 'bg-accent hover:bg-accent-light text-primary-dark'
                      : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  Cotizar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Models
