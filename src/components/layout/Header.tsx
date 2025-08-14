import { ShoppingCart, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { toggleCart } from '@/store/slices/cartSlice';

export function Header() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-primary-red rounded-full flex items-center justify-center">
                            <span className="text-white font-poppins font-bold text-lg">L</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-poppins font-bold text-gray-800">Lezzet Durağı</h1>
                            <p className="text-xs text-gray-600">Taze & Lezzetli</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-primary-red font-medium transition-colors">
                            Ana Sayfa
                        </Link>
                        <Link to="/menu" className="text-gray-700 hover:text-primary-red font-medium transition-colors">
                            Menü
                        </Link>
                        <a href="/about" className="text-gray-700 hover:text-primary-red font-medium transition-colors">
                            Hakkımızda
                        </a>
                        <a href="/contact" className="text-gray-700 hover:text-primary-red font-medium transition-colors">
                            İletişim
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* User Menu */}
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            <User className="w-5 h-5 mr-2" />
                            {isAuthenticated ? 'Hesabım' : 'Giriş Yap'}
                        </Button>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dispatch(toggleCart())}
                            className="relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Button>

                        {/* Mobile Menu */}
                        <Button variant="ghost" size="sm" className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
} 