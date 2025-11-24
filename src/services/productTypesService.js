import { supabase } from '../lib/supabase';

export const productTypesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByCategory(category) {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .eq('category', category)
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(type) {
    const { data, error } = await supabase
      .from('product_types')
      .insert([type])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('product_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updatePosition(id, position) {
    const { data, error } = await supabase
      .from('product_types')
      .update({ position })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

