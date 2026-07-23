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
        aria-label="Toggle menu / Menú"
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
          <img src="/logo.jpg" alt="THE VOULT PRESTIGE" className="drawer-logo-img" />
          <button className="drawer-close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <ul className="drawer-nav-list">
          <li>
            <Link to="/" className="drawer-link">
              ARCHIVE DROPS / INICIO
            </Link>
          </li>
          <li>
            <Link to="/about" className="drawer-link">
              MANIFESTO / MANIFIESTO
            </Link>
          </li>
          <li>
            <Link to="/bag" className="drawer-link">
              SHOPPING BAG / BOLSA
            </Link>
          </li>
          <li>
            <Link to="/checkout" className="drawer-link">
              CHECKOUT
            </Link>
          </li>
          <li>
            <Link to="/admin" className="drawer-link admin-link">
              ADMIN PORTAL
            </Link>
          </li>
        </ul>

        <div className="drawer-footer">
          <span className="badge-red">THE VOULT EDITION</span>
          <p>Curated High-End Streetwear</p>
        </div>
      </nav>
    </div>
  );
}
