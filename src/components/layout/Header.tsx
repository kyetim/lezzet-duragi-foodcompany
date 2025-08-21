import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleCart } from '@/store/slices/cartSlice';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const { isDarkMode, toggleTheme } = useTheme();

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { currentUser, logout } = useAuth();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCartToggle = () => {
    dispatch(toggleCart());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white shadow-lg">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 h-14 sm:h-16 md:h-20">
            <img src="/logo.png" alt="Lezzet Durağı Logo" className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-md" />
            <div className="flex flex-col justify-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-poppins font-extrabold text-primary-600 leading-tight">Lezzet Durağı</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Döner & Makarna</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 md:space-x-8 lg:space-x-12 mx-2 md:mx-6 lg:mx-8 flex-1 justify-center">
            <Link
              to="/"
              className="nav-link text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/menu"
              className="nav-link text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Menü
            </Link>
            <Link
              to="/about"
              className="nav-link text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Hakkımızda
            </Link>
            <Link
              to="/contact"
              className="nav-link text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              İletişim
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 ml-1 sm:ml-2">
            {/* Theme Toggle */}
            {/* <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button> */}

            {/* Cart */}
            <motion.button
              onClick={handleCartToggle}
              className="relative p-2 rounded-lg bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5 text-primary-600" />
              {cartItemCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                onClick={toggleProfile}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5 text-gray-600" />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser.displayName || 'Kullanıcı'}
                          </p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Profilim
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Siparişlerim
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/auth"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Giriş Yap
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-200 bg-white"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="py-4 space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/menu"
                  className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Menü
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  İletişim
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 