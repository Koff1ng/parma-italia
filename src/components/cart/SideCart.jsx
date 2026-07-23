import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";
import { couponService } from "../../services/couponService";
import "./SideCart.css";

export default function SideCart({ openCart, setOpenCart }) {
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteItemCompletely,
    subtotal,
    discountAmount,
    total,
    appliedCoupon,
    setAppliedCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponMsg(null);

    if (!couponCode.trim()) return;

    const coupon = await couponService.validateCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponMsg({ type: "success", text: `¡Coupon ${coupon.codigo} applied!` });
    } else {
      setCouponMsg({ type: "error", text: "Invalid or expired promo code" });
    }
  };

  return (
    <aside className={`vault-side-cart ${openCart ? "open" : ""}`}>
      <div className="cart-header">
        <div className="cart-header-title">
          <span>SHOPPING BAG / BOLSA</span>
          <span className="cart-item-count">({cart.length})</span>
        </div>
        <button
          className="cart-close-btn"
          onClick={() => setOpenCart(false)}
          aria-label="Close bag / Cerrar bolsa"
        >
          ✕
        </button>
      </div>

      <div className="cart-items-container">
        {cart.length === 0 ? (
          <div className="empty-cart-state">
            <p>Your shopping bag is empty / Tu bolsa está vacía.</p>
            <button className="btn-red-outline" onClick={() => setOpenCart(false)}>
              EXPLORE ARCHIVE / VER CATÁLOGO
            </button>
          </div>
        ) : (
          cart.map((item) => {
            const precio = Number(item.itemprice ?? item.precio ?? 0);
            const portada = item.thumb || (item.imagenes ? item.imagenes[0] : item.url_imagen) || "/fallback.jpg";

            return (
              <div key={item.id + (item.size || "")} className="cart-item-card">
                <img src={portada} alt={item.nombre} className="cart-item-img" />

                <div className="cart-item-info">
                  <h4 className="item-title">{item.nombre}</h4>
                  {item.size && <span className="item-size-badge">SIZE: {item.size}</span>}

                  <div className="item-qty-row">
                    <div className="qty-controls">
                      <button onClick={() => removeFromCart(item.id, item.size)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>

                    <button
                      className="delete-item-btn"
                      onClick={() => deleteItemCompletely(item.id, item.size)}
                    >
                      Remove / Eliminar
                    </button>
                  </div>
                </div>

                <div className="cart-item-price">
                  {formatCurrency(precio * item.qty)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer-summary">
          <form className="coupon-form" onSubmit={handleApplyCoupon}>
            <input
              type="text"
              placeholder="Promo / VIP Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="submit">APPLY</button>
          </form>

          {couponMsg && (
            <p className={`coupon-feedback ${couponMsg.type}`}>{couponMsg.text}</p>
          )}

          {appliedCoupon && (
            <div className="summary-row discount">
              <span>Discount ({appliedCoupon.codigo}):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>TOTAL:</span>
            <span className="red-total">{formatCurrency(total)}</span>
          </div>

          <Link
            to="/bag"
            className="go-bag-link btn-red-outline"
            onClick={() => setOpenCart(false)}
          >
            VIEW FULL BAG / VER RESUMEN
          </Link>

          <Link
            to="/checkout"
            className="checkout-link btn-red"
            onClick={() => setOpenCart(false)}
          >
            CHECKOUT / FINALIZAR COMPRA
          </Link>
        </div>
      )}
    </aside>
  );
}
