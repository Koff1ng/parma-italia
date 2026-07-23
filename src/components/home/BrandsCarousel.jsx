import "./BrandsCarousel.css";

const BRANDS = [
  "UNDERGOLD",
  "CLEMONT",
  "MONASTERY",
  "GODSPEED",
  "CASA BLANCA",
  "VINEYARD VINES",
  "Y-OUT",
  "OFF-WHITE",
  "CHROME HEARTS",
  "SAINT THEORY",
  "AMIRI",
  "UNDERGOLD",
  "CLEMONT",
  "MONASTERY",
  "GODSPEED",
  "CASA BLANCA",
  "VINEYARD VINES",
  "Y-OUT",
  "OFF-WHITE",
  "CHROME HEARTS",
  "SAINT THEORY",
  "AMIRI",
];

export default function BrandsCarousel() {
  return (
    <section className="brands-section">
      <p className="brands-eyebrow">TRABAJAMOS CON LAS MEJORES MARCAS DEL MERCADO</p>

      <div className="brands-track-wrapper">
        {/* Fades */}
        <div className="fade-left" />
        <div className="fade-right" />

        <div className="brands-track">
          {BRANDS.map((brand, i) => (
            <span key={i} className="brand-item">
              {brand}
              <span className="brand-dot" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
