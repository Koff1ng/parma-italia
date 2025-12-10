// ================================
// FRONTEND — Pago MercadoPago
// ================================

// Espera a que el script de MP esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("🟦 public/index.js cargado correctamente");
});

// Listener para el botón PAGAR
window.addEventListener("mpPay", async (event) => {
  console.log("📌 mpPay recibido:", event.detail);

  const payload = event.detail;

  try {
    const res = await fetch(
      "https://us-central1-parma-shop-b49a2.cloudfunctions.net/createPreference",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (!data.id) {
      alert("Error creando preferencia de pago.");
      console.error("❌ Respuesta MP:", data);
      return;
    }

    // Inicializar checkout de MP
    const mp = new window.MercadoPago(
      "APP_USR-905e5fc7-cbe6-44bd-acfa-e2b5d1cf116e",
      { locale: "es-CO" }
    );

    mp.checkout({
      preference: { id: data.id },
      autoOpen: true
    });

    console.log("🟩 Checkout MP abierto");
  } catch (err) {
    console.error("❌ Error en mpPay:", err);
  }
});
