import { supabase } from '../lib/supabase';
import { notificationsService } from './notificationsService';

export const contactService = {
  async create(contactData) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      // En desarrollo, simular éxito
      console.log('Supabase no configurado, simulando envío:', contactData);
      return { id: Date.now(), ...contactData, created_at: new Date().toISOString() };
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: contactData.name,
        phone: contactData.phone,
        email: null, // Compatibilidad: email puede ser null si la columna existe
        message: contactData.message,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;

    // La notificación se crea automáticamente mediante un trigger en la base de datos
    // No crear notificación manualmente para evitar duplicados

    return data;
  },

  async getAll() {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getUnreadCount() {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      return 0;
    }

    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    
    if (error) throw error;
    return count || 0;
  },

  async markAsRead(id) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      return;
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const isSupabaseConfigured = () => {
      return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    };

    if (!isSupabaseConfigured()) {
      return;
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

