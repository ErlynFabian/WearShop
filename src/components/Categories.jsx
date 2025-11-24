import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useCategoriesStore from '../context/categoriesStore';

const Categories = () => {
  const { categories } = useCategoriesStore();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-black text-black mb-16 text-center"
        >
          EXPLORA
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative h-96 overflow-hidden group cursor-pointer"
            >
              <Link to={`/${category.slug}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-4xl font-black mb-2">{category.name}</h3>
                  <p className="text-lg font-light">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

