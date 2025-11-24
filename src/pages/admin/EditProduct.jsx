import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useProductsStore from '../../context/productsStore';
import useCategoriesStore from '../../context/categoriesStore';
import useProductTypesStore from '../../context/productTypesStore';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProductsStore();
  const { categories } = useCategoriesStore();
  const { types } = useProductTypesStore();

  const product = products.find(p => p.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'hombre',
    type: '',
    stock: '',
    image: '',
    sizes: '',
    colors: '',
    onSale: false,
    salePrice: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category: product.category || 'hombre',
        type: product.type || '',
        stock: product.stock || '',
        image: product.image || '',
        sizes: product.sizes ? product.sizes.join(', ') : '',
        colors: product.colors ? product.colors.join(', ') : '',
        onSale: product.onSale || false,
        salePrice: product.salePrice || ''
      });
    }
  }, [product]);

  const availableTypes = useMemo(() => {
    return types[formData.category] || [];
  }, [formData.category, types]);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Producto no encontrado</p>
        <Link to="/admin/products" className="text-yellow-500 hover:underline mt-4 inline-block">
          Volver a Productos
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(product.id, {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : [],
      onSale: formData.onSale || false,
      salePrice: formData.onSale && formData.salePrice ? parseFloat(formData.salePrice) : null
    });
    navigate('/admin/products');
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Volver a Productos</span>
        </Link>
        <h2 className="text-5xl font-black text-black mb-2">Editar Producto</h2>
        <p className="text-gray-600">Modifica la información del producto</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
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
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
                <option value="ofertas">Ofertas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de prenda
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">Seleccionar tipo</option>
                {availableTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tallas disponibles (separadas por comas)
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="38, 39, 40, 41, 42, 43, 44"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colores disponibles (separados por comas)
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Negro, Blanco, Rojo, Azul"
              />
            </div>

            {/* Oferta */}
            <div className="col-span-2 border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  name="onSale"
                  id="onSale"
                  checked={formData.onSale}
                  onChange={handleChange}
                  className="w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                />
                <label htmlFor="onSale" className="text-sm font-medium text-gray-700">
                  Producto en oferta
                </label>
              </div>
              {formData.onSale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de oferta *
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required={formData.onSale}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Ej: 99.99"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Precio original: ${formData.price || '0.00'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-4">
          <Link
            to="/admin/products"
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
          >
            <FiSave className="w-5 h-5" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

