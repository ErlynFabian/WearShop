import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import useCartStore from '../context/cartStore';
import useToastStore from '../context/toastStore';
import { formatPrice } from '../utils/formatPrice';

const CartSidebar = () => {
  const { isOpen, closeCart, items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-black">Carrito</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
                  <p className="text-gray-400 text-sm mb-6">Próximamente podrás agregar productos al carrito y realizar pedidos</p>
                  <button
                    onClick={closeCart}
                    className="bg-black text-white px-6 py-2 font-medium hover:opacity-90 transition-opacity"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4 pb-4 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-black mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-black mb-2">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity === 1}
                            className={`p-1 border transition-colors ${
                              item.quantity === 1
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => {
                    useToastStore.getState().info('Próximamente: Esta funcionalidad estará disponible pronto.');
                  }}
                  className="w-full bg-black text-white py-4 font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  Finalizar compra
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-black py-3 font-medium hover:bg-gray-100 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

