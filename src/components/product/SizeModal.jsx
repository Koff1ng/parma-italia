import { memo } from "react";
import "./SizeModal.css";

const SizeModal = memo(({ product, onClose, onSelectSize }) => {
  if (!product) return null;

  const tallas = product.tallas || {};
  const stock = product.stock || {};

  const availableSizes = ["XS", "S", "M", "L", "XL", "2XL"].map((talla) => {
    const isAvailable = tallas[talla] ?? true;
    const count = Number(stock[talla]) || 10;
    return {
      size: talla,
      enabled: isAvailable && count > 0,
    };
  });

  return (
    <div className="size-modal-backdrop" onClick={onClose}>
      <div className="size-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <span className="badge-red">THE VOULT ARCHIVE</span>
          <h3 className="modal-title">{product.nombre}</h3>
          <p className="modal-subtitle">SELECT SIZE / SELECCIONA TU TALLA</p>
        </div>

        <div className="sizes-grid">
          {availableSizes.map(({ size, enabled }) => (
            <button
              key={size}
              className={`size-option-btn ${!enabled ? "disabled" : ""}`}
              disabled={!enabled}
              onClick={() => onSelectSize(product, size)}
            >
              {size}
            </button>
          ))}
        </div>

        <p className="size-guide-hint">
          * Unisex relaxed fit. Standard sizing. / Talle estándar unisex.
        </p>
      </div>
    </div>
  );
});

SizeModal.displayName = "SizeModal";
export default SizeModal;
