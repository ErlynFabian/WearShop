import { supabase } from '../lib/supabase';

export const blogService = {
  async getAll(includeUnpublished = false) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      // Datos de ejemplo para desarrollo
      return [
        {
          id: 1,
          title: 'Las 5 Tendencias de Moda que Dominarán este 2024',
          excerpt: 'Descubre las tendencias que están marcando la diferencia en el mundo de la moda este año.',
          content: 'Este año trae consigo emocionantes tendencias que combinan comodidad y estilo...',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
          category: 'Tendencias',
          author: 'Equipo WearShop',
          published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Cómo Combinar Colores en tu Guardarropa',
          excerpt: 'Aprende los secretos de la combinación de colores para crear outfits perfectos.',
          content: 'La combinación de colores es fundamental para crear looks armoniosos...',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
          category: 'Estilo',
          author: 'Equipo WearShop',
          published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  async getById(id, includeUnpublished = false) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      // Datos de ejemplo para desarrollo
      return {
        id: parseInt(id),
        title: 'Las 5 Tendencias de Moda que Dominarán este 2024',
        excerpt: 'Descubre las tendencias que están marcando la diferencia en el mundo de la moda este año.',
        content: 'Este año trae consigo emocionantes tendencias que combinan comodidad y estilo. Desde los colores vibrantes hasta los cortes relajados, la moda está evolucionando hacia un enfoque más personal y cómodo.\n\n1. **Colores Vibrantes**: Los tonos brillantes están de vuelta. Piensa en amarillos, naranjas y verdes esmeralda.\n\n2. **Siluetas Relajadas**: La comodidad es clave. Los cortes oversize y las prendas holgadas son tendencia.\n\n3. **Texturas Interesantes**: Mezcla diferentes texturas para crear looks únicos.\n\n4. **Accesorios Statement**: Los accesorios grandes y llamativos están de moda.\n\n5. **Sustentabilidad**: La moda consciente sigue ganando terreno.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        category: 'Tendencias',
        author: 'Equipo WearShop',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id);
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.single();
    
    if (error) throw error;
    return data;
  },

  async getByCategory(category) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(post) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

