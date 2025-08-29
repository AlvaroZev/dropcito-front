import React, { useState } from 'react';
import './App.css';
import TiendaPage from './pages/TiendaPage';

function App() {
  const [currentPage, setCurrentPage] = useState('tienda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'nosotros':
        return <div className="page-content nosotros-page">Nosotros Page</div>;
      case 'contactanos':
        return <div className="page-content contactanos-page">Contactanos Page</div>;
      default:
        return <TiendaPage />;
    }
  };

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu when a page is selected
  };

  return (
    <div className="App">
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
        </div>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
