import { useState, useEffect } from 'react';
import { FiDownload, FiTrendingUp, FiTrendingDown, FiCalendar, FiFilter, FiX } from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { reportsService } from '../../services/reportsService';
import { formatPrice } from '../../utils/formatPrice';
import useToastStore from '../../context/toastStore';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // 'day', 'week', 'month'
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Por defecto, mes actual en formato YYYY-MM
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenue, setRevenue] = useState({ total: 0, count: 0, average: 0 });
  const [comparison, setComparison] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    loadReports();
  }, [period, selectedMonth]);

  const getDateRange = () => {
    // Siempre mostrar el mes actual completo
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Primer día del mes actual
    const startDate = new Date(currentYear, currentMonth, 1);
    startDate.setHours(0, 0, 0, 0);
    
    // Último día del mes actual
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return { startDate, endDate };
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      
      // Cargar datos según el período seleccionado
      let data = [];
      if (period === 'day') {
        data = await reportsService.getSalesByDay(startDate, endDate);
      } else if (period === 'week') {
        data = await reportsService.getSalesByWeek(startDate, endDate);
      } else {
        data = await reportsService.getSalesByMonth(startDate, endDate);
      }

      // Formatear datos para los gráficos
      const formattedData = (data || []).map(item => ({
        name: period === 'day' 
          ? new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
          : period === 'week'
          ? item.weekLabel || 'Semana'
          : item.monthLabel || 'Mes',
        ventas: parseFloat(item.total || 0),
        cantidad: parseInt(item.quantity || 0),
        transacciones: parseInt(item.count || 0)
      }));

      setSalesData(formattedData.length > 0 ? formattedData : [{ name: 'Sin datos', ventas: 0, cantidad: 0, transacciones: 0 }]);

      // Cargar productos más vendidos
      const top = await reportsService.getTopProducts(10, startDate, endDate);
      setTopProducts(top || []);

      // Cargar ingresos totales
      const revenueData = await reportsService.getRevenueByPeriod(startDate, endDate);
      setRevenue({
        total: revenueData?.total || 0,
        count: revenueData?.count || 0,
        average: revenueData?.average || 0
      });

      // Comparar con el mes seleccionado (período de comparación)
      const [year, month] = selectedMonth.split('-').map(Number);
      
      // Período de comparación: mes seleccionado completo (del día 1 al último día del mes)
      const prevStartDate = new Date(year, month - 1, 1);
      prevStartDate.setHours(0, 0, 0, 0);
      
      const prevEndDate = new Date(year, month, 0); // Último día del mes seleccionado
      prevEndDate.setHours(23, 59, 59, 999);

      try {
        const comparisonData = await reportsService.comparePeriods(
          prevStartDate,
          prevEndDate,
          startDate,
          endDate
        );
        
        // Logs de depuración para verificar la comparación
        console.log('=== COMPARACIÓN DE PERÍODOS ===');
        console.log('Período de Comparación (Mes Seleccionado):');
        console.log('  Inicio:', prevStartDate.toLocaleDateString('es-ES'), prevStartDate.toLocaleTimeString('es-ES'));
        console.log('  Fin:', prevEndDate.toLocaleDateString('es-ES'), prevEndDate.toLocaleTimeString('es-ES'));
        console.log('  Ingresos:', formatPrice(comparisonData.period1.total), `(${comparisonData.period1.total})`);
        console.log('  Transacciones:', comparisonData.period1.count);
        console.log('Período Actual (Mes Actual):');
        console.log('  Inicio:', startDate.toLocaleDateString('es-ES'), startDate.toLocaleTimeString('es-ES'));
        console.log('  Fin:', endDate.toLocaleDateString('es-ES'), endDate.toLocaleTimeString('es-ES'));
        console.log('  Ingresos:', formatPrice(comparisonData.period2.total), `(${comparisonData.period2.total})`);
        console.log('  Transacciones:', comparisonData.period2.count);
        console.log('Revenue State (debería ser mes actual):');
        console.log('  Ingresos:', formatPrice(revenueData?.total || 0), `(${revenueData?.total || 0})`);
        console.log('  Transacciones:', revenueData?.count || 0);
        console.log('Cambios Calculados:');
        console.log('  Cambio en Ingresos:', formatPrice(comparisonData.revenueChange), `(${comparisonData.revenueChange})`);
        console.log('  Porcentaje Ingresos:', comparisonData.revenueChangePercent.toFixed(1) + '%');
        console.log('  Cambio en Transacciones:', comparisonData.salesChange);
        console.log('  Porcentaje Transacciones:', comparisonData.salesChangePercent.toFixed(1) + '%');
        console.log('==============================');
        
        setComparison(comparisonData);
      } catch (compError) {
        console.error('Error comparing periods:', compError);
        setComparison(null);
      }

    } catch (error) {
      console.error('Error loading reports:', error);
      useToastStore.getState().error('Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'excel') => {
    setExporting(true);
    try {
      const { startDate, endDate } = getDateRange();
      const sales = await reportsService.getAllSalesForExport(startDate, endDate);

      if (!sales || sales.length === 0) {
        useToastStore.getState().error('No hay datos para exportar');
        setExporting(false);
        return;
      }

      // Preparar datos para exportación
      const exportData = sales.map(sale => ({
        'ID': sale.id,
        'Fecha': new Date(sale.created_at).toLocaleDateString('es-ES'),
        'Hora': new Date(sale.created_at).toLocaleTimeString('es-ES'),
        'Producto': sale.products?.name || sale.product_name || 'N/A',
        'Categoría': sale.products?.category || 'N/A',
        'Tipo': sale.products?.type || 'N/A',
        'Cantidad': sale.quantity,
        'Precio Unitario': parseFloat(sale.price || 0),
        'Total': parseFloat(sale.total || 0),
        'Estado': sale.status,
        'Cliente': sale.customer_name || 'N/A',
        'Teléfono': sale.customer_phone || 'N/A',
        'Email': sale.customer_email || 'N/A',
        'Notas': sale.notes || ''
      }));

      if (format === 'excel') {
        // Crear workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 10 }, // ID
          { wch: 12 }, // Fecha
          { wch: 10 }, // Hora
          { wch: 30 }, // Producto
          { wch: 15 }, // Categoría
          { wch: 15 }, // Tipo
          { wch: 10 }, // Cantidad
          { wch: 15 }, // Precio Unitario
          { wch: 15 }, // Total
          { wch: 12 }, // Estado
          { wch: 20 }, // Cliente
          { wch: 15 }  // Teléfono
        ];
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
        
        // Descargar
        const fileName = `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
      } else {
        // CSV
        if (exportData.length === 0) {
          useToastStore.getState().error('No hay datos para exportar');
          setExporting(false);
          return;
        }
        const headers = Object.keys(exportData[0] || {}).join(',');
        const rows = exportData.map(row => Object.values(row).map(val => {
          // Escapar comas y comillas en valores CSV
          const str = String(val || '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(','));
        const csv = [headers, ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      useToastStore.getState().success('Reporte exportado correctamente');
    } catch (error) {
      console.error('Error exporting report:', error);
      useToastStore.getState().error('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2">Reportes y Análisis</h2>
            <p className="text-sm sm:text-base text-gray-600">Análisis detallado de ventas y rendimiento</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExport('excel')}
              disabled={exporting}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Filtros</span>
              {period !== 'month' && (
                <span className="bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal/Dropdown de Filtros */}
        {filtersOpen && (
          <>
            {/* Backdrop para móvil */}
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            
            {/* Panel de Filtros */}
            <div className="fixed lg:relative top-1/2 lg:top-0 left-1/2 lg:left-0 transform -translate-x-1/2 lg:transform-none -translate-y-1/2 lg:translate-y-0 w-[90%] lg:w-full max-w-md lg:max-w-none bg-white rounded-lg p-4 sm:p-6 border border-gray-200 mb-6 shadow-xl lg:shadow-none z-30 lg:z-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">Filtros</h3>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período de agrupación
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="day">Diario</option>
                    <option value="week">Semanal</option>
                    <option value="month">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comparar con el mes
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Se mostrará el mes actual comparado con el mes seleccionado
                  </p>
                </div>
              </div>
              
              {/* Botón de aplicar (solo móvil) */}
              <div className="mt-4 lg:hidden">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      ) : (
        <>
          {/* Resumen de ingresos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Ingresos Totales</h3>
                <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-black break-words">{formatPrice(revenue.total)}</p>
              {comparison && (
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    {comparison.revenueChangePercent >= 0 ? (
                      <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${
                      comparison.revenueChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {comparison.revenueChangePercent >= 0 ? '+' : ''}
                      {comparison.revenueChangePercent.toFixed(1)}%
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">vs período anterior</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Mes comparado: {formatPrice(comparison.period1.total || 0)}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total de Transacciones</h3>
                <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-black">{revenue.count}</p>
              {comparison && (
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    {comparison.salesChangePercent >= 0 ? (
                      <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${
                      comparison.salesChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {comparison.salesChangePercent >= 0 ? '+' : ''}
                      {comparison.salesChangePercent.toFixed(1)}%
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">vs período anterior</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Mes comparado: {comparison.period1.count || 0} transacciones
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Ticket Promedio</h3>
                <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-black break-words">{formatPrice(revenue.average)}</p>
            </div>
          </div>

          {/* Gráfico de ventas */}
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Evolución de Ventas</h3>
            {salesData && salesData.length > 0 && salesData[0].ventas > 0 ? (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" minHeight={300} height={400}>
                  <LineChart data={salesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => formatPrice(value)}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#facc15" 
                      strokeWidth={2}
                      name="Ingresos"
                      dot={{ fill: '#facc15', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-gray-500 text-sm sm:text-base">
                <p>No hay datos de ventas para mostrar</p>
              </div>
            )}
          </div>

          {/* Gráfico de cantidad vendida */}
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Cantidad de Productos Vendidos</h3>
            {salesData && salesData.length > 0 && salesData[0].cantidad > 0 ? (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" minHeight={300} height={400}>
                  <BarChart data={salesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="cantidad" fill="#fbbf24" name="Cantidad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-gray-500 text-sm sm:text-base">
                <p>No hay datos de cantidad para mostrar</p>
              </div>
            )}
          </div>

          {/* Productos más vendidos */}
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Productos Más Vendidos</h3>
            {topProducts.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">No hay datos disponibles</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {topProducts.map((product, index) => (
                  <div 
                    key={product.product_id} 
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full">
                          {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-3">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-black truncate">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Cantidad:</span>
                        <span className="text-sm font-bold text-black">{product.totalQuantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Ingresos:</span>
                        <span className="text-sm font-bold text-black">{formatPrice(product.totalRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Ventas:</span>
                        <span className="text-sm font-medium text-gray-700">{product.salesCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

