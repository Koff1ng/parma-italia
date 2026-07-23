import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function SearchBar({ products = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filtrar productos en tiempo real
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const nombre = (product.nombre || "").toLowerCase();
      const id = (product.id || "").toLowerCase();
      return nombre.includes(query) || id.includes(query);
    }).slice(0, 8); // Limitar a 8 resultados
  }, [searchQuery, products]);

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Focus en el input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Manejar teclado
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
      setFocusedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => 
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0 && filteredProducts[focusedIndex]) {
      handleProductClick(filteredProducts[focusedIndex]);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
  };

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <button
        className="search-toggle"
        onClick={handleSearchToggle}
        aria-label="Buscar productos"
      >
        <SearchIcon />
      </button>

      {isOpen && (
        <div className="search-dropdown">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => {
                  setSearchQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Limpiar búsqueda"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="search-results">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="search-results-header">
                    {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                  </div>
                  {filteredProducts.map((product, index) => {
                    const imagenes = product.imagenes ? Object.values(product.imagenes) : [];
                    const portada = imagenes[0] || product.url_imagen;
                    
                    return (
                      <div
                        key={product.id}
                        className={`search-result-item ${index === focusedIndex ? "focused" : ""}`}
                        onClick={() => handleProductClick(product)}
                        onMouseEnter={() => setFocusedIndex(index)}
                      >
                        <img
                          src={portada}
                          alt={product.nombre}
                          className="search-result-image"
                          loading="lazy"
                        />
                        <div className="search-result-info">
                          <div className="search-result-name">{product.nombre}</div>
                          <div className="search-result-price">
                            ${Number(product.precio).toLocaleString("es-CO")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="search-no-results">
                  No se encontraron productos
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

