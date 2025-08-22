import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
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
                <AboutPage />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <ContactPage />
              </Layout>
            } />
            <Route path="/product/:id" element={
              <Layout>
                <ProductDetailPage />
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
          </Routes>
        </Router>
      </CartProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
