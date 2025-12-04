import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    alert('Funcionalidad de contacto pendiente de implementar');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
          Contáctanos
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          ¿Tienes alguna pregunta o necesitas asesoría? Estamos aquí para ayudarte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Contact Info */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Phone className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                <a
                  href="tel:+56965839601"
                  className="text-gray-600 hover:text-primary"
                >
                  +56 9 6583 9601
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a
                  href="mailto:contacto@billardramirez.cl"
                  className="text-gray-600 hover:text-primary"
                >
                  contacto@billardramirez.cl
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ubicación</h3>
                <p className="text-gray-600">Chile</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Clock className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Horario de Atención
                </h3>
                <p className="text-gray-600 text-sm">
                  Lunes a Viernes<br />
                  9:00 - 18:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-4 sm:mb-6">
              Envíanos un mensaje
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Nombre"
                  name="name"
                  type="text"
                  required
                  placeholder="Tu nombre"
                />
                <Input
                  label="Apellido"
                  name="lastname"
                  type="text"
                  required
                  placeholder="Tu apellido"
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
              />

              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                placeholder="+56 9 XXXX XXXX"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="producto">Consulta sobre producto</option>
                  <option value="servicio">Servicio técnico</option>
                  <option value="pedido">Estado de pedido</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button variant="primary" size="lg" type="submit" className="w-full">
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
