import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PrivacyPolicy = () => {
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
          POLÍTICA DE PRIVACIDAD
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
            <h2 className="text-2xl font-bold text-black mb-4">1. Información que Recopilamos</h2>
            <p className="mb-4">
              En WearShop, recopilamos información que nos proporcionas directamente cuando:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Realizas una compra o intentas realizar una compra a través de nuestro sitio web</li>
              <li>Te registras para recibir nuestro boletín informativo</li>
              <li>Nos contactas a través de nuestros formularios de contacto</li>
              <li>Interactúas con nuestras redes sociales</li>
            </ul>
            <p>
              La información que recopilamos puede incluir: nombre, dirección de correo electrónico, número de teléfono, dirección de envío, información de pago y preferencias de compra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Uso de la Información</h2>
            <p className="mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Procesar y completar tus pedidos</li>
              <li>Comunicarnos contigo sobre tu pedido, productos, servicios y promociones</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Personalizar tu experiencia de compra</li>
              <li>Cumplir con nuestras obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Compartir Información</h2>
            <p className="mb-4">
              No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio (procesadores de pago, servicios de envío)</li>
              <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Tus Derechos</h2>
            <p className="mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tu información</li>
              <li>Oponerte al procesamiento de tu información</li>
              <li>Solicitar la portabilidad de tus datos</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctanos a través de nuestro formulario de contacto o en contacto@wearshop.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Cookies</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web, analizar el tráfico y personalizar el contenido. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Cambios a esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te notificaremos sobre cambios significativos publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
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

export default PrivacyPolicy;

