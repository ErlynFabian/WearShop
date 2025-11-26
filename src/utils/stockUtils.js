/**
 * Utilidades para gestión de inventario/stock
 */

// Umbral para considerar "bajo stock" (puede ser configurable)
const LOW_STOCK_THRESHOLD = 5;

/**
 * Determina el estado del stock de un producto
 * @param {number} stock - Cantidad de stock disponible
 * @returns {string} - 'out_of_stock' | 'low_stock' | 'in_stock'
 */
export const getStockStatus = (stock) => {
  if (stock === 0 || stock === null || stock === undefined) {
    return 'out_of_stock';
  }
  if (stock < LOW_STOCK_THRESHOLD) {
    return 'low_stock';
  }
  return 'in_stock';
};

/**
 * Obtiene el texto descriptivo del estado del stock
 * @param {number} stock - Cantidad de stock disponible
 * @returns {string} - Texto descriptivo
 */
export const getStockStatusText = (stock) => {
  const status = getStockStatus(stock);
  switch (status) {
    case 'out_of_stock':
      return 'Agotado';
    case 'low_stock':
      return 'Bajo Stock';
    case 'in_stock':
      return 'En Stock';
    default:
      return 'Desconocido';
  }
};

/**
 * Obtiene el color/clase CSS para el estado del stock
 * @param {number} stock - Cantidad de stock disponible
 * @returns {string} - Clases CSS de Tailwind
 */
export const getStockStatusColor = (stock) => {
  const status = getStockStatus(stock);
  switch (status) {
    case 'out_of_stock':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'low_stock':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in_stock':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Filtra productos por estado de stock
 * @param {Array} products - Array de productos
 * @param {string} stockFilter - 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
 * @returns {Array} - Productos filtrados
 */
export const filterProductsByStock = (products, stockFilter) => {
  if (stockFilter === 'all') {
    return products;
  }
  
  return products.filter(product => {
    const status = getStockStatus(product.stock);
    return status === stockFilter;
  });
};

/**
 * Obtiene productos con bajo stock
 * @param {Array} products - Array de productos
 * @returns {Array} - Productos con bajo stock
 */
export const getLowStockProducts = (products) => {
  return products.filter(product => getStockStatus(product.stock) === 'low_stock');
};

/**
 * Obtiene productos agotados
 * @param {Array} products - Array de productos
 * @returns {Array} - Productos agotados
 */
export const getOutOfStockProducts = (products) => {
  return products.filter(product => getStockStatus(product.stock) === 'out_of_stock');
};

/**
 * Obtiene productos críticos (agotados + bajo stock)
 * @param {Array} products - Array de productos
 * @returns {Array} - Productos críticos
 */
export const getCriticalStockProducts = (products) => {
  return products.filter(product => {
    const status = getStockStatus(product.stock);
    return status === 'out_of_stock' || status === 'low_stock';
  });
};

export { LOW_STOCK_THRESHOLD };

