import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image || '');

  // Actualizar imageSrc cuando cambie product.image
  useEffect(() => {
    if (product.image) {
      setImageSrc(product.image);
      setImageError(false);
    }
  }, [product.image]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      // Intentar con una imagen placeholder si falla
      setImageSrc('https://via.placeholder.com/400x400?text=Sin+Imagen');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-black mb-1">{product.name}</h3>
        <div className="flex items-center space-x-3 mb-4">
          {product.onSale && product.salePrice ? (
            <>
              <span className="text-2xl font-bold text-black">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-base text-gray-400 line-through font-medium">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-black">
              {formatPrice(product.price)}
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

