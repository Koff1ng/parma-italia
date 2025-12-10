// SuccessPage.jsx
import { Link, useLocation } from "react-router-dom";
import "./payment-status.css";

export default function SuccessPage() {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("payment_id");

  return (
    <div className="status-container success">
      <div className="status-card">
        <svg className="icon success-icon" viewBox="0 0 24 24">
          <path d="M9 12.5l-2-2L5.5 12 9 15.5 18.5 6 17 4.5z" />
        </svg>

        <h1>Pago completado</h1>
        <p>Gracias por tu compra en Parma Italia.</p>

        {paymentId && <p className="details">ID de pago: {paymentId}</p>}

        <Link to="/" className="status-btn">Volver al inicio</Link>
      </div>
    </div>
  );
}
