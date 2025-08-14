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
    <header className="sticky top-0 z-50 bg-blue-100 text-blue-900 border-b border-blue-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-white font-poppins font-bold text-lg lg:text-xl">L</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-poppins font-bold text-blue-800">
                Lezzet Durağı
              </h1>
              <p className="text-xs text-blue-600">
                Döner & Makarna
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-blue-800 hover:text-blue-600 font-semibold transition-colors">
              ANA SAYFA
            </Link>
            <Link to="/menu" className="text-blue-800 hover:text-blue-600 font-semibold transition-colors">
              MENÜ
            </Link>
            <Link to="/about" className="text-blue-800 hover:text-blue-600 font-semibold transition-colors">
              HAKKIMIZDA
            </Link>
            <Link to="/contact" className="text-blue-800 hover:text-blue-600 font-semibold transition-colors">
              İLETİŞİM
            </Link>
            <Link to="/specials" className="text-blue-800 hover:text-blue-600 font-semibold transition-colors">
              KAMPANYALAR
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-300 group shadow-sm"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-300 group shadow-sm">
              <ShoppingCart className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="p-2 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-300 group shadow-sm"
              >
                <User className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-blue-200">
                  <div className="py-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-blue-200">
                          <p className="text-sm font-semibold text-blue-800">
                            {user?.name || 'Kullanıcı'}
                          </p>
                          <p className="text-xs text-blue-600">
                            {user?.email}
                          </p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-blue-700 hover:bg-blue-50 transition-colors">
                          Profil
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-blue-700 hover:bg-blue-50 transition-colors">
                          Siparişlerim
                        </Link>
                        <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                          Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-blue-700 hover:bg-blue-50 transition-colors">
                          Giriş Yap
                        </Link>
                        <Link to="/register" className="block px-4 py-2 text-blue-700 hover:bg-blue-50 transition-colors">
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
              className="lg:hidden p-2 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-300 shadow-sm"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-blue-600" />
              ) : (
                <Menu className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-blue-200 bg-white">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" onClick={toggleMenu}>
                ANA SAYFA
              </Link>
              <Link to="/menu" className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" onClick={toggleMenu}>
                MENÜ
              </Link>
              <Link to="/about" className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" onClick={toggleMenu}>
                HAKKIMIZDA
              </Link>
              <Link to="/contact" className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" onClick={toggleMenu}>
                İLETİŞİM
              </Link>
              <Link to="/specials" className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" onClick={toggleMenu}>
                KAMPANYALAR
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 