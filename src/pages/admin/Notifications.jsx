import { useState, useEffect } from 'react';
import NotificationSkeleton from '../../components/skeletons/NotificationSkeleton';
import { Link } from 'react-router-dom';
import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiFilter, FiPackage, FiDollarSign, FiAlertTriangle, FiShoppingCart, FiInfo, FiMail, FiFolder } from 'react-icons/fi';
import { notificationsService } from '../../services/notificationsService';
import { supabase } from '../../lib/supabase';
import AlertModal from '../../components/admin/AlertModal';
import ConfirmModal from '../../components/admin/ConfirmModal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, sale_pending, sale_completed, low_stock, system
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, notificationId: null });

  useEffect(() => {
    loadNotifications();

    // Suscripción en tiempo real
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('notifications-page-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications'
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (isSupabaseConfigured) {
        const all = await notificationsService.getAll();
        setNotifications(all);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al cargar las notificaciones',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    // Actualizar el estado local inmediatamente para feedback instantáneo
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );

    try {
      await notificationsService.markAsRead(id);
      // Recargar para asegurar sincronización con el servidor
      loadNotifications();
      // Disparar evento personalizado para actualizar el badge en el navbar
      window.dispatchEvent(new CustomEvent('notification-updated'));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revertir el cambio si hay error
      loadNotifications();
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al marcar la notificación como leída',
        type: 'error'
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    // Actualizar el estado local inmediatamente para feedback instantáneo
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );

    try {
      await notificationsService.markAllAsRead();
      // Recargar para asegurar sincronización con el servidor
      loadNotifications();
      // Disparar evento personalizado para actualizar el badge en el navbar
      window.dispatchEvent(new CustomEvent('notification-updated'));
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Revertir el cambio si hay error
      loadNotifications();
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al marcar todas las notificaciones como leídas',
        type: 'error'
      });
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, notificationId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = confirmModal.notificationId;
    if (!id) return;

    try {
      await notificationsService.delete(id);
      loadNotifications();
      // Disparar evento personalizado para actualizar el badge en el navbar
      window.dispatchEvent(new CustomEvent('notification-updated'));
      setConfirmModal({ isOpen: false, notificationId: null });
    } catch (error) {
      console.error('Error deleting notification:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al eliminar la notificación',
        type: 'error'
      });
      setConfirmModal({ isOpen: false, notificationId: null });
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'sale_pending':
        return 'Venta Pendiente';
      case 'sale_completed':
        return 'Venta Completada';
      case 'low_stock':
        return 'Stock Bajo';
      case 'new_order':
        return 'Nuevo Pedido';
      case 'product_created':
        return 'Producto Creado';
      case 'product_updated':
        return 'Producto Actualizado';
      case 'product_deleted':
        return 'Producto Eliminado';
      case 'product_featured':
        return 'Producto Destacado';
      case 'product_on_sale':
        return 'Producto en Oferta';
      case 'category_created':
        return 'Categoría Creada';
      case 'category_updated':
        return 'Categoría Actualizada';
      case 'category_deleted':
        return 'Categoría Eliminada';
      case 'system':
        return 'Sistema';
      case 'contact_message':
        return 'Mensaje de Contacto';
      default:
        return type;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesFilter && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-12 bg-gray-200 rounded w-48 mb-2 animate-pulse-fast" />
            <div className="h-5 bg-gray-200 rounded w-64 animate-pulse-fast" />
          </div>
        </div>
        <NotificationSkeleton count={8} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2 break-words">Notificaciones</h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona todas tus notificaciones</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center justify-center space-x-2 bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
          >
            <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Marcar todas como leídas</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1 sm:mb-2">Total de Notificaciones</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-black">{notifications.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1 sm:mb-2">No Leídas</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-600">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1 sm:mb-2">Leídas</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-green-600">{notifications.length - unreadCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-row gap-2 sm:gap-4">
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">Todas</option>
            <option value="unread">No leídas</option>
            <option value="read">Leídas</option>
          </select>
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex-1 sm:flex-none px-2 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base"
        >
          <option value="all">Todos los tipos</option>
          <option value="sale_pending">Ventas Pendientes</option>
          <option value="sale_completed">Ventas Completadas</option>
          <option value="product_created">Productos Creados</option>
          <option value="product_updated">Productos Actualizados</option>
          <option value="product_deleted">Productos Eliminados</option>
          <option value="product_featured">Productos Destacados</option>
          <option value="product_on_sale">Productos en Oferta</option>
          <option value="category_created">Categorías Creadas</option>
          <option value="category_updated">Categorías Actualizadas</option>
          <option value="category_deleted">Categorías Eliminadas</option>
          <option value="low_stock">Stock Bajo</option>
          <option value="contact_message">Mensajes de Contacto</option>
          <option value="system">Sistema</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <FiBell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">No hay notificaciones</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter !== 'all' || typeFilter !== 'all' 
                ? 'Intenta cambiar los filtros' 
                : 'Las notificaciones aparecerán aquí cuando haya actividad'}
            </p>
          </div>
        ) : (
          <div className="h-[640px] overflow-y-auto divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors border-l-4 ${
                  notification.read 
                    ? getNotificationColor(notification.type) 
                    : `${getNotificationColor(notification.type)} opacity-100`
                }`}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={`text-base sm:text-lg font-bold ${notification.read ? 'text-gray-700' : 'text-black'} break-words`}>
                            {notification.title}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded whitespace-nowrap">
                            {getTypeLabel(notification.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notificationsService.formatTimeAgo(notification.created_at)}
                        </p>
                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver detalles →
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marcar como leída"
                          >
                            <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
        onClose={() => setConfirmModal({ isOpen: false, notificationId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar notificación"
        message="¿Estás seguro de que deseas eliminar esta notificación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
};

export default Notifications;

