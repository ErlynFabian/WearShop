import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import useProductsStore from '../context/productsStore';
import useProductTypesStore from '../context/productTypesStore';

const Ofertas = () => {
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
  const ofertasProducts = products.filter(p => p.onSale === true);
  
  // Agrupar productos por tipo
  const productsByType = ofertasProducts.reduce((acc, product) => {
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
    const categoryTypes = types['ofertas'] || [];
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

  const displayedProducts = selectedType 
    ? productsByType[selectedType] || []
    : ofertasProducts;

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-black mb-4"
        >
          OFERTAS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-8"
        >
          Aprovecha nuestras mejores ofertas
        </motion.p>

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

        {/* Productos agrupados por tipo si no hay filtro */}
        {!selectedType ? (
          orderedTypes.length > 0 ? (
            orderedTypes.map((type) => (
              <div key={type} className="mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-black mb-8"
                >
                  {typeLabels[type] || type}
                </motion.h2>
                <ProductGrid products={productsByType[type]} />
              </div>
            ))
          ) : (
            <ProductGrid products={ofertasProducts} />
          )
        ) : (
          <ProductGrid products={displayedProducts} />
        )}
      </div>
    </div>
  );
};

export default Ofertas;

