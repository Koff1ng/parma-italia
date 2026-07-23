import React from "react";
import "./SizeModal.css";

export default function SizeModal({ product, onClose, onSelectSize }) {
  if (!product) return null;

  const availableSizes = ["XS", "S", "M", "L", "XL", "2XL"].filter((talla) => {
    const tieneTalla = product.tallas?.[talla] || false;
    const stockDisponible = Number(product.stock?.[talla]) || 0;
    return tieneTalla && stockDisponible > 0;
  });

  return (
    <div className="size-modal-overlay" onClick={onClose}>
      <div className="size-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Selecciona tu Talla</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="product-modal-name">{product.nombre}</p>

        <div className="sizes-grid">
          {availableSizes.length > 0 ? (
            availableSizes.map((size) => (
              <button
                key={size}
                className="size-btn"
                onClick={() => onSelectSize(product, size)}
              >
                {size}
              </button>
            ))
          ) : (
            <p className="no-sizes-msg">Disculpa, no hay stock disponible en este momento.</p>
          )}
        </div>

        <button className="cancel-modal-btn" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
