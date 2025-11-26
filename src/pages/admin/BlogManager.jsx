import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye, FiEyeOff } from 'react-icons/fi';
import useBlogStore from '../../context/blogStore';
import useToastStore from '../../context/toastStore';
import ConfirmModal from '../../components/admin/ConfirmModal';
import BlogCardSkeleton from '../../components/skeletons/BlogCardSkeleton';

const BlogManager = () => {
  const { posts, deletePost, updatePost, loading, fetchPosts } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

  useEffect(() => {
    fetchPosts(true); // Incluir posts no publicados para el admin
  }, [fetchPosts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, postId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.postId) {
      const post = posts.find(p => p.id === deleteModal.postId);
      try {
        await deletePost(deleteModal.postId);
        useToastStore.getState().success(`Post "${post?.title}" eliminado correctamente`);
      } catch (error) {
        useToastStore.getState().error('Error al eliminar el post');
      }
      setDeleteModal({ isOpen: false, postId: null });
    }
  };

  const handleTogglePublished = async (post) => {
    try {
      await updatePost(post.id, { published: !post.published });
      useToastStore.getState().success(
        `Post ${post.published ? 'ocultado' : 'publicado'} correctamente`
      );
    } catch (error) {
      useToastStore.getState().error('Error al actualizar el post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2 break-words">
            Blog - Guía de Estilo
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona los artículos del blog</p>
        </div>
        <Link
          to="/admin/blog/create"
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg whitespace-nowrap text-sm sm:text-base"
        >
          <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>Crear Artículo</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          {searchTerm ? 'No se encontraron artículos' : 'No hay artículos creados aún'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
                {!post.published && (
                  <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
                    Borrador
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{formatDate(post.created_at)}</span>
                  {post.author && <span>{post.author}</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <Link
                    to={`/admin/blog/edit/${post.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                  <button
                    onClick={() => handleTogglePublished(post)}
                    className={`px-3 py-2 rounded transition-colors text-sm font-medium ${
                      post.published
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={post.published ? 'Ocultar' : 'Publicar'}
                  >
                    {post.published ? (
                      <FiEye className="w-4 h-4" />
                    ) : (
                      <FiEyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    title="Eliminar"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Artículo"
        message="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default BlogManager;

