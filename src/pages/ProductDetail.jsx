import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import useProductsStore from '../context/productsStore';
import useCartStore from '../context/cartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductsStore();
  const { addItem, openCart } = useCartStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600 mb-4">Producto no encontrado</p>
        <Link to="/" className="text-black hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  const handleWhatsApp = () => {
    const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
    let message = `Hola, me interesa el producto: ${product.name} - $${displayPrice.toFixed(2)}`;
    if (product.onSale && product.salePrice) {
      message += ` (Precio original: $${product.price.toFixed(2)})`;
    }
    if (selectedSize) message += `\nTalla: ${selectedSize}`;
    if (selectedColor) message += `\nColor: ${selectedColor}`;
    const whatsappUrl = `https://wa.link/l8vc70?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-gray-100 overflow-hidden rounded-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-start pt-4"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded mb-4">
                {product.category}
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-black mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="text-4xl font-bold text-black">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-black">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4">Descripción</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-black mb-3">Talla</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-black hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-black mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-black hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 px-6 font-bold text-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Agregar al carrito</span>
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white py-4 px-6 font-bold text-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Pedir por WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

