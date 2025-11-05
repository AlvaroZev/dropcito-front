import React, { useState } from 'react';
import './App.css';
import TiendaPage from './pages/TiendaPage';

export type Country = 'peru' | 'argentina';

function App() {
  const [currentPage, setCurrentPage] = useState('tienda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>('argentina');

  const renderPage = () => {
    switch (currentPage) {
      case 'nosotros':
        return (
          <div className="page-content nosotros-page">
            <div className="construction-container">
              <img src="/building.webp" alt="En construcción" className="construction-image" />
              <h2 className="construction-text">En construcción</h2>
            </div>
          </div>
        );
      case 'contactanos':
        return (
          <div className="page-content contactanos-page">
            <div className="construction-container">
              <img src="/building.webp" alt="En construcción" className="construction-image" />
              <h2 className="construction-text">En construcción</h2>
            </div>
          </div>
        );
      default:
        return <TiendaPage selectedCountry={selectedCountry} />;
    }
  };

  const toggleCountry = () => {
    setSelectedCountry(selectedCountry === 'peru' ? 'argentina' : 'peru');
  };

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu when a page is selected
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : ''}`}>
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/logo.png" alt="Dropcito Logo" className="nav-logo" />
          <span>Dropcito</span>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className={`nav-link ${currentPage === 'tienda' ? 'active' : ''}`}
            onClick={() => handleNavClick('tienda')}
          >
            Tienda
          </button>
          <button 
            className={`nav-link ${currentPage === 'nosotros' ? 'active' : ''}`}
            onClick={() => handleNavClick('nosotros')}
          >
            Nosotros
          </button>
          <button 
            className={`nav-link ${currentPage === 'contactanos' ? 'active' : ''}`}
            onClick={() => handleNavClick('contactanos')}
          >
            Contactanos
          </button>
          
          {/* Country Selector Button */}
          <button 
            className="country-selector-button"
            onClick={toggleCountry}
            aria-label={`Switch to ${selectedCountry === 'peru' ? 'Argentina' : 'Peru'}`}
            title={`País: ${selectedCountry === 'peru' ? 'Perú' : 'Argentina'}`}
          >
            <img 
              src={selectedCountry === 'peru' ? '/per.png' : '/arg.jpg'} 
              alt={selectedCountry === 'peru' ? 'Perú' : 'Argentina'}
              className="country-flag-icon"
            />
          </button>
          
          {/* Dark Theme Toggle Button */}
          <button 
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
