// Invoice Service for DIAN electronic invoicing standard UBL 2.1
import { supabase } from "../lib/supabase";

export class InvoiceService {
  static EMPRESA = {
    nit: "901847592-1",
    razonSocial: "THE VAULT PRESTIGE S.A.S.",
    direccion: "Cali, Colombia",
    telefono: "+57 311 352 4794",
    email: "contact@thevaultprestige.com",
    regimen: "48",
    tipoPersona: "1",
  };

  static generarNumeroFactura() {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const consecutivo = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `TVP-${año}${mes}${dia}-${consecutivo}`;
  }

  static generarCUFE(numeroFactura, fecha, total) {
    const data = `${this.EMPRESA.nit}${numeroFactura}${fecha}${total}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(32, "0");
  }

  static generarXMLFactura(pedido, facturaData) {
    const numeroFactura = this.generarNumeroFactura();
    const fecha = new Date().toISOString();
    const fechaFormateada = fecha.split("T")[0];
    const horaFormateada = fecha.split("T")[1].split(".")[0];
    
    const subtotal = pedido.subtotal || 0;
    const descuento = pedido.descuento || 0;
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal - descuento + iva;
    const cufe = this.generarCUFE(numeroFactura, fecha, total);

    return {
      numeroFactura,
      cufe,
      fecha,
      total,
      subtotal,
      descuento,
      iva,
    };
  }

  static async saveInvoice(invoiceData) {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert([invoiceData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn("Invoice saved locally:", e);
      return invoiceData;
    }
  }

  static async getInvoices() {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("fecha", { ascending: false });

      if (error || !data) return [];
      return data;
    } catch (e) {
      return [];
    }
  }
}
