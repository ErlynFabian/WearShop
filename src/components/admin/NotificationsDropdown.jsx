import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiX, FiCheck, FiPackage, FiDollarSign, FiAlertTriangle, FiShoppingCart, FiInfo, FiMail, FiFolder } from 'react-icons/fi';
import { notificationsService } from '../../services/notificationsService';
import { supabase } from '../../lib/supabase';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true); // Asumir que existe inicialmente
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    
    // Suscripción en tiempo real a cambios en la tabla de notificaciones
    if (tableExists) {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (isSupabaseConfigured) {
        const channel = supabase
          .channel('notifications-changes')
          .on(
            'postgres_changes',
            {
              event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: 'notifications'
            },
            (payload) => {
              console.log('Notification change received:', payload);
              // Recargar notificaciones cuando hay un cambio
              loadNotifications();
            }
          )
          .subscribe();

        // Actualizar periódicamente para asegurar sincronización
        const interval = setInterval(() => {
          loadNotifications();
        }, 5000); // Actualizar cada 5 segundos

        // Limpiar suscripción y intervalo al desmontar
        return () => {
          supabase.removeChannel(channel);
          clearInterval(interval);
        };
      }
    }
  }, [tableExists]);

  // Escuchar eventos personalizados cuando se marca una notificación como leída
  useEffect(() => {
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    // Escuchar evento personalizado
    window.addEventListener('notification-updated', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notification-updated', handleNotificationUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    // Si ya sabemos que la tabla no existe, no intentar cargar
    if (!tableExists) {
      setLoading(false);
      return;
    }

    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const unread = await notificationsService.getUnread();
        const count = await notificationsService.getUnreadCount();
        
        // Eliminar duplicados basándose en el ID
        const uniqueNotifications = unread.filter((notification, index, self) =>
          index === self.findIndex((n) => n.id === notification.id)
        );
        
        setNotifications(uniqueNotifications.slice(0, 10)); // Mostrar solo las 10 más recientes
        setUnreadCount(count);
        setTableExists(true); // Confirmar que la tabla existe
      } catch (error) {
        // Detectar si la tabla no existe (404, PGRST116, PGRST205)
        const isTableNotFound = 
          error.code === 'PGRST116' || 
          error.code === 'PGRST205' ||
          error.message?.includes('404') ||
          error.message?.includes('not found') ||
          error.message?.includes('Could not find the table');
        
        if (isTableNotFound) {
          // La tabla no existe, marcar como tal y no intentar más
          setTableExists(false);
          setNotifications([]);
          setUnreadCount(0);
          // No mostrar error en consola, es esperado si la tabla no está creada
        } else {
          // Otro tipo de error, loguear solo una vez
          console.error('Error loading notifications:', error);
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    } catch (error) {
      // Error general, no mostrar en consola si es sobre la tabla
      const isTableNotFound = 
        error.code === 'PGRST116' || 
        error.code === 'PGRST205' ||
        error.message?.includes('404') ||
        error.message?.includes('not found');
      
      if (!isTableNotFound) {
        console.error('Error loading notifications:', error);
      }
      
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await notificationsService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await notificationsService.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'sale_pending':
        return <FiDollarSign className="w-5 h-5 text-yellow-600" />;
      case 'sale_completed':
        return <FiDollarSign className="w-5 h-5 text-green-600" />;
      case 'low_stock':
        return <FiAlertTriangle className="w-5 h-5 text-red-600" />;
      case 'new_order':
        return <FiShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'product_created':
      case 'product_updated':
      case 'product_deleted':
      case 'product_featured':
      case 'product_on_sale':
        return <FiPackage className="w-5 h-5 text-blue-600" />;
      case 'category_created':
      case 'category_updated':
      case 'category_deleted':
        return <FiFolder className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <FiInfo className="w-5 h-5 text-gray-600" />;
      case 'contact_message':
        return <FiMail className="w-5 h-5 text-blue-600" />;
      default:
        return <FiBell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'sale_pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'sale_completed':
        return 'bg-green-50 border-green-200';
      case 'low_stock':
        return 'bg-red-50 border-red-200';
      case 'new_order':
        return 'bg-blue-50 border-blue-200';
      case 'product_created':
      case 'product_updated':
        return 'bg-blue-50 border-blue-200';
      case 'product_deleted':
        return 'bg-red-50 border-red-200';
      case 'product_featured':
        return 'bg-yellow-50 border-yellow-200';
      case 'product_on_sale':
        return 'bg-orange-50 border-orange-200';
      case 'category_created':
      case 'category_updated':
        return 'bg-purple-50 border-purple-200';
      case 'category_deleted':
        return 'bg-red-50 border-red-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      case 'contact_message':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-black hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4">
                <NotificationSkeleton count={3} />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <FiBell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No hay notificaciones nuevas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link || '#'}
                    onClick={() => setIsOpen(false)}
                    className={`block p-4 hover:opacity-90 transition-opacity border-l-4 ${getNotificationColor(notification.type)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notificationsService.formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-white transition-colors"
                          title="Marcar como leída"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Link
                to="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;

