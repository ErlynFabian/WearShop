import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiPhone, FiMail, FiPackage, FiHelpCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Chatbot = () => {
  const location = useLocation();
  
  // Ocultar chatbot en rutas de admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 Soy el asistente virtual de WearShop. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el chatbot está abierto
      document.body.style.overflow = 'hidden';
      // Hacer scroll al final cuando se abre el chat
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      // Enfocar el input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      // Restaurar scroll del body cuando se cierra el chatbot
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const quickQuestions = [
    { text: '📧 Correo', value: 'correo' },
    { text: '📱 Teléfono', value: 'telefono' },
    { text: '🛒 Pedidos', value: 'pedido' },
    { text: '📦 Envíos', value: 'envios' },
    { text: '❓ Ayuda', value: 'ayuda' }
  ];

  const responses = {
    correo: {
      text: '📧 Nuestro correo electrónico es:\n\ncontacto@wearshop.com\n\nPuedes escribirnos para cualquier consulta o pedido.',
      quickReplies: [
        { text: '📱 Ver WhatsApp', value: 'whatsapp' },
        { text: '🛒 Cómo pedir', value: 'pedido' }
      ]
    },
    telefono: {
      text: '📱 Nuestro número de teléfono es:\n\n+1 (829) 965-7361\n\nTambién puedes contactarnos por WhatsApp haciendo clic en el botón de abajo 👇',
      quickReplies: [
        { text: '💬 Abrir WhatsApp', value: 'whatsapp' },
        { text: '📧 Ver correo', value: 'correo' }
      ]
    },
    whatsapp: {
      text: '💬 Redirigiendo a WhatsApp...',
      action: 'https://wa.link/l8vc70',
      autoAction: true,
      quickReplies: [
        { text: '📧 Ver correo', value: 'correo' },
        { text: '🛒 Cómo pedir', value: 'pedido' }
      ]
    },
    pedido: {
      text: '🛒 Para hacer un pedido sigue estos pasos:\n\n1️⃣ Busca los artículos que te gusten en nuestra tienda\n2️⃣ Toma un screenshot de los productos\n3️⃣ Envíanos el screenshot por WhatsApp\n4️⃣ Incluye tu nombre, dirección y detalles del pedido\n\n¡Es muy fácil! 🎉',
      quickReplies: [
        { text: '💬 Abrir WhatsApp', value: 'whatsapp' },
        { text: '📦 Ver envíos', value: 'envios' },
        { text: '📄 Ver página de envíos', value: 'pagina_envios' }
      ]
    },
    envios: {
      text: '📦 Realizamos envíos:\n\n✅ Nacionales: A toda la República Dominicana\n✅ Internacionales: A todo el mundo\n\n✈️ Envíos Nacionales e Internacionales disponibles',
      quickReplies: [
        { text: '🛒 Cómo pedir', value: 'pedido' },
        { text: '📄 Ver más información', value: 'pagina_envios' }
      ]
    },
    pagina_envios: {
      text: '📄 Redirigiendo a la página de envíos...',
      action: '/envios',
      autoAction: true,
      quickReplies: [
        { text: '🛒 Cómo pedir', value: 'pedido' },
        { text: '📧 Contacto', value: 'correo' }
      ]
    },
    ayuda: {
      text: '❓ Estoy aquí para ayudarte con:\n\n• Información de contacto\n• Cómo hacer pedidos\n• Información de envíos\n• Consultas generales\n\n¿Qué te gustaría saber?',
      quickReplies: [
        { text: '📧 Correo', value: 'correo' },
        { text: '📱 Teléfono', value: 'telefono' },
        { text: '🛒 Cómo pedir', value: 'pedido' }
      ]
    },
    default: {
      text: 'Lo siento, no entendí tu pregunta. 😅\n\nPuedes seleccionar una de las opciones rápidas o preguntarme sobre:\n\n• Correo electrónico\n• Número de teléfono\n• Cómo hacer un pedido\n• Información de envíos',
      quickReplies: quickQuestions
    }
  };

  const handleSendMessage = (text, value = null) => {
    if (!text && !value) return;

    const userMessage = {
      id: messages.length + 1,
      text: text || quickQuestions.find(q => q.value === value)?.text || value,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simular respuesta del bot después de un breve delay
    setTimeout(() => {
      const query = value || text.toLowerCase().trim();
      let response = responses.default;

      if (value) {
        response = responses[value] || responses.default;
      } else {
        // Normalizar el texto: eliminar acentos y caracteres especiales
        const normalizedQuery = query
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

        // Reconocimiento de saludos
        const saludos = ['hola', 'hi', 'hello', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'que tal', 'qué tal'];
        if (saludos.some(saludo => normalizedQuery.includes(saludo))) {
          response = {
            text: '¡Hola! 👋 ¡Qué gusto saludarte!\n\n¿En qué puedo ayudarte hoy? Puedo ayudarte con:\n\n• Información de contacto\n• Cómo hacer pedidos\n• Información de envíos\n• Cualquier otra consulta',
            quickReplies: quickQuestions
          };
        }
        // Correo electrónico
        else if (normalizedQuery.match(/\b(correo|email|mail|e-mail|correo electronico|correo electrónico)\b/)) {
          response = responses.correo;
        }
        // Teléfono / WhatsApp
        else if (normalizedQuery.match(/\b(telefono|teléfono|numero|número|whatsapp|wa|contacto|llamar|llamada|celular|movil|móvil)\b/)) {
          response = responses.telefono;
        }
        // Pedidos / Comprar
        else if (normalizedQuery.match(/\b(pedir|pedido|comprar|compra|orden|ordenar|como comprar|cómo comprar|quiero comprar|necesito|producto|productos)\b/)) {
          response = responses.pedido;
        }
        // Envíos
        else if (normalizedQuery.match(/\b(envio|envío|envios|envíos|entrega|entregas|shipping|cuanto tarda|cuánto tarda|tiempo de entrega|domicilio)\b/)) {
          response = responses.envios;
        }
        // Ayuda / Información general
        else if (normalizedQuery.match(/\b(ayuda|help|informacion|información|info|pregunta|consultar|consulta|saber|necesito saber|quiero saber)\b/)) {
          response = responses.ayuda;
        }
        // Despedidas
        else if (normalizedQuery.match(/\b(adios|adiós|bye|chao|chau|gracias|thank|thanks|hasta luego|nos vemos)\b/)) {
          response = {
            text: '¡De nada! 😊\n\nSi necesitas algo más, no dudes en preguntarme. ¡Estoy aquí para ayudarte!',
            quickReplies: quickQuestions
          };
        }
      }

      const botMessage = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: response.quickReplies,
        action: response.action,
        autoAction: response.autoAction
      };

      setMessages(prev => [...prev, botMessage]);

      // Ejecutar acción automáticamente si está configurada
      if (response.autoAction && response.action) {
        setTimeout(() => {
          handleAction(response.action);
        }, 1000);
      }
    }, 500);
  };

  const handleQuickReply = (value) => {
    handleSendMessage(null, value);
  };

  const handleAction = (action) => {
    if (action.startsWith('http')) {
      // Para móvil, usar window.location.href funciona mejor, especialmente para WhatsApp
      // Para desktop, también funciona bien
      window.location.href = action;
    } else if (action.startsWith('/')) {
      window.location.href = action;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es-DO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-all hover:scale-110"
            aria-label="Abrir chat"
          >
            <FiMessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 h-[500px] max-h-[calc(100vh-2rem)] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">WearShop</h3>
                  <p className="text-xs text-green-50">Asistente virtual</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Cerrar chat"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.action && !message.autoAction && (
                      <button
                        onClick={() => handleAction(message.action)}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors w-full"
                      >
                        {message.action.startsWith('http') ? (
                          <>
                            <FaWhatsapp className="inline w-4 h-4 mr-2" />
                            Abrir WhatsApp
                          </>
                        ) : (
                          'Ver más información'
                        )}
                      </button>
                    )}
                    {message.quickReplies && (
                      <div className="mt-3 space-y-2">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply.value)}
                            className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                          >
                            {reply.text}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (solo al inicio) */}
            {messages.length === 1 && (
              <div className="px-3 py-2 bg-white border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1.5">Preguntas rápidas:</p>
                <div className="flex gap-1.5 justify-between">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(question.value)}
                      className="flex-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors whitespace-nowrap text-center"
                    >
                      {question.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  aria-label="Enviar mensaje"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

