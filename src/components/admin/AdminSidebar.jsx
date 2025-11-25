import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout,
  FiPackage,
  FiFolder,
  FiLogOut,
  FiShoppingBag,
  FiDollarSign,
  FiBell,
  FiMail,
  FiX
} from 'react-icons/fi';
import useAuthStore from '../../context/authStore';
import { contactService } from '../../services/contactService';
import { supabase } from '../../lib/supabase';

const AdminSidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (isSupabaseConfigured) {
          const count = await contactService.getUnreadCount();
          setUnreadMessagesCount(count);
        }
      } catch (error) {
        console.error('Error loading unread messages count:', error);
        setUnreadMessagesCount(0);
      }
    };

    loadUnreadCount();

    // Suscripción en tiempo real
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('sidebar-contact-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contact_messages'
          },
          () => {
            loadUnreadCount();
          }
        )
        .subscribe();

      // Recargar cada 30 segundos también
      const interval = setInterval(loadUnreadCount, 30000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    if (onClose) onClose();
  };

  const handleLinkClick = () => {
    // Cerrar sidebar en móvil cuando se hace clic en un link
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    { path: '/admin', icon: FiLayout, label: 'Dashboard' },
    { path: '/admin/products', icon: FiPackage, label: 'Productos' },
    { path: '/admin/categories', icon: FiFolder, label: 'Categorías' },
    { path: '/admin/product-types', icon: FiShoppingBag, label: 'Tipos de Prenda' },
    { path: '/admin/sales', icon: FiDollarSign, label: 'Ventas' },
    { path: '/admin/notifications', icon: FiBell, label: 'Notificaciones' },
    { path: '/admin/contact-messages', icon: FiMail, label: 'Mensajes de Contacto' },
  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-b border-gray-200 relative" style={{ padding: '1rem 1.5rem', height: '4rem', display: 'flex', alignItems: 'center' }}>
        <Link to="/admin" onClick={handleLinkClick} className="flex items-center space-x-2">
          <span 
            className="text-xl font-bold tracking-tight"
            style={{
              backgroundImage: 'linear-gradient(to right, #facc15, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            WearShop Admin
          </span>
        </Link>
        {/* Close button - Solo visible en móvil */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const showBadge = item.path === '/admin/contact-messages' && unreadMessagesCount > 0;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-100 text-black font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              </div>
              {showBadge && (
                <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                  {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  // En desktop: sidebar siempre visible
  // En móvil: sidebar como overlay
  return (
    <>
      {/* Desktop Sidebar - Siempre visible */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col shadow-sm z-30">
        {sidebarContent}
    </aside>

      {/* Mobile Sidebar - Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;

