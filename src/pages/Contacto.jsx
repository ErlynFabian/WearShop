import { motion } from 'framer-motion';
import { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-black mb-4"
        >
          CONTACTO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-16"
        >
          Estamos aquí para ayudarte
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </motion.div>

          {/* Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">Información de contacto</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Dirección:</strong><br />
                  Calle Principal 123<br />
                  Ciudad, País 12345
                </p>
                <p>
                  <strong>Teléfono:</strong><br />
                  +1 (829) 965-7361
                </p>
                <p>
                  <strong>Email:</strong><br />
                  contacto@wearshop.com
                </p>
              </div>
            </div>

            {/* Static Map */}
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Mapa interactivo</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;

