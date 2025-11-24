import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      
      login: async (username, password) => {
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (isSupabaseConfigured) {
          try {
            // En producción, usar email para autenticarse en Supabase
            // El username puede ser 'admin' pero el email debe ser admin@wearshop.com
            const email = username.includes('@') ? username : `${username}@wearshop.com`;
            
            const { data, error } = await supabase.auth.signInWithPassword({
              email: email,
              password: password,
            });

            if (error) {
              console.error('Error de autenticación:', error.message);
              return false;
            }

            if (data?.user) {
              // Autenticación exitosa en Supabase
              set({
                isAuthenticated: true,
                user: { 
                  username: username, 
                  email: data.user.email,
                  role: 'admin',
                  supabaseUser: data.user 
                }
              });
              return true;
            }
          } catch (error) {
            console.error('Error connecting to Supabase:', error);
            return false;
          }
        } else {
          // Fallback solo si Supabase no está configurado (desarrollo)
          if (username === 'admin' && password === 'admin123') {
            set({
              isAuthenticated: true,
              user: { username: 'admin', role: 'admin' }
            });
            return true;
          }
        }
        return false;
      },
      
      logout: async () => {
        // Cerrar sesión en Supabase si está autenticado
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.warn('Error signing out from Supabase:', error);
        }
        
        set({
          isAuthenticated: false,
          user: null
        });
      }
    }),
    {
      name: 'wearshop-auth',
    }
  )
);

export default useAuthStore;

