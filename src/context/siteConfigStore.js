import { create } from 'zustand';
import { siteConfigService, parseBusinessHours } from '../services/siteConfigService';
import { supabase } from '../lib/supabase';

const useSiteConfigStore = create((set, get) => ({
  config: null,
  loading: false,
  error: null,

  // Cargar configuración
  loadConfig: async () => {
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.warn('Supabase no está configurado');
      const defaultConfig = siteConfigService.getDefaultConfig();
      set({ config: defaultConfig, loading: false });
      return defaultConfig;
    }

    set({ loading: true, error: null });
    try {
      const data = await siteConfigService.get();
      // Asegurar que business_hours esté parseado correctamente
      if (data.business_hours) {
        data.business_hours = parseBusinessHours(data.business_hours);
      }
      // Crear un nuevo objeto para forzar el re-render
      const newConfig = JSON.parse(JSON.stringify(data)); // Deep clone para asegurar nueva referencia
      set({ config: newConfig, loading: false, error: null });
      console.log('Config updated in store (loadConfig):', newConfig);
      return newConfig;
    } catch (error) {
      console.error('Error loading site config:', error);
      const defaultConfig = siteConfigService.getDefaultConfig();
      set({ config: defaultConfig, error: error.message, loading: false });
      return defaultConfig;
    }
  },

  // Actualizar configuración
  updateConfig: async (updates) => {
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.warn('Supabase no está configurado');
      // Aún así actualizar el estado local
      const currentConfig = get().config || siteConfigService.getDefaultConfig();
      const updatedConfig = { ...currentConfig, ...updates };
      set({ config: updatedConfig });
      return updatedConfig;
    }

    set({ loading: true, error: null });
    try {
      const data = await siteConfigService.update(updates);
      // Asegurar que business_hours esté parseado correctamente
      if (data.business_hours) {
        data.business_hours = parseBusinessHours(data.business_hours);
      }
      // Crear un nuevo objeto para forzar el re-render
      const newConfig = JSON.parse(JSON.stringify(data)); // Deep clone para asegurar nueva referencia
      set({ config: newConfig, loading: false, error: null });
      console.log('Config updated in store (updateConfig):', newConfig);
      return newConfig;
    } catch (error) {
      console.error('Error updating site config:', error);
      const errorMessage = error.message || 'Error al guardar la configuración';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Obtener configuración (sincrónico, desde el store)
  getConfig: () => {
    return get().config || siteConfigService.getDefaultConfig();
  },

  // Suscripción a cambios en tiempo real
  subscribeToChanges: () => {
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      return () => {}; // Retornar función vacía si no hay Supabase
    }

    const channel = supabase
      .channel('site-config-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'site_config'
        },
        async (payload) => {
          console.log('Site config change received:', payload);
          
          // Recargar la configuración cuando haya cambios
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            try {
              const data = await siteConfigService.get();
              // Asegurar que business_hours esté parseado correctamente
              if (data.business_hours) {
                data.business_hours = parseBusinessHours(data.business_hours);
              }
              // Crear un nuevo objeto para forzar el re-render
              const newConfig = JSON.parse(JSON.stringify(data)); // Deep clone para asegurar nueva referencia
              set({ config: newConfig, error: null });
              console.log('Site config updated via Realtime:', newConfig);
            } catch (error) {
              console.error('Error reloading site config after change:', error);
            }
          } else if (payload.eventType === 'DELETE') {
            // Si se elimina, usar valores por defecto
            const defaultConfig = siteConfigService.getDefaultConfig();
            set({ config: { ...defaultConfig } });
          }
        }
      )
      .subscribe();

    // Retornar función para desuscribirse
    return () => {
      supabase.removeChannel(channel);
    };
  }
}));

export default useSiteConfigStore;

