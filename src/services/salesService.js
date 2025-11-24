import { supabase } from '../lib/supabase';

export const salesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getTotalSales() {
    const { data, error } = await supabase
      .from('sales')
      .select('total, created_at')
      .eq('status', 'completed');
    
    if (error) throw error;
    
    const total = data?.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0) || 0;
    return total;
  },

  async getSalesByPeriod(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('sales')
      .select('total, created_at')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString());
    
    if (error) throw error;
    return data || [];
  },

  async getGrowthPercentage() {
    try {
      const now = new Date();
      
      // Calcular el mes actual (desde el día 1 hasta hoy)
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentMonthStart.setHours(0, 0, 0, 0);
      
      // Calcular el mes anterior completo
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousMonthStart.setHours(0, 0, 0, 0);
      
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      
      // Obtener ventas del mes actual
      const { data: currentMonthData, error: currentError } = await supabase
        .from('sales')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', now.toISOString());
      
      if (currentError) throw currentError;
      
      // Obtener ventas del mes anterior
      const { data: previousMonthData, error: previousError } = await supabase
        .from('sales')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString());
      
      if (previousError) throw previousError;
      
      const currentMonthTotal = currentMonthData?.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0) || 0;
      const previousMonthTotal = previousMonthData?.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0) || 0;
      
      // Si no hay ventas en el mes anterior pero sí en el actual, retornar 100%
      if (previousMonthTotal === 0) {
        return currentMonthTotal > 0 ? 100 : 0;
      }
      
      // Calcular el porcentaje de crecimiento
      const growth = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
      return Math.round(growth * 10) / 10; // Redondear a 1 decimal
    } catch (error) {
      console.error('Error calculating growth percentage:', error);
      return 0;
    }
  },

  async create(sale) {
    const { data, error } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('sales')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    return data;
  }
};

