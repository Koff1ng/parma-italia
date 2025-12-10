// FailurePage.jsx
import { Link } from "react-router-dom";
import "./styles/payment-status.css";

export default function FailurePage() {
  return (
    <div className="status-container failure">
      <div className="status-card">
        <svg className="icon failure-icon" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 13H11v-2h2v2zm0-4H11V6h2v5z" />
        </svg>

        <h1>Pago fallido</h1>
        <p>No se pudo procesar tu pago. Inténtalo nuevamente.</p>

        <Link to="/" className="status-btn">Volver al inicio</Link>
      </div>
    </div>
  );
}
