import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Testimonial } from '../types'

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos M.',
    location: 'Santiago',
    rating: 5,
    text: 'Excelente calidad y atención. La mesa quedó perfecta en mi sala de juegos. Totalmente recomendados.',
  },
  {
    id: 2,
    name: 'Andrea P.',
    location: 'Viña del Mar',
    rating: 5,
    text: 'La instalación fue impecable y el equipo muy profesional. La mesa es hermosa y juega perfecto.',
  },
  {
    id: 3,
    name: 'Roberto S.',
    location: 'Concepción',
    rating: 5,
    text: 'Mejor inversión para mi local. Los clientes están encantados con la calidad de las mesas.',
  },
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-primary mb-4">
          Lo que dicen nuestros clientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t-2 border-gray-100 pt-4">
                <p className="font-bold text-primary">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
