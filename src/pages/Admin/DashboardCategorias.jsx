import { useState } from "react";
import { useProducts } from "../../context/ProductsContext";
import { categoryService } from "../../services/categoryService";

export default function DashboardCategorias() {
  const { categories, refetchCategories } = useProducts();

  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedSlug = slug.trim()
        ? slug.trim().toLowerCase().replace(/\s+/g, "-")
        : nombre.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const payload = {
        nombre: nombre.trim(),
        slug: generatedSlug,
        orden: Date.now(),
      };

      await categoryService.saveCategory(payload, editId);
      await refetchCategories();
      resetForm();
      alert(editId ? "Categoría actualizada con éxito" : "Nueva categoría creada con éxito");
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      alert("Error al guardar categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setSlug("");
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setNombre(cat.nombre);
    setSlug(cat.slug || "");
  };

  const handleDelete = async (id, catNombre) => {
    if (!confirm(`¿Seguro que deseas eliminar la categoría "${catNombre}"?`)) return;
    try {
      await categoryService.deleteCategory(id);
      await refetchCategories();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    }
  };

  return (
    <div className="admin-section-block">
      <div className="section-header-row">
        <h3>🏷️ GESTIÓN DE CATEGORÍAS ({categories.length})</h3>
        <p className="admin-subtext">Crea, modifica o elimina categorías del catálogo en tiempo real.</p>
      </div>

      <div className="category-management-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px", marginTop: "20px" }}>
        {/* FORM */}
        <div className="admin-card-box" style={{ background: "var(--bg-surface)" }}>
          <h4>{editId ? "Editar Categoría" : "Nueva Categoría"}</h4>

          <form onSubmit={handleSubmit} className="admin-product-form" style={{ marginTop: "14px" }}>
            <div className="form-group">
              <label>Nombre de la Categoría *</label>
              <input
                type="text"
                placeholder="Ej: Accessories / Accesorios"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Slug / Código URL (Opcional)</label>
              <input
                type="text"
                placeholder="Ej: accessories"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="form-actions" style={{ marginTop: "12px" }}>
              <button type="submit" className="btn-red sm" disabled={isSubmitting}>
                {isSubmitting ? "GUARDANDO..." : editId ? "GUARDAR CAMBIOS" : "CREAR CATEGORÍA"}
              </button>

              {editId && (
                <button type="button" className="btn-red-outline sm" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="admin-card-box" style={{ background: "var(--bg-surface)" }}>
          <h4>Categorías Activas</h4>

          <div className="admin-table-wrapper" style={{ marginTop: "14px" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Slug</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.nombre}</strong>
                    </td>
                    <td>
                      <code>{c.slug || c.id}</code>
                    </td>
                    <td>
                      <div className="admin-item-actions">
                        <button
                          className="btn-edit-sm"
                          onClick={() => handleEdit(c)}
                          title="Editar Categoría"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleDelete(c.id, c.nombre)}
                          title="Eliminar Categoría"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
