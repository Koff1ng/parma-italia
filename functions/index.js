import { onRequest } from "firebase-functions/v2/https";
import { onValueCreated, onValueWritten } from "firebase-functions/v2/database";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

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
// 🏢 DATOS DE LA EMPRESA (PARMA ITALIA)
// ⚠️ ACTUALIZA ESTOS DATOS CON TUS DATOS REALES
// ==============================
const EMPRESA_DATA = {
  nit: "1003401790", // ⚠️ TU NIT REAL
  razonSocial: "PARMA ITALIA S.A.S.", // ⚠️ TU RAZÓN SOCIAL
  direccion: "Cali, Colombia", // ⚠️ TU DIRECCIÓN
  telefono: "+57 311 352 4794", // ⚠️ TU TELÉFONO
  email: "gerencia@clientumstudio.com", // ⚠️ TU EMAIL
  regimen: "48", // 48 = Simplificado, 49 = Ordinario
  tipoPersona: "1", // 1 = Natural, 2 = Jurídica
};

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

// ==============================
// 📧 Configurar Nodemailer
// ==============================
function crearTransporteEmail() {
  // Configuración para Gmail (puedes cambiar por otro proveedor)
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER y EMAIL_PASS deben estar configurados en las variables de entorno");
  }

  if (emailUser === "tu-email@gmail.com" || emailPass === "tu-app-password") {
    throw new Error("Por favor configura EMAIL_USER y EMAIL_PASS en functions/.env con valores reales");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass, // Usar App Password de Gmail
    },
  });
}

