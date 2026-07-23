import { Link } from "react-router-dom";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page-container container">
      <div className="about-hero-section">
        <span className="badge-red">CONCEPT & MANIFESTO</span>
        <div className="about-logo-box">
          <img src="/logo.jpg" alt="THE VOULT PRESTIGE" className="about-logo-img" />
        </div>
        <p className="about-tagline">
          EXCLUSIVE ACCESS TO CONTEMPORARY LUXURY & HIGH-END STREETWEAR.
        </p>
      </div>

      <div className="about-content-grid">
        <div className="about-text-block">
          <h2>THE VOULT CONCEPT / EL CONCEPTO</h2>
          <p>
            <strong>THE VOULT PRESTIGE</strong> is a curated high-fashion vault founded to connect passionate collectors with exclusive streetwear drops and archive pieces. Nos especializamos en la selección y confección de prendas de autor inspiradas en las firmas más destacadas de París, Milán y Londres.
          </p>
          <p>
            Each piece in our vault undergoes strict quality curation: heavyweight french terry cotton (400-500 GSM), silk-thread embroidery, custom hardware, and authentic finishing details.
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
          <h3>Heavyweight Fabrics / Telas de Autor</h3>
          <p>400-500 GSM French and Italian combed cotton built for structure and durability.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">02</span>
          <h3>Precision Craft / Detalle de Precisión</h3>
          <p>High-density puff prints, silk embroideries, and custom branded metal hardware.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">03</span>
          <h3>Limited Archive Drops</h3>
          <p>Lotes de producción reducidos para preservar la exclusividad de cada pieza.</p>
        </div>
      </div>

      <div className="about-cta-section">
        <h2>READY TO ENTER THE VOULT?</h2>
        <Link to="/" className="btn-red">
          EXPLORE AVAILABLE DROPS / VER CATÁLOGO 🛍️
        </Link>
      </div>
    </div>
  );
}
