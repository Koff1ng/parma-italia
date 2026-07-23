import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import Hero from "../../components/home/Hero";
import BrandsCarousel from "../../components/home/BrandsCarousel";
import ProductCard from "../../components/product/ProductCard";
import SizeModal from "../../components/product/SizeModal";
import "./HomePage.css";

export default function HomePage({ setOpenCart }) {
  const { addToCart } = useCart();
  const { products, categories, loading } = useProducts();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProductForSize, setSelectedProductForSize] = useState(null);
  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  const dynamicCategoriesList = useMemo(() => {
    const list = [{ label: "Todos", value: "Todos" }];
    if (Array.isArray(categories)) {
      categories.forEach((cat) => {
        list.push({ label: cat.nombre, value: cat.nombre });
      });
    }
    return list;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") return products;
    return products.filter((p) => {
      const cat = (p.categoria || "").toLowerCase();
      const selected = selectedCategory.toLowerCase();
      return cat === selected || cat.includes(selected) || selected.includes(cat);
    });
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
      { ...product, size, itemprice: product.precio, thumb: portada },
      () => setOpenCart(true)
    );

    setSelectedProductForSize(null);
  };

  return (
    <div className="home-page-wrapper">
      <Hero />

      {/* BRANDS INFINITE MARQUEE CAROUSEL */}
      <BrandsCarousel />

      <section id="catalog-section" className="catalog-container container">
        <div className="catalog-header">
          <span className="badge-red">COLECCIÓN EXCLUSIVA</span>
          <h2 className="catalog-title">NUEVOS LANZAMIENTOS</h2>
          <div className="red-divider"></div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="category-tabs">
          {dynamicCategoriesList.map((cat) => (
            <button
              key={cat.value}
              className={`cat-tab-btn ${selectedCategory === cat.value ? "active" : ""}`}
              onClick={() => { setSelectedCategory(cat.value); setPage(1); }}
            >
              {cat.label}
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

            {totalPages > 1 && (
              <div className="vault-pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="page-btn"
                >
                  ← ANTERIOR
                </button>
                <span className="page-info">PÁGINA {page} DE {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="page-btn"
                >
                  SIGUIENTE →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <SizeModal
        product={selectedProductForSize}
        onClose={() => setSelectedProductForSize(null)}
        onSelectSize={handleAddToCartWithSize}
      />
    </div>
  );
}
