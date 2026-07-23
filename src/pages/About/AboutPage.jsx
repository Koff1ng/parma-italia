import { Link } from "react-router-dom";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page-container container">
      <div className="about-hero-section">
        <span className="badge-red">CONCEPTO Y MANIFIESTO</span>
        <div className="about-logo-box">
          <img src="/logo.png" alt="THE VOULT PRESTIGE" className="about-logo-img" />
        </div>
        <p className="about-tagline">
          ACCESO EXCLUSIVO A LA MODA DE ALTA GAMA Y STREETWEAR DE AUTOR.
        </p>
      </div>

      <div className="about-content-grid">
        <div className="about-text-block">
          <h2>EL CONCEPTO THE VOULT</h2>
          <p>
            <strong>THE VOULT PRESTIGE</strong> nace con la visión de conectar a coleccionistas y apasionados de la moda con piezas de archivo exclusivas y streetwear de alta gama. Nos especializamos en la selección y confección de prendas inspiradas en las firmas más destacadas de París, Milán y Londres.
          </p>
          <p>
            Cada pieza disponible en nuestro Vault es seleccionada bajo estrictos estándares: gramos exactos por metro cuadrado de algodón peinado (400-500 GSM), bordados en hilo de seda, herrajes de latón macizo y etiquetas originales.
          </p>
        </div>

        <div className="about-image-card">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
            alt="The Voult Prestige Concept"
          />
        </div>
      </div>

      <div className="pillars-grid">
        <div className="pillar-card">
          <span className="pillar-num">01</span>
          <h3>Telas de Autor</h3>
          <p>Algodón peinado francés e italiano de 400-500 GSM estructurado para máxima durabilidad.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">02</span>
          <h3>Detalle de Precisión</h3>
          <p>Serigrafías en relieve de alta densidad, bordados de seda y herrajes metálicos personalizados.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">03</span>
          <h3>Drops Limitados</h3>
          <p>Lotes de producción reducidos para preservar la exclusividad de cada pieza.</p>
        </div>
      </div>

      <div className="about-cta-section">
        <h2>¿LISTO PARA INGRESAR AL VAULT?</h2>
        <Link to="/" className="btn-red">
          EXPLORAR COLECCIÓN 🛍️
        </Link>
      </div>
    </div>
  );
}
