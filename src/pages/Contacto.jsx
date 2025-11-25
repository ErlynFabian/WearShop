import { motion } from 'framer-motion';
import { useState } from 'react';
import { contactService } from '../services/contactService';

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Validar número de teléfono de República Dominicana
  const validatePhoneRD = (phone) => {
    // Eliminar espacios, guiones, paréntesis y otros caracteres
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Verificar que solo contenga números
    if (!/^\d+$/.test(cleaned)) {
      return { valid: false, message: 'El número solo debe contener dígitos' };
    }

    // Verificar longitud (puede ser 10 dígitos o 11 con el +1)
    let phoneNumber = cleaned;
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      phoneNumber = cleaned.substring(1);
    } else if (cleaned.length !== 10) {
      return { valid: false, message: 'El número debe tener 10 dígitos' };
    }

    // Verificar código de área de RD (809, 829, 849)
    const areaCode = phoneNumber.substring(0, 3);
    if (!['809', '829', '849'].includes(areaCode)) {
      return { valid: false, message: 'Debe ser un número de República Dominicana (809, 829 o 849)' };
    }

    return { valid: true, phone: phoneNumber };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);
    setErrorMessage('');
    setPhoneError('');

    // Validar teléfono
    const phoneValidation = validatePhoneRD(formData.phone);
    if (!phoneValidation.valid) {
      setPhoneError(phoneValidation.message);
      setIsLoading(false);
      return;
    }

    try {
      // Formatear el teléfono antes de enviar
      const formattedPhone = phoneValidation.phone;
      await contactService.create({
        ...formData,
        phone: formattedPhone
      });
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', message: '' });
      
      // Limpiar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error.message || 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Si es el campo de teléfono, solo permitir números, espacios, guiones y paréntesis
    if (e.target.name === 'phone') {
      // Eliminar cualquier carácter que no sea número, espacio, guión o paréntesis
      value = value.replace(/[^0-9\s\-\(\)]/g, '');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    
    // Limpiar mensajes de error cuando el usuario empiece a escribir
    if (submitStatus === 'error') {
      setSubmitStatus(null);
      setErrorMessage('');
    }
    
    // Limpiar error de teléfono cuando el usuario escriba
    if (e.target.name === 'phone' && phoneError) {
      setPhoneError('');
    }
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
              {/* Mensaje de éxito */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded"
                >
                  <p className="font-medium">¡Mensaje enviado exitosamente!</p>
                  <p className="text-sm mt-1">Te contactaremos pronto.</p>
                </motion.div>
              )}

              {/* Mensaje de error */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
                >
                  <p className="font-medium">Error al enviar mensaje</p>
                  <p className="text-sm mt-1">{errorMessage}</p>
                </motion.div>
              )}

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
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Número de Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(809) 123-4567"
                  required
                  disabled={isLoading}
                  pattern="[0-9\s\-\(\)]+"
                  inputMode="numeric"
                  className={`w-full px-4 py-3 border ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
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
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Enviar mensaje'
                )}
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
                  San Isidro,<br />
                  Santo Domingo Este
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

            {/* Interactive Map */}
            <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <iframe
                src={`https://www.google.com/maps?q=18.5043633,-69.7927678&hl=es&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de WearShop"
              />
            </div>
            <div className="mt-2">
              <a
                href="https://maps.app.goo.gl/neA3DWLTRpSLqYKM6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;

