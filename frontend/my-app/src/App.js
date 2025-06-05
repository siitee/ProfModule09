import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductPage } from './pages/Product';
import { Basket } from './pages/Basket'
import { Account } from './pages/Account';
import { BlogPage } from './pages/BlogPage';

import AdminPanel from './pages/AdminPanel';
import ProductsPanel from './components/Admin/ProductsPanel';
import Orders from './components/Admin/Orders';
import Stats from './components/Admin/Stats';
import AdminRoute from './components/Admin/AdminRoute';
import { AuthProvider } from './components/Basket/AuthContext';
import { CartProvider } from './components/Basket/BasketContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/account" element={<Account />} />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductsPanel />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <Orders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/stats"
                element={
                  <AdminRoute>
                    <Stats />
                  </AdminRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>  
  );
}

export default App;