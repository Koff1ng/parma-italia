export default function CheckoutButton({ items }) {

  const handlePay = async () => {
    try {
      if (!items || items.length === 0) {
        console.error("❌ ERROR: items está vacío o undefined");
        alert("No hay productos para procesar el pago.");
        return;
      }

      // Crear preferencia en el backend
      const res = await fetch("https://createpreference-t35o3w5zwq-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })   // 🔥 ahora envía items correctos
      });

      const data = await res.json();

      if (!data.id) {
        console.error("❌ Error en preferencia:", data);
        alert("Error creando preferencia de pago.");
        return;
      }

      // Inicializar MP Checkout
      const mp = new window.MercadoPago(
        "APP_USR-905e5fc7-cbe6-44bd-acfa-e2b5d1cf116e",
        { locale: "es-CO" }
      );

      mp.checkout({
        preference: { id: data.id },
        autoOpen: true
      });

    } catch (error) {
      console.error("ERROR en handlePay:", error);
      alert("Hubo un error procesando el pago.");
    }
  };

  return (
    <button onClick={handlePay} className="btn-checkout">
      Pagar con MercadoPago
    </button>
  );
}
