export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function buildWhatsAppOrderUrl({ cliente, items, total, orderId = null, metodoPago = "WhatsApp / Transferencia" }) {
  const adminPhone = "573113524794";

  let mensaje = `*SOLICITUD DE PEDIDO - THE VOULT PRESTIGE*\n`;
  if (orderId) {
    mensaje += `*Orden #:* ${orderId}\n`;
  }
  mensaje += `----------------------------------------\n\n`;

  mensaje += `*DATOS DEL CLIENTE:*\n`;
  mensaje += `• *Nombre:* ${cliente.nombre || "No especificado"}\n`;
  mensaje += `• *Teléfono:* ${cliente.telefono || "No especificado"}\n`;
  mensaje += `• *Ciudad:* ${cliente.ciudad || "No especificada"}\n`;
  mensaje += `• *Dirección:* ${cliente.direccion || "No especificada"}\n`;
  if (cliente.email) {
    mensaje += `• *Email:* ${cliente.email}\n`;
  }
  mensaje += `\n`;

  mensaje += `*MÉTODO DE PAGO SELECCIONADO:*\n${metodoPago}\n\n`;

  mensaje += `*PRENDAS SELECCIONADAS:*\n\n`;
  items.forEach((item, index) => {
    const itemPrice = Number(item.itemprice || item.precio || 0);
    mensaje += `${index + 1}. *${item.nombre}*\n`;
    if (item.size) mensaje += `   - Talla: ${item.size}\n`;
    mensaje += `   - Cantidad: ${item.qty}\n`;
    mensaje += `   - Precio Total: ${formatCurrency(itemPrice * item.qty)}\n\n`;
  });

  mensaje += `----------------------------------------\n`;
  mensaje += `*TOTAL A PAGAR:* ${formatCurrency(total)}\n\n`;
  mensaje += `Quedo atento a los datos para realizar la transferencia / pago. ¡Muchas gracias!`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(mensaje)}`;
}
