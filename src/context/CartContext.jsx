import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const index = prev.findIndex(i => i.cartId === item.cartId);
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += item.quantity;
        return updated;
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    setCart(prev => {
      const updated = [...prev];
      const index = updated.findIndex(i => i.cartId === cartId);
      if (index !== -1) {
        updated[index].quantity = quantity;
      }
      return updated;
    });
  };

  const updateSize = (cartId, size) => {
    setCart(prev => {
      const updated = [...prev];
      const index = updated.findIndex(i => i.cartId === cartId);
      if (index !== -1) {
        updated[index].selectedSize = size;
      }
      return updated;
    });
  };

  const updateColor = (cartId, color) => {
    setCart(prev => {
      const updated = [...prev];
      const index = updated.findIndex(i => i.cartId === cartId);
      if (index !== -1) {
        updated[index].selectedColor = color;
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateSize,
      updateColor,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
  
export function useCart() {
  return useContext(CartContext);
}
