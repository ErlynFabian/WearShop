import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import useProductTypesStore from '../../context/productTypesStore';
import useCategoriesStore from '../../context/categoriesStore';
import ConfirmModal from '../../components/admin/ConfirmModal';

const ProductTypesManager = () => {
  const { types, addType, updateType, deleteType, moveType } = useProductTypesStore();
  const { categories } = useCategoriesStore();
  // Inicializar con el slug de la primera categoría o 'hombre' como fallback
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (categories.length > 0) {
      return categories[0].slug;
    }
    return 'hombre';
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    value: '',
    label: ''
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, typeValue: null });

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ value: '', label: '' });
  };

  const handleEdit = (type) => {
    setEditingKey(type.value);
    setFormData({ value: type.value, label: type.label });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingKey(null);
    setFormData({ value: '', label: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingKey) {
      updateType(selectedCategory, editingKey, formData);
    } else {
      addType(selectedCategory, formData);
    }
    handleCancel();
  };

  const handleDeleteClick = (typeValue) => {
    setDeleteModal({ isOpen: true, typeValue });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.typeValue) {
      deleteType(selectedCategory, deleteModal.typeValue);
      setDeleteModal({ isOpen: false, typeValue: null });
    }
  };

  // Buscar tipos por el slug, o intentar variaciones si no encuentra
  const getCurrentTypes = () => {
    let categoryTypes = types[selectedCategory] || [];
    
    // Si no encuentra, intentar variaciones comunes
    if (categoryTypes.length === 0) {
      if (selectedCategory === 'hombres') {
        categoryTypes = types['hombre'] || [];
      } else if (selectedCategory === 'mujeres') {
        categoryTypes = types['mujer'] || [];
      } else if (selectedCategory === 'hombre') {
        categoryTypes = types['hombres'] || [];
      } else if (selectedCategory === 'mujer') {
        categoryTypes = types['mujeres'] || [];
      }
    }
    
    return categoryTypes;
  };
  
  const currentTypes = getCurrentTypes();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2 break-words">Tipos de Prenda</h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona los tipos de prenda por categoría</p>
        </div>
        {!isCreating && !editingKey && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg whitespace-nowrap text-sm sm:text-base"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Crear Tipo</span>
          </button>
        )}
      </div>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            handleCancel();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
          <option value="ofertas">Ofertas</option>
        </select>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingKey) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingKey ? 'Editar Tipo' : 'Nuevo Tipo'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (slug) *
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="tenis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiqueta (nombre) *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Tenis"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
              >
                {editingKey ? 'Guardar Cambios' : 'Crear Tipo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Types List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiqueta
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No hay tipos de prenda para esta categoría
                  </td>
                </tr>
              ) : (
                currentTypes.map((type) => (
                  <tr key={type.value} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{type.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{type.label}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => moveType(selectedCategory, type.value, 'up')}
                            disabled={currentTypes.indexOf(type) === 0}
                            className={`p-1 rounded transition-colors ${
                              currentTypes.indexOf(type) === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Mover arriba"
                          >
                            <FiChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveType(selectedCategory, type.value, 'down')}
                            disabled={currentTypes.indexOf(type) === currentTypes.length - 1}
                            className={`p-1 rounded transition-colors ${
                              currentTypes.indexOf(type) === currentTypes.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Mover abajo"
                          >
                            <FiChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleEdit(type)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(type.value)}
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, typeValue: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Tipo de Prenda"
        message="¿Estás seguro de eliminar este tipo de prenda? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default ProductTypesManager;

