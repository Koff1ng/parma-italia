import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("tvp_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("tvp_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, callback) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) => p.id === product.id && p.size === product.size
      );

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

      const updated = [
        ...prev,
        { ...product, itemprice: precioFinal, qty: 1 }
      ];
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

  const deleteItemCompletely = (id, size) => {
    setCart((prev) => prev.filter((p) => !(p.id === id && p.size === size)));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const subtotal = cart.reduce((t, p) => {
    const precio = Number(p.itemprice ?? p.precio ?? 0);
    const qty = Number(p.qty ?? 1);
    return t + precio * qty;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.tipo === "porcentaje") {
      discountAmount = (subtotal * Number(appliedCoupon.descuento)) / 100;
    } else {
      discountAmount = Number(appliedCoupon.descuento);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteItemCompletely,
        clearCart,
        subtotal,
        discountAmount,
        total,
        appliedCoupon,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
