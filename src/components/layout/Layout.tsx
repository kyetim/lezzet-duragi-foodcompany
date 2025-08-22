import type { ReactNode } from 'react';
import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <main className="flex-1 w-full pt-20">
                {children}
            </main>
            <Footer />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}

export { Layout };
export default Layout; 