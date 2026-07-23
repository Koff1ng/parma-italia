import { supabase } from "../lib/supabase";

export const MOCK_CATEGORIES = [
  { id: "cat-1", nombre: "T-Shirts / Camisetas", slug: "t-shirts", orden: 1 },
  { id: "cat-2", nombre: "Hoodies & Sweatshirts", slug: "hoodies", orden: 2 },
  { id: "cat-3", nombre: "Jackets & Outerwear / Chaquetas", slug: "jackets", orden: 3 },
  { id: "cat-4", nombre: "Sets & Tracksuits / Conjuntos", slug: "sets", orden: 4 },
];

const LOCAL_STORAGE_KEY = "tvp_categories";

export const categoryService = {
  /**
   * Fetch all categories (from Supabase, or fallback to LocalStorage / Mock)
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("orden", { ascending: true });

      if (error || !data || data.length === 0) {
        return this.getLocalFallback();
      }

      return data;
    } catch (e) {
      return this.getLocalFallback();
    }
  },

  /**
   * LocalStorage Fallback helper
   */
  getLocalFallback() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Ignore parse error
    }
    return MOCK_CATEGORIES;
  },

  /**
   * Save (Create or Update) a Category
   */
  async saveCategory(categoryData, editId = null) {
    try {
      if (editId) {
        const { data, error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editId)
          .select();

        if (error) throw error;
        this.updateLocalCategory({ ...categoryData, id: editId }, editId);
        return data[0];
      } else {
        const newId = `cat-${Date.now().toString().slice(-6)}`;
        const payload = {
          id: newId,
          orden: categoryData.orden || Date.now(),
          ...categoryData,
        };

        const { data, error } = await supabase
          .from("categories")
          .insert([payload])
          .select();

        if (error) {
          this.saveLocalCategory(payload);
          return payload;
        }
        this.saveLocalCategory(data[0]);
        return data[0];
      }
    } catch (e) {
      // Fallback local persistence
      const current = this.getLocalFallback();
      if (editId) {
        const updated = current.map((c) => (c.id === editId ? { ...c, ...categoryData } : c));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return { id: editId, ...categoryData };
      } else {
        const newId = `cat-${Date.now().toString().slice(-6)}`;
        const newItem = { id: newId, ...categoryData };
        const updated = [...current, newItem];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      }
    }
  },

  /**
   * Delete Category
   */
  async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.warn("Supabase category delete notice:", error.message);
      }
    } catch (e) {
      // Local fallback
    }

    // Always update local cache
    const current = this.getLocalFallback();
    const updated = current.filter((c) => String(c.id) !== String(id));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  saveLocalCategory(item) {
    const current = this.getLocalFallback();
    const exists = current.some((c) => c.id === item.id);
    const updated = exists ? current.map((c) => (c.id === item.id ? item : c)) : [...current, item];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  updateLocalCategory(item, editId) {
    const current = this.getLocalFallback();
    const updated = current.map((c) => (c.id === editId ? { ...c, ...item } : c));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};
