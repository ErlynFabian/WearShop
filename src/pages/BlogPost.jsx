import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import useBlogStore from '../context/blogStore';
import BlogCardSkeleton from '../components/skeletons/BlogCardSkeleton';
import SEO from '../components/SEO';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById } = useBlogStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('No se pudo cargar el artículo');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, getPostById]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    if (!content) return '';
    
    // Convertir saltos de línea a <br>
    let formatted = content.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Convertir markdown básico
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return `<p>${formatted}</p>`;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <BlogCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <SEO
          title="Artículo no encontrado"
          description="El artículo que buscas no está disponible."
        />
        <p className="text-gray-600 mb-4">{error || 'Artículo no encontrado'}</p>
        <Link to="/blog" className="text-black hover:underline">
          Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        keywords={`${post.category}, moda, estilo, ${post.title}`}
        image={post.image}
      />
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {post.category && (
            <div className="flex items-center space-x-2 mb-4">
              <FiTag className="w-4 h-4 text-gray-500" />
              <span className="px-3 py-1 bg-gray-100 text-black text-sm font-medium rounded">
                {post.category}
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-black mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
            {post.created_at && (
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Featured Image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 rounded-lg overflow-hidden bg-gray-100 aspect-video"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {post.excerpt && (
            <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <div
            className="text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </motion.article>

        {/* Back to Blog */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-black hover:text-yellow-500 transition-colors font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Volver a todos los artículos</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;

