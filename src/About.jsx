// src/About.jsx
import "./styles/About.css";
import { useEffect } from "react";

export default function About() {
      useEffect(() => {
    // aplicar fondo negro solo al entrar
    document.body.style.background = "black";
    document.body.style.color = "white";

    // restaurar al salir
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);
  return (
    <div className="about-container">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <h1 className="about-title">SOBRE PARMA ITALIA</h1>
      </section>

      {/* INTRO */}
      <section className="about-section">
        <div className="about-text">
          <h2>Nuestra Historia</h2>
          <p>
            PARMA ITALIA nace con la visión de redefinir la moda urbana premium.
            Inspirados en la estética europea contemporánea, mezclamos minimalismo,
            lujo y funcionalidad en cada colección.
          </p>

          <p>
            Nuestra misión es crear piezas que trasciendan tendencias: prendas
            exclusivas, de corte moderno, materiales de calidad y estilo atemporal.
            Cada colección está diseñada cuidadosamente para ofrecer una experiencia
            sofisticada y auténtica.
          </p>
        </div>
      </section>

      {/* IMAGEN EDITORIAL */}
      <section className="about-image-section">
        <img src="/editorial_hero.webp" alt="Editorial Parma Italia" />
      </section>

      {/* MISIÓN / VISIÓN */}
      <section className="about-section mission">
        <div>
          <h3>MISIÓN</h3>
          <p>
            Elevar el estilo cotidiano mediante prendas que combinan diseño,
            identidad y calidad. Queremos inspirar confianza, poder y autenticidad
            en quienes visten PARMA.
          </p>
        </div>

        <div>
          <h3>VISIÓN</h3>
          <p>
            Convertirnos en una de las marcas de moda urbana premium más influyentes
            de Latinoamérica, manteniendo siempre la esencia italiana moderna.
          </p>
        </div>
      </section>

      {/* SEGUNDA IMAGEN */}
      <section className="about-image-section">
        <img src="/editorial2.webp" alt="Colección Parma" />
      </section>

      {/* CIERRE */}
      <section className="about-section final-message">
        <h2>Autenticidad. Estilo. Identidad.</h2>
        <p>
          Bienvenido a PARMA ITALIA. Este es solo el inicio de una nueva era en la moda.
        </p>
      </section>
    </div>
  );
 
}
