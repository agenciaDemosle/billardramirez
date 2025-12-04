import { Truck, Package, MapPin, Clock } from 'lucide-react';

export default function PoliticasEnvio() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Políticas de Envío
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              En Billard Ramirez trabajamos con los mejores servicios de
              courier para garantizar que tus productos lleguen en perfecto estado.
            </p>

            <div className="grid grid-cols-1 gap-6 mb-8 not-prose">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tiempos de Entrega
                  </h3>
                </div>
                <p className="text-gray-600">
                  Santiago: 2-3 días hábiles
                  <br />
                  Regiones: 5-7 días hábiles
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cobertura de Envíos
            </h2>

            <p>
              Realizamos envíos a todo Chile continental. Para zonas extremas o
              islas, por favor contáctanos para coordinar el envío.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Región Metropolitana
            </h3>

            <ul>
              <li>Envío estándar: 2-3 días hábiles</li>
              <li>Costo: Gratis sobre $100.000 en accesorios</li>
              <li>Cobertura: Todas las comunas</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Regiones
            </h3>

            <ul>
              <li>Envío estándar: 5-7 días hábiles</li>
              <li>Costo: Gratis sobre $100.000 en accesorios</li>
              <li>Cobertura: Todo Chile continental</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Proceso de Envío
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Confirmación de Pedido
                  </h4>
                  <p className="text-gray-600">
                    Una vez confirmado tu pago, recibirás un email con los
                    detalles de tu pedido.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Preparación
                  </h4>
                  <p className="text-gray-600">
                    Preparamos cuidadosamente tu pedido con embalaje especial
                    para productos frágiles.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Despacho
                  </h4>
                  <p className="text-gray-600">
                    Enviamos tu pedido y te compartimos el código de seguimiento
                    por email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Entrega
                  </h4>
                  <p className="text-gray-600">
                    El courier entrega tu pedido en la dirección indicada.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
              Seguimiento de Pedido
            </h2>

            <p>
              Una vez despachado tu pedido, recibirás un código de seguimiento
              que te permitirá rastrear tu envío en tiempo real. Puedes verificar
              el estado de tu pedido en cualquier momento.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Productos Especiales
            </h2>

            <p>
              Para productos de gran tamaño como mesas de pool, el envío se
              coordina de forma especial. Nuestro equipo se pondrá en contacto
              contigo para coordinar la entrega e instalación si es necesario.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Problemas con el Envío
            </h2>

            <p>
              Si tu pedido no llega en el tiempo estimado o hay algún problema
              con la entrega, por favor contáctanos inmediatamente a{' '}
              <a
                href="mailto:contacto@billardramirez.cl"
                className="text-primary hover:underline"
              >
                contacto@billardramirez.cl
              </a>{' '}
              o al{' '}
              <a
                href="tel:+56965839601"
                className="text-primary hover:underline"
              >
                +56 9 6583 9601
              </a>
              .
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8 not-prose">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nota Importante
              </h3>
              <p className="text-gray-700">
                Los tiempos de entrega son estimados y pueden variar según la
                disponibilidad del courier y condiciones climáticas. No nos
                hacemos responsables por retrasos causados por el servicio de
                courier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
