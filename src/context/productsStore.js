import { create } from 'zustand';
import { productsService } from '../services/productsService';
import { supabase } from '../lib/supabase';

const useProductsStore = create(
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
              cost: item.cost ? parseFloat(item.cost) : 0,
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
              created_at: item.created_at || null,
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
            cost: product.cost || 0,
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
                cost: data.cost ? parseFloat(data.cost) : 0,
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
                created_at: data.created_at || null,
              };
              // Verificar si el producto ya existe antes de agregarlo (evitar duplicados de la suscripción)
              const currentProducts = get().products;
              const productExists = currentProducts.some(p => p.id === mappedData.id);
              if (!productExists) {
                set((state) => ({
                  products: [...state.products, mappedData]
                }));
              }
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
                cost: updatedProduct.cost || 0,
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
                cost: data.cost ? parseFloat(data.cost) : 0,
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
                created_at: data.created_at || null,
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
          
          // Actualización optimista: actualizar el estado inmediatamente
          const newFeaturedStatus = !product.featured;
          set((state) => ({
            products: state.products.map(p => 
              p.id === id ? { ...p, featured: newFeaturedStatus } : p
            )
          }));
          
          // Actualizar solo el campo featured en la base de datos (más rápido)
          if (isSupabaseConfigured()) {
            try {
              const { data, error } = await supabase
                .from('products')
                .update({ featured: newFeaturedStatus })
                .eq('id', id)
                .select()
                .single();
              
              if (error) throw error;
              
              // Actualizar solo el campo featured, preservando todos los demás campos del producto
              set((state) => ({
                products: state.products.map(p => 
                  p.id === id ? { 
                    ...p, 
                    featured: data.featured || false 
                  } : p
                )
              }));
            } catch (error) {
              console.error('Error updating featured status:', error);
              // Si falla, revertir el cambio
              set((state) => ({
                products: state.products.map(p => 
                  p.id === id ? { ...p, featured: product.featured } : p
                )
              }));
              throw error;
            }
          }
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
                // Actualizar el producto específico en lugar de recargar todo
                if (payload.eventType === 'UPDATE' && payload.new) {
                  const updatedProduct = payload.new;
                  set((state) => ({
                    products: state.products.map(p => {
                      if (p.id === updatedProduct.id) {
                        // Preservar la imagen existente si no viene en la actualización
                        return {
                          ...p,
                          id: updatedProduct.id,
                          name: updatedProduct.name || p.name,
                          cost: updatedProduct.cost !== undefined && updatedProduct.cost !== null ? parseFloat(updatedProduct.cost) : (p.cost || 0),
                          price: parseFloat(updatedProduct.price) || p.price,
                          description: updatedProduct.description || p.description,
                          category: updatedProduct.category || p.category,
                          type: updatedProduct.type || p.type,
                          stock: updatedProduct.stock !== undefined && updatedProduct.stock !== null ? (updatedProduct.stock || 0) : (p.stock || 0),
                          image: updatedProduct.image || p.image, // Preservar imagen existente
                          sizes: updatedProduct.sizes || p.sizes || [],
                          colors: updatedProduct.colors || p.colors || [],
                          featured: updatedProduct.featured !== undefined ? updatedProduct.featured : p.featured,
                          onSale: updatedProduct.on_sale !== undefined ? updatedProduct.on_sale : p.onSale,
                          salePrice: updatedProduct.sale_price !== undefined && updatedProduct.sale_price !== null ? parseFloat(updatedProduct.sale_price) : p.salePrice,
                          created_at: updatedProduct.created_at || p.created_at || null,
                        };
                      }
                      return p;
                    })
                  }));
                } else if (payload.eventType === 'INSERT' && payload.new) {
                  const newProduct = payload.new;
                  // Verificar si el producto ya existe en el estado (evitar duplicados)
                  const currentProducts = get().products;
                  const productExists = currentProducts.some(p => p.id === newProduct.id);
                  
                  if (!productExists) {
                    const mappedData = {
                      id: newProduct.id,
                      name: newProduct.name,
                      cost: newProduct.cost ? parseFloat(newProduct.cost) : 0,
                      price: parseFloat(newProduct.price),
                      description: newProduct.description,
                      category: newProduct.category,
                      type: newProduct.type,
                      stock: newProduct.stock || 0,
                      image: newProduct.image,
                      sizes: newProduct.sizes || [],
                      colors: newProduct.colors || [],
                      featured: newProduct.featured || false,
                      onSale: newProduct.on_sale || false,
                      salePrice: newProduct.sale_price ? parseFloat(newProduct.sale_price) : null,
                      created_at: newProduct.created_at || null,
                    };
                    set((state) => ({
                      products: [...state.products, mappedData]
                    }));
                  }
                } else if (payload.eventType === 'DELETE' && payload.old) {
                  set((state) => ({
                    products: state.products.filter(p => p.id !== payload.old.id)
                  }));
                } else {
                  // Si no podemos actualizar específicamente, recargar todo
                await get().loadProducts();
                }
              }
            )
            .subscribe();

          // Retornar función para desuscribirse
          return () => {
            supabase.removeChannel(channel);
          };
        },
      };
    }
);

export default useProductsStore;
