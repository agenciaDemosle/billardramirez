const CTA = () => {
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
    <section className="py-20 bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-4">
          ¿Listo para tener tu mesa de pool?
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Obtén una cotización personalizada sin compromiso
        </p>
        <button
          onClick={scrollToQuote}
          className="bg-accent hover:bg-accent-light text-primary-dark font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
        >
          Cotizar Ahora
        </button>
      </div>
    </section>
  )
}

export default CTA
