import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENT_PRODUCTS = 8;

const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      viewedProducts: [], // Array de { productId, viewedAt }
      
      addViewedProduct: (productId) => {
        const state = get();
        const now = new Date().toISOString();
        
        // Remover el producto si ya existe (para evitar duplicados)
        const filtered = state.viewedProducts.filter(
          item => item.productId !== productId
        );
        
        // Agregar el producto al inicio con la fecha actual
        const updated = [
          { productId, viewedAt: now },
          ...filtered
        ].slice(0, MAX_RECENT_PRODUCTS); // Mantener solo los últimos MAX_RECENT_PRODUCTS
        
        set({ viewedProducts: updated });
      },
      
      clearRecentlyViewed: () => {
        set({ viewedProducts: [] });
      },
      
      getViewedProductIds: () => {
        return get().viewedProducts.map(item => item.productId);
      },
    }),
    {
      name: 'wearshop-recently-viewed',
      partialize: (state) => ({ viewedProducts: state.viewedProducts }),
    }
  )
);

export default useRecentlyViewedStore;

