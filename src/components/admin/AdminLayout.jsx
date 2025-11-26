import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const getTitle = () => {
    const titles = {
      '/admin': 'Dashboard',
      '/admin/products': 'Productos',
      '/admin/categories': 'Categorías',
      '/admin/product-types': 'Tipos de Prenda',
      '/admin/blog': 'Blog',
      '/admin/media': 'Medios',
    };
    return titles[location.pathname] || 'Panel de Administración';
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="lg:ml-64">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

