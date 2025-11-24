import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { salesService } from '../../services/salesService';
import useProductsStore from '../../context/productsStore';
import AlertModal from '../../components/admin/AlertModal';

const EditSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductsStore();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    quantity: 1,
    price: '',
    total: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    status: 'completed',
    notes: ''
  });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });

  useEffect(() => {
    loadSale();
  }, [id]);

  const loadSale = async () => {
    setLoading(true);
    try {
      const sales = await salesService.getAll();
      const sale = sales.find(s => s.id === parseInt(id));
      
      if (sale) {
        setFormData({
          product_id: sale.product_id || '',
          product_name: sale.product_name || '',
          quantity: sale.quantity || 1,
          price: sale.price || '',
          total: sale.total || '',
          customer_name: sale.customer_name || '',
          customer_phone: sale.customer_phone || '',
          customer_email: sale.customer_email || '',
          status: sale.status || 'completed',
          notes: sale.notes || ''
        });
      }
    } catch (error) {
      console.error('Error loading sale:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al cargar la venta',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Calcular total automáticamente
      if (name === 'quantity' || name === 'price') {
        const qty = name === 'quantity' ? parseInt(value) || 0 : parseInt(prev.quantity) || 0;
        const price = name === 'price' ? parseFloat(value) || 0 : parseFloat(prev.price) || 0;
        updated.total = (qty * price).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const price = product.onSale && product.salePrice ? product.salePrice : product.price;
      setFormData(prev => ({
        ...prev,
        product_id: productId,
        product_name: product.name,
        price: price.toFixed(2),
        total: (prev.quantity * price).toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        product_id: '',
        product_name: '',
        price: '',
        total: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await salesService.update(parseInt(id), {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        total: parseFloat(formData.total)
      });
      navigate('/admin/sales');
    } catch (error) {
      console.error('Error updating sale:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al actualizar la venta. Inténtalo de nuevo.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando venta...</p>
      </div>
    );
  }

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

      <h2 className="text-5xl font-black text-black mb-6">Editar Venta</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto *
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleProductChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - RD${(product.onSale && product.salePrice ? product.salePrice : product.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
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
                Total (RD$) *
              </label>
              <input
                type="text"
                value={formData.total}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
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
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
          >
            <FiSave className="w-5 h-5" />
            <span>Guardar Cambios</span>
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

export default EditSale;

