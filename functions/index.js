import { onRequest } from "firebase-functions/v2/https";
import { onValueCreated } from "firebase-functions/v2/database";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import dotenv from "dotenv";

// Cargar variables del archivo .env
dotenv.config();

// ==============================
// 🔥 Inicializar Firebase Admin
// ==============================
initializeApp({
  databaseURL: "https://parma-shop-b49a2-default-rtdb.firebaseio.com",
});

const db = getDatabase();

// ==============================
// 📩 Función para enviar Telegram
// ==============================
async function enviarTelegram(texto) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("❌ Falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: texto,
      parse_mode: "HTML",
    });
    console.log("📨 Enviado a Telegram");
  } catch (err) {
    console.error("❌ Error enviando Telegram:", err.response?.data || err);
  }
}

// =====================================================
// 🔥 Trigger: cada vez que se crea un cliente en /clientes
// =====================================================
export const notifyNewClient = onValueCreated(
  {
    ref: "/clientes/{clienteId}",
    region: "us-central1",
  },
  async (event) => {
    const clienteId = event.params.clienteId;
    const data = event.data.val();

    if (!data) return;

    let mensaje = `🆕 <b>NUEVO CLIENTE REGISTRADO</b>\n\n`;
    mensaje += `<b>ID:</b> ${clienteId}\n`;
    mensaje += `<b>Nombre:</b> ${data.nombre}\n`;
    mensaje += `<b>Teléfono:</b> ${data.telefono}\n`;
    mensaje += `<b>Dirección:</b> ${data.direccion}\n`;
    mensaje += `<b>Correo:</b> ${data.correo || "No enviado"}\n`;
    mensaje += `<b>Subtotal:</b> $${Number(data.subtotal).toLocaleString("es-CO")}\n`;
    mensaje += `<b>Fecha:</b> ${data.fecha}\n\n`;

    mensaje += `🛍 <b>Productos:</b>\n`;

    if (Array.isArray(data.productos)) {
      data.productos.forEach((p) => {
        mensaje += `• ${p.nombre} (x${p.qty}) — Talla ${p.size} — $${p.precio}\n`;
      });
    }

    await enviarTelegram(mensaje);
  }
);

// =====================================================
// 🔔 FUNCIÓN DE PRUEBA DESDE DASHBOARD
// =====================================================
export const sendTelegramTest = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    try {
      await enviarTelegram(`
📢 <b>TEST PARMA ITALIA</b>
El sistema de notificaciones funciona correctamente 🚀
      `);

      return res.json({ status: "ok" });
    } catch (err) {
      return res.json({ status: "error", error: err.message });
    }
  }
);

// ==============================
// 🔥 MercadoPago Config
// ==============================
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-4088461890008159-120316-e684df62e8a2eb3cd9b32d85150dae4e-1368851760",
});

// ==========================================
// 🔥 CREAR PREFERENCIA MercadoPago (COMPLETO)
// ==========================================
export const createPreference = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    try {
      const { items, cliente } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Items inválidos" });
      }

      const mpItems = items.map((item, index) => ({
        id: item.id || `item-${index}`,
        title: item.title,
        description: item.description,
        category_id: "fashion",
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: "COP",
      }));

      const orderId = `order_${Date.now()}`;

      // Guardar Orden
      await db.ref(`pedidos/${orderId}`).set({
        orderId,
        items: mpItems,
        cliente: cliente || null,
        status: "pendiente",
        createdAt: Date.now(),
      });

      const preference = new Preference(client);

      const body = {
        items: mpItems,

        metadata: {
          orderId,
        },

        external_reference: `parma-${orderId}`,

        payer: cliente
          ? {
              name: cliente.nombre,
              email: cliente.correo,
              phone: {
                number: cliente.telefono,
              },
            }
          : {},

        back_urls: {
          success: "https://www.parmaitalia.com/success",
          failure: "https://www.parmaitalia.com/failure",
          pending: "https://www.parmaitalia.com/pending",
        },

        auto_return: "approved",

        notification_url:
          "https://us-central1-parma-shop-b49a2.cloudfunctions.net/mpWebhook",
      };

      const result = await preference.create({ body });

      res.json({
        id: result.id,
        orderId,
      });
    } catch (error) {
      logger.error("ERROR createPreference:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// ==========================================
// 🔥 WEBHOOK MercadoPago (PAGOS)
// ==========================================
export const mpWebhook = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    try {
      if (req.body.type !== "payment") return res.send("ignored");

      const paymentId = req.body.data.id;

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization:
              "Bearer APP_USR-4088461890008159-120316-e684df62e8a2eb3cd9b32d85150dae4e-1368851760",
          },
        }
      );

      const paymentData = await response.json();

      const orderId = paymentData.external_reference.replace("parma-", "");

      const newStatus =
        paymentData.status === "approved"
          ? "pagado"
          : paymentData.status === "pending"
          ? "pendiente"
          : "rechazado";

      await db.ref(`pedidos/${orderId}`).update({
        status: newStatus,
        mp_payment_id: paymentId,
        mp_status: paymentData.status,
        updatedAt: Date.now(),
      });

      res.send("OK");
    } catch (err) {
      logger.error("WEBHOOK ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);
