import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";

// Modular UI Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import SideCart from "./components/cart/SideCart";
import Loader from "./components/common/Loader";
import ScrollAnimationObserver from "./components/common/ScrollAnimationObserver";
import MercadoPagoHandler from "./components/common/MercadoPagoHandler";

// Lazy-Loaded Pages
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail/ProductDetailPage"));
const BagPage = lazy(() => import("./pages/Bag/BagPage"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const AboutPage = lazy(() => import("./pages/About/AboutPage"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const SuccessPage = lazy(() => import("./pages/PaymentStatus/SuccessPage"));
const PendingPage = lazy(() => import("./pages/PaymentStatus/PendingPage"));
const FailurePage = lazy(() => import("./pages/PaymentStatus/FailurePage"));

export default function App() {
  const [openCart, setOpenCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin" || location.pathname === "/dashboard";

  // Throttled scroll handling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          setIsScrolled(currentScroll > 40);
          if (currentScroll > lastScrollY && currentScroll > 80) {
            setNavVisible(false);
          } else {
            setNavVisible(true);
          }
          setLastScrollY(currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ProductsProvider>
      <CartProvider>
        <ScrollAnimationObserver />
        <MercadoPagoHandler />

        {!isAdminRoute && (
          <Navbar
            isScrolled={isScrolled}
            navVisible={navVisible}
            setOpenCart={setOpenCart}
          />
        )}

        {!isAdminRoute && (
          <SideCart openCart={openCart} setOpenCart={setOpenCart} />
        )}

        <main className="app-main-content">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage setOpenCart={setOpenCart} />} />
              <Route path="/product/:id" element={<ProductDetailPage setOpenCart={setOpenCart} />} />
              <Route path="/bag" element={<BagPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout-details" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/pending" element={<PendingPage />} />
              <Route path="/failure" element={<FailurePage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </main>

        {!isAdminRoute && <Footer />}
      </CartProvider>
    </ProductsProvider>
  );
}
