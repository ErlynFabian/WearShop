import { supabase } from '../lib/supabase';
import { productsService } from './productsService';

export const salesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  /**
   * Obtener el stock disponible de un producto considerando ventas pendientes
   * El stock físico ya refleja las ventas pendientes porque se resta al crearlas,
   * pero esta función verifica que el stock disponible sea correcto
   * @param {number} productId - ID del producto
   * @returns {Promise<number>} - Stock disponible
   */
  async getAvailableStock(productId) {
    try {
      // Obtener el producto
      const product = await productsService.getById(productId);
      if (!product) return 0;

      // El stock físico ya refleja las ventas pendientes porque se resta cuando se crean
      // Por lo tanto, el stock disponible es simplemente el stock físico actual
      const availableStock = product.stock || 0;

      return Math.max(0, availableStock);
    } catch (error) {
      console.error('Error calculating available stock:', error);
      return 0;
    }
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
    // Crear la venta
    const { data, error } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (error) throw error;

    // Actualizar el stock del producto si la venta está completada o es pendiente
    // (asumimos que las ventas pendientes también reservan stock)
    if (sale.product_id && sale.quantity && (sale.status === 'completed' || sale.status === 'pending')) {
      try {
        // Obtener el producto actual
        const product = await productsService.getById(sale.product_id);
        
        if (product) {
          const currentStock = product.stock || 0;
          const newStock = Math.max(0, currentStock - sale.quantity); // No permitir stock negativo
          
          // Actualizar el stock del producto
          await productsService.update(sale.product_id, { stock: newStock });
        }
      } catch (stockError) {
        console.error('Error updating product stock:', stockError);
        // No lanzar el error para no fallar la creación de la venta
        // pero loguearlo para debugging
      }
    }

    return data;
  },

  async update(id, updates) {
    // Obtener la venta actual antes de actualizar
    const { data: currentSale, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;

    // Actualizar la venta
    const { data, error } = await supabase
      .from('sales')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Manejar cambios en el stock cuando se actualiza una venta
    if (currentSale.product_id && currentSale.quantity) {
      try {
        const product = await productsService.getById(currentSale.product_id);
        
        if (product) {
          let stockAdjustment = 0;
          const oldStatus = currentSale.status;
          const newStatus = updates.status !== undefined ? updates.status : oldStatus;
          const oldQuantity = currentSale.quantity;
          const newQuantity = updates.quantity !== undefined ? updates.quantity : oldQuantity;
          
          // Si la venta cambia de estado
          if (updates.status !== undefined) {
            // Si cambia de completada/pendiente a cancelada, devolver stock
            if ((oldStatus === 'completed' || oldStatus === 'pending') && newStatus === 'cancelled') {
              stockAdjustment = oldQuantity; // Devolver stock (sumar)
            }
            // Si cambia de cancelada a completada/pendiente, restar stock
            else if (oldStatus === 'cancelled' && (newStatus === 'completed' || newStatus === 'pending')) {
              stockAdjustment = -newQuantity; // Restar stock
            }
          }
          
          // Si cambia la cantidad y la venta está activa
          if (updates.quantity !== undefined && newStatus !== 'cancelled') {
            // Si la venta estaba activa, ajustar según la diferencia
            if (oldStatus === 'completed' || oldStatus === 'pending') {
              // La diferencia: si aumenta cantidad, restar más; si disminuye, devolver
              stockAdjustment += (oldQuantity - newQuantity);
            }
            // Si la venta estaba cancelada pero ahora se activa, ya se manejó arriba
            // Si solo cambia cantidad en venta cancelada, no hacer nada
          }
          
          // Aplicar el ajuste de stock
          if (stockAdjustment !== 0) {
            const currentStock = product.stock || 0;
            // stockAdjustment positivo = devolver stock (sumar)
            // stockAdjustment negativo = restar stock
            const newStock = Math.max(0, currentStock + stockAdjustment);
            
            await productsService.update(currentSale.product_id, { stock: newStock });
          }
        }
      } catch (stockError) {
        console.error('Error updating product stock:', stockError);
        // No lanzar el error para no fallar la actualización de la venta
      }
    }

    return data;
  },

  async delete(id) {
    // Obtener la venta antes de eliminarla para actualizar el stock
    const { data: saleToDelete, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 significa que no se encontró el registro, lo cual está bien si ya fue eliminado
      throw fetchError;
    }

    // Eliminar la venta
    const { data, error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    // Si la venta estaba activa (completed o pending), devolver el stock
    if (saleToDelete && saleToDelete.product_id && saleToDelete.quantity && 
        (saleToDelete.status === 'completed' || saleToDelete.status === 'pending')) {
      try {
        const product = await productsService.getById(saleToDelete.product_id);
        
        if (product) {
          const currentStock = product.stock || 0;
          const newStock = currentStock + saleToDelete.quantity; // Devolver stock
          
          await productsService.update(saleToDelete.product_id, { stock: newStock });
        }
      } catch (stockError) {
        console.error('Error updating product stock after sale deletion:', stockError);
        // No lanzar el error para no fallar la eliminación de la venta
      }
    }
    
    return data;
  }
};

