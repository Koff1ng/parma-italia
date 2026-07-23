import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatCurrency, buildWhatsAppOrderUrl } from "../../utils/formatters";
import { orderService } from "../../services/orderService";
import { InvoiceService } from "../../services/invoiceService";
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

  // Factura electrónica state
  const [requiereFactura, setRequiereFactura] = useState(false);
  const [facturaForm, setFacturaForm] = useState({
    tipoDocumento: "CC",
    numeroDocumento: "",
    razonSocial: "",
    direccionFiscal: "",
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

  const handleFacturaChange = (e) => {
    setFacturaForm({ ...facturaForm, [e.target.name]: e.target.value });
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

      // 2. Save invoice if requested
      if (requiereFactura) {
        const xmlData = InvoiceService.generarXMLFactura(
          { subtotal, descuento: discountAmount, items: cart },
          facturaForm
        );

        await InvoiceService.saveInvoice({
          numero_factura: xmlData.numeroFactura,
          order_id: createdOrder.id,
          cliente_nombre: facturaForm.razonSocial || form.nombre,
          cliente_documento: facturaForm.numeroDocumento,
          cliente_email: form.email,
          total,
          estado: "Emitida",
        });
      }

      // 3. Process payment method
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
        <h2>No tienes prendas en tu bolsa para checkout.</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container">
      <h1 className="checkout-page-title">CHECKOUT Y DESPACHO VIP</h1>

      <div className="checkout-grid">
        {/* LEFT COLUMN: CUSTOMER FORM & INVOICE */}
        <div className="checkout-form-col">
          <div className="checkout-card">
            <h3 className="card-heading">1. DATOS DE ENVÍO Y CONTACTO</h3>

            <div className="form-group-row">
              <div className="form-field">
                <label>Nombre y Apellidos *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Teléfono de Contacto (WhatsApp) *</label>
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
                <label>Ciudad de Envío *</label>
                <input
                  type="text"
                  name="ciudad"
                  placeholder="Ej: Cali, Medellín, Bogotá..."
                  value={form.ciudad}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Correo Electrónico (para seguimiento)</label>
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
              <label>Dirección de Residencia / Barrio *</label>
              <input
                type="text"
                name="direccion"
                placeholder="Calle / Carrera / Apto / Conjunto"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ELECTRONIC INVOICE TOGGLE */}
          <div className="checkout-card">
            <div className="invoice-toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={requiereFactura}
                  onChange={(e) => setRequiereFactura(e.target.checked)}
                />
                <span>¿Requieres Factura Electrónica (DIAN)?</span>
              </label>
            </div>

            {requiereFactura && (
              <div className="invoice-fields-box">
                <div className="form-group-row">
                  <div className="form-field">
                    <label>Tipo Documento</label>
                    <select
                      name="tipoDocumento"
                      value={facturaForm.tipoDocumento}
                      onChange={handleFacturaChange}
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="NIT">NIT Empresa</option>
                      <option value="CE">Cédula Extranjería</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Número Documento / NIT</label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      placeholder="123456789"
                      value={facturaForm.numeroDocumento}
                      onChange={handleFacturaChange}
                    />
                  </div>
                </div>

                <div className="form-field full-width">
                  <label>Razón Social / Nombre Fiscal</label>
                  <input
                    type="text"
                    name="razonSocial"
                    placeholder="Nombre registrado en el RUT"
                    value={facturaForm.razonSocial}
                    onChange={handleFacturaChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY & PAYMENT SELECTION */}
        <div className="checkout-summary-col">
          <div className="checkout-card sticky-card">
            <h3 className="card-heading">2. RESUMEN DE COMPRA</h3>

            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item.id + (item.size || "")} className="checkout-mini-item">
                  <img
                    src={item.thumb || (item.imagenes ? item.imagenes[0] : item.url_imagen)}
                    alt={item.nombre}
                  />
                  <div className="mini-info">
                    <span className="mini-title">{item.nombre}</span>
                    <span className="mini-size">Talla: {item.size || "Única"} x {item.qty}</span>
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
                  <span>Descuento ({appliedCoupon.codigo}):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="breakdown-row total">
                <span>TOTAL A PAGAR:</span>
                <span className="gold-total-val">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="payment-options-box">
              <h4 className="payment-heading">SELECCIONA MÉTODO DE PAGO:</h4>

              <button
                className="btn-gold full-btn"
                disabled={!isValid || isSubmitting}
                onClick={() => handleCreateOrder("WhatsApp")}
              >
                COMPRAR POR WHATSAPP (NEQUI / BANCOLOMBIA) 📱
              </button>

              <button
                className="btn-gold-outline full-btn"
                disabled={!isValid || isSubmitting}
                onClick={() => handleCreateOrder("MercadoPago")}
              >
                PAGAR CON MERCADOPAGO 💳
              </button>

              {!isValid && (
                <p className="validation-warning">
                  * Completa los campos obligatorios para activar los botones de pago.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
