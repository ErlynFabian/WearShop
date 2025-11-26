import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import useBlogStore from '../../context/blogStore';
import useToastStore from '../../context/toastStore';
import BlogCardSkeleton from '../../components/skeletons/BlogCardSkeleton';

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById, updatePost } = useBlogStore();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    author: 'Equipo WearShop',
    published: true
  });

  const categories = ['Tendencias', 'Estilo', 'Cuidado', 'Consejos', 'Outfits'];

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const post = await getPostById(id, true); // Incluir posts no publicados para el admin
        setFormData({
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          image: post.image || '',
          category: post.category || '',
          author: post.author || 'Equipo WearShop',
          published: post.published !== undefined ? post.published : true
        });
      } catch (error) {
        console.error('Error loading post:', error);
        useToastStore.getState().error('Error al cargar el artículo');
        navigate('/admin/blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, getPostById, navigate]);

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

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: ''
    });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, formData);
      useToastStore.getState().success(`Artículo "${formData.title}" actualizado correctamente`);
      navigate('/admin/blog');
    } catch (error) {
      useToastStore.getState().error('Error al actualizar el artículo');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <Link
            to="/admin/blog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Volver al Blog</span>
          </Link>
          <h2 className="text-5xl font-black text-black mb-2">Editar Artículo</h2>
        </div>
        <BlogCardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/blog"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Volver al Blog</span>
        </Link>
        <h2 className="text-5xl font-black text-black mb-2">Editar Artículo</h2>
        <p className="text-gray-600">Modifica el artículo del blog</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título * 
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Ej: Las 5 Tendencias de Moda que Dominarán este 2024"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen / Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Breve descripción que aparecerá en la lista de artículos"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido * 
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="15"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-mono text-sm"
              placeholder="Escribe el contenido completo del artículo. Puedes usar saltos de línea y formato básico."
            />
            <p className="mt-1 text-xs text-gray-500">
              Usa **texto** para negrita y *texto* para cursiva. Los saltos de línea se respetarán.
            </p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen
            </label>
            {formData.image ? (
              <div className="space-y-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Eliminar imagen
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  O puedes pegar una URL de imagen directamente
                </p>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Category and Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Equipo WearShop"
              />
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="published"
              id="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
            />
            <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
              Publicar inmediatamente
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Link
              to="/admin/blog"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg"
            >
              <FiSave className="w-5 h-5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;

