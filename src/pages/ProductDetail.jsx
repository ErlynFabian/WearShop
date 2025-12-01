import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart, FiTruck, FiShield, FiInfo, FiLink2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import useProductsStore from '../context/productsStore';
import useCartStore from '../context/cartStore';
import useToastStore from '../context/toastStore';
import useRecentlyViewedStore from '../context/recentlyViewedStore';
import { formatPrice } from '../utils/formatPrice';
import ProductGrid from '../components/ProductGrid';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProductsStore();
  const { addItem, openCart } = useCartStore();
  const { addViewedProduct } = useRecentlyViewedStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const product = products.find(p => p.id === parseInt(id));

  // Registrar producto como visto cuando se carga
  useEffect(() => {
    if (product) {
      addViewedProduct(product.id);
    }
  }, [product, addViewedProduct]);

  // Productos relacionados
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.category === product.category && (p.stock || 0) > 0)
      .slice(0, 4);
  }, [products, product]);

  // Skeleton loader
  const ProductDetailSkeleton = () => (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Cargando producto..."
        description="Cargando información del producto."
      />
      <div className="max-w-7xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="h-6 w-24 bg-gray-200 rounded mb-6 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>

          {/* Details Skeleton */}
          <div className="flex flex-col justify-start pt-4">
            {/* Badge Skeleton */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-3 animate-pulse"></div>
            
            {/* Title Skeleton */}
            <div className="h-12 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
            
            {/* Category Skeleton */}
            <div className="h-5 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
            
            {/* Price Skeleton */}
            <div className="h-10 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>

            {/* Sizes Skeleton */}
            <div className="mb-8">
              <div className="h-5 w-40 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Colors Skeleton */}
            <div className="mb-8">
              <div className="h-5 w-24 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Info Sections Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Mostrar skeleton mientras se cargan los productos
  if (loading || (products.length === 0 && !product)) {
    return <ProductDetailSkeleton />;
  }

  // Solo mostrar "no encontrado" si ya se cargaron los productos y no existe
  if (!product) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <SEO
          title="Producto no encontrado"
          description="El producto que buscas no está disponible."
        />
        <p className="text-gray-600 mb-4">Producto no encontrado</p>
        <Link to="/" className="text-black hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Meta tags para SEO del producto
  const productTitle = `${product.name} - ${formatPrice(product.onSale && product.salePrice ? product.salePrice : product.price)}`;
  const productDescription = `${product.name}${product.description ? ` - ${product.description.substring(0, 150)}` : ''}. Categoría: ${product.category}. ${product.onSale ? '¡En oferta!' : ''}`;
  const productKeywords = `${product.name}, ${product.category}, ${product.type || ''}, moda, ropa, ${product.onSale ? 'oferta, descuento' : ''}`;
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/producto/${product.id}` : '';

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
    // Usar formato directo de WhatsApp para que el mensaje aparezca correctamente
    const phoneNumber = '18299657361'; // +1 (829) 965-7361 sin formato
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    useToastStore.getState().info('Abriendo WhatsApp...');
  };

  const handleCopyLink = () => {
    const productUrl = `${window.location.origin}/producto/${product.id}`;
    navigator.clipboard.writeText(productUrl).then(() => {
      useToastStore.getState().success('Enlace del producto copiado al portapapeles');
    }).catch(() => {
      useToastStore.getState().error('Error al copiar el enlace');
    });
  };

  // Verificar si se pueden seleccionar talla y color
  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  
  // El botón de WhatsApp solo está habilitado si:
  // - No hay tallas ni colores (producto sin variantes), O
  // - Hay tallas y está seleccionada, Y hay colores y está seleccionado
  const isWhatsAppEnabled = 
    (!hasSizes && !hasColors) || 
    (hasSizes && selectedSize && hasColors && selectedColor) ||
    (hasSizes && selectedSize && !hasColors) ||
    (!hasSizes && hasColors && selectedColor);

  // Función para obtener el texto del botón según lo que falte
  const getWhatsAppButtonText = () => {
    if (isWhatsAppEnabled) {
      return 'Pedir por WhatsApp';
    }
    
    if (hasSizes && hasColors) {
      if (!selectedSize && !selectedColor) {
        return 'Selecciona talla y color';
      } else if (!selectedSize) {
        return 'Selecciona talla';
      } else if (!selectedColor) {
        return 'Selecciona color';
      }
    } else if (hasSizes && !selectedSize) {
      return 'Selecciona talla';
    } else if (hasColors && !selectedColor) {
      return 'Selecciona color';
    }
    
    return 'Pedir por WhatsApp';
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={productKeywords}
        image={product.image}
        url={productUrl}
        type="product"
      />
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
            className="lg:sticky lg:top-24 lg:self-start aspect-square bg-gray-100 overflow-hidden rounded-lg"
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
              {(() => {
                // Determinar si el producto es nuevo (creado en los últimos 30 días)
                const isNew = product.created_at 
                  ? (new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24) <= 30
                  : false;
                
                return isNew ? (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded mb-3">
                    Lo más nuevo
              </span>
                ) : null;
              })()}
              <h1 className="text-4xl md:text-5xl font-black text-black mb-2">
                {product.name}
              </h1>
              <p className="text-base text-gray-600 mb-4 capitalize">
                {product.category}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-black">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-black">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-black">Selecciona la Talla</h3>
                  <Link 
                    to="/calculadora-tallas" 
                    className="text-sm text-gray-600 hover:text-black underline"
                  >
                    Guía de tallas
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 border-2 rounded-lg font-medium transition-colors ${
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

            <div className="space-y-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 px-6 font-bold text-base rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Agregar a la bolsa de compras</span>
              </button>
              <button
                onClick={handleWhatsApp}
                disabled={!isWhatsAppEnabled}
                className={`w-full py-4 px-6 font-bold text-base rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  isWhatsAppEnabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isWhatsAppEnabled && <FaWhatsapp className="w-5 h-5" />}
                <span>{getWhatsAppButtonText()}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full border-2 border-gray-300 text-black py-3 px-6 font-medium text-base rounded-lg flex items-center justify-center space-x-2 hover:border-black transition-colors"
              >
                <FiLink2 className="w-5 h-5" />
                <span>Copiar enlace</span>
              </button>
            </div>

            {/* Shipping Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start space-x-3 mb-4">
                <FiTruck className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-bold text-black mb-1">Envío*</p>
                  <p className="text-sm text-gray-600">Para obtener información de envío precisa</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Specifications */}
            <div className="space-y-2 text-sm mb-8">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Color que se muestra: </span>
                  <span className="text-gray-600">{product.colors.join('/')}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Categoría: </span>
                <span className="text-gray-600 capitalize">{product.category}</span>
              </div>
              {product.type && (
                <div>
                  <span className="font-medium text-gray-700">Tipo: </span>
                  <span className="text-gray-600">{product.type}</span>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <FiInfo className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-bold text-black mb-1">Información de cuidado</p>
                  <p className="text-sm text-gray-600">Sigue las instrucciones de lavado según el tipo de prenda. Consulta la etiqueta para más detalles.</p>
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <FiShield className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-bold text-black mb-1">Garantía</p>
                  <p className="text-sm text-gray-600">Todos nuestros productos cuentan con garantía de calidad. Consulta nuestros términos y condiciones para más información.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-center">
              Productos Relacionados
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

