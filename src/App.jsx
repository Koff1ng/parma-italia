import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import { useCart } from "./CartContext";
import "./App.css";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import PedidoDetalle from "./PedidoDetalle";
import "./payment-status.css";
// ⭐ IMPORTANTE: HANDLER DE MERCADOPAGO
import MercadoPagoHandler from "./MercadoPagoHandler";
import SuccessPage from "./SuccessPage";
import PendingPage from "./PendingPage";
import FailurePage from "./FailurePage";

/* ===============================
   🟦 LAZY LOAD DE PÁGINAS PESADAS
================================ */
const Checkout = lazy(() => import("./Checkout"));
const AdminLogin = lazy(() => import("./AdminLogin"));
const Dashboard = lazy(() => import("./Dashboard.jsx"));
const ProductDetails = lazy(() => import("./ProductDetails"));
const BagPage = lazy(() => import("./BagPage"));
const About = lazy(() => import("./About.jsx"));
const CheckoutDetails = lazy(() => import("./checkout-details"));

/* ===============================
   🟩 HOME — Página principal
================================ */

export function Home({ setOpenCart }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTallas, setShowTallas] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [page, setPage] = useState(1);
  const productsPerPage = 10;

  const totalPages = Math.ceil(products.length / productsPerPage) || 1;
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const visibleProducts = products.slice(start, end);

  useEffect(() => {
    const cached = sessionStorage.getItem("productosweb_cache_v1");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.warn("Error leyendo cache de productos", e);
      }
    }

    const productsRef = ref(db, "productosweb");

    const unsub = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));

      setProducts(list);
      sessionStorage.setItem("productosweb_cache_v1", JSON.stringify(list));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <>
      <Hero />

      <h2 className="section-title">NUEVOS LANZAMIENTOS</h2>
      <div className="section-divider"></div>

      {/* SKELETONS */}
      {loading && (
        <div className="productos-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-producto skeleton-card">
              <div className="card-img skeleton-img" />
              <div className="card-info">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line price" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          No hay productos disponibles por el momento.
        </p>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="productos-grid">
            {visibleProducts.map((p) => {
              const imagenes = p.imagenes ? Object.values(p.imagenes) : [];
              const portada = imagenes[0] || p.url_imagen;
              const hover = imagenes[1] || portada;

              return (
                <div
                  key={p.id}
                  className="card-producto clickable-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="card-img">
                    <img className="img-main" src={portada} alt={p.nombre} loading="lazy" />
                    <img className="img-hover" src={hover} alt={p.nombre} loading="lazy" />
                  </div>

                  <div className="card-info">
                    <span className="codigo">{p.id}</span>
                    <h3 className="nombre">{p.nombre}</h3>
                    <p className="precio">${Number(p.precio).toLocaleString("es-CO")}</p>
                    <span className="disponible">Disponible</span>

                    <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-add"
                        onClick={() => {
                          setProductoSeleccionado(p);
                          setShowTallas(true);
                        }}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINACIÓN */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              ← Anterior
            </button>

            <span>Página {page} de {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      {showTallas && (
        <div className="talla-overlay">
          <div className="talla-modal">
            <h3>Selecciona tu talla</h3>

            <div className="tallas-row">
              {["XS", "S", "M", "L", "XL", "2XL"].map((talla) => (
                <button
                  key={talla}
                  className="talla-btn"
                  onClick={() => {
                    const imagenes = productoSeleccionado.imagenes
                      ? Object.values(productoSeleccionado.imagenes)
                      : [];

                    const portada = imagenes[0] || productoSeleccionado.url_imagen;

                    addToCart(
                      {
                        ...productoSeleccionado,
                        size: talla,
                        itemprice: productoSeleccionado.precio,
                        thumb: portada // ★★★ MINIATURA
                      },
                      () => setOpenCart(true)
                    );

                    setShowTallas(false);
                  }}
                >
                  {talla}
                </button>
              ))}
            </div>

            <button className="cancelar-talla" onClick={() => setShowTallas(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ===============================
      🟦 APP PRINCIPAL
================================ */


export default function App() {
  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("cart");
  });

  const { cart, addToCart, removeFromCart } = useCart();
  const [openCart, setOpenCart] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    let mounted = true;

    requestAnimationFrame(() => {
      if (mounted) setLoadingRoute(true);
    });

    const timer = setTimeout(() => {
      if (mounted) setLoadingRoute(false);
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setIsScrolled(currentScroll > 40);

      if (currentScroll > lastScrollY && currentScroll > 80) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <MercadoPagoHandler />

      {loadingRoute && <Loader />}

      <header
        className={`navbar ${isScrolled ? "scrolled" : ""} ${
          navVisible ? "nav-visible" : "nav-hidden"
        }`}
      >
        <div className="nav-left" />

        <Link to="/" className="logo">
          PARMA ITALIA
        </Link>

        <button className="cart-icon" onClick={() => setOpenCart(true)}>
          <img src="/bag.svg" className="bag-icon" alt="Bolsa" />
          {cart.length > 0 && <span className="badge">{cart.length}</span>}
        </button>
      </header>

      {/* CARRITO */}
      <div className="main-content">
        <aside className={`side-cart ${openCart ? "open" : ""}`}>
          <div className="cart-header">
            TUS PRODUCTOS
            <span className="cart-close" onClick={() => setOpenCart(false)}>
              ✖
            </span>
          </div>

          <div className="cart-items">
            {cart.length === 0 && <p>Tu carrito está vacío</p>}

            {cart.map((item) => {
              const precio = Number(item.itemprice ?? 0);

              return (
                <div key={item.id + (item.size || "")} className="cart-item">
                  <img
                    src={item.thumb || item.url_imagen || "/fallback.jpg"}
                    alt={item.nombre}
                  />

                  <div className="item-info">
                    <div className="item-title">{item.nombre}</div>

                    {item.size && <div className="item-size">Size: {item.size}</div>}

                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => removeFromCart(item.id, item.size)}>
                        -
                      </button>

                      <span className="qty-num">{item.qty}</span>

                      <button className="qty-btn" onClick={() => addToCart(item)}>
                        +
                      </button>
                    </div>

                    <div className="remove-btn" onClick={() => removeFromCart(item.id, item.size)}>
                      🗑 Remover
                    </div>

                    <div className="item-price">
                      ${(precio * item.qty).toLocaleString("es-CO")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <strong>
                $
                {cart
                  .reduce(
                    (acc, item) =>
                      acc + Number(item.itemprice ?? 0) * Number(item.qty ?? 1),
                    0
                  )
                  .toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="summary-note">
              * Impuestos, envío y descuentos calculados en el checkout.
            </div>

            <Link to="/bag" className="go-bag-btn" onClick={() => setOpenCart(false)}>
              IR A LA BOLSA
            </Link>

            <div className="coupon-box">
              <input placeholder="Código exclusivo o tarjeta de descuento" />
              <button>Aplicar</button>
            </div>
          </div>
        </aside>

        {/* RUTAS */}
        <Suspense fallback={<Loader />}>
          <Routes>
          <Route path="/success" element={<SuccessPage />} />
<Route path="/pending" element={<PendingPage />} />
<Route path="/failure" element={<FailurePage />} />
            <Route path="/pedido/:id" element={<PedidoDetalle />} />
            <Route path="/checkout-details" element={<CheckoutDetails />} />
            <Route path="/" element={<Home setOpenCart={setOpenCart} />} />
            <Route path="/bag" element={<BagPage />} />
            <Route
              path="/product/:id"
              element={<ProductDetails setOpenCart={setOpenCart} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Routes>
        </Suspense>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <Link to="/" className="footer-logo">
            PARMA ITALIA
          </Link>

          <div className="footer-links">
            <Link to="/about">Sobre nosotros</Link>
            <a href="tel:3113524794">Contáctenos: +57 311 352 4794</a>
            <a href="mail:trujillojuanjose05@gmail.com">Mail: admin@parma.com</a>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Parma Italia — Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
