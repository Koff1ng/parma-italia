import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const scrollToCatalog = () => {
    const catalogSection = document.getElementById("catalog-section");
    if (catalogSection) {
      const offset = 70;
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
      {/* 🎥 VIDEO BACKGROUND */}
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

      {/* Dark gradient overlay */}
      <div className="hero-video-overlay"></div>

      <div className="hero-content container">
        <div className="hero-badge">
          <span className="badge-red">LIMITED ARCHIVE DROPS • EDICIÓN EXCLUSIVA</span>
        </div>

        {/* LOGO IMAGE DISPLAY IN HERO */}
        <div className="hero-logo-box">
          <img src="/logo.png" alt="THE VOULT PRESTIGE" className="hero-logo-img" />
        </div>

        <p className="hero-subtitle">
          CURATED HIGH-END STREETWEAR & ARCHIVE LUXURY APPAREL.<br />
          EDICIONES LIMITADAS DE ALTA COSTURA CON ACABADOS DE AUTOR.
        </p>

        <div className="hero-actions">
          <button className="btn-red" onClick={scrollToCatalog}>
            EXPLORE THE VAULT / EXPLORAR 🛍️
          </button>
          <Link to="/about" className="btn-red-outline">
            MANIFESTO / MANIFIESTO
          </Link>
        </div>
      </div>
    </section>
  );
}
