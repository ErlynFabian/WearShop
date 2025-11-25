import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiCheck, FiTrash2, FiFilter, FiUser, FiClock, FiEye, FiEyeOff, FiX, FiAtSign, FiMessageSquare, FiCalendar, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { contactService } from '../../services/contactService';
import { supabase } from '../../lib/supabase';
import AlertModal from '../../components/admin/AlertModal';
import ConfirmModal from '../../components/admin/ConfirmModal';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, messageId: null });
  const modalRef = useRef(null);

  useEffect(() => {
    loadMessages();

    // Suscripción en tiempo real
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('contact-messages-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contact_messages'
          },
          () => {
            loadMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const all = await contactService.getAll();
      setMessages(all);
    } catch (error) {
      console.error('Error loading messages:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al cargar los mensajes de contacto',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al marcar el mensaje como leído',
        type: 'error'
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter(m => !m.read);
      await Promise.all(unreadMessages.map(msg => contactService.markAsRead(msg.id)));
      loadMessages();
    } catch (error) {
      console.error('Error marking all as read:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al marcar todos los mensajes como leídos',
        type: 'error'
      });
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, messageId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = confirmModal.messageId;
    if (!id) return;

    try {
      await contactService.delete(id);
      loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al eliminar el mensaje',
        type: 'error'
      });
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace unos segundos';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.read;
    if (filter === 'read') return message.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedMessage(null);
      }
    };

    if (selectedMessage) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMessage]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && selectedMessage) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedMessage]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Lista de mensajes */}
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2 break-words">CONTACTO</h2>
            <p className="text-sm sm:text-base text-gray-600">Gestiona los mensajes recibidos desde el formulario de contacto</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center justify-center space-x-2 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
            >
              <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Marcar todos como leídos</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1 sm:mb-2">Total de Mensajes</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-black">{messages.length}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1 sm:mb-2">No Leídos</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-600">{unreadCount}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1 sm:mb-2">Leídos</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-green-600">{messages.length - unreadCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 sm:mb-6 flex items-center space-x-2">
          <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">Todos</option>
            <option value="unread">No leídos</option>
            <option value="read">Leídos</option>
          </select>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-8 sm:p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
              <FiMail className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-base sm:text-lg">No hay mensajes</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                {filter !== 'all' 
                  ? 'Intenta cambiar el filtro' 
                  : 'Los mensajes de contacto aparecerán aquí'}
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto divide-y divide-gray-200 max-h-[calc(100vh-20rem)] sm:max-h-[calc(100vh-24rem)]">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                    message.read 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <h3 className={`text-base sm:text-lg font-bold truncate ${message.read ? 'text-gray-700' : 'text-black'}`}>
                          {message.name}
                        </h3>
                        {!message.read && (
                          <span className="px-2 py-0.5 sm:py-1 text-xs font-medium bg-blue-500 text-white rounded-full whitespace-nowrap">
                            Nuevo
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate mb-1">{message.phone || message.email}</p>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">{message.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatTimeAgo(message.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      {!message.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(message.id);
                          }}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marcar como leído"
                        >
                          <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(message.id);
                        }}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      <AnimatePresence>
        {selectedMessage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            >
              {/* Modal */}
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col w-full max-w-2xl max-h-[calc(100vh-1rem)] sm:max-h-[90vh] mx-2 sm:mx-4"
              >
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-lg flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-black text-black break-words pr-2">Detalles del Mensaje</h3>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title="Cerrar (ESC)"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {selectedMessage.read ? (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <FiEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                        Leído
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <FiEyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                        No leído
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center">
                      <FiClock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                      {formatTimeAgo(selectedMessage.created_at)}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 min-h-0">
                  {/* Nombre */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiUser className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</label>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-black break-words">{selectedMessage.name}</p>
                  </div>

                  {/* Teléfono */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiPhone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`tel:${selectedMessage.phone || selectedMessage.email}`}
                        className="text-sm sm:text-base text-blue-600 hover:text-blue-700 hover:underline font-medium break-all"
                      >
                        {selectedMessage.phone || selectedMessage.email}
                      </a>
                      {(selectedMessage.phone || selectedMessage.email) && (
                        <a
                          href={`https://wa.me/1${(selectedMessage.phone || selectedMessage.email).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
                          title="Abrir WhatsApp"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</label>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium break-words">{formatDate(selectedMessage.created_at)}</p>
                  </div>

                  {/* Mensaje */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiMessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mensaje</label>
                    </div>
                    <div className="bg-white rounded-md p-3 sm:p-4 border border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 bg-gray-50 rounded-b-lg space-y-3 flex-shrink-0">
                  {!selectedMessage.read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="w-full flex items-center justify-center space-x-2 bg-black text-white px-4 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-sm text-sm sm:text-base"
                    >
                      <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Marcar como leído</span>
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <a
                      href={`https://wa.me/1${(selectedMessage.phone || selectedMessage.email || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 sm:space-x-2 bg-green-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm text-xs sm:text-sm whitespace-nowrap"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">Contactar por WhatsApp</span>
                    </a>
                    <button
                      onClick={() => handleDeleteClick(selectedMessage.id)}
                      className="flex items-center justify-center space-x-1.5 sm:space-x-2 bg-red-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm text-xs sm:text-sm whitespace-nowrap"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, messageId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar mensaje"
        message="¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
};

export default ContactMessages;

