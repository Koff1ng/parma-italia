import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency, buildWhatsAppOrderUrl } from "../../utils/formatters";
import { couponService } from "../../services/couponService";
import "./BagPage.css";

export default function BagPage() {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteItemCompletely,
    subtotal,
    discountAmount,
    total,
    appliedCoupon,
    setAppliedCoupon,
    clearCart
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponStatus(null);
    if (!couponInput.trim()) return;

    const coupon = await couponService.validateCoupon(couponInput);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponStatus({ success: true, message: `¡Cupón ${coupon.codigo} aplicado con éxito!` });
    } else {
      setCouponStatus({ success: false, message: "Código de descuento no válido o expirado." });
    }
  };

  const handleQuickWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const url = buildWhatsAppOrderUrl({
      cliente: {
        nombre: "Cliente VIP",
        telefono: "Por confirmar",
        ciudad: "Por confirmar",
        direccion: "Por confirmar",
      },
      items: cart,
      total,
    });

    window.open(url, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="bag-page-container container empty-bag-view">
        <div className="empty-box">
          <span className="red-icon">🛍️</span>
          <h2>TU BOLSA DE COMPRAS ESTÁ VACÍA</h2>
          <p>Explora nuestras colecciones exclusivas e inicia tu orden.</p>
          <Link to="/" className="btn-red">
            VER CATÁLOGO
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bag-page-container container">
      <h1 className="bag-heading">TU BOLSA DE COMPRAS</h1>

      <div className="bag-grid">
        {/* ITEMS TABLE / LIST */}
        <div className="bag-items-section">
          {cart.map((item) => {
            const precio = Number(item.itemprice ?? item.precio ?? 0);
            const portada = item.thumb || (item.imagenes ? item.imagenes[0] : item.url_imagen) || "/fallback.jpg";

            return (
              <div key={item.id + (item.size || "")} className="bag-row-card">
                <img src={portada} alt={item.nombre} className="bag-item-thumb" />

                <div className="bag-item-details">
                  <h3 className="bag-item-name">{item.nombre}</h3>
                  {item.size && <span className="bag-item-size">TALLA: {item.size}</span>}
                  <span className="bag-item-unit-price">{formatCurrency(precio)} c/u</span>

                  <div className="bag-qty-actions">
                    <div className="qty-picker">
                      <button onClick={() => removeFromCart(item.id, item.size)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>

                    <button
                      className="bag-remove-link"
                      onClick={() => deleteItemCompletely(item.id, item.size)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="bag-item-total">
                  {formatCurrency(precio * item.qty)}
                </div>
              </div>
            );
          })}

          <button className="clear-bag-btn" onClick={clearCart}>
            Vaciar bolsa de compras
          </button>
        </div>

        {/* SUMMARY CARD */}
        <div className="bag-summary-card">
          <h3 className="summary-title">RESUMEN DEL PEDIDO</h3>

          <div className="summary-line">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {appliedCoupon && (
            <div className="summary-line discount">
              <span>Descuento ({appliedCoupon.codigo}):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="summary-line total-line">
            <span>TOTAL ESTIMADO:</span>
            <span className="red-price">{formatCurrency(total)}</span>
          </div>

          <form className="bag-coupon-form" onSubmit={handleApplyCoupon}>
            <input
              type="text"
              placeholder="Código de descuento"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button type="submit">APLICAR</button>
          </form>

          {couponStatus && (
            <p className={`coupon-msg ${couponStatus.success ? "success" : "error"}`}>
              {couponStatus.message}
            </p>
          )}

          <div className="checkout-buttons">
            <button className="btn-red full-btn" onClick={() => navigate("/checkout")}>
              PROCEDER AL CHECKOUT →
            </button>
            <button className="btn-red-outline full-btn" onClick={handleQuickWhatsAppOrder}>
              COMPRAR POR WHATSAPP 📲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
