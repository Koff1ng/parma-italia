import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const scrollToCatalog = () => {
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
  };

  return (
    <section className="vault-hero">
      {/* 🎥 VIDEO BACKGROUND - thevault.mp4 */}
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/editorial_hero.webp"
      >
        <source src="/thevault.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="hero-video-overlay"></div>

      <div className="hero-content container">
        <div className="hero-badge">
          <span className="badge-gold">QUALITÉ 1.1 • AUTHENTIC DROP</span>
        </div>

        <h1 className="hero-title">
          THE VAULT <span className="gold-text">PRESTIGE</span>
        </h1>

        <p className="hero-subtitle">
          Ediciones limitadas de streetwear de lujo y alta costura 1:1. 
          Mismas telas, mismos bordados, idéntico peso y acabados impecables.
        </p>

        <div className="hero-actions">
          <button className="btn-gold" onClick={scrollToCatalog}>
            EXPLORAR EL VAULT 🛍️
          </button>
          <Link to="/about" className="btn-gold-outline">
            NUESTRO MANIFIESTO
          </Link>
        </div>
      </div>
    </section>
  );
}