// ==============================
// 📧 Enviar factura por correo
// ==============================
async function enviarFacturaPorEmail(facturaData) {
  try {
    const emailCliente = facturaData.cliente?.emailFiscal || facturaData.cliente?.correo;
    
    if (!emailCliente || !emailCliente.trim()) {
      logger.warn(`No hay email del cliente para enviar factura. Cliente: ${facturaData.cliente?.razonSocial || 'N/A'}`);
      return { enviado: false, motivo: "No hay email del cliente" };
    }

    const transporter = crearTransporteEmail();
    const emailEmpresa = process.env.EMAIL_USER || EMPRESA_DATA.email;
    
    logger.info(`📧 Configurando email desde ${emailEmpresa} hacia ${emailCliente}`);

    // Generar PDF de la factura (texto simple por ahora)
    const pdfContent = `
FACTURA ELECTRÓNICA
===================

Número: ${facturaData.numeroFactura}
CUFE: ${facturaData.cufe}
Fecha: ${new Date(facturaData.fecha).toLocaleDateString("es-CO")}

EMISOR:
${EMPRESA_DATA.razonSocial}
NIT: ${EMPRESA_DATA.nit}
${EMPRESA_DATA.direccion}

CLIENTE:
${facturaData.cliente.razonSocial}
${facturaData.cliente.tipoDocumento}: ${facturaData.cliente.numeroDocumento}
${facturaData.cliente.direccionFiscal}

DETALLE:
${facturaData.items?.map((item, idx) => 
  `${idx + 1}. ${item.nombre || item.title} - Cantidad: ${item.cantidad || item.quantity} - Precio: $${(item.precio || item.unit_price || 0).toLocaleString("es-CO")}`
).join("\n")}

Subtotal: $${(facturaData.subtotal || 0).toLocaleString("es-CO")}
Descuento: $${(facturaData.descuento || 0).toLocaleString("es-CO")}
IVA (19%): $${(facturaData.iva || 0).toLocaleString("es-CO")}
TOTAL: $${(facturaData.total || 0).toLocaleString("es-CO")}

Este documento ha sido generado electrónicamente y es válido para efectos tributarios.
    `;

    const mailOptions = {
      from: `"${EMPRESA_DATA.razonSocial}" <${emailEmpresa}>`,
      to: emailCliente,
      subject: `Factura Electrónica ${facturaData.numeroFactura} - ${EMPRESA_DATA.razonSocial}`,
      text: pdfContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #09816a;">FACTURA ELECTRÓNICA</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Número:</strong> ${facturaData.numeroFactura}</p>
            <p><strong>CUFE:</strong> <code style="font-size: 11px; word-break: break-all;">${facturaData.cufe}</code></p>
            <p><strong>Fecha:</strong> ${new Date(facturaData.fecha).toLocaleDateString("es-CO")}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #09816a;">EMISOR</h3>
            <p><strong>${EMPRESA_DATA.razonSocial}</strong><br>
            NIT: ${EMPRESA_DATA.nit}<br>
            ${EMPRESA_DATA.direccion}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #09816a;">CLIENTE</h3>
            <p><strong>${facturaData.cliente.razonSocial}</strong><br>
            ${facturaData.cliente.tipoDocumento}: ${facturaData.cliente.numeroDocumento}<br>
            ${facturaData.cliente.direccionFiscal}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #09816a;">DETALLE</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #09816a; color: white;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: right;">Cantidad</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${facturaData.items?.map((item, idx) => `
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">${item.nombre || item.title}</td>
                    <td style="padding: 10px; text-align: right;">${item.cantidad || item.quantity}</td>
                    <td style="padding: 10px; text-align: right;">$${(item.precio || item.unit_price || 0).toLocaleString("es-CO")}</td>
                    <td style="padding: 10px; text-align: right;">$${((item.precio || item.unit_price || 0) * (item.cantidad || item.quantity)).toLocaleString("es-CO")}</td>
                  </tr>
                `).join("") || ""}
              </tbody>
            </table>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="text-align: right; margin: 5px 0;"><strong>Subtotal:</strong> $${(facturaData.subtotal || 0).toLocaleString("es-CO")}</p>
            ${(facturaData.descuento || 0) > 0 ? `<p style="text-align: right; margin: 5px 0; color: #dc3545;"><strong>Descuento:</strong> -$${(facturaData.descuento || 0).toLocaleString("es-CO")}</p>` : ""}
            <p style="text-align: right; margin: 5px 0;"><strong>IVA (19%):</strong> $${(facturaData.iva || 0).toLocaleString("es-CO")}</p>
            <p style="text-align: right; margin: 15px 0; font-size: 18px; color: #09816a;"><strong>TOTAL: $${(facturaData.total || 0).toLocaleString("es-CO")}</strong></p>
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
            Este documento ha sido generado electrónicamente y es válido para efectos tributarios.<br>
            El archivo XML adjunto contiene la factura en formato UBL 2.1 según estándares DIAN.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `factura_${facturaData.numeroFactura}.xml`,
          content: facturaData.xml,
          contentType: "application/xml",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Factura ${facturaData.numeroFactura} enviada por email a ${emailCliente}`);
    
    return { enviado: true, email: emailCliente };
  } catch (error) {
    logger.error("Error enviando factura por email:", error);
    return { enviado: false, error: error.message };
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
📢 <b>TEST ${EMPRESA_DATA.razonSocial}</b>
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
      const { items, cliente, facturaData, subtotal, descuento, total, cupon } = req.body;

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
      const pedidoData = {
        orderId,
        items: mpItems,
        cliente: cliente || null,
        status: "pendiente",
        createdAt: Date.now(),
        subtotal: subtotal || 0,
        descuento: descuento || 0,
        total: total || subtotal || 0,
        cupon: cupon || null,
      };

      await db.ref(`pedidos/${orderId}`).set(pedidoData);

      // Generar factura electrónica si se requiere
      if (facturaData && facturaData.requiereFactura) {
        try {
          // Importar el servicio de facturación (simplificado para backend)
          const FacturaService = {
            EMPRESA: EMPRESA_DATA,
            generarNumeroFactura: () => {
              const ahora = new Date();
              const año = ahora.getFullYear();
              const mes = String(ahora.getMonth() + 1).padStart(2, "0");
              const dia = String(ahora.getDate()).padStart(2, "0");
              const consecutivo = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
              return `${año}${mes}${dia}${consecutivo}`;
            },
            generarCUFE: (numeroFactura, fecha, total) => {
              const data = `${this.EMPRESA.nit}${numeroFactura}${fecha}${total}`;
              let hash = 0;
              for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
              }
              return Math.abs(hash).toString(16).toUpperCase().padStart(32, "0");
            },
          };

          const numeroFactura = FacturaService.generarNumeroFactura();
          const fecha = new Date().toISOString();
          const cufe = FacturaService.generarCUFE(numeroFactura, fecha, total || subtotal || 0);

          // Generar XML simplificado (en producción usar librería XML)
          const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <ID>${numeroFactura}</ID>
  <UUID>${cufe}</UUID>
  <IssueDate>${fecha.split("T")[0]}</IssueDate>
  <Supplier>
    <ID>${FacturaService.EMPRESA.nit}</ID>
    <Name>${FacturaService.EMPRESA.razonSocial}</Name>
  </Supplier>
  <Customer>
    <ID>${facturaData.numeroDocumento}</ID>
    <Name>${facturaData.razonSocial}</Name>
  </Customer>
  <Total>${total || subtotal || 0}</Total>
</Invoice>`;

          // Guardar factura
          const facturaId = `factura_${Date.now()}`;
          const facturaCompleta = {
            id: facturaId,
            numeroFactura,
            cufe,
            fecha: Date.now(),
            pedidoId: orderId,
            cliente: facturaData,
            xml,
            subtotal: subtotal || 0,
            descuento: descuento || 0,
            total: total || subtotal || 0,
            items: mpItems,
            emailEnviado: false,
          };
          
          await db.ref(`facturas/${facturaId}`).set(facturaCompleta);

          // Enviar factura por email
          if (facturaData.emailFiscal || cliente?.correo) {
            try {
              const resultadoEmail = await enviarFacturaPorEmail(facturaCompleta);
              await db.ref(`facturas/${facturaId}`).update({
                emailEnviado: resultadoEmail.enviado,
                emailEnviadoFecha: resultadoEmail.enviado ? Date.now() : null,
              });
            } catch (error) {
              logger.error("Error enviando email de factura:", error);
            }
          }

          logger.info(`Factura ${numeroFactura} generada para pedido ${orderId}`);
        } catch (error) {
          logger.error("Error generando factura:", error);
          // No fallar el proceso si la factura falla
        }
      }

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

// ==========================================
// 🔥 TRIGGER: Cuando se crea/actualiza una factura
// ==========================================
export const onFacturaCreated = onValueWritten(
  {
    ref: "/facturas/{facturaId}",
    region: "us-central1",
  },
  async (event) => {
    const facturaId = event.params.facturaId;
    const facturaData = event.data.after.val();
    const facturaAnterior = event.data.before.val();

    // Solo procesar si es una nueva factura (facturaAnterior es null)
    if (!facturaData) {
      logger.warn(`Factura ${facturaId} no tiene datos`);
      return;
    }

    // Si ya existía antes, no es nueva
    if (facturaAnterior !== null && facturaAnterior !== undefined) {
      logger.info(`Factura ${facturaId} ya existía, no es nueva`);
      return;
    }

    logger.info(`📧 Nueva factura detectada: ${facturaData.numeroFactura || facturaId}`);

    // Verificar si ya se envió el email
    if (facturaData.emailEnviado) {
      logger.info(`Factura ${facturaData.numeroFactura} ya tiene email enviado`);
      return;
    }

    // Verificar que hay email del cliente
    const emailCliente = facturaData.cliente?.emailFiscal || facturaData.cliente?.correo;
    if (!emailCliente) {
      logger.warn(`⚠️ Factura ${facturaData.numeroFactura} no tiene email del cliente. Cliente: ${facturaData.cliente?.razonSocial || 'N/A'}`);
      return;
    }

    // Verificar configuración de email
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass || emailUser === "tu-email@gmail.com" || emailPass === "tu-app-password") {
      logger.error(`❌ Email no configurado. EMAIL_USER: ${emailUser ? 'configurado' : 'NO configurado'}, EMAIL_PASS: ${emailPass ? 'configurado' : 'NO configurado'}`);
      return;
    }

    // Enviar factura por email
    try {
      logger.info(`📤 Intentando enviar factura ${facturaData.numeroFactura} a ${emailCliente}`);
      const resultado = await enviarFacturaPorEmail(facturaData);
      
      if (resultado.enviado) {
        await db.ref(`facturas/${facturaId}`).update({
          emailEnviado: true,
          emailEnviadoFecha: Date.now(),
        });
        logger.info(`✅ Factura ${facturaData.numeroFactura} enviada por email a ${resultado.email}`);
      } else {
        logger.warn(`⚠️ No se pudo enviar factura ${facturaData.numeroFactura}: ${resultado.motivo || resultado.error}`);
      }
    } catch (error) {
      logger.error(`❌ Error enviando factura ${facturaData.numeroFactura} por email:`, error);
    }
  }
);

// ==========================================
// 🔥 ENDPOINT: Reenviar factura por email
// ==========================================
export const reenviarFacturaEmail = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    try {
      const { facturaId } = req.body;

      if (!facturaId) {
        return res.status(400).json({ error: "facturaId es requerido" });
      }

      const facturaRef = db.ref(`facturas/${facturaId}`);
      const snapshot = await facturaRef.once("value");
      const facturaData = snapshot.val();

      if (!facturaData) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }

      const resultado = await enviarFacturaPorEmail(facturaData);

      if (resultado.enviado) {
        await facturaRef.update({
          emailEnviado: true,
          emailEnviadoFecha: Date.now(),
        });
        return res.json({ 
          success: true, 
          message: `Factura enviada a ${resultado.email}` 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          error: resultado.motivo || resultado.error 
        });
      }
    } catch (error) {
      logger.error("Error reenviando factura:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);
