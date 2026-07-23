import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileMenu.css";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="mobile-menu-wrapper">
      <button
        className={`hamburger-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <nav className={`mobile-menu-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <img src="/logo.png" alt="THE VOULT PRESTIGE" className="drawer-logo-img" />
          <button className="drawer-close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <ul className="drawer-nav-list">
          <li>
            <Link to="/" className="drawer-link">
              COLECCIÓN / INICIO
            </Link>
          </li>
          <li>
            <Link to="/about" className="drawer-link">
              SOBRE NOSOTROS
            </Link>
          </li>
          <li>
            <Link to="/bag" className="drawer-link">
              BOLSA DE COMPRAS
            </Link>
          </li>
          <li>
            <Link to="/checkout" className="drawer-link">
              FINALIZAR COMPRA
            </Link>
          </li>
          <li>
            <Link to="/admin" className="drawer-link admin-link">
              PANEL ADMIN
            </Link>
          </li>
        </ul>

        <div className="drawer-footer">
          <span className="badge-red">EDICIÓN EXCLUSIVA</span>
          <p>Streetwear de Alta Gama</p>
        </div>
      </nav>
    </div>
  );
}
