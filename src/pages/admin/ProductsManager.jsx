import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiStar } from 'react-icons/fi';
import useProductsStore from '../../context/productsStore';
import useToastStore from '../../context/toastStore';
import ConfirmModal from '../../components/admin/ConfirmModal';
import ProductCardSkeleton from '../../components/admin/ProductCardSkeleton';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import { formatPrice } from '../../utils/formatPrice';

const ProductsManager = () => {
  const { products, deleteProduct, toggleFeatured, loading, loadProducts } = useProductsStore();
  
  // Asegurar que los productos se carguen al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (products.length === 0 && !loading) {
        await loadProducts();
      }
    };
    loadData();
  }, []); // Solo ejecutar una vez al montar
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.productId) {
      const product = products.find(p => p.id === deleteModal.productId);
      deleteProduct(deleteModal.productId);
      setDeleteModal({ isOpen: false, productId: null });
      if (product) {
        useToastStore.getState().success(`Producto "${product.name}" eliminado correctamente`);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2 break-words">Productos</h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona todos tus productos</p>
        </div>
        <Link
          to="/admin/products/create"
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg whitespace-nowrap text-sm sm:text-base"
        >
          <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>Crear Producto</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No se encontraron productos
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-900 truncate pr-2">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                        product.featured
                          ? 'text-yellow-500 hover:bg-yellow-50'
                          : 'text-gray-300 hover:bg-gray-100 hover:text-yellow-500'
                      }`}
                      title={product.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                    >
                      <FiStar className={`w-4 h-4 ${product.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {product.category}
                    </span>
                    {product.onSale && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        En Oferta
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {product.onSale && product.salePrice ? (
                        <>
                          <span className="text-sm font-medium text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-base font-bold text-red-600">
                            {formatPrice(product.salePrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oferta
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destacado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <div className="h-16 w-16 bg-gray-200 rounded animate-pulse-fast" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse-fast" />
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse-fast" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse-fast" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse-fast" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse-fast" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-6 bg-gray-200 rounded animate-pulse-fast" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse-fast" />
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse-fast" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.onSale && product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            {formatPrice(product.salePrice)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {product.onSale ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                          En Oferta
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          product.featured
                            ? 'text-yellow-500 hover:bg-yellow-50'
                            : 'text-gray-300 hover:bg-gray-100 hover:text-yellow-500'
                        }`}
                        title={product.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                      >
                        <FiStar className={`w-5 h-5 ${product.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Desktop */}
        {totalPages > 1 && (
          <div className="hidden md:flex px-6 py-4 border-t border-gray-200 items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de{' '}
              {filteredProducts.length} productos
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Mobile */}
      {totalPages > 1 && (
        <div className="md:hidden mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de{' '}
            {filteredProducts.length} productos
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default ProductsManager;

