import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from '@/store';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { ThemeProvider } from '@/contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
            </Routes>
          </Layout>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
