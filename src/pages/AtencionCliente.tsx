import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function AtencionCliente() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Atención al Cliente
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              En Billard Ramirez, tu satisfacción es nuestra prioridad. Estamos
              aquí para ayudarte con cualquier consulta, duda o problema que puedas
              tener.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Canales de Atención
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Teléfono</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  Llámanos y habla directamente con nuestro equipo
                </p>
                <a
                  href="tel:+56965839601"
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  +56 9 6583 9601
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  Envíanos un correo y te responderemos en 24 horas
                </p>
                <a
                  href="mailto:contacto@billardramirez.cl"
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  contacto@billardramirez.cl
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  Chatea con nosotros de forma rápida y directa
                </p>
                <a
                  href="https://wa.me/56965839601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  Abrir WhatsApp
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Horario</h3>
                </div>
                <p className="text-gray-600">
                  Lunes a Viernes: 9:00 - 18:00
                  <br />
                  Sábados: 11:00 - 15:00
                  <br />
                  Domingos: Cerrado
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Cuánto demora el envío?
                </h3>
                <p className="text-gray-600">
                  Los envíos dentro de Santiago se realizan en 2-3 días hábiles.
                  Para regiones, el tiempo estimado es de 5-7 días hábiles.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Puedo devolver un producto?
                </h3>
                <p className="text-gray-600">
                  Sí, aceptamos devoluciones dentro de los 30 días posteriores a
                  la compra. El producto debe estar en su empaque original y sin
                  uso.{' '}
                  <Link to="/devoluciones" className="text-primary hover:underline">
                    Ver política de devoluciones
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Los productos tienen garantía?
                </h3>
                <p className="text-gray-600">
                  Todos nuestros productos cuentan con garantía. El período varía
                  según el producto.{' '}
                  <Link to="/garantia" className="text-primary hover:underline">
                    Ver información de garantía
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Hacen instalación de mesas de pool?
                </h3>
                <p className="text-gray-600">
                  Sí, ofrecemos servicio de instalación profesional para mesas de
                  pool. Contáctanos para más información y cotización.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 not-prose">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-gray-600 mb-4">
                Completa nuestro formulario de contacto y te responderemos a la
                brevedad.
              </p>
              <Link to="/contacto">
                <Button variant="primary">Ir a Contacto</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
