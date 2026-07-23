import React, { memo } from "react";
import { formatCurrency } from "../../utils/formatters";
import "./ProductCard.css";

const ProductCard = memo(({ product, index, onAddToCart, navigate }) => {
  const imagenes = product.imagenes ? (Array.isArray(product.imagenes) ? product.imagenes : Object.values(product.imagenes)) : [];
  const portada = imagenes[0] || product.url_imagen || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80";
  const hover = imagenes[1] || portada;

  // Check stock availability
  const tallas = product.tallas || {};
  const stock = product.stock || {};
  const tieneStock = Object.keys(tallas).some((talla) => {
    const tieneTalla = tallas[talla];
    const stockDisponible = Number(stock[talla]) || 0;
    return tieneTalla && stockDisponible > 0;
  });
  const estaAgotado = !tieneStock;

  return (
    <div
      className={`vault-product-card scroll-animate ${estaAgotado ? "agotado" : ""}`}
      style={{ transitionDelay: `${index * 0.04}s` }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="card-media-wrapper">
        <div className="quality-pill">QUALITÉ 1.1</div>
        
        <img
          className="img-primary"
          src={portada}
          alt={product.nombre}
          loading="lazy"
          decoding="async"
        />
        <img
          className="img-hover"
          src={hover}
          alt={product.nombre}
          loading="lazy"
          decoding="async"
        />
        {estaAgotado && <div className="overlay-agotado">AGOTADO</div>}
      </div>

      <div className="card-details">
        <span className="product-category">{product.categoria || "Prenda 1.1"}</span>
        <h3 className="product-title">{product.nombre}</h3>
        
        <div className="card-bottom-row">
          <span className="product-price">{formatCurrency(product.precio)}</span>
          
          <button
            className={`add-cart-btn ${estaAgotado ? "disabled" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!estaAgotado) onAddToCart(product);
            }}
            disabled={estaAgotado}
          >
            {estaAgotado ? "Agotado" : "Añadir +"}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
