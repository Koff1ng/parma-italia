import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, set } from "firebase/database";
import "./styles/checkoutdetails.css";
export default function CheckoutDetails() {
  const { state } = useLocation();
  const cart = state?.cart || [];
  const subtotal = state?.subtotal || 0;

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    correo: ""
  });

  const [isValid, setIsValid] = useState(false);
  const [clienteGuardado, setClienteGuardado] = useState(false);

  // Validación
  useEffect(() => {
    setIsValid(
      form.nombre.trim() !== "" &&
      form.telefono.trim() !== "" &&
      form.direccion.trim() !== ""
    );
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setClienteGuardado(false); // Si cambia algo, debe guardar de nuevo
  };

  // Generar ID fácil de leer
  const generarIdCliente = () => {
    const ahora = new Date();
    const formato = ahora
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);
    return `cliente_${formato}`;
  };

  const guardarCliente = async () => {
    if (!isValid) return;

    const id = generarIdCliente();

    await set(ref(db, `clientes/${id}`), {
      ...form,
      productos: cart,
      subtotal,
      fecha: new Date().toISOString()
    });

    setClienteGuardado(true); // 🔥 AHORA SÍ PUEDE PAGAR
    alert("Datos guardados correctamente.");
  };

  // Enviar items a MercadoPago
  const mpItems = cart.map((item) => ({
    id: String(item.id),
    title: item.nombre,
    description: `Compra de ${item.nombre} - Talla ${item.size}`,
    category_id: "fashion",
    quantity: Number(item.qty),
    unit_price: Number(item.precio)
  }));

  const pagarMP = () => {
    if (!isValid || !clienteGuardado) {
      alert("Debes guardar tus datos primero.");
      return;
    }

    const payload = { items: mpItems };

    setTimeout(() => {
      const event = new CustomEvent("mpPay", { detail: payload });
      window.dispatchEvent(event);
    }, 0);
  };

  const enviarWhatsApp = () => {
    if (!isValid || !clienteGuardado) {
      alert("Debes guardar tus datos primero.");
      return;
    }

    const productosTexto = cart
      .map((p) => `• ${p.nombre} (x${p.qty}) — $${p.precio}`)
      .join("%0A");

    const mensaje =
      `Hola, quiero hacer este pedido:%0A%0A${productosTexto}` +
      `%0A%0ASubtotal: $${subtotal.toLocaleString("es-CO")}` +
      `%0A%0ADatos del cliente:%0A${form.nombre}%0A${form.telefono}` +
      `%0A${form.direccion}%0A${form.correo}`;

    window.location.href = `https://wa.me/573113524794?text=${mensaje}`;
  };

  return (
    <div className="checkout-main">

      {/* DATOS CLIENTE */}
      <div className="window-card">
        <h2 className="window-title">TUS DATOS</h2>

        <label>Nombre completo *</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />

        <label>Teléfono *</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} />

        <label>Dirección *</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} />

        <label>Correo (opcional)</label>
        <input
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
        />

        <button
          className={`btn-save ${!isValid ? "disabled" : ""}`}
          disabled={!isValid}
          onClick={guardarCliente}
        >
          Guardar Datos
        </button>
      </div>

      {/* RESUMEN */}
      <div className="window-card">
        <h2 className="window-title">Tu pedido</h2>

        {cart.map((item) => (
          <div key={item.id + item.size} className="order-line">
            <div>
              <strong>{item.nombre}</strong>
              <p>Talla: {item.size}</p>
              <p>Cant: {item.qty}</p>
            </div>
            <strong>
              ${(item.precio * item.qty).toLocaleString("es-CO")}
            </strong>
          </div>
        ))}

        <div className="order-total">
          <span>Total:</span>
          <strong>${subtotal.toLocaleString("es-CO")}</strong>
        </div>
      </div>

      {/* MÉTODOS DE PAGO */}
      <div className="window-card">
        <h2 className="window-title">Métodos de Pago</h2>

        <div className="mp-wrapper">
          <button
            className={`mp-btn ${
              !isValid || !clienteGuardado ? "disabled" : ""
            }`}
            disabled={!isValid || !clienteGuardado}
            onClick={pagarMP}
          >
            <img src="/mercadopago.png" className="mp-btn-logo" />
            <span className="mp-btn-title">PAGAR CON MERCADOPAGO</span>
          </button>

          <div className="mp-btn-sub">
            Guarda tus datos primero para habilitar el pago
          </div>
        </div>

        <button
          className={`btn-whatsapp ${
            !isValid || !clienteGuardado ? "disabled" : ""
          }`}
          disabled={!isValid || !clienteGuardado}
          onClick={enviarWhatsApp}
        >
          PAGAR POR TRANSFERENCIAS (WhatsApp)
        </button>
      </div>
    </div>
  );
}


