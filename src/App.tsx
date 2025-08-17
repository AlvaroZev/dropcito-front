import React, { useState } from 'react';
import './App.css';
import TiendaPage from './pages/TiendaPage';

function App() {
  const [currentPage, setCurrentPage] = useState('tienda');

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

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/logo.png" alt="Dropcito Logo" className="nav-logo" />
          <span>Dropcito</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'tienda' ? 'active' : ''}`}
            onClick={() => setCurrentPage('tienda')}
          >
            Tienda
          </button>
          <button 
            className={`nav-link ${currentPage === 'nosotros' ? 'active' : ''}`}
            onClick={() => setCurrentPage('nosotros')}
          >
            Nosotros
          </button>
          <button 
            className={`nav-link ${currentPage === 'contactanos' ? 'active' : ''}`}
            onClick={() => setCurrentPage('contactanos')}
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
