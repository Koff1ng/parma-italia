import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import "./Navbar.css";

export default function Navbar({ isScrolled, navVisible, setOpenCart }) {
  const { cart } = useCart();
  const { products } = useProducts();

  return (
    <header
      className={`vault-navbar ${isScrolled ? "scrolled" : ""} ${
        navVisible ? "nav-visible" : "nav-hidden"
      }`}
    >
      <div className="nav-container">
        <div className="nav-left">
          <MobileMenu />
          <nav className="desktop-menu">
            <Link to="/" className="nav-link">ARCHIVE / DROPS</Link>
            <Link to="/about" className="nav-link">MANIFESTO</Link>
          </nav>
        </div>

        {/* LOGO PNG */}
        <Link to="/" className="vault-logo-brand" aria-label="THE VOULT PRESTIGE">
          <img src="/logo.png" alt="THE VOULT PRESTIGE" className="nav-logo-img" />
        </Link>

        <div className="nav-right">
          <SearchBar products={products} />
          <button
            className="cart-trigger-btn"
            onClick={() => setOpenCart(true)}
            aria-label="Shopping Bag / Bolsa de compras"
          >
            <span className="cart-btn-label">BAG</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
