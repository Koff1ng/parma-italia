import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { useProducts } from "../../context/ProductsContext";
import { formatCurrency } from "../../utils/formatters";

import DashboardPedidos from "./DashboardPedidos";
import DashboardCupones from "./DashboardCupones";
import DashboardCategorias from "./DashboardCategorias";

import "./Admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, categories, refetchProducts } = useProducts();

  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
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

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !categoria) {
      setCategoria(categories[0].nombre);
    }
  }, [categories, categoria]);

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
        categoria: categoria || (categories[0] ? categories[0].nombre : "General"),
        url_imagen: finalImages[0] || "",
        imagenes: finalImages,
        tallas,
        detalles,
        es_destacado: true,
      };

      await productService.saveProduct(productPayload, editId);
      refetchProducts();
      resetForm();
      alert(editId ? "Prenda actualizada con éxito." : "Nueva prenda agregada al catálogo.");
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
    setCategoria(categories[0] ? categories[0].nombre : "");
    setImagenes([]);
    setPreviewImgs([]);
    setDetalles({ descripcion: "", material: "", cuidados: "" });
    setTallas({ XS: true, S: true, M: true, L: true, XL: true, "2XL": true });
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setCategoria(p.categoria || (categories[0] ? categories[0].nombre : ""));

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
          <img src="/logo.png" alt="THE VOULT PRESTIGE" className="admin-header-logo" />
        </div>

        <button className="btn-red-outline sm" onClick={handleLogout}>
          CERRAR SESIÓN
        </button>
      </div>

      {/* DYNAMIC CATEGORIES MANAGEMENT BLOCK */}
      <DashboardCategorias />

      {/* GRID LAYOUT: PRODUCT FORM & PRODUCTS LIST */}
      <div className="dashboard-main-grid">
        {/* PRODUCT FORM */}
        <div className="admin-card-box">
          <h2>{editId ? "Editar Prenda" : "Agregar Prenda al Catálogo"}</h2>

          <form onSubmit={handleSubmit} className="admin-product-form">
            <div className="form-group">
              <label>Nombre de la Prenda *</label>
              <input
                type="text"
                placeholder="Ej: Hoodie Balenciaga Heavyweight"
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
                  {categories.map((c) => (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descripción y Detalles</label>
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
                placeholder="Ej: 100% Algodón Pima Peruano 500 GSM"
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
                Seleccionar Imágenes de Producto
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
              <button type="submit" className="btn-red" disabled={uploading}>
                {uploading ? "SUBIENDO..." : editId ? "GUARDAR CAMBIOS" : "AÑADIR AL CATÁLOGO"}
              </button>

              {editId && (
                <button type="button" className="btn-red-outline" onClick={resetForm}>
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
                    <span className="item-category-tag" style={{ display: "block", fontSize: "0.7rem", color: "var(--accent-red)" }}>
                      {p.categoria}
                    </span>
                  </div>

                  <div className="admin-item-actions">
                    <button className="btn-edit-sm" onClick={() => handleEdit(p)}>
                      Editar
                    </button>
                    <button className="btn-danger-sm" onClick={() => handleDelete(p.id)}>
                      Eliminar
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
    </div>
  );
}
