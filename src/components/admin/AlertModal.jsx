import { FiAlertCircle, FiCheckCircle, FiX, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <FiInfo className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getIconBg()}`}>
                    {getIcon()}
                  </div>
                  <h3 className="text-xl font-bold text-black">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Message */}
              <p className="text-gray-600 mb-6">{message}</p>

              {/* Actions */}
              <div className="flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Aceptar
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;

