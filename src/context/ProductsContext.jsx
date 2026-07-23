import { createContext, useContext, useState, useEffect } from "react";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { supabase } from "../lib/supabase";

const ProductsContext = createContext();
export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      sessionStorage.setItem("tvp_products_cache", JSON.stringify(data));
    } catch (e) {
      console.warn("Error fetching products:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (e) {
      console.warn("Error fetching categories:", e);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    // Attempt cache read for instant initial load
    const cached = sessionStorage.getItem("tvp_products_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch (e) {
        // Ignore cache parse error
      }
    }

    refreshAll();

    // Supabase Realtime Subscriptions for instant catalog & categories updates
    const productsChannel = supabase
      .channel("public:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => fetchProducts()
      )
      .subscribe();

    const categoriesChannel = supabase
      .channel("public:categories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => fetchCategories()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        loading,
        refetchProducts: fetchProducts,
        refetchCategories: fetchCategories,
        refreshAll,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
