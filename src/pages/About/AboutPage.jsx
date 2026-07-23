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
          LA EXCLUSIVIDAD DEL STREETWEAR DE LUJO • ALGODÓN PIMA PERUANO DE ALTO GRAMAJE
        </p>
      </div>

      <div className="about-content-grid">
        <div className="about-text-block">
          <h2>EL MANIFIESTO THE VOULT</h2>
          <p>
            <strong>THE VOULT PRESTIGE</strong> nace con una misión clara: redefinir el lujo urbano mediante la obsesión por la calidad textil suprema y el diseño de autor.
          </p>
          <p>
            No creemos en la producción masiva. Cada prenda en nuestro Vault es confeccionada utilizando exclusivamente <strong>100% Algodón Pima Peruano de Selección Extra-Larga</strong> de alto gramaje (400 a 500 GSM). Reconocido mundialmente por su suavidad sedosa inigualable, brillo natural y resistencia extraordinaria, el Algodón Pima Peruano le otorga a nuestras siluetas la estructura, cuerpo y caída perfecta que exige la alta costura contemporánea.
          </p>
          <p>
            Desde la densidad del tejido hasta los bordados en hilo de seda y los herrajes personalizados, cada Drop es un testimonio de sofisticación sin concesiones.
          </p>
        </div>

        <div className="about-image-card">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=90"
            alt="The Voult Prestige - Algodón Pima Peruano"
          />
        </div>
      </div>

      {/* BRANDS SECTION */}
      <div className="about-brands-block">
        <span className="badge-red">MARCAS REPRESENTADAS</span>
        <h3>TRABAJAMOS CON LAS MEJORES MARCAS DEL MERCADO</h3>
        <p>
          En The Voult Prestige encontrarás piezas inspiradas y confeccionadas al nivel de las casas más reconocidas del streetwear y la alta costura contemporánea:
        </p>
        <div className="brands-name-grid">
          {[
            "Undergold", "Clemont", "Monastery", "Godspeed", "Casa Blanca",
            "Vineyard Vines", "Y-OUT", "Off-White", "Chrome Hearts",
            "Saint Theory", "Amiri"
          ].map((b) => (
            <span key={b} className="brand-name-tag">{b}</span>
          ))}
        </div>
      </div>

      <div className="pillars-grid">
        <div className="pillar-card">
          <span className="pillar-num">01</span>
          <h3>Algodón Pima Peruano Supremo</h3>
          <p>Fibras extra largas de origen peruano con tejido pesado (400 - 500 GSM). Tacto ultra sedoso, estructura impecable y cero desgaste.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">02</span>
          <h3>Confección & Detalle de Autor</h3>
          <p>Serigrafías en relieve de alta densidad, bordados de seda, costuras reforzadas y herrajes metálicos de alta gama.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-num">03</span>
          <h3>Drops de Edición Limitada</h3>
          <p>Lotes de producción estrictamente reducidos para garantizar que cada prenda mantenga su estatus de pieza de colección.</p>
        </div>
      </div>

      <div className="about-cta-section">
        <h2>¿LISTO PARA INGRESAR AL VAULT?</h2>
        <Link to="/" className="btn-red">
          EXPLORAR COLECCIÓN
        </Link>
      </div>
    </div>
  );
}
