// BagPage.jsx
import { useCart } from "./CartContext";
import "./styles/bagpage.css";
import { Link, useNavigate } from "react-router-dom";

export default function BagPage() {
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.itemprice ?? item.precio) * item.qty,
    0
  );

  const phoneNumber = "573113524794";

  const sendWhatsAppOrder = () => {
    const items = cart
      .map((item) => {
        return `🔹 *${item.nombre}*
ID: ${item.id}
Talla: ${item.size}
Cantidad: ${item.qty}
Precio unitario: $${Number(item.itemprice ?? item.precio).toLocaleString("es-CO")}
Subtotal: $${(
          Number(item.itemprice ?? item.precio) * item.qty
        ).toLocaleString("es-CO")}`;
      })
      .join("\n\n");

    const totalFinal = subtotal.toLocaleString("es-CO");

    const message = `
🛒 *Nuevo Pedido desde PARMA ITALIA*  
------------------------------------

${items}

------------------------------------
💰 *Total del pedido:* $${totalFinal} (SIN ENVIO)

Por favor confirma la compra, dirección y método de pago 🙌
    `;

    const encodedMessage = encodeURIComponent(message);

    window.location.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  // 🔥 NUEVO: navegar al panel de datos
  const continuarCheckout = () => {
    navigate("/checkout-details", {
      state: { cart: cart, subtotal: subtotal }
    });
  };

  return (
    <div className="bag-container">
      {/* LEFT SIDE */}
      <div className="bag-left">
        <h2 className="bag-title">TUS PRODUCTOS ({cart.length})</h2>

        {cart.map((item) => (
          <div key={item.id + item.size} className="bag-item">
            
            {/* ⭐ MINIATURA CORRECTA */}
            <img
              src={item.thumb || item.url_imagen || "/fallback.jpg"}
              alt={item.nombre}
              className="bag-img"
            />

            <div className="bag-item-info">
              <h3>{item.nombre}</h3>
              <p className="bag-size">Size: {item.size}</p>

              <div className="qty-controls">
                <button onClick={() => removeFromCart(item.id, item.size)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id, item.size)}
              >
                🗑 Remove
              </button>
            </div>

            <p className="bag-price">
              $
              {(
                Number(item.itemprice ?? item.precio) * item.qty
              ).toLocaleString("es-CO")}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="bag-right">

        <div className="summary-box">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span className="subtotal-value">
              ${subtotal.toLocaleString("es-CO")}
            </span>
          </div>

          <p className="tax-note">
            * Impuestos, envío y descuentos calculados en el checkout.
          </p>

          <div className="coupon-area">
            <input type="text" placeholder="Código exclusivo o tarjeta de regalo" />
            <button className="btn-add">Aplicar</button>
          </div>

          {/* 🔥 NUEVO: Checkout moderno */}
          <button className="btn-checkout" onClick={continuarCheckout}>
            Continuar al Checkout
          </button>

          {/* Checkout antiguo opcional */}
          {/* <button className="btn-alt" onClick={sendWhatsAppOrder}>
            Comprar por WhatsApp
          </button> */}
        </div>

        <div className="zipcode-box">
          <h4>CÓDIGO POSTAL:</h4>
          <p>
            Si no conoces tu código postal, ingresa <strong>000000</strong>.
          </p>
        </div>

        <div className="payment-methods">
          <h4>MÉTODOS DE PAGO:</h4>

          <div className="payment-icons">
            <img src="/bancolombia.png" alt="Bancolombia" />
            <img src="/nequi.jpg" alt="Nequi" />
            <img src="/breb.jpg" alt="Bre-B" />
            <img src="/nubank.png" alt="NuBank" />
            <img src="/bancodebogota.png" alt="Banco de Bogotá" />
          </div>
        </div>
      </div>
    </div>
  );
}
