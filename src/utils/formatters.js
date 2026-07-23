/**
 * Formats a number to Colombian Pesos (COP) currency string
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `$${num.toLocaleString("es-CO")}`;
};

/**
 * Formats a date string or timestamp to readable Spanish format
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generates formatted WhatsApp link and message for The Vault Prestige order confirmation
 */
export const buildWhatsAppOrderUrl = ({
  cliente,
  items,
  total,
  orderId,
  metodoPago = "MercadoPago / Transferencia",
  phoneNumber = "573113524794",
}) => {
  let mensaje = `⚜️ *NUEVO PEDIDO EXCLUSIVO - THE VAULT PRESTIGE* ⚜️\n`;
  if (orderId) mensaje += `*Código de Orden:* #${orderId}\n`;
  mensaje += `-----------------------------------\n`;
  mensaje += `👤 *Cliente:* ${cliente.nombre}\n`;
  mensaje += `📞 *Teléfono:* ${cliente.telefono}\n`;
  mensaje += `📍 *Ciudad/Dirección:* ${cliente.ciudad} - ${cliente.direccion}\n`;
  if (cliente.email) mensaje += `✉️ *Email:* ${cliente.email}\n`;
  mensaje += `💳 *Método de Pago:* ${metodoPago}\n`;
  mensaje += `-----------------------------------\n`;
  mensaje += `🛍️ *PRENDAS SELECCIONADAS (QUALITÉ 1.1):*\n\n`;

  items.forEach((item, index) => {
    const precioUnit = Number(item.itemprice || item.precio || 0);
    const subtotal = precioUnit * (item.qty || 1);
    mensaje += `${index + 1}. *${item.nombre}*\n`;
    if (item.size) mensaje += `   • Talla: ${item.size}\n`;
    mensaje += `   • Cantidad: ${item.qty || 1}\n`;
    mensaje += `   • Subtotal: ${formatCurrency(subtotal)}\n\n`;
  });

  mensaje += `-----------------------------------\n`;
  mensaje += `💰 *TOTAL A PAGAR:* ${formatCurrency(total)}\n`;
  mensaje += `-----------------------------------\n`;
  mensaje += `✨ *Gracias por comprar en The Vault Prestige.* Por favor indícanos si requieres asistencia con tu pago.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;
};
