import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileMenu.css";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú principal"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)} />
      )}

      <nav className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-menu-logo" onClick={() => setIsOpen(false)}>
            <span>THE VAULT</span>
            <span className="gold-sub">PRESTIGE</span>
          </Link>
          <button
            className="mobile-menu-close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mobile-menu-links">
          <Link
            to="/"
            className={`mobile-menu-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Inicio & Drops 1.1
          </Link>
          <Link
            to="/about"
            className={`mobile-menu-link ${location.pathname === "/about" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Manifiesto & Concepto
          </Link>
          <Link
            to="/bag"
            className={`mobile-menu-link ${location.pathname === "/bag" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Bolsa de Compras
          </Link>
          <Link
            to="/checkout"
            className={`mobile-menu-link ${location.pathname === "/checkout" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Checkout VIP
          </Link>
        </div>

        <div className="mobile-menu-footer">
          <a href="https://wa.me/573113524794" target="_blank" rel="noreferrer" className="mobile-menu-contact">
            📞 <span>+57 311 352 4794</span>
          </a>
          <a href="mailto:contact@thevaultprestige.com" className="mobile-menu-contact">
            ✉️ <span>contact@thevaultprestige.com</span>
          </a>
        </div>
      </nav>
    </>
  );
}
