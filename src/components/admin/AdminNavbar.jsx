import { FiSearch, FiUser } from 'react-icons/fi';
import useAuthStore from '../../context/authStore';
import NotificationsDropdown from './NotificationsDropdown';

const AdminNavbar = () => {
  const { user } = useAuthStore();

  return (
    <nav className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 flex items-center justify-end z-40" style={{ padding: '1rem 1.5rem', height: '4rem' }}>
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
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
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

