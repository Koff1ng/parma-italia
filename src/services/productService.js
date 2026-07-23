import { supabase } from "../lib/supabase";

// Fallback seed catalog for The Vault Prestige (Ropa 1.1)
export const MOCK_PRODUCTS = [
  {
    id: "TVP-001",
    nombre: "Hoodie Balenciaga Oversized Crest 1:1 Gold Edition",
    precio: 380000,
    url_imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 5, S: 8, M: 12, L: 10, XL: 6, "2XL": 4 },
    detalles: {
      descripcion: "Hoodie Balenciaga calidad 1:1 idéntica a la versión retail. Confeccionada en franela pesada de 500g, bordado frontal en hilo metalizado y etiquetas de lavado auténticas con código QR escaneable.",
      material: "100% Algodón Francés Peinado (500 GSM)",
      cuidados: "Lavar al revés con agua fría, no planchar directamente el bordado."
    },
    categoria: "Hoodies 1.1",
    es_destacado: true
  },
  {
    id: "TVP-002",
    nombre: "Camiseta Chrome Hearts Horseshoe Logo 1:1 Black",
    precio: 240000,
    url_imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 6, M: 10, L: 8, XL: 5, "2XL": 0 },
    detalles: {
      descripcion: "Camiseta Chrome Hearts edición 1:1 con serigrafía en relieve de alta densidad en espalda y mangas. Incluye marquilla de cuello personalizada de la firma y bolsa anti-polvo.",
      material: "100% Algodón Premium Heavyweight (280 GSM)",
      cuidados: "Lavar en ciclo delicado, no usar secadora."
    },
    categoria: "Camisetas 1.1",
    es_destacado: true
  },
  {
    id: "TVP-003",
    nombre: "Chaqueta Louis Vuitton Monogram Vault Puffer 1:1",
    precio: 750000,
    url_imagen: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 0, S: 3, M: 5, L: 4, XL: 2, "2XL": 1 },
    detalles: {
      descripcion: "Chaqueta acolchada Louis Vuitton Monogram 1.1. Acabado impermeable termosellado, herrajes grabados en bronce envejecido y plumón térmico de ganso para máximo aislamiento.",
      material: "Poliamida técnica impermeable & Relleno térmico ultra-liviano",
      cuidados: "Lavado en seco profesional exclusivamente."
    },
    categoria: "Chaquetas & abrigos 1.1",
    es_destacado: true
  },
  {
    id: "TVP-004",
    nombre: "Conjunto Trapstar Shooters Tracksuit 1:1 Black/Gold",
    precio: 460000,
    url_imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 4, S: 7, M: 9, L: 6, XL: 3, "2XL": 0 },
    detalles: {
      descripcion: "Sudadera y pantaloneta Trapstar London edición 1.1 con letras de toalla en relieve Chenille y detalles dorados refractivos. Ajuste fino de corte urbano.",
      material: "Mezcla de Algodón Cepillado & Poliéster de Alta Resistencia (400 GSM)",
      cuidados: "Lavar a máquina en programa frío con prendas del mismo color."
    },
    categoria: "Conjuntos 1.1",
    es_destacado: true
  },
  {
    id: "TVP-005",
    nombre: "Camiseta Gucci Blade Logo Oversized Tee 1:1 White",
    precio: 250000,
    url_imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 3, S: 6, M: 10, L: 8, XL: 4, "2XL": 2 },
    detalles: {
      descripcion: "Camiseta Gucci Blade print calidad 1:1. Algodón orgánico suave de tacto sedoso con estampado en tinta plastisol importada.",
      material: "100% Algodón Orgánico Italiano",
      cuidados: "No retorcer, secar colgado a la sombra."
    },
    categoria: "Camisetas 1.1",
    es_destacado: false
  }
];

export const productService = {
  /**
   * Fetch all products from Supabase
   */
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, fallback to mock catalog:", error.message);
        return MOCK_PRODUCTS;
      }

      if (!data || data.length === 0) {
        return MOCK_PRODUCTS;
      }

      return data;
    } catch (e) {
      console.warn("Unexpected error fetching products, using mock catalog:", e);
      return MOCK_PRODUCTS;
    }
  },

  /**
   * Fetch product by ID
   */
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return MOCK_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
      }

      return data;
    } catch (e) {
      return MOCK_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
    }
  },

  /**
   * Save (Insert or Update) a product
   */
  async saveProduct(productData, editId = null) {
    if (editId) {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editId)
        .select();

      if (error) throw error;
      return data[0];
    } else {
      const newId = `TVP-${Date.now().toString().slice(-6)}`;
      const payload = {
        id: newId,
        ...productData,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();

      if (error) throw error;
      return data[0];
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(id) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  /**
   * Upload image file to Supabase Storage bucket ('product-images')
   */
  async uploadImage(file) {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  },
};
