import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import useToastStore from '../context/toastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiXCircle className="w-5 h-5" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'info':
        return <FiInfo className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
        };
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className={`${styles.bg} border rounded-lg shadow-lg p-4 flex items-start space-x-3 pointer-events-auto`}
            >
              <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                {getIcon(toast.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                  <p className={`${styles.text} text-sm font-medium`}>
                    {toast.message}
                  </p>
                  {toast.count > 1 && (
                    <motion.span 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`${styles.icon} px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0`}
                      style={{
                        backgroundColor: toast.type === 'success' ? 'rgba(34, 197, 94, 0.2)' :
                                       toast.type === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                                       toast.type === 'warning' ? 'rgba(234, 179, 8, 0.2)' :
                                       'rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      x{toast.count}
                    </motion.span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
                aria-label="Cerrar notificación"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;

