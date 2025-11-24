import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productTypesService } from '../services/productTypesService';
import { supabase } from '../lib/supabase';

const useProductTypesStore = create(
  persist(
    (set, get) => {
      const isSupabaseConfigured = () => {
        return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      };

      // Normalizar nombre de categoría (hombres/hombre, mujeres/mujer)
      const normalizeCategory = (category) => {
        if (category === 'hombres') return 'hombre';
        if (category === 'mujeres') return 'mujer';
        return category;
      };

      // Convertir array de tipos a objeto por categoría
      const arrayToObject = (types) => {
        const result = {};
        types.forEach(type => {
          // Normalizar la categoría al guardar
          const normalizedCategory = normalizeCategory(type.category);
          if (!result[normalizedCategory]) {
            result[normalizedCategory] = [];
          }
          result[normalizedCategory].push({
            value: type.value,
            label: type.label,
            id: type.id, // Incluir id para operaciones de Supabase
            position: type.position
          });
        });
        // Ordenar los tipos dentro de cada categoría por su posición
        Object.keys(result).forEach(category => {
          result[category].sort((a, b) => (a.position || 0) - (b.position || 0));
        });
        return result;
      };

      // Convertir objeto por categoría a array
      const objectToArray = (typesObj) => {
        const result = [];
        Object.keys(typesObj).forEach(category => {
          typesObj[category].forEach((type, index) => {
            result.push({
              category,
              value: type.value,
              label: type.label,
              position: index
            });
          });
        });
        return result;
      };

              return {
                types: {},
                loading: false,
                error: null,
        
        loadTypes: async () => {
          if (!isSupabaseConfigured()) {
            return get().types;
          }

          set({ loading: true, error: null });
          try {
            const data = await productTypesService.getAll();
            console.log('Raw types data from Supabase:', data);
            
            // Si hay datos en Supabase, usarlos
            if (data && data.length > 0) {
              const typesObj = arrayToObject(data);
              console.log('Loaded types from Supabase (converted):', typesObj);
              set({ types: typesObj, loading: false });
              return typesObj;
                    } else {
                      // Si no hay datos en Supabase, usar objeto vacío
                      console.log('No types in Supabase, using empty object');
                      set({ types: {}, loading: false });
                      return {};
                    }
                  } catch (error) {
                    console.error('Error loading product types:', error);
                    set({ error: error.message, loading: false });
                    // Si hay error, mantener los tipos actuales o objeto vacío
                    return get().types || {};
                  }
        },
        
        addType: async (category, type) => {
          // Normalizar la categoría antes de guardar
          const normalizedCategory = normalizeCategory(category);
          const categoryTypes = get().types[normalizedCategory] || [];
          const exists = categoryTypes.some(t => t.value === type.value);
          if (exists) return;

          if (isSupabaseConfigured()) {
            try {
              const position = categoryTypes.length;
              await productTypesService.create({
                category: normalizedCategory, // Guardar con categoría normalizada
                value: type.value,
                label: type.label,
                position
              });
              // Recargar tipos desde Supabase para asegurar consistencia
              await get().loadTypes();
            } catch (error) {
              console.error('Error adding product type:', error);
              throw error;
            }
          } else {
            set((state) => ({
              types: {
                ...state.types,
                [normalizedCategory]: [...categoryTypes, type]
              }
            }));
          }
        },
        
        updateType: async (category, oldValue, newType) => {
          const normalizedCategory = normalizeCategory(category);
          if (isSupabaseConfigured()) {
            try {
              const types = await productTypesService.getByCategory(normalizedCategory);
              const typeToUpdate = types.find(t => t.value === oldValue);
              if (typeToUpdate) {
                await productTypesService.update(typeToUpdate.id, {
                  value: newType.value,
                  label: newType.label
                });
              }
              // Recargar tipos desde Supabase
              await get().loadTypes();
            } catch (error) {
              console.error('Error updating product type:', error);
              throw error;
            }
          } else {
            set((state) => ({
              types: {
                ...state.types,
                [normalizedCategory]: state.types[normalizedCategory].map(t => 
                  t.value === oldValue ? newType : t
                )
              }
            }));
          }
        },
        
        deleteType: async (category, typeValue) => {
          const normalizedCategory = normalizeCategory(category);
          if (isSupabaseConfigured()) {
            try {
              const types = await productTypesService.getByCategory(normalizedCategory);
              const typeToDelete = types.find(t => t.value === typeValue);
              if (typeToDelete) {
                await productTypesService.delete(typeToDelete.id);
              }
              // Recargar tipos desde Supabase
              await get().loadTypes();
            } catch (error) {
              console.error('Error deleting product type:', error);
              throw error;
            }
          } else {
            set((state) => ({
              types: {
                ...state.types,
                [normalizedCategory]: state.types[normalizedCategory].filter(t => t.value !== typeValue)
              }
            }));
          }
        },
        
        moveType: async (category, typeValue, direction) => {
          const normalizedCategory = normalizeCategory(category);
          const categoryTypes = [...(get().types[normalizedCategory] || [])];
          const index = categoryTypes.findIndex(t => t.value === typeValue);
          
          if (index === -1) return;
          if (direction === 'up' && index === 0) return;
          if (direction === 'down' && index === categoryTypes.length - 1) return;
          
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          [categoryTypes[index], categoryTypes[newIndex]] = [categoryTypes[newIndex], categoryTypes[index]];

          if (isSupabaseConfigured()) {
            try {
              const types = await productTypesService.getByCategory(normalizedCategory);
              // Actualizar posiciones en Supabase
              for (let i = 0; i < categoryTypes.length; i++) {
                const type = types.find(t => t.value === categoryTypes[i].value);
                if (type) {
                  await productTypesService.updatePosition(type.id, i);
                }
              }
            } catch (error) {
              console.error('Error moving product type:', error);
            }
          }

          set((state) => ({
            types: {
              ...state.types,
              [normalizedCategory]: categoryTypes
            }
          }));
        },

        // Suscripción a cambios en tiempo real
        subscribeToChanges: () => {
          if (!isSupabaseConfigured()) {
            return () => {}; // Retornar función vacía si no hay Supabase
          }

          const channel = supabase
            .channel('product-types-changes')
            .on(
              'postgres_changes',
              {
                event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'product_types'
              },
              async (payload) => {
                console.log('Product type change received:', payload);
                // Recargar tipos cuando hay un cambio
                await get().loadTypes();
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
      name: 'wearshop-product-types',
      // Solo persistir si hay tipos, no objetos vacíos
      partialize: (state) => {
        const hasTypes = Object.keys(state.types).length > 0;
        return {
          types: hasTypes ? state.types : {},
        };
      },
    }
  )
);

export default useProductTypesStore;
