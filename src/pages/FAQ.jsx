import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiPackage, FiTruck, FiCreditCard, FiRefreshCw, FiShield, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      title: 'Pedidos y Compras',
      icon: FiPackage,
      questions: [
        {
          question: '¿Cómo puedo realizar un pedido?',
          answer: 'Para realizar un pedido, sigue estos pasos:\n1. Navega por nuestra tienda y encuentra los productos que te gustan\n2. Toma una captura de pantalla (screenshot) de los productos que deseas\n3. Envíanos las imágenes por WhatsApp con tu información de contacto\n4. Te responderemos con la disponibilidad y el precio total\n5. Una vez confirmado, procederás con el pago y te enviaremos tu pedido'
        },
        {
          question: '¿Qué métodos de pago aceptan?',
          answer: 'Aceptamos diferentes métodos de pago:\n• Transferencia bancaria\n• Depósito bancario\n• Efectivo (solo entregas locales)\n• Tarjetas de crédito/débito (según disponibilidad)\n\nPara más información sobre métodos de pago, contáctanos por WhatsApp.'
        },
        {
          question: '¿Puedo modificar o cancelar mi pedido?',
          answer: 'Sí, puedes modificar o cancelar tu pedido siempre que no haya sido enviado. Contacta con nosotros lo antes posible por WhatsApp para realizar cualquier cambio. Si el pedido ya fue enviado, deberás seguir el proceso de devolución una vez recibido.'
        },
        {
          question: '¿Cuánto tiempo tarda en procesarse mi pedido?',
          answer: 'Una vez confirmado el pago, tu pedido será procesado en un plazo de 1-3 días hábiles. Te notificaremos cuando tu pedido haya sido enviado con el número de seguimiento correspondiente.'
        }
      ]
    },
    {
      title: 'Envíos y Entregas',
      icon: FiTruck,
      questions: [
        {
          question: '¿Hacen envíos nacionales e internacionales?',
          answer: 'Sí, realizamos envíos tanto a nivel nacional como internacional. Los tiempos y costos de envío varían según la ubicación. Para conocer los costos exactos de envío a tu destino, contáctanos por WhatsApp con tu dirección completa.'
        },
        {
          question: '¿Cuánto tiempo tarda en llegar mi pedido?',
          answer: 'Los tiempos de entrega dependen de tu ubicación:\n• Envíos nacionales: 3-7 días hábiles\n• Envíos internacionales: 7-21 días hábiles\n\nEstos tiempos son aproximados y pueden variar según la empresa de envío y las condiciones aduaneras (para envíos internacionales).'
        },
        {
          question: '¿Cómo puedo rastrear mi pedido?',
          answer: 'Una vez que tu pedido sea enviado, recibirás un número de seguimiento por WhatsApp o email. Puedes usar este número para rastrear tu pedido en la página web de la empresa de envío correspondiente.'
        },
        {
          question: '¿Cuál es el costo de envío?',
          answer: 'El costo de envío varía según el destino, peso y dimensiones del paquete. Para conocer el costo exacto de envío, contáctanos por WhatsApp con los productos que deseas y tu dirección de entrega. Te proporcionaremos un presupuesto detallado.'
        }
      ]
    },
    {
      title: 'Devoluciones y Reembolsos',
      icon: FiRefreshCw,
      questions: [
        {
          question: '¿Puedo devolver un producto?',
          answer: 'Sí, aceptamos devoluciones dentro de los 30 días posteriores a la recepción del pedido. El producto debe estar en su estado original, sin usar, con todas las etiquetas y embalaje original. Para iniciar una devolución, contáctanos por WhatsApp o email.'
        },
        {
          question: '¿Quién paga el costo de envío de la devolución?',
          answer: 'Los costos de envío de devolución corren por cuenta del cliente, excepto en casos de:\n• Producto defectuoso o incorrecto enviado por error\n• Producto dañado durante el envío\n• Error en el pedido por parte de WearShop\n\nEn estos casos, los costos corren por nuestra cuenta.'
        },
        {
          question: '¿Cuánto tiempo tarda el reembolso?',
          answer: 'Una vez recibido y verificado el producto devuelto, procesaremos tu reembolso en un plazo de 5-10 días hábiles. El reembolso se realizará utilizando el mismo método de pago utilizado para la compra original.'
        },
        {
          question: '¿Qué productos no se pueden devolver?',
          answer: 'No se aceptan devoluciones para:\n• Productos personalizados o hechos a medida\n• Productos de higiene íntima\n• Productos que hayan sido usados o dañados por el cliente\n• Productos sin el embalaje original'
        }
      ]
    },
    {
      title: 'Tallas y Medidas',
      icon: FiHelpCircle,
      questions: [
        {
          question: '¿Cómo sé qué talla elegir?',
          answer: 'Te recomendamos usar nuestra Calculadora de Tallas disponible en el menú. Allí encontrarás tablas de medidas detalladas para diferentes tipos de prendas. Si tienes dudas, contáctanos por WhatsApp y te ayudaremos a elegir la talla correcta.'
        },
        {
          question: '¿Las tallas son estándar?',
          answer: 'Las tallas pueden variar ligeramente según el fabricante y el tipo de prenda. Por eso recomendamos revisar nuestras tablas de medidas en la Calculadora de Tallas. Si estás entre dos tallas, te recomendamos elegir la talla más grande para mayor comodidad.'
        },
        {
          question: '¿Puedo cambiar la talla de un producto?',
          answer: 'Actualmente no ofrecemos cambios directos. Si necesitas una talla diferente, puedes devolver el producto original siguiendo nuestro proceso de devolución y realizar un nuevo pedido con la talla correcta.'
        }
      ]
    },
    {
      title: 'Productos y Calidad',
      icon: FiShield,
      questions: [
        {
          question: '¿Los productos son originales?',
          answer: 'Sí, todos nuestros productos son 100% originales y auténticos. Trabajamos directamente con proveedores autorizados para garantizar la calidad y autenticidad de cada artículo.'
        },
        {
          question: '¿Qué hago si recibo un producto defectuoso?',
          answer: 'Si recibes un producto defectuoso, contáctanos dentro de las 48 horas posteriores a la recepción. Proporciona fotografías del defecto y te enviaremos un producto de reemplazo o procesaremos un reembolso completo. Los costos de envío corren por nuestra cuenta.'
        },
        {
          question: '¿Los colores en la web son exactos?',
          answer: 'Hacemos nuestro mejor esfuerzo para mostrar los colores con la mayor precisión posible. Sin embargo, los colores pueden variar ligeramente debido a la configuración de tu pantalla. Si tienes dudas sobre un color específico, contáctanos y te proporcionaremos más información o fotografías adicionales.'
        }
      ]
    },
    {
      title: 'Contacto y Soporte',
      icon: FiMail,
      questions: [
        {
          question: '¿Cómo puedo contactarlos?',
          answer: 'Puedes contactarnos de las siguientes formas:\n• WhatsApp: +1 (829) 965-7361\n• Email: contacto@wearshop.com\n• Formulario de contacto en nuestra web\n• Redes sociales: Instagram y TikTok\n\nNuestro horario de atención es de lunes a sábado de 9:00 AM a 6:00 PM (hora de República Dominicana).'
        },
        {
          question: '¿Cuál es el tiempo de respuesta?',
          answer: 'Nos esforzamos por responder todas las consultas en un plazo máximo de 24 horas. Para consultas urgentes, te recomendamos contactarnos por WhatsApp para una respuesta más rápida.'
        },
        {
          question: '¿Ofrecen atención al cliente en otros idiomas?',
          answer: 'Actualmente ofrecemos atención al cliente principalmente en español. Si necesitas asistencia en otro idioma, contáctanos y haremos nuestro mejor esfuerzo para ayudarte.'
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3">
            <FiHelpCircle className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black break-words">
              Preguntas Frecuentes
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Encuentra respuestas a las preguntas más comunes sobre nuestros productos, envíos y servicios
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-black">{category.title}</h2>
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-200">
                  {category.questions.map((item, questionIndex) => {
                    const globalIndex = categoryIndex * 100 + questionIndex;
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <div key={questionIndex} className="border-b border-gray-100 last:border-b-0">
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-base sm:text-lg font-semibold text-black pr-4 flex-1">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 sm:p-8 border border-yellow-200"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 text-center">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-sm sm:text-base text-gray-700 text-center mb-6">
            Estamos aquí para ayudarte. Contáctanos y responderemos todas tus dudas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.link/l8vc70"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>Contactar por WhatsApp</span>
            </a>
            <a
              href="/contacto"
              className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              <FiMail className="w-5 h-5" />
              <span>Enviar Email</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

