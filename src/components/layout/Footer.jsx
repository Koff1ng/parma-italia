import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="vault-footer">
      <div className="container">
        <div className="footer-grid">
          {/* BRAND COLUMN */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo-link">
              <img src="/logo.png" alt="THE VOULT PRESTIGE" className="footer-logo-img" />
            </Link>
            <p className="footer-brand-desc">
              Colecciones de archivo de alta costura y streetwear de lujo. 
              Ediciones limitadas de diseño contemporáneo con despacho asegurado a todo el país.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4 className="footer-col-title">NAVEGACIÓN</h4>
            <ul className="footer-links">
              <li><Link to="/">COLECCIÓN</Link></li>
              <li><Link to="/bag">BOLSA DE COMPRAS</Link></li>
              <li><Link to="/checkout">FINALIZAR COMPRA</Link></li>
              <li><Link to="/about">SOBRE NOSOTROS</Link></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="footer-col">
            <h4 className="footer-col-title">SERVICIO AL CLIENTE</h4>
            <ul className="footer-links">
              <li><a href="https://wa.me/573113524794" target="_blank" rel="noopener noreferrer">SOPORTE WHATSAPP</a></li>
              <li><span>ENVÍOS NACIONALES</span></li>
              <li><span>COMPRA SEGURA</span></li>
            </ul>
          </div>

          {/* VIP CONTACT */}
          <div className="footer-col">
            <h4 className="footer-col-title">ATENCIÓN VIP</h4>
            <p className="concierge-text">
              Atención directa y pedidos personalizados:<br />
              <strong>contact@thevaultprestige.com</strong>
            </p>
            <span className="badge-red footer-badge">DROPS EXCLUSIVOS</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} THE VOULT PRESTIGE. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </div>
    </footer>
  );
}
