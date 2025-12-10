import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, update } from "firebase/database";
import "./dashboard.css";

export default function DashboardPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const pedidosRef = ref(db, "pedidos");

    onValue(pedidosRef, (snap) => {
      if (!snap.exists()) return setPedidos([]);

      const data = snap.val();
      const lista = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));

      setPedidos(lista.reverse()); // Últimos arriba
    });
  }, []);

  const cambiarEstado = (id, estado) => {
    update(ref(db, `pedidos/${id}`), {
      status: estado,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="pedidos-container">
      <h1 className="panel-title">Pedidos</h1>

      <div className="table-wrapper">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Items</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Cambiar</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>

                <td>
                  {p.customer?.email || "—"}
                  <br />
                  {p.customer?.nombre || ""}
                </td>

                <td>
                  {p.items?.map((i, idx) => (
                    <div key={idx}>
                      • {i.title} x{i.quantity}
                    </div>
                  ))}
                </td>

                <td>
                  $
                  {p.items
                    ?.reduce(
                      (t, i) => t + i.unit_price * i.quantity,
                      0
                    )
                    .toLocaleString("es-CO")}
                </td>

                <td className={`estado ${p.status}`}>
                  {p.status}
                </td>

                <td>
                  {new Date(p.createdAt).toLocaleString("es-CO")}
                </td>

                <td>
                  <select
                    value={p.status}
                    className="estado-select"
                    onChange={(e) =>
                      cambiarEstado(p.id, e.target.value)
                    }
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
