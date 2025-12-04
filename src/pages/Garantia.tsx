import { Shield } from 'lucide-react';

export default function Garantia() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Garantía de Productos
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              En Billard Ramirez respaldamos la calidad de todos nuestros
              productos. Cada artículo cuenta con garantía contra defectos de
              fabricación.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Períodos de Garantía
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Mesas de Pool
                </h3>
                <p className="text-3xl font-bold text-primary mb-2">12 meses</p>
                <p className="text-gray-600">
                  Garantía completa contra defectos de fabricación en
                  estructura, paño y accesorios.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tacos y Accesorios
                </h3>
                <p className="text-3xl font-bold text-primary mb-2">6 meses</p>
                <p className="text-gray-600">
                  Garantía contra defectos de fabricación en materiales y
                  manufactura.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Bolas de Billar
                </h3>
                <p className="text-3xl font-bold text-primary mb-2">6 meses</p>
                <p className="text-gray-600">
                  Garantía contra defectos en el balance y acabado de las bolas.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Otros Accesorios
                </h3>
                <p className="text-3xl font-bold text-primary mb-2">3 meses</p>
                <p className="text-gray-600">
                  Garantía contra defectos de fabricación en otros accesorios.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cobertura de la Garantía
            </h2>

            <p>La garantía cubre:</p>

            <ul>
              <li>Defectos de fabricación</li>
              <li>Fallas en materiales</li>
              <li>Problemas de funcionamiento no causados por mal uso</li>
              <li>Defectos en el acabado o pintura (primeros 90 días)</li>
            </ul>

            <p>La garantía <strong>NO</strong> cubre:</p>

            <ul>
              <li>Daños por mal uso o negligencia</li>
              <li>Desgaste normal por uso</li>
              <li>Daños por accidentes o golpes</li>
              <li>Modificaciones no autorizadas</li>
              <li>Daños por exposición a condiciones climáticas extremas</li>
              <li>Daños causados durante el transporte (después de la entrega)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Hacer Válida la Garantía
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
                      href="mailto:garantia@billardramirez.cl"
                      className="text-primary hover:underline"
                    >
                      garantia@billardramirez.cl
                    </a>{' '}
                    con tu número de pedido y descripción del problema.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Proporciona evidencia
                  </h4>
                  <p className="text-gray-600">
                    Envía fotos o videos que muestren claramente el defecto o
                    problema.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Evaluación
                  </h4>
                  <p className="text-gray-600">
                    Nuestro equipo técnico evaluará el caso en 24-48 horas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Resolución
                  </h4>
                  <p className="text-gray-600">
                    Si la garantía es válida, procederemos con reparación,
                    reemplazo o reembolso según corresponda.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Opciones de Resolución
            </h2>

            <p>
              Dependiendo del caso y el producto, ofrecemos las siguientes
              soluciones:
            </p>

            <ul>
              <li>
                <strong>Reparación:</strong> Reparamos el producto sin costo
                (incluye envío de ida y vuelta)
              </li>
              <li>
                <strong>Reemplazo:</strong> Te enviamos un producto nuevo sin
                costo adicional
              </li>
              <li>
                <strong>Reembolso:</strong> Devolvemos el valor pagado (si no hay
                stock para reemplazo)
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Requisitos para Garantía
            </h2>

            <p>Para hacer válida la garantía necesitas:</p>

            <ul>
              <li>Boleta o factura de compra original</li>
              <li>Número de pedido</li>
              <li>Producto dentro del período de garantía</li>
              <li>Producto sin evidencia de mal uso</li>
              <li>Empaque original (si es posible)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Garantía Extendida
            </h2>

            <p>
              Para algunos productos ofrecemos la opción de adquirir garantía
              extendida al momento de la compra. Esta garantía puede extender la
              cobertura hasta 24 meses adicionales. Consulta al momento de tu
              compra si el producto califica para garantía extendida.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8 not-prose">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Compromiso de Calidad
                </h3>
              </div>
              <p className="text-gray-700">
                En Billard Ramirez nos comprometemos a ofrecer productos de la
                más alta calidad. Nuestra garantía es un respaldo de confianza
                en cada compra que realizas con nosotros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
