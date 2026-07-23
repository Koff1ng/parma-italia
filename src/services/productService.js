import { supabase } from "../lib/supabase";

// Catálogo mock exclusivo en español para THE VOULT PRESTIGE
export const MOCK_PRODUCTS = [
  {
    id: "TVP-001",
    nombre: "Hoodie Balenciaga Crest Heavyweight",
    precio: 380000,
    url_imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 5, S: 8, M: 12, L: 10, XL: 6, "2XL": 4 },
    detalles: {
      descripcion: "Confeccionado en algodón peinado de 500 GSM con silueta oversized de alta costura, bordado frontal metálico y acabados artesanales de archivo.",
      material: "100% Algodón Peinado Francés (500 GSM)",
      cuidados: "Lavar en seco o agua fría al revés."
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true
  },
  {
    id: "TVP-002",
    nombre: "Camiseta Chrome Hearts Horseshoe Logo",
    precio: 240000,
    url_imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 6, M: 10, L: 8, XL: 5, "2XL": 0 },
    detalles: {
      descripcion: "Camiseta de corte relajado con serigrafía de alta densidad en relieve y detalles característicos de archivo en mangas y espalda.",
      material: "100% Algodón Orgánico Pesado (280 GSM)",
      cuidados: "Lavado delicado en frío."
    },
    categoria: "Camisetas",
    es_destacado: true
  },
  {
    id: "TVP-003",
    nombre: "Chaqueta Louis Vuitton Monogram Archive Puffer",
    precio: 750000,
    url_imagen: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 0, S: 3, M: 5, L: 4, XL: 2, "2XL": 1 },
    detalles: {
      descripcion: "Chaqueta acolchada de alto rendimiento con patrón Monogram jacquard mate, herrajes de bronce macizo y aislamiento térmico de plumas.",
      material: "Poliamida Técnica & Relleno de Plumas de Ganso",
      cuidados: "Lavado profesional en seco exclusivamente."
    },
    categoria: "Chaquetas y Abrigos",
    es_destacado: true
  },
  {
    id: "TVP-004",
    nombre: "Conjunto Trapstar Shooters Tracksuit",
    precio: 460000,
    url_imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 4, S: 7, M: 9, L: 6, XL: 3, "2XL": 0 },
    detalles: {
      descripcion: "Conjunto exclusivo de 2 piezas con parches en chenille de toalla de alto relieve y cremalleras de precisión.",
      material: "Algodón Cepillado & Poliéster de Alta Resistencia (420 GSM)",
      cuidados: "Lavar con agua fría, secar colgado."
    },
    categoria: "Conjuntos",
    es_destacado: true
  },
  {
    id: "TVP-005",
    nombre: "Camiseta Gucci Blade Edition Oversized",
    precio: 250000,
    url_imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 3, S: 6, M: 10, L: 8, XL: 4, "2XL": 2 },
    detalles: {
      descripcion: "Camiseta de silueta contemporánea fabricada en algodón orgánico mercerizado de caída estructurada.",
      material: "100% Algodón Orgánico Mercerizado",
      cuidados: "Lavado suave a mano."
    },
    categoria: "Camisetas",
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

      if (error || !data || data.length === 0) {
        return MOCK_PRODUCTS;
      }

      return data;
    } catch (e) {
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
