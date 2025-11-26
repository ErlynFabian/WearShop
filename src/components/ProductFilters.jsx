import { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useToastStore from '../context/toastStore';

const ProductFilters = ({ 
  products = [], 
  onFilterChange,
  showSizeFilter = true,
  showColorFilter = true,
  showPriceFilter = true,
  showSortFilter = true,
  initialFilters = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters || {
    minPrice: '',
    maxPrice: '',
    sizes: [],
    colors: [],
    sortBy: 'default' // default, price-asc, price-desc, name-asc, name-desc
  });

  // Sincronizar con filtros externos si se proporcionan
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Obtener todas las tallas y colores únicos de los productos
  const allSizes = [...new Set(products.flatMap(p => p.sizes || []))].sort();
  const allColors = [...new Set(products.flatMap(p => p.colors || []))].sort();

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSizeToggle = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    handleFilterChange({ sizes: newSizes });
  };

  const handleColorToggle = (color) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    handleFilterChange({ colors: newColors });
  };

  const handlePriceChange = (field, value) => {
    handleFilterChange({ [field]: value });
  };

  const handleSortChange = (sortBy) => {
    handleFilterChange({ sortBy });
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      sizes: [],
      colors: [],
      sortBy: 'default'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    useToastStore.getState().info('Filtros eliminados');
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.sizes.length > 0 || filters.colors.length > 0 || filters.sortBy !== 'default';

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FiFilter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
              {[
                filters.minPrice || filters.maxPrice ? 1 : 0,
                filters.sizes.length,
                filters.colors.length,
                filters.sortBy !== 'default' ? 1 : 0
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-black transition-colors flex items-center space-x-1"
          >
            <FiX className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              {/* Sort Filter */}
              {showSortFilter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ordenar por
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <button
                      onClick={() => handleSortChange('default')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.sortBy === 'default'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Por defecto
                    </button>
                    <button
                      onClick={() => handleSortChange('price-asc')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.sortBy === 'price-asc'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Precio: Menor
                    </button>
                    <button
                      onClick={() => handleSortChange('price-desc')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.sortBy === 'price-desc'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Precio: Mayor
                    </button>
                    <button
                      onClick={() => handleSortChange('name-asc')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.sortBy === 'name-asc'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Nombre: A-Z
                    </button>
                    <button
                      onClick={() => handleSortChange('name-desc')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.sortBy === 'name-desc'
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Nombre: Z-A
                    </button>
                  </div>
                </div>
              )}

              {/* Price Filter */}
              {showPriceFilter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rango de Precio
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        placeholder="Precio mínimo"
                        value={filters.minPrice}
                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Precio máximo"
                        value={filters.maxPrice}
                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Size Filter */}
              {showSizeFilter && allSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tallas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filters.sizes.includes(size)
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Filter */}
              {showColorFilter && allColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Colores
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorToggle(color)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filters.colors.includes(color)
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;

