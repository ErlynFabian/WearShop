import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { salesService } from '../../services/salesService';
import useProductsStore from '../../context/productsStore';
import AlertModal from '../../components/admin/AlertModal';
import { formatPrice } from '../../utils/formatPrice';
import useToastStore from '../../context/toastStore';

const CreateSale = () => {
  const navigate = useNavigate();
  const { products } = useProductsStore();
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    quantity: 1,
    price: '',
    total: '',
    cost: 0,
    profit: 0,
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    status: 'pending',
    notes: ''
  });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });
  const [productSearch, setProductSearch] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProductStock, setSelectedProductStock] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Calcular total y ganancias automáticamente
      if (name === 'quantity' || name === 'price') {
        const qty = name === 'quantity' ? parseInt(value) || 0 : parseInt(prev.quantity) || 0;
        const price = name === 'price' ? parseFloat(value) || 0 : parseFloat(prev.price) || 0;
        const cost = prev.cost || 0;
        updated.total = (qty * price).toFixed(2);
        updated.profit = (qty * price - qty * cost).toFixed(2);
      }
      
      // Validar stock cuando se cambia la cantidad
      if (name === 'quantity' && selectedProductStock !== null) {
        const requestedQty = parseInt(value) || 0;
        if (requestedQty > selectedProductStock) {
          setAlertModal({
            isOpen: true,
            title: 'Stock Insuficiente',
            message: `No hay suficiente stock. Stock disponible: ${selectedProductStock} unidades.`,
            type: 'error'
          });
        }
      }
      
      return updated;
    });
  };

  const handleProductSearch = (e) => {
    const searchValue = e.target.value;
    setProductSearch(searchValue);
    
    if (searchValue.trim() === '') {
      setProductSuggestions([]);
      setShowSuggestions(false);
      // Limpiar datos del producto si se borra el input
      setFormData(prev => ({
        ...prev,
        product_id: '',
        product_name: '',
        price: '',
        cost: 0,
        total: '',
        profit: 0
      }));
      setSelectedProductStock(null);
      return;
    }
    
    // Buscar productos que coincidan con el texto ingresado
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    ).slice(0, 10); // Limitar a 10 sugerencias
    
    setProductSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleProductSelect = async (product) => {
    // Obtener el stock disponible considerando ventas pendientes
    const availableStock = await salesService.getAvailableStock(product.id);
    
    // Validar si el producto tiene stock disponible
    if (availableStock <= 0) {
      setAlertModal({
        isOpen: true,
        title: 'Producto Sin Stock',
        message: 'Este producto no tiene stock disponible. Hay ventas pendientes que reservan el stock.',
        type: 'error'
      });
      return;
    }
    
    const price = product.onSale && product.salePrice ? product.salePrice : product.price;
    const cost = product.cost || 0;
    const quantity = Math.min(formData.quantity || 1, availableStock); // Ajustar cantidad al stock disponible
    
    // Si la cantidad solicitada excede el stock disponible, ajustarla y mostrar advertencia
    if ((formData.quantity || 1) > availableStock) {
      setAlertModal({
        isOpen: true,
        title: 'Stock Insuficiente',
        message: `El stock disponible es ${availableStock} unidades (considerando ventas pendientes). La cantidad se ha ajustado automáticamente.`,
        type: 'warning'
      });
    }
    
    setProductSearch(`${product.name} - ${formatPrice(price)}`);
    setProductSuggestions([]);
    setShowSuggestions(false);
    setSelectedProductStock(availableStock);
    
    setFormData(prev => ({
      ...prev,
      product_id: product.id,
      product_name: product.name,
      price: price.toFixed(2),
      cost: cost,
      quantity: quantity,
      total: (quantity * price).toFixed(2),
      profit: (quantity * price - quantity * cost).toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un producto
    if (!formData.product_id) {
      setAlertModal({
        isOpen: true,
        title: 'Producto Requerido',
        message: 'Debes seleccionar un producto para realizar la venta.',
        type: 'error'
      });
      return;
    }
    
    // Obtener el stock disponible actualizado (considerando ventas pendientes)
    const availableStock = await salesService.getAvailableStock(formData.product_id);
    
    // Validar stock antes de crear la venta
    if (availableStock <= 0) {
      setAlertModal({
        isOpen: true,
        title: 'Producto Sin Stock',
        message: 'El producto seleccionado no tiene stock disponible. Hay ventas pendientes que reservan el stock.',
        type: 'error'
      });
      return;
    }
    
    const requestedQuantity = parseInt(formData.quantity) || 0;
    if (requestedQuantity > availableStock) {
      setAlertModal({
        isOpen: true,
        title: 'Stock Insuficiente',
        message: `No hay suficiente stock disponible. Stock disponible: ${availableStock} unidades (considerando ventas pendientes). Cantidad solicitada: ${requestedQuantity} unidades.`,
        type: 'error'
      });
      return;
    }
    
    try {
      await salesService.create({
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        total: parseFloat(formData.total),
        cost: parseFloat(formData.cost) || 0,
        profit: parseFloat(formData.profit) || 0
      });
      
      // Calcular el mes actual en formato YYYY-MM
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Mostrar toast de éxito
      useToastStore.getState().success('¡Venta creada exitosamente!');
      
      // Navegar a la vista de ventas con el mes actual seleccionado
      navigate('/admin/sales', {
        state: {
          selectedMonth: currentMonth,
          showSuccessAlert: true
        }
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al crear la venta. Inténtalo de nuevo.',
        type: 'error'
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/sales"
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Volver a Ventas</span>
        </Link>
      </div>

      <h2 className="text-5xl font-black text-black mb-6">Registrar Nueva Venta</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto *
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={handleProductSearch}
                onFocus={() => {
                  if (productSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay para permitir el click en las sugerencias
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                required={!formData.product_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Buscar producto por nombre..."
              />
              {showSuggestions && productSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {productSuggestions.map((product) => {
                    const price = product.onSale && product.salePrice ? product.salePrice : product.price;
                    const stock = product.stock || 0;
                    const hasStock = stock > 0;
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductSelect(product)}
                        disabled={!hasStock}
                        className={`w-full text-left px-4 py-2 transition-colors border-b border-gray-100 last:border-b-0 ${
                          hasStock
                            ? 'hover:bg-gray-100'
                            : 'bg-gray-50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">{formatPrice(price)}</div>
                          <div className={`text-xs font-medium ${
                            hasStock ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {hasStock ? `Stock: ${stock}` : 'Sin stock'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad *
                {selectedProductStock !== null && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (Stock disponible: {selectedProductStock} unidades)
                  </span>
                )}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                max={selectedProductStock !== null ? selectedProductStock : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                  selectedProductStock !== null && parseInt(formData.quantity) > selectedProductStock
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              {selectedProductStock !== null && parseInt(formData.quantity) > selectedProductStock && (
                <p className="mt-1 text-xs text-red-600">
                  La cantidad excede el stock disponible ({selectedProductStock} unidades)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario (RD$) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de Venta (RD$) *
              </label>
              <input
                type="text"
                value={formatPrice(formData.total)}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-green-800 mb-2">
                Ganancias (RD$)
              </label>
              <div className="text-2xl font-bold text-green-700">
                {formatPrice(formData.profit)}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Total: {formatPrice(formData.total)} - Costo: {formatPrice((formData.quantity * formData.cost).toFixed(2))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="pending">Pendiente</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono del Cliente
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Ej: +1 809 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email del Cliente
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Ej: cliente@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                placeholder="Notas adicionales sobre la venta..."
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/sales')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              !formData.product_id || 
              selectedProductStock === null || 
              selectedProductStock <= 0 ||
              parseInt(formData.quantity) > selectedProductStock
            }
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-yellow-400 disabled:hover:to-amber-500"
          >
            <FiSave className="w-5 h-5" />
            <span>Guardar Venta</span>
          </button>
        </div>
      </form>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default CreateSale;

