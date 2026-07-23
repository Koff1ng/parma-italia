import { Link } from "react-router-dom";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page-container container">
      <div className="about-hero-section">
        <span className="badge-gold">MANIFIESTO & CONCEPTO</span>
        <h1 className="about-title">
          THE VAULT <span className="gold-text">PRESTIGE</span>
        </h1>
        <p className="about-tagline">
          Acceso exclusivo al secreto de la moda de alta gama y streetwear 1:1.
        </p>
      </div>

      <div className="about-content-grid">
        <div className="about-text-block">
          <h2>EL CONCEPTO 1.1</h2>
          <p>
            <strong>THE VAULT PRESTIGE</strong> nace con la visión de eliminar la brecha entre el verdadero lujo urbano y el coleccionista apasionado. Nos especializamos en la curaduría y confección de prendas <strong>Qualité 1.1</strong> — réplicas de grado idéntico a las piezas originales lanzadas en las casas de alta costura de París, Milán y Londres.
          </p>
          <p>
            Cada pieza disponible en nuestro Vault es seleccionada bajo estrictos estándares: gramos exactos por metro cuadrado de algodón peinado (400-500 GSM), bordados en hilo de seda o metalizado, herrajes de latón macizo grabados y etiquetas de lavado funcionales.
          </p>
        </div>

        <div className="about-image-card">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
            alt="The Vault Prestige Concept"
          />
        </div>
      </div>

      <div className="pillars-grid">
        <div className="pillar-card">
          <span className="pillar-num">01</span>
          <h3>Telas de Autor</h3>
          <p>Algodón peinado francés e italiano con la densidad y el peso auténtico del retail.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">02</span>
          <h3>Detalles de Precisión</h3>
          <p>Serigrafías en relieve de alta densidad, bordados de seda y etiquetas originales.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">03</span>
          <h3>Drops Limitados</h3>
          <p>Lotes de producción reducidos para preservar la exclusividad de quienes visten The Vault.</p>
        </div>
      </div>

      <div className="about-cta-section">
        <h2>¿LISTO PARA INGRESAR AL VAULT?</h2>
        <Link to="/" className="btn-gold">
          EXPLORAR DROPS DISPONIBLES 🛍️
        </Link>
      </div>
    </div>
  );
}
