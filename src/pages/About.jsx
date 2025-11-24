import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTrendingUp, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const About = () => {
  const values = [
    {
      icon: FiTrendingUp,
      title: 'Innovación',
      description: 'Siempre a la vanguardia de las últimas tendencias de moda'
    },
    {
      icon: FiUsers,
      title: 'Cliente Primero',
      description: 'Tu satisfacción es nuestra prioridad número uno'
    },
    {
      icon: FiAward,
      title: 'Calidad',
      description: 'Productos seleccionados con los más altos estándares'
    },
    {
      icon: FiHeart,
      title: 'Pasión',
      description: 'Amamos lo que hacemos y se refleja en cada detalle'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
          SOBRE NOSOTROS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-16 max-w-3xl"
        >
          Tu destino para el estilo y la moda. Calidad premium, diseño innovador.
        </motion.p>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black text-black mb-6">Nuestra Historia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-gray-700">
              <p>
                WearShop nació de la pasión por la moda y el deseo de ofrecer productos de alta calidad que reflejen tu personalidad única. Fundada con la visión de hacer la moda accesible sin comprometer la calidad, nos hemos convertido en un referente en el mercado de la moda.
              </p>
              <p>
                Nuestro compromiso es ofrecerte una experiencia de compra excepcional, con productos cuidadosamente seleccionados que combinan estilo, calidad y precio justo.
              </p>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Trabajamos directamente con proveedores de confianza para asegurar que cada producto cumpla con nuestros estándares de excelencia. Desde ropa casual hasta piezas de alta gama, en WearShop encontrarás todo lo que necesitas para expresar tu estilo.
              </p>
              <p>
                Creemos que la moda es una forma de expresión personal, y estamos aquí para ayudarte a encontrar las piezas perfectas que te hagan sentir confiado y auténtico.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black text-black mb-12 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
        >
          <div>
            <h2 className="text-4xl font-black text-black mb-6">Nuestra Misión</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Ofrecer productos de moda de alta calidad que permitan a nuestros clientes expresar su personalidad única, mientras brindamos una experiencia de compra excepcional y un servicio al cliente de primera clase.
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-black text-black mb-6">Nuestra Visión</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Ser la tienda de moda de referencia en República Dominicana, reconocida por nuestra calidad, innovación y compromiso con la satisfacción del cliente, expandiendo nuestra presencia y llevando estilo a más personas.
            </p>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 p-12 rounded-lg"
        >
          <h2 className="text-4xl font-black text-black mb-6 text-center">¿Tienes Preguntas?</h2>
          <p className="text-gray-700 text-center mb-8 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. No dudes en contactarnos si tienes alguna pregunta, sugerencia o simplemente quieres saber más sobre nosotros.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              to="/contacto"
              className="bg-black text-white px-8 py-4 font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Contáctanos
            </Link>
            <a
              href="https://wa.link/l8vc70"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 font-bold text-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;

