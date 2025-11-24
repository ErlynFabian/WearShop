import { useState, useEffect } from 'react';
import { FiPackage, FiFolder, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import useProductsStore from '../../context/productsStore';
import useCategoriesStore from '../../context/categoriesStore';
import { activitiesService } from '../../services/activitiesService';
import { salesService } from '../../services/salesService';

const Dashboard = () => {
  const { products } = useProductsStore();
  const { categories } = useCategoriesStore();
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
      value: loadingStats ? 'Cargando...' : formatCurrency(totalSales),
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      change: growthPercentage > 0 ? `+${growthPercentage.toFixed(1)}%` : `${growthPercentage.toFixed(1)}%`
    },
    {
      title: 'Crecimiento',
      value: loadingStats ? 'Cargando...' : `${growthPercentage.toFixed(1)}%`,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-100">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <span className="text-sm font-medium text-gray-600">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-black text-black mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {loadingActivities ? (
              <p className="text-sm text-gray-500">Cargando actividades...</p>
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
                  <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

