import { motion } from 'framer-motion'

const Hero = () => {
  const scrollToQuote = () => {
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
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary-dark overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1604726488664-26cabf50ead8?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }} />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-black text-white mb-6 text-shadow"
        >
          Mesas de Pool Profesionales
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 mb-8 font-light text-shadow-sm"
        >
          Fabricadas a medida con la más alta calidad y precisión
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToQuote}
          className="bg-accent hover:bg-accent-light text-primary-dark font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
        >
          Cotiza Ahora
        </motion.button>
      </div>
    </section>
  )
}

export default Hero
