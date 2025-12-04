import { motion } from 'framer-motion'
import { Trophy, Sparkles, Truck, Award } from 'lucide-react'

const benefits = [
  {
    icon: Trophy,
    title: 'Calidad Premium',
    description: 'Materiales de primera calidad garantizando durabilidad y rendimiento excepcional',
  },
  {
    icon: Sparkles,
    title: 'Personalización Total',
    description: 'Diseña tu mesa a medida: tamaño, color, acabados y más opciones',
  },
  {
    icon: Truck,
    title: 'Instalación Incluida',
    description: 'Entrega e instalación profesional en toda la región',
  },
  {
    icon: Award,
    title: 'Garantía Extendida',
    description: 'Respaldamos nuestro trabajo con garantía de 2 años',
  },
]

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-primary mb-4">
          ¿Por qué elegir Billard Ramírez?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Benefits
