// PendingPage.jsx
import { Link } from "react-router-dom";
import "./styles/payment-status.css";

export default function PendingPage() {
  return (
    <div className="status-container pending">
      <div className="status-card">
        <svg className="icon pending-icon" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11H11V6h2v5zm0 4H11v-2h2v2z" />
        </svg>

        <h1>Pago pendiente</h1>
        <p>Aún no hemos recibido la confirmación del pago.</p>

        <Link to="/" className="status-btn">Volver al inicio</Link>
      </div>
    </div>
  );
}
