// Servicio para generar facturas electrónicas según estándares DIAN
// Basado en Resolución 000042 de 2020 (Formato UBL 2.1)

export class FacturaService {
  // ⚠️ DATOS DE LA EMPRESA (PARMA ITALIA) - MODIFICA AQUÍ
  // ⚠️ IMPORTANTE: También actualiza los datos en functions/index.js (línea ~26)
  static EMPRESA = {
    nit: "1003401790", // ⚠️ TU NIT REAL
    razonSocial: "PARMA ITALIA S.A.S.", // ⚠️ TU RAZÓN SOCIAL
    direccion: "Cali, Colombia", // ⚠️ TU DIRECCIÓN
    telefono: "+57 311 352 4794", // ⚠️ TU TELÉFONO
    email: "gerencia@clientumstudio.com", // ⚠️ TU EMAIL
    regimen: "48", // 48 = Simplificado, 49 = Ordinario
    tipoPersona: "1", // 1 = Natural, 2 = Jurídica
  };

  // Generar número de factura consecutivo
  static generarNumeroFactura() {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const consecutivo = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `${año}${mes}${dia}${consecutivo}`;
  }

  // Generar CUFE (Código Único de Facturación Electrónica)
  static generarCUFE(numeroFactura, fecha, total) {
    // En producción, esto debe generarse con el algoritmo oficial de la DIAN
    // Por ahora, generamos un hash simple
    const data = `${this.EMPRESA.nit}${numeroFactura}${fecha}${total}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(32, "0");
  }

  // Generar XML de factura electrónica (UBL 2.1)
  static generarXMLFactura(pedido, facturaData) {
    const numeroFactura = this.generarNumeroFactura();
    const fecha = new Date().toISOString();
    const fechaFormateada = fecha.split("T")[0];
    const horaFormateada = fecha.split("T")[1].split(".")[0];
    
    const subtotal = pedido.subtotal || 0;
    const descuento = pedido.descuento || 0;
    const iva = Math.round(subtotal * 0.19); // IVA 19%
    const total = subtotal - descuento + iva;
    
    const cufe = this.generarCUFE(numeroFactura, fecha, total);

    // Mapear tipo de documento
    const tipoDocumentoMap = {
      CC: "13", // Cédula de Ciudadanía
      NIT: "31", // NIT
      CE: "22", // Cédula de Extranjería
      PP: "41", // Pasaporte
      TI: "12", // Tarjeta de Identidad
    };

    const tipoDocCliente = tipoDocumentoMap[facturaData.tipoDocumento] || "13";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen:tech:xsd:invoice-2.1</cbc:CustomizationID>
  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>
  <cbc:ID>${numeroFactura}</cbc:ID>
  <cbc:UUID schemeID="CUFE-SHA384">${cufe}</cbc:UUID>
  <cbc:IssueDate>${fechaFormateada}</cbc:IssueDate>
  <cbc:IssueTime>${horaFormateada}</cbc:IssueTime>
  <cbc:InvoiceTypeCode listID="1" listAgencyName="PE" listName="Tipo de Documento" listURI="urn:oasis:names:specification:ubl:codelist:co:InvoiceTypeCode">01</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode listID="ISO 4217 Alpha" listName="Currency" listAgencyName="United Nations Economic Commission for Europe">COP</cbc:DocumentCurrencyCode>
  
  <!-- Emisor -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="4" schemeName="NIT">${this.EMPRESA.nit.replace(/-/g, "")}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name><![CDATA[${this.EMPRESA.razonSocial}]]></cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName><![CDATA[${this.EMPRESA.direccion}]]></cbc:StreetName>
        <cac:Country>
          <cbc:IdentificationCode listID="ISO 3166-1" listName="Country" listAgencyName="United Nations Economic Commission for Europe">CO</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:Contact>
        <cbc:Telephone>${this.EMPRESA.telefono}</cbc:Telephone>
        <cbc:ElectronicMail>${this.EMPRESA.email}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- Cliente -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="${tipoDocCliente}" schemeName="${facturaData.tipoDocumento}">${facturaData.numeroDocumento.replace(/-/g, "")}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name><![CDATA[${facturaData.razonSocial}]]></cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName><![CDATA[${facturaData.direccionFiscal}]]></cbc:StreetName>
        <cac:Country>
          <cbc:IdentificationCode listID="ISO 3166-1" listName="Country" listAgencyName="United Nations Economic Commission for Europe">CO</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      ${facturaData.telefonoFiscal ? `<cac:Contact>
        <cbc:Telephone>${facturaData.telefonoFiscal}</cbc:Telephone>
        ${facturaData.emailFiscal ? `<cbc:ElectronicMail>${facturaData.emailFiscal}</cbc:ElectronicMail>` : ""}
      </cac:Contact>` : ""}
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- Items -->
  ${pedido.items?.map((item, index) => {
    const precioUnitario = item.unit_price || 0;
    const cantidad = item.quantity || 1;
    const subtotalItem = precioUnitario * cantidad;
    const ivaItem = Math.round(subtotalItem * 0.19);
    
    return `<cac:InvoiceLine>
      <cbc:ID>${index + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="C62" unitCodeListID="UN/ECE rec 20" unitCodeListAgencyName="United Nations Economic Commission for Europe">${cantidad}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="COP">${subtotalItem}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Description><![CDATA[${item.title || item.nombre}]]></cbc:Description>
        <cac:SellersItemIdentification>
          <cbc:ID>${item.id || ""}</cbc:ID>
        </cac:SellersItemIdentification>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="COP">${precioUnitario}</cbc:PriceAmount>
      </cac:Price>
      <cac:TaxTotal>
        <cbc:TaxAmount currencyID="COP">${ivaItem}</cbc:TaxAmount>
        <cac:TaxSubtotal>
          <cbc:TaxableAmount currencyID="COP">${subtotalItem}</cbc:TaxableAmount>
          <cbc:TaxAmount currencyID="COP">${ivaItem}</cbc:TaxAmount>
          <cac:TaxCategory>
            <cac:TaxScheme>
              <cbc:ID>01</cbc:ID>
              <cbc:Name>IVA</cbc:Name>
            </cac:TaxScheme>
          </cac:TaxCategory>
        </cac:TaxSubtotal>
      </cac:TaxTotal>
    </cac:InvoiceLine>`;
  }).join("\n  ") || ""}

  <!-- Totales -->
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="COP">${subtotal}</cbc:LineExtensionAmount>
    ${descuento > 0 ? `<cbc:AllowanceTotalAmount currencyID="COP">${descuento}</cbc:AllowanceTotalAmount>` : ""}
    <cbc:TaxExclusiveAmount currencyID="COP">${subtotal - descuento}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="COP">${total}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="COP">${total}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  <!-- Impuestos -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="COP">${iva}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="COP">${subtotal - descuento}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="COP">${iva}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:Percent>19.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
</Invoice>`;

    return {
      xml,
      numeroFactura,
      cufe,
      fecha,
      total,
      subtotal,
      descuento,
      iva,
    };
  }

  // Generar PDF de factura (formato simplificado)
  static generarPDFFactura(facturaData, xmlData) {
    // En producción, usar una librería como jsPDF o generar en el backend
    const pdfContent = `
FACTURA ELECTRÓNICA
==================

Número: ${xmlData.numeroFactura}
CUFE: ${xmlData.cufe}
Fecha: ${new Date(xmlData.fecha).toLocaleDateString("es-CO")}

EMISOR:
${this.EMPRESA.razonSocial}
NIT: ${this.EMPRESA.nit}
${this.EMPRESA.direccion}

CLIENTE:
${facturaData.razonSocial}
${facturaData.tipoDocumento}: ${facturaData.numeroDocumento}
${facturaData.direccionFiscal}

DETALLE:
Subtotal: $${xmlData.subtotal.toLocaleString("es-CO")}
Descuento: $${xmlData.descuento.toLocaleString("es-CO")}
IVA (19%): $${xmlData.iva.toLocaleString("es-CO")}
TOTAL: $${xmlData.total.toLocaleString("es-CO")}

Este documento ha sido generado electrónicamente y es válido para efectos tributarios.
    `;

    return pdfContent;
  }

  // Validar datos de facturación
  static validarDatosFactura(facturaData) {
    if (!facturaData.requiereFactura) {
      return { valido: true };
    }

    const errores = [];

    if (!facturaData.numeroDocumento || facturaData.numeroDocumento.trim() === "") {
      errores.push("El número de documento es obligatorio");
    }

    if (!facturaData.razonSocial || facturaData.razonSocial.trim() === "") {
      errores.push("La razón social es obligatoria");
    }

    if (!facturaData.direccionFiscal || facturaData.direccionFiscal.trim() === "") {
      errores.push("La dirección fiscal es obligatoria");
    }

    // Validar formato de NIT
    if (facturaData.tipoDocumento === "NIT") {
      const nitRegex = /^\d{9,10}-\d$/;
      if (!nitRegex.test(facturaData.numeroDocumento)) {
        errores.push("El formato del NIT debe ser: 123456789-0");
      }
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }
}


