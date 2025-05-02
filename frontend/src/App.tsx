import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./provider/AuthProvider";
import CartProvider from "./provider/CartProvider";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import { Toaster } from "sonner";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            {/* Add more routes as needed */}

            {/* Default fallback route for unknown paths */}
            <Route path="*" element={<NotFound />} />
            {/* or use: <Route path="*" element={<Forbidden />} /> */}
          </Routes>
          <Toaster richColors position="top-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
