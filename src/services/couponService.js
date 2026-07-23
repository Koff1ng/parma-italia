import { supabase } from "../lib/supabase";

export const MOCK_COUPONS = [
  { id: "c1", codigo: "VAULT10", descuento: 10, tipo: "porcentaje", activo: true },
  { id: "c2", codigo: "PRESTIGE15", descuento: 15, tipo: "porcentaje", activo: true },
  { id: "c3", codigo: "VIP50K", descuento: 50000, tipo: "fijo", activo: true }
];

export const couponService = {
  async getCoupons() {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("creado_en", { ascending: false });

      if (error || !data || data.length === 0) return MOCK_COUPONS;
      return data;
    } catch (e) {
      return MOCK_COUPONS;
    }
  },

  async validateCoupon(codigoStr) {
    if (!codigoStr) return null;
    const cleanCode = codigoStr.trim().toUpperCase();
    const coupons = await this.getCoupons();
    const found = coupons.find(c => c.codigo.toUpperCase() === cleanCode && c.activo !== false);
    return found || null;
  },

  async createCoupon(couponData) {
    const payload = {
      codigo: couponData.codigo.toUpperCase(),
      descuento: Number(couponData.descuento),
      tipo: couponData.tipo || "porcentaje",
      activo: true,
    };

    const { data, error } = await supabase
      .from("coupons")
      .insert([payload])
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteCoupon(id) {
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
};
