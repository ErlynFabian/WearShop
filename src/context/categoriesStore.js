import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { categories as initialCategories } from '../data/categories';
import { categoriesService } from '../services/categoriesService';
import { supabase } from '../lib/supabase';

const useCategoriesStore = create(
  persist(
    (set, get) => {
      const isSupabaseConfigured = () => {
        return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      };

      return {
        categories: initialCategories,
        loading: false,
        error: null,
        
        loadCategories: async () => {
          if (!isSupabaseConfigured()) {
            return get().categories;
          }

          set({ loading: true, error: null });
          try {
            const data = await categoriesService.getAll();
            set({ categories: data, loading: false });
            return data;
          } catch (error) {
            console.error('Error loading categories:', error);
            set({ error: error.message, loading: false });
            return get().categories;
          }
        },
        
        addCategory: async (category) => {
          if (isSupabaseConfigured()) {
            try {
              const data = await categoriesService.create(category);
              set((state) => ({
                categories: [...state.categories, data]
              }));
              return data;
            } catch (error) {
              console.error('Error adding category:', error);
              throw error;
            }
          } else {
            const newCategory = {
              ...category,
              id: Math.max(...get().categories.map(c => c.id), 0) + 1
            };
            set((state) => ({
              categories: [...state.categories, newCategory]
            }));
            return newCategory;
          }
        },
        
        updateCategory: async (id, updatedCategory) => {
          if (isSupabaseConfigured()) {
            try {
              const data = await categoriesService.update(id, updatedCategory);
              set((state) => ({
                categories: state.categories.map(c => 
                  c.id === id ? data : c
                )
              }));
              return data;
            } catch (error) {
              console.error('Error updating category:', error);
              throw error;
            }
          } else {
            set((state) => ({
              categories: state.categories.map(c => 
                c.id === id ? { ...c, ...updatedCategory } : c
              )
            }));
          }
        },
        
        deleteCategory: async (id) => {
          if (isSupabaseConfigured()) {
            try {
              await categoriesService.delete(id);
              set((state) => ({
                categories: state.categories.filter(c => c.id !== id)
              }));
            } catch (error) {
              console.error('Error deleting category:', error);
              throw error;
            }
          } else {
            set((state) => ({
              categories: state.categories.filter(c => c.id !== id)
            }));
          }
        },

        // Suscripción a cambios en tiempo real
        subscribeToChanges: () => {
          if (!isSupabaseConfigured()) {
            return () => {}; // Retornar función vacía si no hay Supabase
          }

          const channel = supabase
            .channel('categories-changes')
            .on(
              'postgres_changes',
              {
                event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'categories'
              },
              async (payload) => {
                console.log('Category change received:', payload);
                // Recargar categorías cuando hay un cambio
                await get().loadCategories();
              }
            )
            .subscribe();

          // Retornar función para desuscribirse
          return () => {
            supabase.removeChannel(channel);
          };
        },
      };
    },
    {
      name: 'wearshop-categories',
    }
  )
);

export default useCategoriesStore;
