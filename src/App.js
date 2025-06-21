import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './App.css';

function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/add" element={<ProductForm />} />
              <Route path="/edit/:id" element={<ProductForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;
