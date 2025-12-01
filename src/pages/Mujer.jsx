import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import ProductFilters from '../components/ProductFilters';
import SEO from '../components/SEO';
import useProductsStore from '../context/productsStore';
import useProductTypesStore from '../context/productTypesStore';

const Mujer = () => {
  const { products, loadProducts, loading } = useProductsStore();
  const { types, loadTypes } = useProductTypesStore();

  // Cargar productos y tipos cuando se monta el componente
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadProducts(),
        loadTypes()
      ]);
    };
    loadData();
  }, [loadProducts, loadTypes]);
  const mujerProducts = products.filter(p => {
    const category = p.category?.toLowerCase();
    return (category === 'mujer' || category === 'mujeres') && (p.stock || 0) > 0;
  });
  
  console.log('Mujer: Total productos:', products.length, 'Productos de mujer:', mujerProducts.length);
  
  // Agrupar productos por tipo
  const productsByType = mujerProducts.reduce((acc, product) => {
    const type = product.type || 'otros';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});

  // Crear labels desde el store y ordenar tipos según el orden del store
  const { typeLabels, orderedTypes } = useMemo(() => {
    const labels = {};
    const categoryTypes = types['mujer'] || [];
    categoryTypes.forEach(type => {
      labels[type.value] = type.label;
    });
    
    // Ordenar tipos según el orden del store, solo incluir los que tienen productos
    const ordered = categoryTypes
      .map(type => type.value)
      .filter(type => productsByType[type] && productsByType[type].length > 0);
    
    // Agregar tipos que no están en el store pero tienen productos
    Object.keys(productsByType).forEach(type => {
      if (!ordered.includes(type)) {
        ordered.push(type);
      }
    });
    
    return { typeLabels: labels, orderedTypes: ordered };
  }, [types, productsByType]);

  const [selectedType, setSelectedType] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sizes: [],
    colors: [],
    sortBy: 'default'
  });

  // Aplicar filtros a los productos
  const filteredProducts = useMemo(() => {
    let filtered = selectedType 
      ? productsByType[selectedType] || []
      : mujerProducts;

    // Filtro por precio
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = product.onSale && product.salePrice ? product.salePrice : product.price;
        const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filtro por tallas
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => {
        return filters.sizes.some(size => (product.sizes || []).includes(size));
      });
    }

    // Filtro por colores
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => {
        return filters.colors.some(color => (product.colors || []).includes(color));
      });
    }

    // Ordenar
    if (filters.sortBy !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
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
  }, [selectedType, productsByType, mujerProducts, filters]);

  const displayedProducts = filteredProducts;

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Ropa para Mujeres"
        description="Explora nuestra colección de ropa para mujeres. Vestidos, blusas, pantalones y más. Elegancia y moda para ella. Envíos nacionales e internacionales."
        keywords="ropa para mujeres, moda femenina, vestidos, blusas, pantalones, estilo femenino, ropa mujer"
      />
      {loading ? (
        <div className="max-w-7xl mx-auto">
          <div className="h-16 bg-gray-200 rounded mb-4 w-64 animate-pulse-fast" />
          <div className="h-6 bg-gray-200 rounded mb-8 w-48 animate-pulse-fast" />
          <ProductGridSkeleton count={8} />
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-black mb-4"
        >
          MUJER
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-8"
        >
          Elegancia y moda para ella
        </motion.p>

        {/* Filtros avanzados */}
        <ProductFilters 
          products={mujerProducts}
          onFilterChange={setFilters}
        />

        {/* Filtros por tipo */}
        {orderedTypes.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedType === null
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {orderedTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {typeLabels[type] || type}
              </button>
            ))}
          </div>
        )}

        {/* Productos agrupados por tipo si no hay filtro de tipo, pero aplicar otros filtros */}
        {!selectedType ? (
          orderedTypes.length > 0 ? (
            orderedTypes.map((type) => {
              // Aplicar filtros a cada grupo de tipo
              let typeProducts = productsByType[type] || [];
              
              // Filtro por precio
              if (filters.minPrice || filters.maxPrice) {
                typeProducts = typeProducts.filter(product => {
                  const price = product.onSale && product.salePrice ? product.salePrice : product.price;
                  const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
                  const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
                  return price >= min && price <= max;
                });
              }

              // Filtro por tallas
              if (filters.sizes.length > 0) {
                typeProducts = typeProducts.filter(product => {
                  return filters.sizes.some(size => (product.sizes || []).includes(size));
                });
              }

              // Filtro por colores
              if (filters.colors.length > 0) {
                typeProducts = typeProducts.filter(product => {
                  return filters.colors.some(color => (product.colors || []).includes(color));
                });
              }

              // Ordenar
              if (filters.sortBy !== 'default') {
                typeProducts = [...typeProducts].sort((a, b) => {
                  switch (filters.sortBy) {
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

              // Solo mostrar el tipo si tiene productos después de filtrar
              if (typeProducts.length === 0) return null;

              return (
              <div key={type} className="mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-black mb-8"
                >
                  {typeLabels[type] || type}
                </motion.h2>
                  <ProductGrid products={typeProducts} />
              </div>
              );
            })
          ) : (
            // Si no hay tipos ordenados, mostrar todos los productos con filtros aplicados
            displayedProducts.length > 0 ? (
              <ProductGrid products={displayedProducts} />
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No hay productos disponibles para este filtro</p>
              </div>
            )
          )
        ) : (
          displayedProducts.length > 0 ? (
            <ProductGrid products={displayedProducts} />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No hay productos disponibles para este filtro</p>
            </div>
          )
        )}
      </div>
      )}
    </div>
  );
};

export default Mujer;
