import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { useProducts } from "../../context/ProductsContext";
import { formatCurrency } from "../../utils/formatters";

import DashboardPedidos from "./DashboardPedidos";
import DashboardCupones from "./DashboardCupones";
import DashboardFacturas from "./DashboardFacturas";

import "./Admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, refetchProducts } = useProducts();

  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Camisetas 1.1");
  const [imagenes, setImagenes] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [detalles, setDetalles] = useState({
    descripcion: "",
    material: "",
    cuidados: "",
  });

  const [tallas, setTallas] = useState({
    XS: true,
    S: true,
    M: true,
    L: true,
    XL: true,
    "2XL": true,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("tvp_admin_auth");
    if (!isAuth) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("tvp_admin_auth");
    navigate("/admin", { replace: true });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
    setPreviewImgs(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      alert("Nombre y Precio son requeridos");
      return;
    }

    setUploading(true);

    try {
      let finalImages = previewImgs;

      // Upload new image files if selected
      if (imagenes.length > 0) {
        const uploadedUrls = [];
        for (const file of imagenes) {
          const url = await productService.uploadImage(file);
          uploadedUrls.push(url);
        }
        finalImages = uploadedUrls;
      }

      const productPayload = {
        nombre,
        precio: Number(precio),
        categoria,
        url_imagen: finalImages[0] || "",
        imagenes: finalImages,
        tallas,
        detalles,
        es_destacado: true,
      };

      await productService.saveProduct(productPayload, editId);
      refetchProducts();
      resetForm();
      alert(editId ? "Prenda actualizada con éxito." : "Nueva prenda agregada al Vault.");
    } catch (e) {
      console.error("Error guardando prenda:", e);
      alert("Ocurrió un error al guardar la prenda.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setPrecio("");
    setCategoria("Camisetas 1.1");
    setImagenes([]);
    setPreviewImgs([]);
    setDetalles({ descripcion: "", material: "", cuidados: "" });
    setTallas({ XS: true, S: true, M: true, L: true, XL: true, "2XL": true });
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setCategoria(p.categoria || "Camisetas 1.1");

    const imgs = p.imagenes
      ? (Array.isArray(p.imagenes) ? p.imagenes : Object.values(p.imagenes))
      : [p.url_imagen];

    setPreviewImgs(imgs);
    setDetalles({
      descripcion: p.detalles?.descripcion || "",
      material: p.detalles?.material || "",
      cuidados: p.detalles?.cuidados || "",
    });
    setTallas(p.tallas || { XS: true, S: true, M: true, L: true, XL: true, "2XL": true });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta prenda del catálogo?")) return;
    await productService.deleteProduct(id);
    refetchProducts();
  };

  return (
    <div className="admin-dashboard-container container">
      {/* HEADER */}
      <div className="admin-nav-header">
        <div className="admin-title-box">
          <span className="badge-gold">PANEL CONTROL VIP</span>
          <h1>THE VAULT PRESTIGE</h1>
        </div>

        <button className="btn-gold-outline sm" onClick={handleLogout}>
          Cerrar Sesión 🔒
        </button>
      </div>

      {/* GRID LAYOUT: FORM & PRODUCTS */}
      <div className="dashboard-main-grid">
        {/* PRODUCT FORM */}
        <div className="admin-card-box">
          <h2>{editId ? "Editar Prenda 1.1" : "Agregar Nueva Prenda 1.1"}</h2>

          <form onSubmit={handleSubmit} className="admin-product-form">
            <div className="form-group">
              <label>Nombre de la Prenda *</label>
              <input
                type="text"
                placeholder="Ej: Hoodie Balenciaga 1:1 Black"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Precio ($ COP) *</label>
                <input
                  type="number"
                  placeholder="380000"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="Camisetas 1.1">Camisetas 1.1</option>
                  <option value="Hoodies 1.1">Hoodies 1.1</option>
                  <option value="Chaquetas & abrigos 1.1">Chaquetas 1.1</option>
                  <option value="Conjuntos 1.1">Conjuntos 1.1</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descripción Qualité 1.1</label>
              <textarea
                placeholder="Detalles de bordado, confección..."
                value={detalles.descripcion}
                onChange={(e) => setDetalles({ ...detalles, descripcion: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Material & Gramaje</label>
              <input
                type="text"
                placeholder="Ej: 100% Algodón Pesado 450 GSM"
                value={detalles.material}
                onChange={(e) => setDetalles({ ...detalles, material: e.target.value })}
              />
            </div>

            {/* SIZES */}
            <div className="form-group">
              <label>Tallas Disponibles:</label>
              <div className="tallas-toggle-grid">
                {["XS", "S", "M", "L", "XL", "2XL"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`talla-toggle-btn ${tallas[t] ? "active" : ""}`}
                    onClick={() => setTallas({ ...tallas, [t]: !tallas[t] })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* UPLOAD IMAGES */}
            <div className="form-group">
              <label className="file-upload-label">
                📷 Seleccionar Imágenes de Producto
                <input type="file" multiple accept="image/*" onChange={handleFileSelect} />
              </label>
            </div>

            {previewImgs.length > 0 && (
              <div className="preview-thumbs-grid">
                {previewImgs.map((url, i) => (
                  <img key={i} src={url} alt={`preview ${i}`} className="preview-thumb" />
                ))}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-gold" disabled={uploading}>
                {uploading ? "SUBIENDO PRENDA..." : editId ? "GUARDAR CAMBIOS" : "AÑADIR AL CATÁLOGO 1.1"}
              </button>

              {editId && (
                <button type="button" className="btn-gold-outline" onClick={resetForm}>
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PRODUCTS CATALOG LIST */}
        <div className="admin-card-box">
          <h2>Prendas Registradas ({products.length})</h2>

          <div className="admin-products-scroll-list">
            {products.map((p) => {
              const portada = p.imagenes?.[0] || p.url_imagen || "/fallback.jpg";

              return (
                <div key={p.id} className="admin-product-item">
                  <img src={portada} alt={p.nombre} className="admin-item-img" />

                  <div className="admin-item-info">
                    <span className="item-id-code">#{p.id}</span>
                    <h4 className="item-name">{p.nombre}</h4>
                    <span className="item-price">{formatCurrency(p.precio)}</span>
                  </div>

                  <div className="admin-item-actions">
                    <button className="btn-edit-sm" onClick={() => handleEdit(p)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-danger-sm" onClick={() => handleDelete(p.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTIONS */}
      <DashboardPedidos />
      <DashboardCupones />
      <DashboardFacturas />
    </div>
  );
}
