import { useState } from "react";
import "./FacturacionElectronica.css";

export default function FacturacionElectronica({ onFacturaChange, facturaData }) {
  const [requiereFactura, setRequiereFactura] = useState(facturaData?.requiereFactura || false);
  const [tipoDocumento, setTipoDocumento] = useState(facturaData?.tipoDocumento || "CC");
  const [numeroDocumento, setNumeroDocumento] = useState(facturaData?.numeroDocumento || "");
  const [razonSocial, setRazonSocial] = useState(facturaData?.razonSocial || "");
  const [direccionFiscal, setDireccionFiscal] = useState(facturaData?.direccionFiscal || "");
  const [telefonoFiscal, setTelefonoFiscal] = useState(facturaData?.telefonoFiscal || "");
  const [emailFiscal, setEmailFiscal] = useState(facturaData?.emailFiscal || "");

  const handleChange = () => {
    const data = {
      requiereFactura,
      tipoDocumento,
      numeroDocumento: numeroDocumento.trim(),
      razonSocial: razonSocial.trim(),
      direccionFiscal: direccionFiscal.trim(),
      telefonoFiscal: telefonoFiscal.trim(),
      emailFiscal: emailFiscal.trim(),
    };

    if (onFacturaChange) {
      onFacturaChange(data);
    }
  };

  const handleRequiereFacturaChange = (value) => {
    setRequiereFactura(value);
    if (!value) {
      // Limpiar campos si no requiere factura
      setTipoDocumento("CC");
      setNumeroDocumento("");
      setRazonSocial("");
      setDireccionFiscal("");
      setTelefonoFiscal("");
      setEmailFiscal("");
    }
    setTimeout(handleChange, 0);
  };

  const handleFieldChange = (setter, value) => {
    setter(value);
    setTimeout(handleChange, 0);
  };

  const isValid = !requiereFactura || (
    numeroDocumento.trim() !== "" &&
    razonSocial.trim() !== "" &&
    direccionFiscal.trim() !== ""
  );

  return (
    <div className="facturacion-electronica">
      <div className="factura-header">
        <label className="factura-checkbox">
          <input
            type="checkbox"
            checked={requiereFactura}
            onChange={(e) => handleRequiereFacturaChange(e.target.checked)}
          />
          <span>Requiero factura electrónica para la DIAN</span>
        </label>
      </div>

      {requiereFactura && (
        <div className="factura-form">
          <div className="factura-info">
            <p className="factura-note">
              📋 Completa los siguientes datos para generar tu factura electrónica según los estándares de la DIAN.
            </p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Tipo de Documento <span className="required">*</span>
              </label>
              <select
                value={tipoDocumento}
                onChange={(e) => handleFieldChange(setTipoDocumento, e.target.value)}
                className="form-input"
              >
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="PP">Pasaporte (PP)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Número de Documento <span className="required">*</span>
              </label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={(e) => handleFieldChange(setNumeroDocumento, e.target.value)}
                placeholder={tipoDocumento === "NIT" ? "900123456-7" : "1234567890"}
                className="form-input"
                maxLength={20}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Razón Social / Nombre Completo <span className="required">*</span>
            </label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => handleFieldChange(setRazonSocial, e.target.value)}
              placeholder={tipoDocumento === "NIT" ? "Nombre de la empresa" : "Nombre completo"}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Dirección Fiscal <span className="required">*</span>
            </label>
            <input
              type="text"
              value={direccionFiscal}
              onChange={(e) => handleFieldChange(setDireccionFiscal, e.target.value)}
              placeholder="Calle, número, ciudad, departamento"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Teléfono Fiscal
              </label>
              <input
                type="tel"
                value={telefonoFiscal}
                onChange={(e) => handleFieldChange(setTelefonoFiscal, e.target.value)}
                placeholder="300 123 4567"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                Email Fiscal
              </label>
              <input
                type="email"
                value={emailFiscal}
                onChange={(e) => handleFieldChange(setEmailFiscal, e.target.value)}
                placeholder="facturacion@empresa.com"
                className="form-input"
              />
            </div>
          </div>

          {!isValid && (
            <div className="factura-error">
              ⚠️ Por favor completa todos los campos obligatorios marcados con *
            </div>
          )}
        </div>
      )}
    </div>
  );
}


