
import React, { useState, useEffect } from "react";
import { Button, InputNumber, message, List } from "antd";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch {
      message.error("Failed to load cart");
    }
  };

  const updateQty = async (cartItemId, newQty) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/cart/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cartItemId, quantity: newQty }),
    });
    if(res.ok) {
      message.success("Quantity updated");
      fetchCart();
    }
  };

  const removeItem = async (cartItemId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api/cart/${cartItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if(res.ok) {
      message.success("Removed from cart");
      fetchCart();
    }
  };

  if (!cart.length) return <div>Your cart is empty.</div>;

  return (
    <List
      dataSource={cart}
      renderItem={item => (
        <List.Item
          actions={[
            <InputNumber min={1} value={item.quantity} onChange={val => updateQty(item._id, val)} />,
            <Button danger onClick={() => removeItem(item._id)}>Remove</Button>
          ]}
        >
          <List.Item.Meta title={item.name} description={`₹${item.price} × ${item.quantity}`} />
        </List.Item>
      )}
    />
  );
}
