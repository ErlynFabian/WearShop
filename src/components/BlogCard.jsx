import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <Link to={`/blog/${post.id}`}>
        <div className="relative overflow-hidden bg-gray-100 aspect-video">
          {post.image ? (
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
          {post.category && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-medium rounded">
              {post.category}
            </span>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-black mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              {post.created_at && (
                <div className="flex items-center space-x-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              )}
              {post.author && (
                <div className="flex items-center space-x-1">
                  <FiUser className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-black font-medium text-sm group-hover:text-yellow-500 transition-colors">
            <span>Leer más</span>
            <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;

