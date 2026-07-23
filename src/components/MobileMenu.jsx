import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileMenu.css";

// SVG Icons
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Función para hacer scroll al catálogo
  const scrollToCatalog = () => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      // Si no estamos en home, navegar primero
      window.location.href = "/#catalog-section";
    } else {
      // Si estamos en home, hacer scroll
      setTimeout(() => {
        const catalogSection = document.getElementById("catalog-section");
        if (catalogSection) {
          const offset = 80;
          const elementPosition = catalogSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  };

  // Cerrar menú cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevenir scroll del body cuando el menú está abierto
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
      {/* Botón hamburguesa */}
      <button
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú */}
      <nav className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-menu-logo" onClick={() => setIsOpen(false)}>
            PARMA ITALIA
          </Link>
          <button
            className="mobile-menu-close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mobile-menu-links">
          <Link
            to="/"
            className={`mobile-menu-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>
          <button
            className="mobile-menu-link"
            onClick={scrollToCatalog}
          >
            Catálogo
          </button>
          <Link
            to="/about"
            className={`mobile-menu-link ${location.pathname === "/about" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Sobre Nosotros
          </Link>
          <Link
            to="/bag"
            className={`mobile-menu-link ${location.pathname === "/bag" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Carrito
          </Link>
        </div>

        <div className="mobile-menu-footer">
          <a href="tel:+573113524794" className="mobile-menu-contact">
            <PhoneIcon />
            <span>+57 311 352 4794</span>
          </a>
          <a href="mailto:trujillojuanjose05@gmail.com" className="mobile-menu-contact">
            <MailIcon />
            <span>trujillojuanjose05@gmail.com</span>
          </a>
        </div>
      </nav>
    </>
  );
}

