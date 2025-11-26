import { useEffect, useRef } from 'react';
import useProductsStore from '../context/productsStore';
import useCategoriesStore from '../context/categoriesStore';
import useProductTypesStore from '../context/productTypesStore';
import useSiteConfigStore from '../context/siteConfigStore';

export const useLoadData = () => {
  const { loadProducts, subscribeToChanges: subscribeToProducts } = useProductsStore();
  const { loadCategories, subscribeToChanges: subscribeToCategories } = useCategoriesStore();
  const { loadTypes, subscribeToChanges: subscribeToProductTypes } = useProductTypesStore();
  const { loadConfig, subscribeToChanges: subscribeToSiteConfig } = useSiteConfigStore();
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Cargar datos siempre al montar la aplicación
    const loadAllData = async () => {
      console.log('Cargando datos desde Supabase...');
      try {
        await Promise.all([
          loadProducts(),
          loadCategories(),
          loadTypes(),
          loadConfig(), // Cargar configuración del sitio
        ]);
        console.log('Datos cargados exitosamente');
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    // Cargar datos inmediatamente
    loadAllData();
    hasLoaded.current = true;

    // Suscribirse a cambios en tiempo real para las 4 tablas
    const unsubscribeProducts = subscribeToProducts();
    const unsubscribeCategories = subscribeToCategories();
    const unsubscribeProductTypes = subscribeToProductTypes();
    const unsubscribeSiteConfig = subscribeToSiteConfig();

    // Limpiar suscripciones al desmontar
    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeProductTypes) unsubscribeProductTypes();
      if (unsubscribeSiteConfig) unsubscribeSiteConfig();
    };
  }, [loadProducts, loadCategories, loadTypes, loadConfig, subscribeToProducts, subscribeToCategories, subscribeToProductTypes, subscribeToSiteConfig]); // Incluir dependencias para recargar si cambian
};

