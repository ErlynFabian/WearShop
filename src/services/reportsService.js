import { supabase } from '../lib/supabase';

export const reportsService = {
  /**
   * Obtener ventas agrupadas por día
   */
  async getSalesByDay(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select('total, created_at, quantity, product_id')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Si no hay datos, retornar array vacío
    if (!data || data.length === 0) {
      return [];
    }

    // Agrupar por día
    const grouped = {};
    data.forEach(sale => {
      const date = new Date(sale.created_at);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: dayKey,
          total: 0,
          count: 0,
          quantity: 0
        };
      }
      
      grouped[dayKey].total += parseFloat(sale.total || 0);
      grouped[dayKey].count += 1;
      grouped[dayKey].quantity += parseInt(sale.quantity || 0);
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Obtener ventas agrupadas por semana
   */
  async getSalesByWeek(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select('total, created_at, quantity, product_id')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Si no hay datos, retornar array vacío
    if (!data || data.length === 0) {
      return [];
    }

    // Agrupar por semana
    const grouped = {};
    data.forEach(sale => {
      const date = new Date(sale.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Domingo de esa semana
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          date: weekKey,
          weekLabel: `Sem ${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
          total: 0,
          count: 0,
          quantity: 0
        };
      }
      
      grouped[weekKey].total += parseFloat(sale.total || 0);
      grouped[weekKey].count += 1;
      grouped[weekKey].quantity += parseInt(sale.quantity || 0);
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Obtener ventas agrupadas por mes
   */
  async getSalesByMonth(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select('total, created_at, quantity, product_id')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Si no hay datos, retornar array vacío
    if (!data || data.length === 0) {
      return [];
    }

    // Agrupar por mes
    const grouped = {};
    data.forEach(sale => {
      const date = new Date(sale.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          date: monthKey,
          monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          total: 0,
          count: 0,
          quantity: 0
        };
      }
      
      grouped[monthKey].total += parseFloat(sale.total || 0);
      grouped[monthKey].count += 1;
      grouped[monthKey].quantity += parseInt(sale.quantity || 0);
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Obtener productos más vendidos
   */
  async getTopProducts(limit = 10, startDate = null, endDate = null) {
    let query = supabase
      .from('sales')
      .select('product_id, quantity, total, product_name')
      .eq('status', 'completed');

    if (startDate && endDate) {
      query = query
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    // Si no hay datos, retornar array vacío
    if (!data || data.length === 0) {
      return [];
    }

    // Agrupar por producto
    const grouped = {};
    const productIds = new Set();
    
    data.forEach(sale => {
      const productId = sale.product_id;
      if (!productId) return;

      productIds.add(productId);

      if (!grouped[productId]) {
        grouped[productId] = {
          product_id: productId,
          name: sale.product_name || 'Producto desconocido',
          image: '',
          totalQuantity: 0,
          totalRevenue: 0,
          salesCount: 0
        };
      }

      grouped[productId].totalQuantity += parseInt(sale.quantity || 0);
      grouped[productId].totalRevenue += parseFloat(sale.total || 0);
      grouped[productId].salesCount += 1;
    });

    // Obtener imágenes de productos
    if (productIds.size > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('id, image')
        .in('id', Array.from(productIds));

      products?.forEach(product => {
        if (grouped[product.id]) {
          grouped[product.id].image = product.image || '';
        }
      });
    }

    // Ordenar por cantidad vendida y tomar los top N
    return Object.values(grouped)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  },

  /**
   * Obtener ingresos por período
   */
  async getRevenueByPeriod(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select('total')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const total = data?.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0) || 0;
    const count = data?.length || 0;

    return {
      total,
      count,
      average: count > 0 ? total / count : 0
    };
  },

  /**
   * Comparar dos períodos
   */
  async comparePeriods(period1Start, period1End, period2Start, period2End) {
    const [period1, period2] = await Promise.all([
      this.getRevenueByPeriod(period1Start, period1End),
      this.getRevenueByPeriod(period2Start, period2End)
    ]);

    const revenueChange = period2.total - period1.total;
    let revenueChangePercent = 0;
    
    if (period1.total > 0) {
      // Si el período anterior tiene ingresos, calcular el porcentaje de cambio
      revenueChangePercent = (revenueChange / period1.total) * 100;
    } else if (period2.total > 0) {
      // Si el período anterior no tiene ingresos pero el actual sí, es un crecimiento infinito
      // Mostramos 100% para indicar que hay crecimiento desde cero
      revenueChangePercent = 100;
    } else {
      // Ambos períodos tienen 0 ingresos
      revenueChangePercent = 0;
    }

    const salesChange = period2.count - period1.count;
    let salesChangePercent = 0;
    
    if (period1.count > 0) {
      // Si el período anterior tiene transacciones, calcular el porcentaje de cambio
      salesChangePercent = (salesChange / period1.count) * 100;
    } else if (period2.count > 0) {
      // Si el período anterior no tiene transacciones pero el actual sí, es un crecimiento infinito
      // Mostramos 100% para indicar que hay crecimiento desde cero
      salesChangePercent = 100;
    } else {
      // Ambos períodos tienen 0 transacciones
      salesChangePercent = 0;
    }

    return {
      period1,
      period2,
      revenueChange,
      revenueChangePercent,
      salesChange,
      salesChangePercent
    };
  },

  /**
   * Obtener todas las ventas para exportación
   */
  async getAllSalesForExport(startDate = null, endDate = null) {
    let query = supabase
      .from('sales')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (startDate && endDate) {
      query = query
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    // Obtener información de productos
    const salesWithProducts = await Promise.all(
      (data || []).map(async (sale) => {
        if (sale.product_id) {
          try {
            const { data: product } = await supabase
              .from('products')
              .select('name, category, type')
              .eq('id', sale.product_id)
              .single();
            
            return {
              ...sale,
              products: product || null
            };
          } catch (err) {
            return {
              ...sale,
              products: null
            };
          }
        }
        return {
          ...sale,
          products: null
        };
      })
    );

    return salesWithProducts;
  }
};

