import { supabase } from '../lib/supabase';

export const activitiesService = {
  async getRecentActivities(limit = 10) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      // Obtener productos recientes (creados o actualizados)
      const { data: recentProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (productsError) throw productsError;

      // Obtener categorías recientes (creadas o actualizadas)
      const { data: recentCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (categoriesError) throw categoriesError;

      // Combinar y formatear actividades
      const activities = [];

      // Agregar actividades de productos
      recentProducts?.forEach(product => {
        const isNew = new Date(product.created_at).getTime() === new Date(product.updated_at).getTime();
        activities.push({
          id: `product-${product.id}`,
          type: isNew ? 'product_created' : 'product_updated',
          title: isNew ? 'Nuevo producto agregado' : 'Producto actualizado',
          description: product.name,
          timestamp: product.updated_at,
          icon: 'package'
        });
      });

      // Agregar actividades de categorías
      recentCategories?.forEach(category => {
        const isNew = new Date(category.created_at).getTime() === new Date(category.updated_at).getTime();
        activities.push({
          id: `category-${category.id}`,
          type: isNew ? 'category_created' : 'category_updated',
          title: isNew ? 'Nueva categoría agregada' : 'Categoría actualizada',
          description: category.name,
          timestamp: category.updated_at,
          icon: 'folder'
        });
      });

      // Ordenar por timestamp descendente y limitar
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  },

  formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace unos segundos';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  }
};

