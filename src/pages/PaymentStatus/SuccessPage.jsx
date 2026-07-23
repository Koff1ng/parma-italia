import { Link } from "react-router-dom";
import "./PaymentStatus.css";

export default function SuccessPage() {
  return (
    <div className="status-page-container container">
      <div className="status-card success">
        <span className="status-icon">✨</span>
        <span className="badge-gold">PAGO CONFIRMADO</span>
        <h2>¡Gracias por tu compra en The Vault Prestige!</h2>
        <p>Tu orden de prendas 1.1 ha sido aprobada e ingresada al sistema de despacho VIP.</p>
        <p className="status-sub">Te enviaremos la guía de rastreo y factura vía correo / WhatsApp.</p>
        
        <Link to="/" className="btn-gold">
          VOLVER AL INICIO 🏠
        </Link>
      </div>
    </div>
  );
}
