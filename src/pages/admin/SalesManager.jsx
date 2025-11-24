import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye, FiCalendar, FiArrowLeft, FiTrendingUp } from 'react-icons/fi';
import { salesService } from '../../services/salesService';
import useProductsStore from '../../context/productsStore';
import ConfirmModal from '../../components/admin/ConfirmModal';
import AlertModal from '../../components/admin/AlertModal';

const SalesManager = () => {
  const { products } = useProductsStore();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, saleId: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });
  const [selectedMonth, setSelectedMonth] = useState(null); // null = vista de meses, string = mes seleccionado

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (isSupabaseConfigured) {
        const data = await salesService.getAll();
        setSales(data);
      }
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ isOpen: true, saleId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.saleId) return;
    
    try {
      await salesService.delete(deleteModal.saleId);
      loadSales();
      setDeleteModal({ isOpen: false, saleId: null });
      } catch (error) {
        console.error('Error deleting sale:', error);
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: `Error al eliminar la venta: ${error.message || 'Error desconocido'}`,
          type: 'error'
        });
      }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Agrupar ventas por mes
  const salesByMonth = useMemo(() => {
    const grouped = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-DO', { year: 'numeric', month: 'long' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          key: monthKey,
          label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          sales: [],
          total: 0,
          completed: 0,
          completedTotal: 0,
          pending: 0,
          cancelled: 0
        };
      }
      
      grouped[monthKey].sales.push(sale);
      grouped[monthKey].total += parseFloat(sale.total || 0);
      
      if (sale.status === 'completed') {
        grouped[monthKey].completed++;
        grouped[monthKey].completedTotal += parseFloat(sale.total || 0);
      } else if (sale.status === 'pending') {
        grouped[monthKey].pending++;
      } else if (sale.status === 'cancelled') {
        grouped[monthKey].cancelled++;
      }
    });
    
    // Ordenar por mes (más reciente primero)
    return Object.values(grouped).sort((a, b) => b.key.localeCompare(a.key));
  }, [sales]);

  // Obtener ventas del mes seleccionado
  const selectedMonthSales = useMemo(() => {
    if (!selectedMonth) return [];
    const monthData = salesByMonth.find(m => m.key === selectedMonth);
    return monthData ? monthData.sales : [];
  }, [selectedMonth, salesByMonth]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completada', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Filtrar ventas según la vista actual
  const salesToFilter = selectedMonth ? selectedMonthSales : sales;
  
  const filteredSales = salesToFilter.filter(sale => {
    const matchesSearch = 
      sale.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_phone?.includes(searchTerm) ||
      sale.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalSalesAmount = filteredSales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando ventas...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        {selectedMonth && (
          <button
            onClick={() => {
              setSelectedMonth(null);
              setSearchTerm('');
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Volver a meses</span>
          </button>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-5xl font-black text-black">
            {selectedMonth ? salesByMonth.find(m => m.key === selectedMonth)?.label : 'Ventas'}
          </h2>
          <Link
            to="/admin/sales/create"
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            <span>Registrar Venta</span>
          </Link>
        </div>
        {!selectedMonth && (
          <p className="text-gray-600 mt-2">
            Gestiona todas tus ventas y pedidos
          </p>
        )}
      </div>

      {/* Vista de Meses */}
      {!selectedMonth && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-black mb-6 flex items-center space-x-2">
            <FiCalendar className="w-6 h-6" />
            <span>Ventas por Mes</span>
          </h3>
          
          {salesByMonth.length === 0 ? (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <p className="text-gray-600">No hay ventas registradas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salesByMonth.map((month) => (
                <button
                  key={month.key}
                  onClick={() => {
                    setSelectedMonth(month.key);
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCurrentPage(1);
                  }}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-black group-hover:text-yellow-600 transition-colors">
                      {month.label}
                    </h4>
                    <FiTrendingUp className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total de Ventas</span>
                      <span className="text-lg font-bold text-black">{month.sales.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completadas</span>
                      <span className="text-lg font-bold text-green-600">{month.completed}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pendientes</span>
                      <span className="text-lg font-bold text-yellow-600">{month.pending}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Canceladas</span>
                      <span className="text-lg font-bold text-red-600">{month.cancelled}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Ingresos</span>
                        <span className="text-xl font-black text-black">
                          {formatCurrency(month.completedTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats - Solo mostrar si hay un mes seleccionado */}
      {selectedMonth && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total de Ventas</p>
            <p className="text-3xl font-black text-black">{filteredSales.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Ventas Completadas</p>
            <p className="text-3xl font-black text-green-600">
              {filteredSales.filter(s => s.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Ingresos</p>
            <p className="text-3xl font-black text-black">{formatCurrency(totalSalesAmount)}</p>
          </div>
        </div>
      )}

      {/* Filters - Solo mostrar si hay un mes seleccionado */}
      {selectedMonth && (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por producto, cliente, teléfono o email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>
      )}

      {/* Sales Table - Solo mostrar si hay un mes seleccionado */}
      {selectedMonth && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron ventas
                  </td>
                </tr>
              ) : (
                paginatedSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{sale.product_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{sale.customer_name || 'N/A'}</div>
                      {sale.customer_phone && (
                        <div className="text-xs text-gray-500">{sale.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/sales/edit/${sale.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={(e) => handleDeleteClick(sale.id, e)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filteredSales.length)} de{' '}
              {filteredSales.length} ventas
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, saleId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Venta"
        message="¿Estás seguro de eliminar esta venta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default SalesManager;

