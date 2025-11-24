import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useProductsStore from '../../context/productsStore';
import useCategoriesStore from '../../context/categoriesStore';
import useProductTypesStore from '../../context/productTypesStore';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProductsStore();
  const { categories, loadCategories } = useCategoriesStore();
  const { types, loadTypes } = useProductTypesStore();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    type: '',
    stock: '',
    image: '',
    sizes: '',
    colors: '',
    onSale: false,
    salePrice: ''
  });

  const availableTypes = useMemo(() => {
    if (!formData.category) return [];
    
    // Intentar buscar por el slug exacto primero
    let categoryTypes = types[formData.category] || [];
    
    // Si no encuentra, intentar variaciones comunes (hombres/hombre, mujeres/mujer)
    if (categoryTypes.length === 0) {
      if (formData.category === 'hombres') {
        categoryTypes = types['hombre'] || [];
      } else if (formData.category === 'mujeres') {
        categoryTypes = types['mujer'] || [];
      }
    }
    
    console.log('Available types for category', formData.category, ':', categoryTypes, 'All types:', types);
    return categoryTypes;
  }, [formData.category, types]);

  // Asegurar que los datos se carguen al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCategories(),
        loadTypes()
      ]);
    };
    loadData();
  }, [loadCategories, loadTypes]);

  // Debug: mostrar tipos cuando cambian
  useEffect(() => {
    console.log('Types updated:', types);
    if (formData.category) {
      console.log('Types for category', formData.category, ':', types[formData.category]);
    }
  }, [types, formData.category]);

  // Limpiar tipo cuando cambia la categoría
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ ...prev, type: '' }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
    addProduct({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : []
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
        <h2 className="text-5xl font-black text-black mb-2">Crear Producto</h2>
        <p className="text-gray-600">Agrega un nuevo producto a tu tienda</p>
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
                placeholder="Ej: Air Max Classic"
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
                placeholder="129.99"
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
                <option value="">Seleccionar categoría</option>
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
                disabled={!formData.category || availableTypes.length === 0}
              >
                <option value="">
                  {!formData.category 
                    ? 'Selecciona una categoría primero' 
                    : availableTypes.length === 0 
                    ? 'No hay tipos disponibles' 
                    : 'Seleccionar tipo'}
                </option>
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
                placeholder="100"
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
                placeholder="Descripción del producto..."
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
            <span>Guardar Producto</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

