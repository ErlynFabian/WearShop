import { supabase } from '../lib/supabase';

export const siteConfigService = {
  // Obtener toda la configuración
  async get() {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .maybeSingle(); // Usar maybeSingle en lugar de single para evitar error si no existe
      
      if (error) {
        // Si la tabla no existe o hay error de RLS, retornar valores por defecto
        if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('permission denied')) {
          console.warn('No se pudo cargar la configuración del sitio, usando valores por defecto:', error.message);
          return this.getDefaultConfig();
        }
        throw error;
      }
      return data || this.getDefaultConfig();
    } catch (error) {
      // Si hay cualquier error, retornar valores por defecto
      console.warn('Error al obtener configuración del sitio, usando valores por defecto:', error);
      return this.getDefaultConfig();
    }
  },

  // Actualizar configuración
  async update(updates) {
    try {
      // Primero intentar obtener la configuración existente
      const existing = await this.get();
      
      // Preparar los datos para actualizar, asegurando que business_hours sea JSON válido
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Si business_hours es un objeto, asegurarse de que se envíe como JSON
      if (updateData.business_hours && typeof updateData.business_hours === 'object') {
        updateData.business_hours = JSON.stringify(updateData.business_hours);
      }
      
      if (existing && existing.id) {
        // Actualizar si existe
        const { data, error } = await supabase
          .from('site_config')
          .update(updateData)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error actualizando configuración:', error);
          throw error;
        }
        
        // Parsear business_hours si es string
        if (data.business_hours && typeof data.business_hours === 'string') {
          data.business_hours = JSON.parse(data.business_hours);
        }
        
        return data;
      } else {
        // Crear si no existe
        const defaultConfig = this.getDefaultConfig();
        const insertData = {
          ...defaultConfig,
          ...updates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Asegurar que business_hours sea JSON string
        if (insertData.business_hours && typeof insertData.business_hours === 'object') {
          insertData.business_hours = JSON.stringify(insertData.business_hours);
        }
        
        // Remover id si es null
        if (insertData.id === null) {
          delete insertData.id;
        }
        
        const { data, error } = await supabase
          .from('site_config')
          .insert([insertData])
          .select()
          .single();
        
        if (error) {
          console.error('Error creando configuración:', error);
          throw error;
        }
        
        // Parsear business_hours si es string
        if (data.business_hours && typeof data.business_hours === 'string') {
          data.business_hours = JSON.parse(data.business_hours);
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error en update de site config:', error);
      throw error;
    }
  },

  // Configuración por defecto
  getDefaultConfig() {
    return {
      id: null,
      site_name: 'WearShop',
      site_description: '',
      site_logo: '',
      contact_phone: '',
      contact_email: '',
      contact_address: '',
      instagram_url: '',
      facebook_url: '',
      whatsapp_number: '',
      business_hours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '09:00', close: '18:00', closed: true }
      },
      created_at: null,
      updated_at: null
    };
  }
};

// Función helper para parsear business_hours si viene como string
export const parseBusinessHours = (businessHours) => {
  if (!businessHours) {
    return siteConfigService.getDefaultConfig().business_hours;
  }
  
  if (typeof businessHours === 'string') {
    try {
      return JSON.parse(businessHours);
    } catch (e) {
      console.warn('Error parseando business_hours:', e);
      return siteConfigService.getDefaultConfig().business_hours;
    }
  }
  
  return businessHours;
};

