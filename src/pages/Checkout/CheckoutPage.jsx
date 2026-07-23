import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatCurrency, buildWhatsAppOrderUrl } from "../../utils/formatters";
import { orderService } from "../../services/orderService";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { cart, subtotal, discountAmount, total, appliedCoupon, clearCart } = useCart();

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "Cali",
    email: "",
    notas: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    form.nombre.trim() !== "" &&
    form.telefono.trim() !== "" &&
    form.direccion.trim() !== "" &&
    form.ciudad.trim() !== "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrder = async (metodoPago) => {
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const orderPayload = {
        cliente: form,
        items: cart,
        total,
        subtotal,
        descuento: discountAmount,
        cupon: appliedCoupon ? appliedCoupon.codigo : null,
        metodoPago,
        notas: form.notas,
      };

      // 1. Save order in Supabase
      const createdOrder = await orderService.createOrder(orderPayload);

      // 2. Process payment method
      if (metodoPago === "WhatsApp") {
        const url = buildWhatsAppOrderUrl({
          cliente: form,
          items: cart,
          total,
          orderId: createdOrder.id,
          metodoPago: "Transferencia / Bancolombia / Nequi",
        });
        clearCart();
        window.location.href = url;
      } else {
        // MercadoPago flow handler event
        const mpItems = cart.map((item) => ({
          id: String(item.id),
          title: item.nombre,
          unit_price: Number(item.itemprice || item.precio),
          quantity: Number(item.qty),
        }));

        const event = new CustomEvent("mpPay", {
          detail: {
            items: mpItems,
            cliente: form,
            total,
          },
        });
        window.dispatchEvent(event);
      }
    } catch (e) {
      console.error("Error al procesar orden:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty-container container">
        <h2>Your bag is empty / Tu bolsa está vacía para el checkout.</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container">
      <h1 className="checkout-page-title">CHECKOUT & DISPATCH / DESPACHO</h1>

      <div className="checkout-grid">
        {/* LEFT COLUMN: CUSTOMER FORM */}
        <div className="checkout-form-col">
          <div className="checkout-card">
            <h3 className="card-heading">1. SHIPPING & CONTACT DETAILS / DATOS DE ENVÍO</h3>

            <div className="form-group-row">
              <div className="form-field">
                <label>Full Name / Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Phone / Contacto WhatsApp *</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Ej: 311 352 4794"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-field">
                <label>City / Ciudad *</label>
                <input
                  type="text"
                  name="ciudad"
                  placeholder="Ej: Cali, Medellín, Bogotá..."
                  value={form.ciudad}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Email (Optional / Opcional)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="cliente@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field full-width">
              <label>Shipping Address / Dirección de Residencia *</label>
              <input
                type="text"
                name="direccion"
                placeholder="Calle / Carrera / Apt / Conjunto"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY & PAYMENT SELECTION */}
        <div className="checkout-summary-col">
          <div className="checkout-card sticky-card">
            <h3 className="card-heading">2. ORDER SUMMARY / RESUMEN</h3>

            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item.id + (item.size || "")} className="checkout-mini-item">
                  <img
                    src={item.thumb || (item.imagenes ? item.imagenes[0] : item.url_imagen)}
                    alt={item.nombre}
                  />
                  <div className="mini-info">
                    <span className="mini-title">{item.nombre}</span>
                    <span className="mini-size">SIZE: {item.size || "STD"} x {item.qty}</span>
                  </div>
                  <span className="mini-price">
                    {formatCurrency((item.itemprice || item.precio) * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="breakdown-row discount">
                  <span>Discount ({appliedCoupon.codigo}):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="breakdown-row total">
                <span>TOTAL:</span>
                <span className="red-total-val">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="payment-options-box">
              <h4 className="payment-heading">PAYMENT METHOD / MÉTODO DE PAGO:</h4>

              <button
                className="btn-red full-btn"
                disabled={!isValid || isSubmitting}
                onClick={() => handleCreateOrder("WhatsApp")}
              >
                ORDER VIA WHATSAPP (NEQUI / BANCOLOMBIA) 📱
              </button>

              <button
                className="btn-red-outline full-btn"
                disabled={!isValid || isSubmitting}
                onClick={() => handleCreateOrder("MercadoPago")}
              >
                PAY WITH MERCADOPAGO 💳
              </button>

              {!isValid && (
                <p className="validation-warning">
                  * Fill required fields to enable checkout buttons / Completa los campos obligatorios.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
