// PedidoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "./firebase";
import { ref, get } from "firebase/database";
import "./styles/dashboard.css";

export default function PedidoDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const cargarPedido = async () => {
      const snap = await get(ref(db, `pedidos/${id}`));

      if (snap.exists()) {
        setPedido(snap.val());
      }
    };

    cargarPedido();
  }, [id]);

  if (!pedido) return <p style={{ padding: 20 }}>Cargando datos del pedido...</p>;

  const cliente = pedido.customer || {};
  const items = pedido.items || [];
  const total = items.reduce(
    (sum, i) => sum + i.unit_price * i.quantity,
    0
  );

  return (
    <div className="detalle-container">
      <Link to="/dashboard" className="volver">⬅ Volver</Link>

      <h1>Detalle del Pedido</h1>

      {/* ======================  
            INFO GENERAL  
      ======================= */}
      <div className="detalle-box">
        <h2>Información del Pedido</h2>

        <p><strong>ID Pedido:</strong> {id}</p>
        <p><strong>Estado:</strong> {pedido.status}</p>

        {pedido.mp_payment_id && (
          <p><strong>ID de Pago MP:</strong> {pedido.mp_payment_id}</p>
        )}

        <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleString("es-CO")}</p>
      </div>

      {/* ======================  
            DATOS DEL CLIENTE  
      ======================= */}
      <div className="detalle-box">
        <h2>Datos del Cliente</h2>

        <p><strong>Nombre:</strong> {cliente.nombre || "—"}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono || "—"}</p>
        <p><strong>Dirección:</strong> {cliente.direccion || "—"}</p>
        <p><strong>Correo:</strong> {cliente.correo || "—"}</p>

        {cliente.notas && (
          <p><strong>Notas:</strong> {cliente.notas}</p>
        )}
      </div>

      {/* ======================  
            ITEMS  
      ======================= */}
      <div className="detalle-box">
        <h2>Productos Comprados</h2>

        {items.map((i, index) => (
          <div key={index} className="detalle-item">
            <p><strong>{i.title}</strong></p>
            <p>Cantidad: {i.quantity}</p>
            <p>Precio unidad: ${i.unit_price.toLocaleString("es-CO")}</p>
          </div>
        ))}

        <hr />

        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Total: ${total.toLocaleString("es-CO")}
        </p>
      </div>

    </div>
  );
}
