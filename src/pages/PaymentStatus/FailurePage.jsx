import { Link } from "react-router-dom";
import "./PaymentStatus.css";

export default function FailurePage() {
  return (
    <div className="status-page-container container">
      <div className="status-card failure">
        <span className="status-icon">❌</span>
        <h2>Pago Rechazado o Incompleto</h2>
        <p>No pudimos procesar tu pago. Puedes intentar nuevamente o comunicarte vía WhatsApp con un asesor VIP.</p>
        
        <div className="status-actions">
          <Link to="/bag" className="btn-gold">
            REINTENTAR COMPRA 🛍️
          </Link>
          <a href="https://wa.me/573113524794" target="_blank" rel="noreferrer" className="btn-gold-outline">
            CONTACTAR SOPORTE 📲
          </a>
        </div>
      </div>
    </div>
  );
}
