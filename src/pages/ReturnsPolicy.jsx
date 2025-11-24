import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const ReturnsPolicy = () => {
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
          POLÍTICA DE DEVOLUCIONES
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
            <h2 className="text-2xl font-bold text-black mb-4">1. Período de Devolución</h2>
            <p>
              Tienes derecho a devolver productos no deseados dentro de los <strong>30 días</strong> posteriores a la fecha de recepción del pedido. Los productos deben estar en su estado original, sin usar, con todas las etiquetas y embalaje originales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Productos Elegibles para Devolución</h2>
            <p className="mb-4">
              Para ser elegible para una devolución, el producto debe:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Estar en su estado original, sin usar</li>
              <li>Tener todas las etiquetas y etiquetas de precio originales</li>
              <li>Incluir el embalaje original</li>
              <li>No haber sido usado, lavado o dañado</li>
            </ul>
            <p className="mb-4">
              <strong>No se aceptan devoluciones para:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Productos personalizados o hechos a medida</li>
              <li>Productos de higiene íntima</li>
              <li>Productos que hayan sido usados o dañados por el cliente</li>
              <li>Productos sin el embalaje original</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Proceso de Devolución</h2>
            <p className="mb-4">
              Para iniciar una devolución:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Contacta con nuestro equipo de atención al cliente a través de WhatsApp o email</li>
              <li>Proporciona el número de pedido y detalles del producto que deseas devolver</li>
              <li>Nuestro equipo te proporcionará instrucciones de devolución</li>
              <li>Empaqueta el producto de forma segura en su embalaje original</li>
              <li>Envía el paquete a la dirección proporcionada</li>
            </ol>
            <p>
              <strong>Contacto para devoluciones:</strong><br />
              WhatsApp: <a href="https://wa.link/l8vc70" className="text-blue-600 hover:underline">+1 (829) 965-7361</a><br />
              Email: contacto@wearshop.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Costos de Devolución</h2>
            <p className="mb-4">
              Los costos de envío de devolución corren por cuenta del cliente, excepto en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Producto defectuoso o incorrecto enviado por error</li>
              <li>Producto dañado durante el envío</li>
              <li>Error en el pedido por parte de WearShop</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Reembolsos</h2>
            <p className="mb-4">
              Una vez recibido y verificado el producto devuelto, procesaremos tu reembolso. El reembolso se realizará utilizando el mismo método de pago utilizado para la compra original.
            </p>
            <p className="mb-4">
              <strong>Tiempo de procesamiento:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Verificación del producto: 2-3 días hábiles</li>
              <li>Procesamiento del reembolso: 5-10 días hábiles</li>
              <li>El tiempo total puede variar según el método de pago</li>
            </ul>
            <p>
              <strong>Nota:</strong> Los costos de envío originales no son reembolsables, a menos que la devolución sea por un error de nuestra parte.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Cambios</h2>
            <p>
              Actualmente no ofrecemos cambios directos. Si deseas un producto diferente, puedes devolver el producto original siguiendo nuestro proceso de devolución y realizar un nuevo pedido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Productos Defectuosos</h2>
            <p className="mb-4">
              Si recibes un producto defectuoso o dañado:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Contacta con nosotros dentro de las 48 horas posteriores a la recepción</li>
              <li>Proporciona fotografías del defecto o daño</li>
              <li>Te enviaremos un producto de reemplazo o procesaremos un reembolso completo</li>
              <li>Los costos de envío corren por nuestra cuenta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de devoluciones, puedes contactarnos en:
            </p>
            <p className="mt-2">
              <strong>WhatsApp:</strong> <a href="https://wa.link/l8vc70" className="text-blue-600 hover:underline">+1 (829) 965-7361</a><br />
              <strong>Email:</strong> contacto@wearshop.com
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;

