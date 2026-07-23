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
              <img src="/logo.jpg" alt="THE VOULT PRESTIGE" className="footer-logo-img" />
            </Link>
            <p className="footer-brand-desc">
              Curated high-fashion archive collections & luxury streetwear. 
              Ediciones limitadas de diseño contemporáneo con despacho asegurado.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4 className="footer-col-title">NAVIGATION / NAVEGACIÓN</h4>
            <ul className="footer-links">
              <li><Link to="/">ARCHIVE DROPS</Link></li>
              <li><Link to="/bag">SHOPPING BAG / BOLSA</Link></li>
              <li><Link to="/checkout">CHECKOUT</Link></li>
              <li><Link to="/about">MANIFESTO / SOBRE NOSOTROS</Link></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="footer-col">
            <h4 className="footer-col-title">CLIENT CARE / SERVICIO AL CLIENTE</h4>
            <ul className="footer-links">
              <li><a href="https://wa.me/573113524794" target="_blank" rel="noopener noreferrer">WHATSAPP SUPPORT 📱</a></li>
              <li><span>EXPRESS SHIPPING / ENVÍO NACIONAL</span></li>
              <li><span>SECURE CHECKOUT / COMPRA SEGURA</span></li>
            </ul>
          </div>

          {/* VIP CONTACT */}
          <div className="footer-col">
            <h4 className="footer-col-title">CONCIERGE</h4>
            <p className="concierge-text">
              Direct assistance & personalized orders:<br />
              <strong>contact@thevaultprestige.com</strong>
            </p>
            <span className="badge-red footer-badge">LIMITED ARCHIVE DROPS</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} THE VOULT PRESTIGE. ALL RIGHTS RESERVED / TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </div>
    </footer>
  );
}
