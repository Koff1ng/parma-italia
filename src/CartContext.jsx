import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, callback) => {
  setCart((prev) => {
    const exists = prev.find((p) => p.id === product.id && p.size === product.size);

    const precioFinal = Number(product.itemprice ?? product.precio ?? 0);

    if (exists) {
      const updated = prev.map((p) =>
        p.id === product.id && p.size === product.size
          ? { ...p, qty: p.qty + 1 }
          : p
      );
      if (callback) callback();
      return updated;
    }

    const updated = [...prev, { ...product, itemprice: precioFinal, qty: 1 }];
    if (callback) callback();
    return updated;
  });
};



  const removeFromCart = (id, size) => {
  setCart((prev) =>
    prev
      .map((p) =>
        p.id === id && p.size === size ? { ...p, qty: p.qty - 1 } : p
      )
      .filter((p) => p.qty > 0)
  );
};


  const clearCart = () => setCart([]);

  const total = cart.reduce((t, p) => {
  const precio = Number(p.itemprice ?? p.precio ?? 0);
  const qty = p.qty ?? 1;
  return t + precio * qty;
}, 0);



  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
