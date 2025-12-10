import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();

  const phone = "573001112233"; // cambia por tu WhatsApp

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, quiero comprar:\n\n${cart
        .map(
          (p) =>
            `• ${p.name} x ${p.qty} — $${(p.qty * p.price).toLocaleString(
              "es-CO"
            )}`
        )
        .join("\n")}\n\nTotal: $${total.toLocaleString("es-CO")}`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="checkout-page">
      <h2>Checkout 🧾</h2>

      {cart.length === 0 && (
        <>
          <p>Tu carrito está vacío</p>
          <Link to="/">Volver a comprar</Link>
        </>
      )}

      {cart.map((item) => (
        <div key={item.id} className="checkout-item">
          <img src={item.thumb} />
          <div>
            <h4>{item.name}</h4>
            <p>${item.price.toLocaleString("es-CO")}</p>
            <span>Cantidad: {item.qty}</span>
          </div>
          <strong>
            ${((item.qty * item.price)).toLocaleString("es-CO")}
          </strong>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3 className="checkout-total">
            Total: ${total.toLocaleString("es-CO")}
          </h3>

          <button className="btn-whatsapp" onClick={sendToWhatsApp}>
            Comprar por WhatsApp ✅
          </button>

          <button className="btn-clear" onClick={clearCart}>
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
}
