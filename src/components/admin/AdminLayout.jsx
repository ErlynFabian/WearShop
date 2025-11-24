import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  
  const getTitle = () => {
    const titles = {
      '/admin': 'Dashboard',
      '/admin/products': 'Productos',
      '/admin/categories': 'Categorías',
      '/admin/product-types': 'Tipos de Prenda',
      '/admin/media': 'Medios',
    };
    return titles[location.pathname] || 'Panel de Administración';
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />
      <div className="ml-64">
        <AdminNavbar />
        <main className="pt-20 p-8 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

