const Footer = () => {
  return (
    <footer id="contacto" className="bg-primary-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">Billard Ramírez</h3>
            <p className="text-white/80">
              Fabricantes expertos en mesas de pool de alta calidad desde 1995.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-accent mb-4">Contacto</h4>
            <p className="text-white/80 mb-2">Email: contacto@billardramirez.cl</p>
            <p className="text-white/80">Teléfono: +56 9 1234 5678</p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold text-accent mb-4">Horario</h4>
            <p className="text-white/80 mb-2">Lunes a Viernes: 9:00 - 18:00</p>
            <p className="text-white/80">Sábados: 10:00 - 14:00</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/60">
            &copy; {new Date().getFullYear()} Billard Ramírez. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
