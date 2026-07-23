import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="vault-footer">
      <div className="container">
        <div className="footer-grid">
          {/* BRAND COLUMN */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand-logo">
              <span className="v-title">THE VAULT</span>
              <span className="v-subtitle">PRESTIGE</span>
            </Link>
            <p className="footer-desc">
              Curaduría exclusiva de moda de alta gama y streetwear de grado 1:1. 
              Prendas confeccionadas con materiales de máxima calidad y acabados idénticos a los drops internacionales.
            </p>
            <div className="badge-gold">Qualité 1.1 Authentic Drop</div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Colección Principal</Link></li>
              <li><Link to="/about">Manifiesto & Concepto</Link></li>
              <li><Link to="/bag">Bolsa de Compras</Link></li>
              <li><Link to="/checkout">Finalizar Pedido</Link></li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="footer-col">
            <h4 className="footer-heading">Atención VIP</h4>
            <div className="footer-contact">
              <a href="https://wa.me/573113524794" target="_blank" rel="noreferrer" className="contact-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+57 311 352 4794</span>
              </a>
              <a href="mailto:contact@thevaultprestige.com" className="contact-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>contact@thevaultprestige.com</span>
              </a>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="footer-col">
            <h4 className="footer-heading">Comunidad</h4>
            <div className="social-row">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://wa.me/573113524794" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} THE VAULT PRESTIGE S.A.S. — Todos los derechos reservados.
          </p>
          <Link to="/admin" className="admin-portal-link">
            Acceso Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
