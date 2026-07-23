import { Link } from "react-router-dom";
import "./PaymentStatus.css";

export default function PendingPage() {
  return (
    <div className="status-page-container container">
      <div className="status-card pending">
        <span className="status-icon">⏳</span>
        <h2>Pago Pendiente de Verificación</h2>
        <p>Tu transacción está en proceso de validación por la pasarela de pago.</p>
        <p className="status-sub">Tan pronto se apruebe, recibirás la confirmación de despacho.</p>
        
        <Link to="/" className="btn-gold-outline">
          VOLVER AL INICIO 🏠
        </Link>
      </div>
    </div>
  );
}
