import { useState, useEffect } from "react";
import { orderService } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function DashboardPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await orderService.getOrders();
    setPedidos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await orderService.updateOrderStatus(id, status);
    loadOrders();
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm("¿Seguro de eliminar este pedido?")) return;
    await orderService.deleteOrder(id);
    loadOrders();
  };

  return (
    <div className="admin-section-block">
      <div className="section-header-row">
        <h3>🛍️ GESTIÓN DE PEDIDOS VIP ({pedidos.length})</h3>
        <button className="btn-gold-outline sm" onClick={loadOrders}>Refrescar</button>
      </div>

      {loading ? (
        <p className="admin-msg">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="admin-msg">No hay pedidos registrados en la base de datos.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Ciudad / Dirección</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td><strong>#{p.id}</strong></td>
                  <td>{formatDate(p.created_at)}</td>
                  <td>{p.cliente_nombre}</td>
                  <td>{p.cliente_telefono}</td>
                  <td>{p.cliente_ciudad} - {p.cliente_direccion}</td>
                  <td className="red-text-bold">{formatCurrency(p.total)}</td>
                  <td>
                    <select
                      value={p.estado || "Pendiente"}
                      onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                      className={`status-badge ${p.estado?.toLowerCase()}`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-danger-sm"
                      onClick={() => handleDeleteOrder(p.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
