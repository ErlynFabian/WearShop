import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useCartStore from '../context/cartStore';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, items } = useCartStore();
  const location = useLocation();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm"
              style={{
                backgroundImage: 'linear-gradient(to right, #facc15, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              WearShop
            </motion.span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/hombres"
              className={`text-sm font-medium transition-colors ${
                isActive('/hombres')
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              Hombres
            </Link>
            <Link
              to="/mujeres"
              className={`text-sm font-medium transition-colors ${
                isActive('/mujeres')
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              Mujeres
            </Link>
            <Link
              to="/accesorios"
              className={`text-sm font-medium transition-colors ${
                isActive('/accesorios')
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              Accesorios
            </Link>
            <Link
              to="/ofertas"
              className={`text-sm font-medium transition-colors ${
                isActive('/ofertas')
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              Ofertas
            </Link>
            <Link
              to="/contacto"
              className={`text-sm font-medium transition-colors ${
                isActive('/contacto')
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              Contacto
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-black hover:text-gray-600 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              className="relative p-2 text-black hover:text-gray-600 transition-colors"
            >
              <FiShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
          </div>
        </div>
      </motion.nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

