import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import useProductsStore from '../context/productsStore';
import { formatPrice } from '../utils/formatPrice';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const { products } = useProductsStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.toLowerCase().includes(searchLower);
      const typeMatch = product.type?.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
      
      return nameMatch || categoryMatch || typeMatch || descriptionMatch;
    });

    setResults(filtered.slice(0, 8)); // Limitar a 8 resultados
  }, [searchTerm, products]);

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
    onClose();
    setSearchTerm('');
  };

  const handleViewAll = () => {
    navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
    onClose();
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && searchTerm.trim() !== '') {
      handleViewAll();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-black"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {searchTerm.trim() === '' ? (
                <div className="text-center text-gray-500 py-8">
                  <FiSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Escribe para buscar productos</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="mb-2">No se encontraron productos</p>
                  <p className="text-sm">Intenta con otros términos de búsqueda</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-black truncate">{product.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                          <p className="text-lg font-bold text-black">
                            {product.onSale && product.salePrice ? (
                              <>
                                <span className="text-red-600">{formatPrice(product.salePrice)}</span>
                                <span className="text-gray-400 line-through ml-2 text-sm">{formatPrice(product.price)}</span>
                              </>
                            ) : (
                              formatPrice(product.price)
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {results.length >= 8 && (
                    <button
                      onClick={handleViewAll}
                      className="w-full mt-4 py-3 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Ver todos los resultados
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

