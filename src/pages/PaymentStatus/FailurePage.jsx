import { Link } from "react-router-dom";

export default function FailurePage() {
  return (
    <div className="status-page-container container">
      <div className="status-card error-card">
        <span className="status-badge red">PAGO CANCELADO / FALLIDO</span>
        <h2>Hubo un problema al procesar tu pago</h2>
        <p>No se ha realizado ningún cargo a tu cuenta. Puedes reintentar la compra o comunicarte directamente con nuestro equipo de atención VIP.</p>
        
        <div className="status-actions">
          <Link to="/checkout" className="btn-red">
            REINTENTAR COMPRA
          </Link>
          <a href="https://wa.me/573113524794" target="_blank" rel="noopener noreferrer" className="btn-red-outline">
            SOPORTE WHATSAPP
          </a>
        </div>
      </div>
    </div>
  );
}
