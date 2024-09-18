// File: woodgreen-landscaping/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './elements/Navbar.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Services from './pages/Services.js';
import Gallery from './pages/Gallery.js';
import Contact from './pages/Contact.js';
import Footer from './elements/Footer.js';
function App() {
    return (<Router>
      <Navbar /> {/* Added Navbar */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/services">Services</Link> {/* Added link for Services */}
          </li>
          <li>
            <Link to="/gallery">Gallery</Link> {/* Added link for Gallery */}
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/services" element={<Services />}/>{' '}
        {/* Added route for Services */}
        <Route path="/gallery" element={<Gallery />}/>{' '}
        {/* Added route for Gallery */}
        <Route path="/contact" element={<Contact />}/>
      </Routes>
      <Footer /> {/* Added Footer */}
    </Router>);
}
export default App;
