import { motion } from 'framer-motion';
import { FiSearch, FiCamera, FiMessageCircle, FiPackage, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Envios = () => {
  const steps = [
    {
      number: 1,
      icon: FiSearch,
      title: 'Busca los artículos que te gustan',
      description: 'Navega por nuestra tienda y encuentra los productos que más te gusten. Puedes filtrar por categoría, género, precio y más.',
      color: 'bg-blue-500'
    },
    {
      number: 2,
      icon: FiCamera,
      title: 'Toma un screenshot',
      description: 'Captura una imagen de los productos que deseas comprar. Puedes incluir varios artículos en tu pedido.',
      color: 'bg-purple-500'
    },
    {
      number: 3,
      icon: FiMessageCircle,
      title: 'Envíanos tu pedido por WhatsApp',
      description: 'Comparte el screenshot con nosotros a través de WhatsApp. Incluye tu nombre, dirección de envío y cualquier detalle adicional.',
      color: 'bg-green-500'
    },
    {
      number: 4,
      icon: FiPackage,
      title: 'Recibe tu pedido',
      description: 'Procesamos tu pedido y te enviamos la confirmación. Realizamos envíos nacionales e internacionales.',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black text-black mb-4">
            CÓMO COMPRAR
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Proceso simple y rápido para realizar tu pedido
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  {/* Icon & Number */}
                  <div className="flex-shrink-0">
                    <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center text-white relative`}>
                      <Icon className="w-10 h-10" />
                      <div className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-black mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex items-center justify-center text-gray-300">
                      <FiArrowRight className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-center text-white shadow-lg"
        >
          <FaWhatsapp className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">¿Listo para hacer tu pedido?</h2>
          <p className="text-lg mb-6 text-green-50">
            Contáctanos por WhatsApp y te ayudaremos con todo el proceso
          </p>
          <a
            href="https://wa.link/l8vc70"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <FaWhatsapp className="w-6 h-6" />
            <span>Contactar por WhatsApp</span>
          </a>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <FiPackage className="w-10 h-10 text-black mx-auto mb-3" />
            <h4 className="font-bold text-black mb-2">Envíos Nacionales</h4>
            <p className="text-sm text-gray-600">
              Entregamos en toda la República Dominicana
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <FiCheckCircle className="w-10 h-10 text-black mx-auto mb-3" />
            <h4 className="font-bold text-black mb-2">Envíos Internacionales</h4>
            <p className="text-sm text-gray-600">
              Realizamos envíos a todo el mundo
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <FiMessageCircle className="w-10 h-10 text-black mx-auto mb-3" />
            <h4 className="font-bold text-black mb-2">Atención Personalizada</h4>
            <p className="text-sm text-gray-600">
              Te ayudamos en cada paso del proceso
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Envios;

