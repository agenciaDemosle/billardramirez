import { RotateCcw, Package, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Devoluciones() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Política de Devoluciones
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Tu satisfacción es importante para nosotros. Si no estás conforme
              con tu compra, puedes solicitar una devolución siguiendo estos
              lineamientos.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Plazo para Devoluciones
            </h2>

            <p>
              Aceptamos devoluciones dentro de los <strong>30 días</strong>{' '}
              posteriores a la recepción del producto. Pasado este plazo, no
              podremos ofrecerte un reembolso o cambio.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Condiciones para Devoluciones
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
              <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Aceptamos
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Producto sin usar</li>
                  <li>• Empaque original intacto</li>
                  <li>• Todos los accesorios incluidos</li>
                  <li>• Etiquetas originales</li>
                  <li>• Boleta o factura de compra</li>
                </ul>
              </div>

              <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    No Aceptamos
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Productos usados</li>
                  <li>• Empaques dañados</li>
                  <li>• Productos personalizados</li>
                  <li>• Productos en oferta final</li>
                  <li>• Accesorios faltantes</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Proceso de Devolución
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Contacta con nosotros
                  </h4>
                  <p className="text-gray-600">
                    Envía un email a{' '}
                    <a
                      href="mailto:devoluciones@billardramirez.cl"
                      className="text-primary hover:underline"
                    >
                      devoluciones@billardramirez.cl
                    </a>{' '}
                    indicando tu número de pedido y el motivo de la devolución.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Autorización
                  </h4>
                  <p className="text-gray-600">
                    Nuestro equipo revisará tu solicitud y te enviará un número
                    de autorización de devolución (RMA).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Empaque el producto
                  </h4>
                  <p className="text-gray-600">
                    Embala el producto en su caja original con todos los
                    accesorios. Incluye el número RMA visible en el exterior.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Envío del producto
                  </h4>
                  <p className="text-gray-600">
                    Envía el producto a nuestra dirección. El costo del envío de
                    devolución corre por cuenta del cliente, excepto en casos de
                    producto defectuoso.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Inspección y reembolso
                  </h4>
                  <p className="text-gray-600">
                    Una vez recibido, inspeccionaremos el producto. Si cumple con
                    las condiciones, procesaremos tu reembolso en 5-7 días hábiles.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Métodos de Reembolso
            </h2>

            <p>
              Los reembolsos se realizarán mediante el mismo método de pago
              utilizado en la compra original:
            </p>

            <ul>
              <li>
                <strong>Tarjeta de crédito/débito:</strong> 5-10 días hábiles
              </li>
              <li>
                <strong>Transferencia bancaria:</strong> 3-5 días hábiles
              </li>
              <li>
                <strong>Paiku:</strong> 3-5 días hábiles
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cambios
            </h2>

            <p>
              Si deseas cambiar un producto por otro, debes realizar una
              devolución del producto original y hacer una nueva compra del
              producto deseado. Esto nos permite procesar tu solicitud más
              rápidamente.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Productos Defectuosos
            </h2>

            <p>
              Si recibes un producto defectuoso o dañado, por favor contáctanos
              inmediatamente. En estos casos:
            </p>

            <ul>
              <li>No se cobrará el envío de devolución</li>
              <li>Te enviaremos un reemplazo sin costo adicional</li>
              <li>O procesaremos un reembolso completo si lo prefieres</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8 not-prose">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-gray-700 mb-3">
                Si tienes dudas sobre el proceso de devolución, no dudes en
                contactarnos.
              </p>
              <Link
                to="/contacto"
                className="text-primary font-medium hover:underline"
              >
                Ir a Contacto →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
