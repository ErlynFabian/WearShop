import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'product-images';

export const storageService = {
  /**
   * Sube una imagen al bucket de Supabase
   * @param {File} file - Archivo de imagen a subir
   * @param {string} fileName - Nombre del archivo (opcional, se genera automáticamente si no se proporciona)
   * @returns {Promise<string>} URL pública de la imagen
   */
  async uploadImage(file, fileName = null) {
    try {
      // Generar nombre único si no se proporciona
      const fileExt = file.name.split('.').pop();
      const filePath = fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Elimina una imagen del bucket
   * @param {string} filePath - Ruta del archivo en el bucket
   */
  async deleteImage(filePath) {
    try {
      // Extraer el nombre del archivo de la URL completa si es necesario
      const fileName = filePath.includes('/') 
        ? filePath.split('/').pop() 
        : filePath;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  /**
   * Obtiene la URL pública de una imagen
   * @param {string} filePath - Ruta del archivo en el bucket
   * @returns {string} URL pública
   */
  getPublicUrl(filePath) {
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return publicUrl;
  },

  /**
   * Convierte una imagen a base64 (para usar como fallback)
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} String base64
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },
};

