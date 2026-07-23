import React from "react";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="vault-loader-overlay">
      <div className="vault-loader-box">
        <div className="vault-gold-ring"></div>
        <span className="vault-loader-brand">THE VAULT PRESTIGE</span>
        <p className="vault-loader-sub">Cargando colección 1.1...</p>
      </div>
    </div>
  );
}
