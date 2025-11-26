import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import BlogGrid from '../components/BlogGrid';
import BlogCardSkeleton from '../components/skeletons/BlogCardSkeleton';
import useBlogStore from '../context/blogStore';
import SEO from '../components/SEO';

const Blog = () => {
  const { posts, loading, fetchPosts } = useBlogStore();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const categories = useMemo(() => {
    const cats = ['Todos', ...new Set(posts.map(post => post.category).filter(Boolean))];
    return cats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return posts;
    }
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Guía de Estilo - Blog de Moda y Tendencias"
        description="Descubre las últimas tendencias de moda, tips de estilo, consejos para combinar prendas y mucho más en nuestro blog de moda."
        keywords="blog moda, tendencias moda, guía de estilo, tips moda, consejos moda, fashion blog"
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-black mb-4">
            GUÍA DE ESTILO
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las últimas tendencias, tips de moda y consejos de estilo para crear looks increíbles
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Blog Posts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <BlogGrid posts={filteredPosts} />
        )}
      </div>
    </div>
  );
};

export default Blog;

