import { createContext, useContext, useState, useEffect } from "react";
import { productService } from "../services/productService";
import { supabase } from "../lib/supabase";

const ProductsContext = createContext();
export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      sessionStorage.setItem("tvp_products_cache", JSON.stringify(data));
    } catch (e) {
      console.warn("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt cache read for instant initial load
    const cached = sessionStorage.getItem("tvp_products_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoading(false);
        }
      } catch (e) {
        // Ignore cache parse error
      }
    }

    fetchProducts();

    // Supabase Realtime Subscription for instant catalog updates
    const channel = supabase
      .channel("public:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, refetchProducts: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
