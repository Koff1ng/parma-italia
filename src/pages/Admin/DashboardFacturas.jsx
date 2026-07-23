import { useState, useEffect } from "react";
import { InvoiceService } from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function DashboardFacturas() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    InvoiceService.getInvoices().then(setFacturas);
  }, []);

  return (
    <div className="admin-section-block">
      <h3>📄 FACTURACIÓN ELECTRÓNICA DIAN</h3>
      <p className="admin-subtext">Empresa Emisora: THE VAULT PRESTIGE S.A.S. (NIT 901847592-1)</p>

      {facturas.length === 0 ? (
        <p className="admin-msg">No hay facturas electrónicas registradas aún.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Número Factura</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.numero_factura}</strong></td>
                  <td>{formatDate(f.fecha)}</td>
                  <td>{f.cliente_nombre}</td>
                  <td>{f.cliente_documento}</td>
                  <td className="gold-text-bold">{formatCurrency(f.total)}</td>
                  <td><span className="badge-gold">{f.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
