import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import useAuthStore from '../../context/authStore';
import NotificationsDropdown from './NotificationsDropdown';

const AdminNavbar = ({ onMenuClick, sidebarOpen }) => {
  const { user } = useAuthStore();

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-gray-200 flex items-center justify-between lg:justify-end z-40" style={{ padding: '1rem 1.5rem', height: '4rem' }}>
      {/* Hamburger Menu Button - Solo visible en móvil */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <FiX className="w-6 h-6 text-black" />
        ) : (
          <FiMenu className="w-6 h-6 text-black" />
        )}
      </button>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search - Oculto en móvil muy pequeño */}
        <div className="relative hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
          />
        </div>

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User */}
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200">
            <img 
              src="/file.jpeg" 
              alt="Admin Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-black">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

