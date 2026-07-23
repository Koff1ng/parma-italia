// Script para subir los nuevos productos con fotos reales a Supabase
// Ejecutar con: node scripts/seed-products.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zbeumwsevdpokcojemqx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXVtd3NldmRwb2tjb2plbXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjEzNTQsImV4cCI6MjEwMDM5NzM1NH0.CD2MMheIH-OduPNohwZRwlpulLl9T7NnFn9dJBbqFrU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PRODUCTOS = [
  {
    id: "TVP-001",
    nombre: "Undergold Holy State Divinity Boxy Hoodie",
    precio: 580000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/1_b7f5b911-ed27-4b71-8fad-3f1df1fcc747.jpg?v=1779894272",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/1_b7f5b911-ed27-4b71-8fad-3f1df1fcc747.jpg?v=1779894272",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/2_da5f4757-fa12-4982-9abc-6a4d49abbf1a.jpg?v=1779894272",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/5_fca1076f-a04d-4444-a2fa-160684a7d662.jpg?v=1779894273",
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 5, S: 8, M: 12, L: 10, XL: 6, "2XL": 4 },
    detalles: {
      descripcion:
        "Hoodie boxy bondeado en color amarillo con teñido artesanal. 420 gr en 100% algodón. Capucha forrada, cordón con puntera metálica y bolsillo canguro. Colección Holy State — Undergold.",
      material: "100% Algodón (420 gr) — Silueta Boxy",
      cuidados: "Lavar en seco o agua fría al revés.",
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true,
  },
  {
    id: "TVP-002",
    nombre: "Undergold Holy State Goldboy Tee",
    precio: 290000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/2_4b24b86d-526a-43d8-a49d-9832f990b441.jpg?v=1779894336",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/2_4b24b86d-526a-43d8-a49d-9832f990b441.jpg?v=1779894336",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/1_8ca09de6-3a02-4c13-abbe-92811121559a.jpg?v=1779894336",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/4_e3a45d13-6a98-4c78-840d-d2a8bc2c5925.jpg?v=1779894336",
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 6, M: 10, L: 8, XL: 5, "2XL": 0 },
    detalles: {
      descripcion:
        "Camiseta oversized negra con estampado gráfico en policromía en posterior. 230 gr en 100% algodón. Cuello redondo en rib, marquillas tejidas exclusivas. Colección Holy State — Undergold.",
      material: "100% Algodón (230 gr) — Oversized",
      cuidados: "Lavado delicado en frío.",
    },
    categoria: "Camisetas",
    es_destacado: true,
  },
  {
    id: "TVP-003",
    nombre: "Undergold UNDRGLD Zip-Up Boxy Hoodie Faded Pink",
    precio: 620000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/1_6a1aa056-dda5-4104-b5c2-6957aa0fde30.jpg?v=1779893359",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/1_6a1aa056-dda5-4104-b5c2-6957aa0fde30.jpg?v=1779893359",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/2_856ae2a4-802f-4fc6-ba74-97f953acda5f.jpg?v=1779893359",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/6_9316c6d5-4157-4fde-852c-a7b57ba1c462.jpg?v=1779893360",
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 0, S: 4, M: 8, L: 6, XL: 3, "2XL": 2 },
    detalles: {
      descripcion:
        "Hoodie boxy con cierre metálico en rosa degradé con teñido artesanal. 420 gr algodón. Gráfico en frente y posterior. Colección Holy State — Undergold.",
      material: "100% Algodón (420 gr) — Boxy Zip-Up",
      cuidados: "Lavado en seco exclusivamente.",
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true,
  },
  {
    id: "TVP-004",
    nombre: "Undergold UNDRGLD Ripped Jacket Washed Gray",
    precio: 620000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/2_2c5569da-6b55-417c-9975-3d9877f59aa1.jpg?v=1780333556",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/2_2c5569da-6b55-417c-9975-3d9877f59aa1.jpg?v=1780333556",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/1_3b42535e-979d-4f33-aac4-5f78fea80ec0.jpg?v=1779893435",
      "https://cdn.shopify.com/s/files/1/0275/4671/4181/files/4_d9eb3627-fa7e-482e-8781-3c711738476d.jpg?v=1779893435",
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 5, M: 9, L: 7, XL: 4, "2XL": 0 },
    detalles: {
      descripcion:
        "Chaqueta boxy en denim de 17.5 oz gris con teñido artesanal y rotos manuales. Cierre frontal metálico, multibolsillos. Colección Holy State — Undergold.",
      material: "100% Algodón Denim (17.5 oz) — Ripped Boxy",
      cuidados: "Lavado suave a mano en frío.",
    },
    categoria: "Chaquetas y Abrigos",
    es_destacado: true,
  },
  {
    id: "TVP-005",
    nombre: "Amiri MA Surf Hoodie — Black",
    precio: 2890000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1169_001_SN107594_CLOSEUP001.jpg?v=1779824696",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1169_001_SN107594_CLOSEUP001.jpg?v=1779824696",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/79_PF26_MEN_RTW_Tops__MASURFHOODIE_AMTOJR1169-001_Black_a61fdb29-0f19-473b-bae8-7026f736495c.jpg?v=1779824667",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/79_PF26_MEN_RTW_Tops__MASURFHOODIE_AMTOJR1169-001_Black_1_b975359c-27da-4312-a63a-416c871fcf73.jpg?v=1779824667",
    ],
    tallas: { XS: false, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 0, S: 3, M: 6, L: 4, XL: 2, "2XL": 0 },
    detalles: {
      descripcion:
        "Hoodie Pre-Fall 2026 de AMIRI. Gráficos dibujados a mano inspirados en la cultura surf californiana de los 70s. Bolsillo canguro, hecho en Italia en 100% algodón.",
      material: "100% Cotton — Made In Italy",
      cuidados: "Lavado en seco. Cuidado profesional recomendado.",
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true,
  },
  {
    id: "TVP-006",
    nombre: "Amiri MA Quad Flames Oversized Hoodie — Ivory",
    precio: 3720000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1149_127_SN107853_CLOSEUP001.jpg?v=1779496004",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1149_127_SN107853_CLOSEUP001.jpg?v=1779496004",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/64_PF26_MEN_RTW_Tops_FLAMES_MAQUADFLAMESOSHOODIE_AMTOJR1149-127_Ivory_a21584ea-0b79-4a1b-8676-85724627f30a.jpg?v=1779495979",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/64_PF26_MEN_RTW_Tops_FLAMES_MAQUADFLAMESOSHOODIE_AMTOJR1149-127_Ivory_1_7546f183-e7c1-4866-b314-b6197780e507.jpg?v=1779495979",
    ],
    tallas: { XS: true, S: false, M: false, L: true, XL: false, "2XL": false },
    stock: { XS: 2, S: 0, M: 0, L: 3, XL: 0, "2XL": 0 },
    detalles: {
      descripcion:
        "Hoodie oversized Pre-Fall 2026 de AMIRI con gráficos artesanales DIY de llamas MA Quad. Bolsillo canguro, 100% algodón. Hecho en Italia.",
      material: "100% Cotton — Made In Italy",
      cuidados: "Lavado en seco exclusivamente.",
    },
    categoria: "Hoodies y Sacos",
    es_destacado: true,
  },
  {
    id: "TVP-007",
    nombre: "Amiri Hollywood Lightweight Jersey Tee — Ivory",
    precio: 1460000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1189_127_SN107889_CLOSEUP001.jpg?v=1779506608",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1189_127_SN107889_CLOSEUP001.jpg?v=1779506608",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/97_PF26_MEN_RTW_Tops_AMIRIHOLLYWOOD_AMIRIHOLLYWOODOSTEE_AMTOJR1189-127_Ivory.jpg?v=1779506590",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/97_PF26_MEN_RTW_Tops_AMIRIHOLLYWOOD_AMIRIHOLLYWOODOSTEE_AMTOJR1189-127_Ivory_1.jpg?v=1779506590",
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": false },
    stock: { XS: 3, S: 7, M: 10, L: 8, XL: 4, "2XL": 0 },
    detalles: {
      descripcion:
        "Camiseta oversized Pre-Fall 2026 de AMIRI. Inspirada en la escena renegada de L.A. con gráficos estilo motocicleta. Fit relajado, 100% algodón. Hecha en Turquía.",
      material: "100% Cotton — Made In Turkey",
      cuidados: "Lavado suave en agua fría.",
    },
    categoria: "Camisetas",
    es_destacado: true,
  },
  {
    id: "TVP-008",
    nombre: "Amiri MA Surf Tee — Skyline Blue",
    precio: 1460000,
    url_imagen:
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1170_576_SN107898_CLOSEUP001.jpg?v=1779506806",
    imagenes: [
      "https://cdn.shopify.com/s/files/1/1056/1394/files/AMTOJR1170_576_SN107898_CLOSEUP001.jpg?v=1779506806",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/82_PF26_MEN_RTW_Tops__MASURFTEE_AMTOJR1170-576_SkylineBlue.jpg?v=1779506728",
      "https://cdn.shopify.com/s/files/1/1056/1394/files/82_PF26_MEN_RTW_Tops__MASURFTEE_AMTOJR1170-576_SkylineBlue_1.jpg?v=1779506728",
    ],
    tallas: { XS: true, S: true, M: true, L: true, XL: true, "2XL": true },
    stock: { XS: 4, S: 6, M: 9, L: 7, XL: 4, "2XL": 2 },
    detalles: {
      descripcion:
        "Camiseta Pre-Fall 2026 de AMIRI. Gráficos de logo que evocan la cultura surf californiana de los 70s. Hecha en Italia en 100% algodón.",
      material: "100% Cotton — Made In Italy",
      cuidados: "Lavado delicado en frío.",
    },
    categoria: "Camisetas",
    es_destacado: true,
  },
];

async function seed() {
  console.log("🗑️  Eliminando productos existentes en Supabase...");

  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", ""); // Elimina todos los registros

  if (deleteError) {
    console.error("❌ Error al eliminar productos:", deleteError.message);
    process.exit(1);
  }

  console.log("✅ Productos anteriores eliminados.");
  console.log(`📦 Insertando ${PRODUCTOS.length} productos nuevos...`);

  const { data, error: insertError } = await supabase
    .from("products")
    .insert(PRODUCTOS)
    .select();

  if (insertError) {
    console.error("❌ Error al insertar productos:", insertError.message);
    process.exit(1);
  }

  console.log(`✅ ${data.length} productos subidos exitosamente a Supabase:`);
  data.forEach((p) => console.log(`   • ${p.id} — ${p.nombre}`));
  console.log("\n🚀 Catálogo actualizado. Recarga la app para verlos.");
}

seed();
