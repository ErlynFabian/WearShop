import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import ProductGrid from '../components/ProductGrid';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import ProductFilters from '../components/ProductFilters';
import SEO from '../components/SEO';
import useToastStore from '../context/toastStore';
import useProductsStore from '../context/productsStore';
import useCategoriesStore from '../context/categoriesStore';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loadProducts, loading: productsLoading } = useProductsStore();
  const { categories, loadCategories } = useCategoriesStore();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sizes: [],
    colors: [],
    sortBy: 'default'
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      await Promise.all([
        loadProducts(),
        loadCategories()
      ]);
      setLoadingData(false);
    };
    fetchData();
  }, [loadProducts, loadCategories]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Búsqueda por texto
    if (query.trim() !== '') {
      const searchLower = query.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const categoryMatch = product.category?.toLowerCase().includes(searchLower);
        const typeMatch = product.type?.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
        
        return nameMatch || categoryMatch || typeMatch || descriptionMatch;
      });
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filtro por precio avanzado
    if (advancedFilters.minPrice || advancedFilters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = product.onSale && product.salePrice ? product.salePrice : product.price;
        const min = advancedFilters.minPrice ? parseFloat(advancedFilters.minPrice) : 0;
        const max = advancedFilters.maxPrice ? parseFloat(advancedFilters.maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filtro por tallas
    if (advancedFilters.sizes.length > 0) {
      filtered = filtered.filter(product => {
        return advancedFilters.sizes.some(size => (product.sizes || []).includes(size));
      });
    }

    // Filtro por colores
    if (advancedFilters.colors.length > 0) {
      filtered = filtered.filter(product => {
        return advancedFilters.colors.some(color => (product.colors || []).includes(color));
      });
    }

    // Ordenar
    if (advancedFilters.sortBy !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        switch (advancedFilters.sortBy) {
          case 'price-asc': {
            const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
            const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
            return priceA - priceB;
          }
          case 'price-desc': {
            const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
            const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
            return priceB - priceA;
          }
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, query, categoryFilter, advancedFilters]);

  // Notificación cuando no hay resultados
  useEffect(() => {
    if (!loadingData && query.trim() !== '' && filteredProducts.length === 0) {
      useToastStore.getState().warning(`No se encontraron productos para "${query}"`);
    }
  }, [filteredProducts.length, query, loadingData]);

  if (loadingData) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-gray-200 rounded mb-4 w-96 animate-pulse-fast" />
          <div className="h-6 bg-gray-200 rounded mb-8 w-48 animate-pulse-fast" />
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  const searchTitle = query ? `Resultados de búsqueda: "${query}"` : 'Búsqueda de Productos';
  const searchDescription = query 
    ? `Encuentra productos relacionados con "${query}". ${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}.`
    : 'Busca productos en nuestra tienda. Encuentra lo que necesitas fácilmente.';

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title={searchTitle}
        description={searchDescription}
        keywords={query ? `${query}, búsqueda, productos, moda` : 'búsqueda, productos, moda'}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-black text-black mb-4">
            {query ? `Resultados para "${query}"` : 'Búsqueda de Productos'}
          </h1>
          <p className="text-gray-600 text-lg">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Advanced Filters */}
        <ProductFilters 
          products={filteredProducts}
          onFilterChange={setAdvancedFilters}
          showSizeFilter={true}
          showColorFilter={true}
          showPriceFilter={true}
          showSortFilter={true}
        />

        {/* Results */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <FiSearch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-black mb-2">No se encontraron productos</h2>
            <p className="text-gray-600 mb-6">
              {query ? `No hay productos que coincidan con "${query}"` : 'Intenta buscar con otros términos'}
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white px-6 py-3 font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Volver al inicio
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProductGrid products={filteredProducts} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

