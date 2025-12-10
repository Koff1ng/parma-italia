// src/MercadoPagoHandler.jsx
import { useEffect } from "react";

export default function MercadoPagoHandler() {
  useEffect(() => {
    const listener = async (e) => {
      try {
        const { items } = e.detail;

        // Petición a tu Cloud Function createPreference
        const res = await fetch(
          "https://us-central1-parma-shop-b49a2.cloudfunctions.net/createPreference",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items })
          }
        );

        const data = await res.json();

        if (!data.id) {
          console.error("Error creando preferencia:", data);
          alert("Error creando la orden de pago.");
          return;
        }

        // Inicializar MercadoPago
        const mp = new window.MercadoPago(
          "APP_USR-905e5fc7-cbe6-44bd-acfa-e2b5d1cf116e", // TU PUBLIC KEY
          { locale: "es-CO" }
        );

        // Abrir ventana emergente
        mp.checkout({
          preference: { id: data.id },
          autoOpen: true
        });

      } catch (error) {
        console.error("ERROR en MercadoPagoHandler:", error);
      }
    };

    // Escuchar evento global
    window.addEventListener("mpPay", listener);

    return () => window.removeEventListener("mpPay", listener);
  }, []);

  return null;
}
