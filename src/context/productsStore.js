import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productsService } from '../services/productsService';
import { supabase } from '../lib/supabase';

const useProductsStore = create(
  persist(
    (set, get) => {
      // Función helper para verificar si Supabase está configurado
      const isSupabaseConfigured = () => {
        return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      };

      return {
        products: [],
        loading: false,
        error: null,
        
        // Cargar productos desde Supabase o usar datos iniciales
        loadProducts: async () => {
          const isSupabase = isSupabaseConfigured();
          
          if (!isSupabase) {
            console.warn('Supabase no está configurado');
            return get().products;
          }

          set({ loading: true, error: null });
          try {
            const data = await productsService.getAll();
            // Mapear snake_case a camelCase
            const mappedData = data.map(item => ({
              id: item.id,
              name: item.name,
              price: parseFloat(item.price),
              description: item.description,
              category: item.category,
              type: item.type,
              stock: item.stock || 0,
              image: item.image,
              sizes: item.sizes || [],
              colors: item.colors || [],
              featured: item.featured || false,
              onSale: item.on_sale || false,
              salePrice: item.sale_price ? parseFloat(item.sale_price) : null,
            }));
            set({ products: mappedData, loading: false });
            console.log('Productos cargados desde Supabase:', mappedData.length);
            return mappedData;
          } catch (error) {
            console.error('Error loading products:', error);
            set({ error: error.message, loading: false });
            // Si hay error, mantener los productos actuales o array vacío
            const currentProducts = get().products;
            return currentProducts && currentProducts.length > 0 ? currentProducts : [];
          }
        },
        
        addProduct: async (product) => {
          // Mapear camelCase a snake_case para Supabase
          const supabaseProduct = {
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            type: product.type || null,
            stock: product.stock || 0,
            image: product.image,
            sizes: product.sizes || [],
            colors: product.colors || [],
            featured: product.featured || false,
            on_sale: product.onSale || false,
            sale_price: product.salePrice || null,
          };

          if (isSupabaseConfigured()) {
            try {
              const data = await productsService.create(supabaseProduct);
              const mappedData = {
                id: data.id,
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                category: data.category,
                type: data.type,
                stock: data.stock || 0,
                image: data.image,
                sizes: data.sizes || [],
                colors: data.colors || [],
                featured: data.featured || false,
                onSale: data.on_sale || false,
                salePrice: data.sale_price ? parseFloat(data.sale_price) : null,
              };
              set((state) => ({
                products: [...state.products, mappedData]
              }));
              return mappedData;
            } catch (error) {
              console.error('Error adding product:', error);
              throw error;
            }
          } else {
            // Fallback a localStorage
            const newProduct = {
              ...product,
              id: Math.max(...get().products.map(p => p.id), 0) + 1
            };
            set((state) => ({
              products: [...state.products, newProduct]
            }));
            return newProduct;
          }
        },
        
        updateProduct: async (id, updatedProduct) => {
          if (isSupabaseConfigured()) {
            try {
              const supabaseProduct = {
                name: updatedProduct.name,
                price: updatedProduct.price,
                description: updatedProduct.description,
                category: updatedProduct.category,
                type: updatedProduct.type || null,
                stock: updatedProduct.stock || 0,
                image: updatedProduct.image,
                sizes: updatedProduct.sizes || [],
                colors: updatedProduct.colors || [],
                featured: updatedProduct.featured || false,
                on_sale: updatedProduct.onSale || false,
                sale_price: updatedProduct.salePrice || null,
              };
              const data = await productsService.update(id, supabaseProduct);
              const mappedData = {
                id: data.id,
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                category: data.category,
                type: data.type,
                stock: data.stock || 0,
                image: data.image,
                sizes: data.sizes || [],
                colors: data.colors || [],
                featured: data.featured || false,
                onSale: data.on_sale || false,
                salePrice: data.sale_price ? parseFloat(data.sale_price) : null,
              };
              set((state) => ({
                products: state.products.map(p => 
                  p.id === id ? mappedData : p
                )
              }));
              return mappedData;
            } catch (error) {
              console.error('Error updating product:', error);
              throw error;
            }
          } else {
            // Fallback a localStorage
            set((state) => ({
              products: state.products.map(p => 
                p.id === id ? { ...p, ...updatedProduct } : p
              )
            }));
          }
        },
        
        deleteProduct: async (id) => {
          if (isSupabaseConfigured()) {
            try {
              await productsService.delete(id);
              set((state) => ({
                products: state.products.filter(p => p.id !== id)
              }));
            } catch (error) {
              console.error('Error deleting product:', error);
              throw error;
            }
          } else {
            // Fallback a localStorage
            set((state) => ({
              products: state.products.filter(p => p.id !== id)
            }));
          }
        },
        
        toggleFeatured: async (id) => {
          const product = get().products.find(p => p.id === id);
          if (!product) return;
          
          await get().updateProduct(id, { ...product, featured: !product.featured });
        },

        // Suscripción a cambios en tiempo real
        subscribeToChanges: () => {
          if (!isSupabaseConfigured()) {
            return () => {}; // Retornar función vacía si no hay Supabase
          }

          const channel = supabase
            .channel('products-changes')
            .on(
              'postgres_changes',
              {
                event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'products'
              },
              async (payload) => {
                console.log('Change received:', payload);
                // Recargar productos cuando hay un cambio
                await get().loadProducts();
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
      name: 'wearshop-products',
      // Solo persistir si hay productos, no arrays vacíos
      partialize: (state) => ({
        products: state.products.length > 0 ? state.products : [],
      }),
    }
  )
);

export default useProductsStore;
