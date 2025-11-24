import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiPackage,
  FiFolder,
  FiLogOut,
  FiShoppingBag,
  FiDollarSign,
  FiBell
} from 'react-icons/fi';
import useAuthStore from '../../context/authStore';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: FiLayout, label: 'Dashboard' },
    { path: '/admin/products', icon: FiPackage, label: 'Productos' },
    { path: '/admin/categories', icon: FiFolder, label: 'Categorías' },
    { path: '/admin/product-types', icon: FiShoppingBag, label: 'Tipos de Prenda' },
    { path: '/admin/sales', icon: FiDollarSign, label: 'Ventas' },
    { path: '/admin/notifications', icon: FiBell, label: 'Notificaciones' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="border-b border-gray-200" style={{ padding: '1rem 1.5rem', height: '4rem', display: 'flex', alignItems: 'center' }}>
        <Link to="/admin" className="flex items-center space-x-2">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-100 text-black font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
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
    </aside>
  );
};

export default AdminSidebar;

