import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { lazy, Suspense } from 'react';
import { store } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { Layout } from '@/components/layout/Layout';

// Critical pages - loaded immediately
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { AuthPage } from '@/pages/AuthPage';
import AdminPage from '@/pages/AdminPage';

// Non-critical pages - lazy loaded for performance
const AboutPage = lazy(() => import('@/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(module => ({ default: module.OrdersPage })));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage').then(module => ({ default: module.OrderDetailPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const PWATestPage = lazy(() => import('@/pages/PWATestPage').then(module => ({ default: module.PWATestPage })));


import { SEO } from '@/components/seo/SEO';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { PWAStatusIndicator } from '@/components/ui/PWAStatusIndicator';
import './App.css';

function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Provider store={store}>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <Router>
                  <SEO />
                  <ScrollToTop />
                  <ToastContainer />
                
                {/* PWA Components */}
                <PWAInstallPrompt />
                <PWAStatusIndicator position="bottom-right" />
                
            <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            <Route path="/menu" element={
              <Layout>
                <MenuPage />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
                  <AboutPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
                  <ContactPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/product/:id" element={
              <Layout>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
                  <ProductDetailPage />
                </Suspense>
              </Layout>
            } />
            
            {/* PWA Test Page (Development Only) */}
            <Route path="/pwa-test" element={
              <Layout>
                <PWATestPage />
              </Layout>
            } />

            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout>
                  <OrdersPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <Layout>
                  <OrderDetailPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Layout>
                  <CheckoutPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin Panel Route */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
              </Routes>
            </Router>
          </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
