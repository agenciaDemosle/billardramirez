import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Modelos', href: '#modelos' },
    { label: 'Cotizar', href: '#cotizacion' },
    { label: 'Contacto', href: '#contacto' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-black text-primary">Billard Ramírez</h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-primary font-semibold transition-colors duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left text-gray-700 hover:text-primary font-semibold transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
