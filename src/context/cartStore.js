import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useToastStore from './toastStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => {
        const state = get();
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
          useToastStore.getState().success(`Cantidad de "${product.name}" actualizada en el carrito`);
        } else {
          set({
          items: [...state.items, { ...product, quantity: 1 }]
          });
          useToastStore.getState().success(`"${product.name}" agregado al carrito`);
        }
      },
      
      removeItem: (productId) => {
        const state = get();
        const item = state.items.find(item => item.id === productId);
        set({
        items: state.items.filter(item => item.id !== productId)
        });
        if (item) {
          useToastStore.getState().info(`"${item.name}" eliminado del carrito`);
        }
      },
      
      updateQuantity: (productId, quantity) => {
        const state = get();
        const item = state.items.find(item => item.id === productId);
        const newItems = state.items.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0);
        
        set({ items: newItems });
        
        if (item && quantity === 0) {
          useToastStore.getState().info(`"${item.name}" eliminado del carrito`);
        } else if (item && quantity > item.quantity) {
          useToastStore.getState().success(`Cantidad de "${item.name}" actualizada`);
        }
      },
      
      clearCart: () => {
        set({ items: [] });
        useToastStore.getState().info('Carrito vaciado');
      },
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
    }),
    {
      name: 'wearshop-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;

