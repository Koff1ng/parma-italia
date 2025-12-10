// Dashboard.jsx – MULTI IMÁGENES / GALERÍA
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  ref,
  onValue,
  push,
  set,
  remove,
  update,
} from "firebase/database";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import DashboardPedidos from "./DashboardPedidos";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(true);
  const [productos, setProductos] = useState([]);

  // FORM STATES
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  // 👇 AHORA SE MANEJA MÚLTIPLES IMÁGENES
  const [imagenes, setImagenes] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);

  const [editId, setEditId] = useState(null);

  // DETALLES
  const [detalles, setDetalles] = useState({
    descripcion: "",
    material: "",
    cuidados: "",
  });

  // TALLAS
  const [tallas, setTallas] = useState({
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
    "2XL": false,
  });

  /* ============================
        VALIDAR SESIÓN
  ============================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin", { replace: true });
      else setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  /* ============================
        LISTAR PRODUCTOS
  ============================= */
  useEffect(() => {
    const productosRef = ref(db, "productosweb");

    onValue(productosRef, (snap) => {
      if (!snap.exists()) return setProductos([]);

      const data = snap.val();
      const lista = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));

      setProductos(lista);
    });
  }, []);

  /* ============================
        SUBIR UNA IMAGEN
  ============================= */
  const subirImagen = async (file) => {
    const filename = `${Date.now()}-${file.name}`;
    const imgRef = storageRef(storage, `productosweb/${filename}`);
    await uploadBytes(imgRef, file);
    return await getDownloadURL(imgRef);
  };

  /* ============================
        SUBIR TODAS LAS IMÁGENES
  ============================= */
  const subirMultiples = async () => {
    let urls = [];

    for (const file of imagenes) {
      const url = await subirImagen(file);
      urls.push(url);
    }

    return urls;
  };

  /* ============================
        GUARDAR PRODUCTO
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !precio) {
      alert("Faltan datos obligatorios");
      return;
    }

    let finalImages = [];

    // SI SUBE NUEVAS IMÁGENES
    if (imagenes.length > 0) {
      finalImages = await subirMultiples();
    } else if (previewImgs.length > 0) {
      // SI SOLO ESTÁ EDITANDO Y YA EXISTEN
      finalImages = previewImgs;
    }

    const data = {
      nombre,
      precio: Number(precio),
      imagenes: finalImages,    // 👈 AHORA ES ARRAY
      tallas,
      detalles,
    };

    if (editId) {
      await update(ref(db, `productosweb/${editId}`), data);
    } else {
      const nuevo = push(ref(db, "productosweb"));
      await set(nuevo, data);
    }

    // LIMPIAR FORM
    resetForm();
  };

  const resetForm = () => {
    setNombre("");
    setPrecio("");
    setImagenes([]);
    setPreviewImgs([]);
    setEditId(null);
    setDetalles({
      descripcion: "",
      material: "",
      cuidados: "",
    });
    setTallas({
      XS: false,
      S: false,
      M: false,
      L: false,
      XL: false,
      "2XL": false,
    });
  };

  /* ============================
        EDITAR PRODUCTO
  ============================= */
  const editarProducto = (p) => {
    setNombre(p.nombre);
    setPrecio(p.precio);

    // 👇 CARGAR IMÁGENES EXISTENTES
    if (p.imagenes) setPreviewImgs(p.imagenes);

    setEditId(p.id);

    setTallas({
      XS: p.tallas?.XS || false,
      S: p.tallas?.S || false,
      M: p.tallas?.M || false,
      L: p.tallas?.L || false,
      XL: p.tallas?.XL || false,
      "2XL": p.tallas?.["2XL"] || false,
    });

    setDetalles({
      descripcion: p.detalles?.descripcion || "",
      material: p.detalles?.material || "",
      cuidados: p.detalles?.cuidados || "",
    });

    setImagenes([]);
  };

  /* ============================
        BORRAR PRODUCTO
  ============================= */
  const borrarProducto = (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    remove(ref(db, `productosweb/${id}`));
  };

  if (loadingUser) return <p>Cargando...</p>;

  /* ================================================
     🟦 RENDER
  ================================================= */
  return (
    <div className="dashboard-container">
      <h1 className="panel-title">Panel de Administración</h1>

      <div className="panel-grid">
        
        {/* FORMULARIO */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Editar producto" : "Nuevo producto"}</h2>

          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          {/* DETALLES */}
          <h3 className="section-title">Detalles</h3>

          <textarea
            placeholder="Descripción"
            value={detalles.descripcion}
            onChange={(e) =>
              setDetalles({ ...detalles, descripcion: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Material"
            value={detalles.material}
            onChange={(e) =>
              setDetalles({ ...detalles, material: e.target.value })
            }
          />

          <textarea
            placeholder="Cuidados"
            value={detalles.cuidados}
            onChange={(e) =>
              setDetalles({ ...detalles, cuidados: e.target.value })
            }
          />

          {/* TALLAS */}
          <div className="tallas-box">
            <label>Tallas disponibles:</label>
            <div className="tallas-buttons">
              {["XS", "S", "M", "L", "XL", "2XL"].map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`talla-btn ${tallas[t] ? "active" : ""}`}
                  onClick={() =>
                    setTallas({ ...tallas, [t]: !tallas[t] })
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SUBIR MÚLTIPLES IMÁGENES */}
          <label className="file-label">
            Subir imágenes (puedes seleccionar varias)
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = [...e.target.files];
                setImagenes(files);
                setPreviewImgs(files.map((f) => URL.createObjectURL(f)));
              }}
            />
          </label>

          {/* PREVIEW GALERÍA */}
          {previewImgs.length > 0 && (
            <div className="preview-grid">
              {previewImgs.map((src, i) => (
                <img key={i} src={src} className="preview-img" />
              ))}
            </div>
          )}

          <button className="btn-save">
            {editId ? "Guardar cambios" : "Agregar producto"}
          </button>
        </form>

        {/* LISTA DE PRODUCTOS */}
        <div className="products-list">
          <h2>Productos</h2>

          <div className="products-grid">
            {productos.map((p) => (
              <div key={p.id} className="product-card">

                <img
                  src={
                    p.imagenes?.length
                      ? p.imagenes[0]
                      : p.url_imagen
                  }
                  alt={p.nombre}
                />

                <div className="info">
                  <h3>{p.nombre}</h3>
                  <p>${p.precio.toLocaleString("es-CO")}</p>

                  <span className="tallas-view">
                    {Object.keys(p.tallas || {})
                      .filter((t) => p.tallas[t])
                      .join(", ") || "Sin tallas"}
                  </span>
                </div>

                <div className="actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => editarProducto(p)}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    onClick={() => borrarProducto(p.id)}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      <DashboardPedidos />
    </div>
  );
}
