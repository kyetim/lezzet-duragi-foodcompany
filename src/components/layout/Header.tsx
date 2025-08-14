import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import type { RootState } from '@/store';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border transition-all duration-300">
      <div className="container-modern">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-red to-primary-yellow rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-poppins font-bold text-lg lg:text-xl">L</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-poppins font-bold text-gradient">
                Lezzet Durağı
              </h1>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                Taze & Lezzetli
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Ana Sayfa
            </Link>
            <div className="relative group">
              <button className="nav-link flex items-center space-x-1">
                <span>Menü</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-strong border border-gray-200 dark:border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                <div className="py-2">
                  <Link to="/menu?category=doner" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    Döner
                  </Link>
                  <Link to="/menu?category=makarna" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    Makarna
                  </Link>
                  <Link to="/menu?category=salata" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    Salata
                  </Link>
                  <Link to="/menu?category=icecek" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    İçecek
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="nav-link">
              Hakkımızda
            </Link>
            <Link to="/contact" className="nav-link">
              İletişim
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 group"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 group">
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-dark-text group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-red text-white text-xs rounded-full flex items-center justify-center font-semibold animate-scale-in">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="p-2 rounded-xl bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 group"
              >
                <User className="w-5 h-5 text-gray-700 dark:text-dark-text group-hover:scale-110 transition-transform" />
              </button>
              
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-strong border border-gray-200 dark:border-dark-border animate-scale-in">
                  <div className="py-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-border">
                          <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                            {user?.name || 'Kullanıcı'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                            {user?.email}
                          </p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                          Profil
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                          Siparişlerim
                        </Link>
                        <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                          Giriş Yap
                        </Link>
                        <Link to="/register" className="block px-4 py-2 text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                          Kayıt Ol
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-dark-text" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-dark-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-dark-border animate-slide-up">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="nav-link py-2" onClick={toggleMenu}>
                Ana Sayfa
              </Link>
              <Link to="/menu" className="nav-link py-2" onClick={toggleMenu}>
                Menü
              </Link>
              <Link to="/about" className="nav-link py-2" onClick={toggleMenu}>
                Hakkımızda
              </Link>
              <Link to="/contact" className="nav-link py-2" onClick={toggleMenu}>
                İletişim
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 