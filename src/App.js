import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './elements/Navbar.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Services from './pages/Services.js';
import Gallery from './pages/Gallery.js';
import Contact from './pages/Contact.js';
import Footer from './elements/Footer.js';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route exact path="/" element={Home} />
          <Route path="/about" element={About} />
          <Route path="/services" element={Services} />
          <Route path="/gallery" element={Gallery} />
          <Route path="/contact" element={Contact} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
