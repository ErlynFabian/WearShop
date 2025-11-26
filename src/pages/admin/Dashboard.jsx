import { useState, useEffect, useMemo } from 'react';
import StatsSkeleton from '../../components/skeletons/StatsSkeleton';
import ActivitySkeleton from '../../components/skeletons/ActivitySkeleton';
import { FiPackage, FiFolder, FiDollarSign, FiTrendingUp, FiMail, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useProductsStore from '../../context/productsStore';
import useCategoriesStore from '../../context/categoriesStore';
import { activitiesService } from '../../services/activitiesService';
import { salesService } from '../../services/salesService';
import { contactService } from '../../services/contactService';
import { formatPrice } from '../../utils/formatPrice';
import { getCriticalStockProducts, getOutOfStockProducts, getLowStockProducts, getStockStatus, getStockStatusColor } from '../../utils/stockUtils';

const Dashboard = () => {
  const { products } = useProductsStore();
  const { categories } = useCategoriesStore();
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setLoadingActivities(true);
      const recentActivities = await activitiesService.getRecentActivities(5);
      setActivities(recentActivities);
      setLoadingActivities(false);
    };

    loadActivities();
  }, [products, categories]); // Recargar cuando cambien productos o categorías

  useEffect(() => {
    const loadSalesStats = async () => {
      setLoadingStats(true);
      try {
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (isSupabaseConfigured) {
          const sales = await salesService.getTotalSales();
          const growth = await salesService.getGrowthPercentage();
          
          setTotalSales(sales);
          setGrowthPercentage(growth);
        }
      } catch (error) {
        console.error('Error loading sales stats:', error);
        // Si hay error, mantener valores por defecto
        setTotalSales(0);
        setGrowthPercentage(0);
      } finally {
        setLoadingStats(false);
      }
    };

    loadSalesStats();
  }, []);

  useEffect(() => {
    const loadUnreadMessages = async () => {
      setLoadingMessages(true);
      try {
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (isSupabaseConfigured) {
          const count = await contactService.getUnreadCount();
          setUnreadMessages(count);
        }
      } catch (error) {
        console.error('Error loading unread messages:', error);
        setUnreadMessages(0);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadUnreadMessages();

    // Recargar cada 30 segundos para mantener actualizado
    const interval = setInterval(loadUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return formatPrice(amount);
  };

  // Calcular productos críticos de inventario
  const criticalProducts = useMemo(() => getCriticalStockProducts(products), [products]);
  const outOfStockProducts = useMemo(() => getOutOfStockProducts(products), [products]);
  const lowStockProducts = useMemo(() => getLowStockProducts(products), [products]);

  const stats = [
    {
      title: 'Productos Totales',
      value: products.length,
      icon: FiPackage,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Categorías',
      value: categories.length,
      icon: FiFolder,
      color: 'bg-green-500',
      change: '+2'
    },
    {
      title: 'Ventas Totales',
      value: loadingStats ? '...' : formatCurrency(totalSales),
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      change: growthPercentage > 0 ? `+${growthPercentage.toFixed(1)}%` : `${growthPercentage.toFixed(1)}%`
    },
    {
      title: 'Crecimiento',
      value: loadingStats ? '...' : `${growthPercentage.toFixed(1)}%`,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      change: growthPercentage > 0 ? `+${Math.abs(growthPercentage).toFixed(1)}%` : `${growthPercentage.toFixed(1)}%`
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-5xl font-black text-black mb-2">Dashboard</h2>
        <p className="text-gray-600">Resumen general de tu tienda</p>
      </div>

      {/* Stats Grid */}
      {loadingStats ? (
        <StatsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-gray-100">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">{stat.change}</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-1">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.title}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {loadingActivities ? (
              <ActivitySkeleton count={5} />
            ) : activities.length === 0 ? (
              <p className="text-sm text-gray-500">No hay actividades recientes</p>
            ) : (
              activities.map((activity, index) => {
                const Icon = activity.icon === 'package' ? FiPackage : activity.icon === 'folder' ? FiFolder : FiDollarSign;
                const isLast = index === activities.length - 1;
                return (
                  <div key={activity.id} className={`flex items-center space-x-4 ${!isLast ? 'pb-4 border-b border-gray-200' : ''}`}>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activitiesService.formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Productos Populares</h3>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">{product.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventario Crítico */}
      {criticalProducts.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">Inventario Crítico</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {criticalProducts.length} {criticalProducts.length === 1 ? 'producto requiere' : 'productos requieren'} atención
                </p>
              </div>
            </div>
            <Link
              to="/admin/products?stock=critical"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2.5 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Productos Agotados */}
            {outOfStockProducts.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiXCircle className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-bold text-black">Agotados</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                    {outOfStockProducts.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 pb-3 border-b border-gray-200 last:border-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Stock: 0</p>
                      </div>
                    </div>
                  ))}
                  {outOfStockProducts.length > 5 && (
                    <Link
                      to="/admin/products?stock=out_of_stock"
                      className="block text-center text-sm text-gray-600 hover:text-black transition-colors pt-2"
                    >
                      Ver {outOfStockProducts.length - 5} más →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Productos con Bajo Stock */}
            {lowStockProducts.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-lg font-bold text-black">Bajo Stock</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    {lowStockProducts.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 pb-3 border-b border-gray-200 last:border-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock || 0}</p>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <Link
                      to="/admin/products?stock=low_stock"
                      className="block text-center text-sm text-gray-600 hover:text-black transition-colors pt-2"
                    >
                      Ver {lowStockProducts.length - 5} más →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mensajes de Contacto */}
      {unreadMessages > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiMail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">
                  Tienes {unreadMessages} {unreadMessages === 1 ? 'mensaje' : 'mensajes'} de contacto sin leer
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Revisa los mensajes recibidos desde el formulario de contacto
                </p>
              </div>
            </div>
            <Link
              to="/admin/contact-messages"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Ver mensajes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

