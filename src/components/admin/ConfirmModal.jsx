import { FiAlertCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
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
                  <div className={`p-2 rounded-full ${
                    type === 'danger' ? 'bg-red-100' : 
                    type === 'warning' ? 'bg-yellow-100' : 
                    'bg-blue-100'
                  }`}>
                    <FiAlertCircle className={`w-5 h-5 ${
                      type === 'danger' ? 'text-red-600' : 
                      type === 'warning' ? 'text-yellow-600' : 
                      'text-blue-600'
                    }`} />
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
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                    type === 'danger' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : type === 'warning'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

