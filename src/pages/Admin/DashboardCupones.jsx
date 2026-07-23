import { useState, useEffect } from "react";
import { couponService } from "../../services/couponService";

export default function DashboardCupones() {
  const [cupones, setCupones] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [descuento, setDescuento] = useState("");
  const [tipo, setTipo] = useState("porcentaje");

  const loadCoupons = async () => {
    const list = await couponService.getCoupons();
    setCupones(list);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!codigo || !descuento) return;

    await couponService.createCoupon({ codigo, descuento, tipo });
    setCodigo("");
    setDescuento("");
    loadCoupons();
  };

  const handleDeleteCoupon = async (id) => {
    await couponService.deleteCoupon(id);
    loadCoupons();
  };

  return (
    <div className="admin-section-block">
      <h3>🎫 GESTIÓN DE CUPONES VIP</h3>

      <form className="coupon-create-form" onSubmit={handleCreateCoupon}>
        <input
          type="text"
          placeholder="Código (Ej: VAULT20)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Descuento"
          value={descuento}
          onChange={(e) => setDescuento(e.target.value)}
          required
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="porcentaje">Porcentaje (%)</option>
          <option value="fijo">Monto Fijo ($ COP)</option>
        </select>
        <button type="submit" className="btn-gold sm">Crear Cupón</button>
      </form>

      <div className="coupons-grid-list">
        {cupones.map((c) => (
          <div key={c.id} className="coupon-admin-card">
            <span className="coupon-code-title">{c.codigo}</span>
            <span className="coupon-value">
              {c.tipo === "porcentaje" ? `${c.descuento}% OFF` : `$${Number(c.descuento).toLocaleString("es-CO")} COP`}
            </span>
            <button className="btn-danger-sm" onClick={() => handleDeleteCoupon(c.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
