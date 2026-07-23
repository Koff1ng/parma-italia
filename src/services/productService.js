import { supabase } from "../lib/supabase";

// Catálogo mock con imágenes editoriales reales de alta calidad
export const MOCK_PRODUCTS = [
  {
    id: "TVP-001",
    nombre: "Undergold Heavy Crewneck Archive",
    precio: 380000,
    url_imagen: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 5, S: 8, M: 12, L: 10, XL: 6, "2XL": 4 },
    detalles: {
      descripcion: "Crewneck de colección de archivo en Algodón Pima Peruano de 500 GSM. Silueta oversized con bordado de hilo de seda y acabados artesanales de alta costura.",
      material: "100% Algodón Pima Peruano de Alto Gramaje (500 GSM)",
      cuidados: "Lavar en seco o agua fría al revés."
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true
  },
  {
    id: "TVP-002",
    nombre: "Off-White Arrows Oversized Tee",
    precio: 265000,
    url_imagen: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 6, M: 10, L: 8, XL: 5, "2XL": 0 },
    detalles: {
      descripcion: "Camiseta de corte elongado en Algodón Pima Peruano con serigrafía industrial de alta densidad y etiqueta de archivo cosida a mano.",
      material: "100% Algodón Pima Peruano Heavyweight (280 GSM)",
      cuidados: "Lavado delicado en frío."
    },
    categoria: "Camisetas",
    es_destacado: true
  },
  {
    id: "TVP-003",
    nombre: "Chrome Hearts Cross Patch Hoodie",
    precio: 490000,
    url_imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 0, S: 4, M: 8, L: 6, XL: 3, "2XL": 2 },
    detalles: {
      descripcion: "Hoodie de archivo con parche de cruz en chenille de seda doble densidad, cordones de cuero y herrajes de plata maciza. Pima Peruano.",
      material: "100% Algodón Pima Peruano (480 GSM) + Detalles en Cuero",
      cuidados: "Lavado en seco exclusivamente."
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true
  },
  {
    id: "TVP-004",
    nombre: "Amiri Paisley Distressed Tee",
    precio: 290000,
    url_imagen: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 3, S: 7, M: 11, L: 9, XL: 5, "2XL": 2 },
    detalles: {
      descripcion: "Camiseta de silueta relajada con estampado paisley en tinta reactiva de alta fijación y desgaste artesanal controlado.",
      material: "100% Algodón Pima Peruano Mercerizado (260 GSM)",
      cuidados: "Lavado suave a mano con agua fría."
    },
    categoria: "Camisetas",
    es_destacado: true
  },
  {
    id: "TVP-005",
    nombre: "Godspeed Co. Varsity Crewneck",
    precio: 420000,
    url_imagen: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 2, S: 5, M: 9, L: 7, XL: 4, "2XL": 0 },
    detalles: {
      descripcion: "Crewneck de inspiración varsity con letras en lana de alta costura y cuerpo en Pima Peruano de 440 GSM.",
      material: "85% Algodón Pima Peruano / 15% Lana Merino (440 GSM)",
      cuidados: "Lavar en frío, no centrifugar."
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true
  },
  {
    id: "TVP-006",
    nombre: "Casa Blanca Tennis Club Polo",
    precio: 310000,
    url_imagen: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: false, "2XL": false },
    stock: { XS: 0, S: 5, M: 8, L: 6, XL: 0, "2XL": 0 },
    detalles: {
      descripcion: "Polo de estética de club de tenis con bordado de arquero y ribetes en contraste. Confeccionado en Pima Peruano de alta densidad.",
      material: "100% Algodón Pima Peruano Piqué (300 GSM)",
      cuidados: "Lavar en frío, planchar a temperatura media."
    },
    categoria: "Camisetas",
    es_destacado: false
  },
  {
    id: "TVP-007",
    nombre: "Monastery Oversized Fleece Coat",
    precio: 680000,
    url_imagen: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 3, M: 6, L: 5, XL: 2, "2XL": 0 },
    detalles: {
      descripcion: "Abrigo de silueta estructurada en forro polar de alta densidad. Botones de nácar con herrajes de bronce macizo y forro interior en satén.",
      material: "Forro Polar Premium + Forro Interior en Satén de Algodón Pima",
      cuidados: "Lavado en seco exclusivamente."
    },
    categoria: "Chaquetas y Abrigos",
    es_destacado: true
  },
  {
    id: "TVP-008",
    nombre: "Undergold Conjunto Tracksuit Pro",
    precio: 520000,
    url_imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=90",
    imagenes: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=90",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=90"
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 4, S: 6, M: 9, L: 7, XL: 3, "2XL": 0 },
    detalles: {
      descripcion: "Conjunto de 2 piezas de la colección Pro en felpa de Algodón Pima Peruano con parches en chenille y cremalleras YKK de precisión.",
      material: "Mezcla de Algodón Pima Peruano & Felpa Pesada (420 GSM)",
      cuidados: "Lavar con agua fría, secar colgado."
    },
    categoria: "Conjuntos",
    es_destacado: true
  }
];

export const productService = {
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
      const payload = { id: newId, ...productData };

      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();

      if (error) throw error;
      return data[0];
    }
  },

  async deleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  async uploadImage(file) {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  },
};
