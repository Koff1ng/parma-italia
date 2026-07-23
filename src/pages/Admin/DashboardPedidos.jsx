import { useEffect, useState } from "react";
import { orderService } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function DashboardPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setPedidos(data);
    } catch (e) {
      console.error("Error cargando pedidos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleUpdateStatus = async (id, nuevoEstado) => {
    try {
      await orderService.updateOrderStatus(id, nuevoEstado);
      fetchPedidos();
    } catch (e) {
      alert("Error al actualizar estado del pedido");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await orderService.deleteOrder(id);
      fetchPedidos();
    } catch (e) {
      alert("Error al eliminar pedido");
    }
  };

  return (
    <div className="admin-section-block">
      <div className="section-header-row">
        <h3>GESTIÓN DE PEDIDOS ({pedidos.length})</h3>
        <button className="btn-red-outline sm" onClick={fetchPedidos}>
          Actualizar Lista
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="no-data-text">No hay pedidos registrados todavía.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Ciudad / Dirección</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>#{p.id}</strong>
                  </td>
                  <td>{formatDate(p.created_at)}</td>
                  <td>{p.cliente_nombre}</td>
                  <td>{p.cliente_telefono}</td>
                  <td>{p.cliente_ciudad} - {p.cliente_direccion}</td>
                  <td className="red-text-bold">{formatCurrency(p.total)}</td>
                  <td>
                    <select
                      value={p.estado || "Pendiente"}
                      onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                      className={`status-select ${p.estado ? p.estado.toLowerCase() : "pendiente"}`}
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
                      title="Eliminar Pedido"
                    >
                      Eliminar
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
