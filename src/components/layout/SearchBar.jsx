import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";
import "./SearchBar.css";

export default function SearchBar({ products = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const filteredProducts = products.filter((product) => {
    if (!searchTerm.trim()) return false;
    const query = searchTerm.toLowerCase();
    const nombreMatch = product.nombre?.toLowerCase().includes(query);
    const catMatch = product.categoria?.toLowerCase().includes(query);
    const descMatch = product.detalles?.descripcion?.toLowerCase().includes(query);
    return nombreMatch || catMatch || descMatch;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (id) => {
    setSearchTerm("");
    setIsOpen(false);
    setIsExpanded(false);
    navigate(`/product/${id}`);
  };

  return (
    <div className={`vault-search-container ${isExpanded ? "expanded" : ""}`} ref={searchRef}>
      <button
        className="search-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Buscar producto"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      {isExpanded && (
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por marca, prenda o 1.1..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            autoFocus
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {isOpen && searchTerm.trim() !== "" && (
        <div className="search-results-dropdown">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="search-result-item"
                onClick={() => handleSelectProduct(item.id)}
              >
                <img
                  src={item.imagenes?.[0] || item.url_imagen || "/fallback.jpg"}
                  alt={item.nombre}
                  className="search-result-img"
                />
                <div className="search-result-info">
                  <div className="result-name">{item.nombre}</div>
                  <div className="result-price">{formatCurrency(item.precio)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No se encontraron prendas para "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  );
}
