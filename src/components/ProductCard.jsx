import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';

const ProductCard = ({ product }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-black mb-1">{product.name}</h3>
        <div className="flex items-center space-x-3 mb-4">
          {product.onSale && product.salePrice ? (
            <>
              <span className="text-2xl font-bold text-black">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="text-base text-gray-400 line-through font-medium">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-black">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        <Link
          to={`/producto/${product.id}`}
          className="w-full bg-black text-white px-6 py-3 text-sm font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <FiEye className="w-4 h-4" />
          <span>Ver detalles</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;

