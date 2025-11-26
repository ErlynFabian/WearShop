import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const state = useToastStore.getState();
    const existingToast = state.toasts.find(
      t => t.message === toast.message && t.type === (toast.type || 'success')
    );
    
    // Si ya existe un toast con el mismo mensaje y tipo, incrementar contador
    if (existingToast) {
      // Cancelar el timeout del toast existente
      if (existingToast.timeoutId) {
        clearTimeout(existingToast.timeoutId);
      }
      
      // Incrementar contador
      const newCount = (existingToast.count || 1) + 1;
      const newDuration = toast.duration || 3000;
      const timeoutId = setTimeout(() => {
        set((currentState) => ({
          toasts: currentState.toasts.filter((t) => t.id !== existingToast.id),
        }));
      }, newDuration);
      
      set((currentState) => ({
        toasts: currentState.toasts.map(t => 
          t.id === existingToast.id 
            ? { ...t, timeoutId, duration: newDuration, count: newCount }
            : t
        ),
      }));
      
      return existingToast.id;
    }
    
    // Si no existe, crear uno nuevo
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: toast.type || 'success', // success, error, info, warning
      message: toast.message,
      duration: toast.duration || 3000,
      count: 1, // Contador inicial
    };
    
    const timeoutId = setTimeout(() => {
      set((currentState) => ({
        toasts: currentState.toasts.filter((t) => t.id !== id),
      }));
    }, newToast.duration);
    
    newToast.timeoutId = timeoutId;
    
    set((currentState) => ({
      toasts: [...currentState.toasts, newToast],
    }));
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => {
      const toast = state.toasts.find(t => t.id === id);
      if (toast && toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
      return {
        toasts: state.toasts.filter((t) => t.id !== id),
      };
    });
  },
  
  success: (message, duration) => {
    return useToastStore.getState().addToast({ type: 'success', message, duration });
  },
  
  error: (message, duration) => {
    return useToastStore.getState().addToast({ type: 'error', message, duration });
  },
  
  info: (message, duration) => {
    return useToastStore.getState().addToast({ type: 'info', message, duration });
  },
  
  warning: (message, duration) => {
    return useToastStore.getState().addToast({ type: 'warning', message, duration });
  },
}));

export default useToastStore;

