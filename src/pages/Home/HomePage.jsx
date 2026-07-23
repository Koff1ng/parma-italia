import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import Hero from "../../components/home/Hero";
import ProductCard from "../../components/product/ProductCard";
import SizeModal from "../../components/product/SizeModal";
import "./HomePage.css";

export default function HomePage({ setOpenCart }) {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProductForSize, setSelectedProductForSize] = useState(null);
  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  // Filter products by category tab
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") return products;
    return products.filter((p) => p.categoria?.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  const totalPages = useMemo(
    () => Math.ceil(filteredProducts.length / productsPerPage) || 1,
    [filteredProducts.length, productsPerPage]
  );

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, page, productsPerPage]);

  const handleOpenSizeModal = useCallback((product) => {
    setSelectedProductForSize(product);
  }, []);

  const handleAddToCartWithSize = (product, size) => {
    const imagenes = product.imagenes
      ? (Array.isArray(product.imagenes) ? product.imagenes : Object.values(product.imagenes))
      : [];
    const portada = imagenes[0] || product.url_imagen;

    addToCart(
      {
        ...product,
        size,
        itemprice: product.precio,
        thumb: portada
      },
      () => setOpenCart(true)
    );

    setSelectedProductForSize(null);
  };

  return (
    <div className="home-page-wrapper">
      <Hero />

      <section id="catalog-section" className="catalog-container container">
        <div className="catalog-header">
          <span className="badge-gold">EXCLUSIVITÉ 1.1</span>
          <h2 className="catalog-title">COLECCIÓN RECIENTE & DROPS</h2>
          <div className="gold-divider"></div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="category-tabs">
          {["Todos", "Camisetas 1.1", "Hoodies 1.1", "Chaquetas & abrigos 1.1", "Conjuntos 1.1"].map((cat) => (
            <button
              key={cat}
              className={`cat-tab-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line price" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProducts.length === 0 && (
          <div className="empty-catalog-msg">
            <p>No se encontraron prendas en esta categoría por el momento.</p>
          </div>
        )}

        {/* PRODUCTS GRID */}
        {!loading && filteredProducts.length > 0 && (
          <>
            <div className="products-grid">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={handleOpenSizeModal}
                  navigate={navigate}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="vault-pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="page-btn"
                >
                  ← Anterior
                </button>
                <span className="page-info">
                  Página {page} de {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="page-btn"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* SIZE SELECTOR MODAL */}
      <SizeModal
        product={selectedProductForSize}
        onClose={() => setSelectedProductForSize(null)}
        onSelectSize={handleAddToCartWithSize}
      />
    </div>
  );
}
