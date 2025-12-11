import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src="/images/logo.png"
              alt="Billard Ramirez"
              className="h-12 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Diseñamos y equipamos espacios de pool para disfrutar el juego con estilo.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/billardramirez.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/BilliardRamirez/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.5,3.44,9.5,5.32v2.15H7v4h2.5v12h5v-12h3.85l.42-4Z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@billardramirez.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">
              Tienda
            </p>
            <ul className="space-y-3">
              <li>
                <Link to="/tienda?categoria=mesas-de-pool" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Mesas de Pool
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=tacos" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Tacos
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=accesorios" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Ver todo
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">
              Información
            </p>
            <ul className="space-y-3">
              <li>
                <Link to="/politicas-envio" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/devoluciones" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/garantia" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Garantía
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">
              Contacto
            </p>
            <ul className="space-y-3">
              <li>
                <a href="tel:+56965839601" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +56 9 6583 9601
                </a>
              </li>
              <li>
                <a href="mailto:contacto@billardramirez.cl" className="text-sm text-gray-400 hover:text-white transition-colors">
                  contacto@billardramirez.cl
                </a>
              </li>
              <li>
                <p className="text-sm text-gray-400">
                  Lun - Vie: 9:00 - 13:00, 14:00 - 18:30
                </p>
              </li>
              <li>
                <p className="text-sm text-gray-400">
                  Sáb: 11:00 - 15:00
                </p>
              </li>
              <li>
                <p className="text-sm text-gray-400">
                  Dom: Cerrado
                </p>
              </li>
              <li className="pt-2">
                <p className="text-sm text-gray-400 mb-2">
                  Maximiliano Ibáñez #1436, Quinta Normal
                </p>
                <a
                  href="https://www.google.com/maps/search/Billard+Ramirez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white border border-gray-600 px-3 py-2 hover:bg-white hover:text-black transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cómo llegar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <p>
                © {currentYear} Billard Ramirez. Todos los derechos reservados.
              </p>
              <span className="hidden md:inline text-gray-600">|</span>
              <a
                href="https://demosle.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Creado por demosle.cl
              </a>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/terminos-condiciones" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link to="/politica-privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
