import { useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function MercadoPagoHandler() {
  const { clearCart } = useCart();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status") || urlParams.get("collection_status");

    if (status === "approved" || status === "success") {
      clearCart();
    }
  }, [clearCart]);

  return null;
}
