import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const TermsAndConditions = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Volver al inicio</span>
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-black mb-4"
        >
          TÉRMINOS Y CONDICIONES
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none space-y-6 text-gray-700"
        >
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: {new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar el sitio web de WearShop, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Uso del Sitio Web</h2>
            <p className="mb-4">
              Te otorgamos una licencia limitada, no exclusiva y no transferible para acceder y utilizar nuestro sitio web únicamente para fines personales y no comerciales. No puedes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Reproducir, duplicar o copiar el contenido sin nuestro permiso</li>
              <li>Utilizar el sitio para fines ilegales o no autorizados</li>
              <li>Intentar obtener acceso no autorizado a cualquier parte del sitio</li>
              <li>Transmitir virus, malware o código malicioso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Productos y Precios</h2>
            <p className="mb-4">
              Nos esforzamos por mostrar con precisión los colores, imágenes y descripciones de nuestros productos. Sin embargo:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>No garantizamos que los colores en pantalla sean exactos</li>
              <li>Nos reservamos el derecho de corregir errores en precios o descripciones</li>
              <li>Los precios están sujetos a cambios sin previo aviso</li>
              <li>Nos reservamos el derecho de limitar las cantidades de productos vendidos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Pedidos y Pagos</h2>
            <p className="mb-4">
              Al realizar un pedido, aceptas proporcionar información precisa y completa. Nos reservamos el derecho de:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Rechazar o cancelar cualquier pedido por cualquier motivo</li>
              <li>Limitar o cancelar pedidos que parezcan ser realizados por comerciantes o revendedores</li>
              <li>Requerir verificación adicional antes de aceptar un pedido</li>
            </ul>
            <p>
              Todos los precios están en Pesos Dominicanos (DOP) e incluyen impuestos aplicables, a menos que se indique lo contrario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del sitio web, incluyendo textos, gráficos, logotipos, iconos, imágenes y software, es propiedad de WearShop o sus proveedores de contenido y está protegido por leyes de derechos de autor y otras leyes de propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, WearShop no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos o uso, relacionados con el uso o la imposibilidad de usar nuestro sitio web o productos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Indemnización</h2>
            <p>
              Aceptas indemnizar y eximir de responsabilidad a WearShop, sus afiliados, directores, empleados y agentes de cualquier reclamo, daño, obligación, pérdida, responsabilidad, costo o deuda, y gastos (incluyendo honorarios de abogados) que surjan de tu uso del sitio web o violación de estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Ley Aplicable</h2>
            <p>
              Estos términos y condiciones se rigen por las leyes de la República Dominicana. Cualquier disputa relacionada con estos términos será sometida a la jurisdicción exclusiva de los tribunales de la República Dominicana.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Cambios a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. Es tu responsabilidad revisar periódicamente estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos en:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> contacto@wearshop.com<br />
              <strong>Teléfono:</strong> +1 (829) 965-7361
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

