export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Última actualización: {new Date().toLocaleDateString('es-CL')}
            </p>

            <p>
              En Billard Ramirez, accesible desde www.billardramirez.cl,
              nos comprometemos a proteger tu privacidad. Esta Política de
              Privacidad describe cómo recopilamos, usamos y protegemos tu
              información personal.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              1.1 Información Personal
            </h3>

            <p>
              Podemos recopilar la siguiente información personal cuando
              interactúas con nuestro sitio web:
            </p>

            <ul>
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección de envío y facturación</li>
              <li>Información de pago (procesada de forma segura)</li>
              <li>Historial de compras</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              1.2 Información Técnica
            </h3>

            <p>
              También recopilamos información técnica automáticamente cuando
              visitas nuestro sitio:
            </p>

            <ul>
              <li>Dirección IP</li>
              <li>Tipo de navegador</li>
              <li>Sistema operativo</li>
              <li>Páginas visitadas</li>
              <li>Tiempo de permanencia en el sitio</li>
              <li>Cookies y tecnologías similares</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Cómo Usamos tu Información
            </h2>

            <p>Utilizamos la información recopilada para:</p>

            <ul>
              <li>Procesar tus pedidos y pagos</li>
              <li>Enviar confirmaciones y actualizaciones de pedidos</li>
              <li>Responder a tus consultas y solicitudes</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Personalizar tu experiencia de compra</li>
              <li>Enviar comunicaciones marketing (con tu consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Prevenir fraudes y proteger la seguridad</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Cookies
            </h2>

            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu
              experiencia en nuestro sitio web. Las cookies nos ayudan a:
            </p>

            <ul>
              <li>Recordar tus preferencias</li>
              <li>Mantener tu sesión activa</li>
              <li>Recordar productos en tu carrito</li>
              <li>Analizar el tráfico del sitio</li>
              <li>Mostrar anuncios relevantes</li>
            </ul>

            <p>
              Puedes configurar tu navegador para rechazar cookies, pero esto
              puede afectar la funcionalidad del sitio.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Compartir Información con Terceros
            </h2>

            <p>
              No vendemos ni alquilamos tu información personal. Solo compartimos
              tu información con terceros en las siguientes circunstancias:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              4.1 Proveedores de Servicios
            </h3>

            <p>Compartimos información con proveedores que nos ayudan a:</p>

            <ul>
              <li>Procesar pagos (Paiku, bancos)</li>
              <li>Realizar envíos (empresas de courier)</li>
              <li>Analizar datos (Google Analytics)</li>
              <li>Enviar emails (servicios de email marketing)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              4.2 Requisitos Legales
            </h3>

            <p>
              Podemos divulgar tu información si es requerido por ley o para:
            </p>

            <ul>
              <li>Cumplir con procesos legales</li>
              <li>Proteger nuestros derechos y propiedad</li>
              <li>Prevenir fraudes</li>
              <li>Proteger la seguridad de usuarios y el público</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Seguridad de la Información
            </h2>

            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información personal, incluyendo:
            </p>

            <ul>
              <li>Encriptación SSL/TLS para transmisiones de datos</li>
              <li>Almacenamiento seguro de datos</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo regular de sistemas de seguridad</li>
            </ul>

            <p>
              Sin embargo, ningún método de transmisión por Internet es 100%
              seguro, y no podemos garantizar la seguridad absoluta.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Tus Derechos
            </h2>

            <p>
              De acuerdo con la Ley N° 19.628 sobre Protección de la Vida
              Privada, tienes derecho a:
            </p>

            <ul>
              <li>Acceder a tu información personal</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Revocar tu consentimiento</li>
              <li>Solicitar la portabilidad de datos</li>
            </ul>

            <p>
              Para ejercer estos derechos, contáctanos a{' '}
              <a
                href="mailto:privacidad@billardramirez.cl"
                className="text-primary hover:underline"
              >
                privacidad@billardramirez.cl
              </a>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Retención de Datos
            </h2>

            <p>
              Conservamos tu información personal durante el tiempo necesario
              para cumplir con los fines descritos en esta política, a menos que
              la ley requiera un período de retención más largo.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Menores de Edad
            </h2>

            <p>
              Nuestro sitio web no está dirigido a menores de 18 años. No
              recopilamos conscientemente información personal de menores. Si
              descubrimos que hemos recopilado información de un menor,
              eliminaremos esa información de inmediato.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Enlaces a Sitios de Terceros
            </h2>

            <p>
              Nuestro sitio puede contener enlaces a sitios web de terceros. No
              somos responsables de las prácticas de privacidad de estos sitios.
              Te recomendamos leer las políticas de privacidad de cada sitio que
              visites.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Comunicaciones de Marketing
            </h2>

            <p>
              Con tu consentimiento, podemos enviarte comunicaciones de marketing
              sobre nuestros productos y ofertas. Puedes cancelar tu suscripción
              en cualquier momento haciendo clic en el enlace de "Cancelar
              suscripción" en nuestros emails o contactándonos directamente.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Transferencias Internacionales
            </h2>

            <p>
              Tu información puede ser transferida y almacenada en servidores
              ubicados fuera de Chile. Al usar nuestros servicios, consientes
              estas transferencias. Aseguramos que cualquier transferencia
              cumpla con las leyes de protección de datos aplicables.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Cambios a esta Política
            </h2>

            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Te
              notificaremos sobre cambios significativos publicando la nueva
              política en esta página y actualizando la fecha de "Última
              actualización".
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Contacto
            </h2>

            <p>
              Si tienes preguntas sobre esta Política de Privacidad o sobre cómo
              manejamos tu información personal, contáctanos:
            </p>

            <ul>
              <li>
                Email:{' '}
                <a
                  href="mailto:privacidad@billardramirez.cl"
                  className="text-primary hover:underline"
                >
                  privacidad@billardramirez.cl
                </a>
              </li>
              <li>
                Teléfono:{' '}
                <a
                  href="tel:+56965839601"
                  className="text-primary hover:underline"
                >
                  +56 9 6583 9601
                </a>
              </li>
              <li>Dirección: Maximiliano Ibáñez 1436, Quinta Normal, Santiago</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8 not-prose">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu Privacidad es Importante
              </h3>
              <p className="text-gray-700">
                Nos comprometemos a proteger tu privacidad y manejar tu
                información de manera responsable y transparente. Si tienes
                alguna pregunta o inquietud, no dudes en contactarnos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
