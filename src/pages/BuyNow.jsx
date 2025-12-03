// import React, { useEffect, useState } from "react";
// import { Card, Button } from "antd";

// export default function BuyNow() {
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("buynow_product"));
//     if (data) setProduct(data);
//   }, []);

//   if (!product) return <h2>No product selected</h2>;

//   return (
//     <div style={{ maxWidth: 800, margin: "50px auto" }}>
//       <Card title="Order Summary">
//         <p><strong>Product:</strong> {product.name}</p>
//         <p><strong>Size:</strong> {product.size}</p>
//         <p><strong>Color:</strong> {product.color}</p>
//         <p><strong>Quantity:</strong> {product.quantity}</p>
//         <p><strong>Price:</strong> ₹{product.price}</p>
//         <p><strong>Total:</strong> ₹{product.total}</p>

//         <Button type="primary" block>
//           Place Order
//         </Button>
//       </Card>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function BuyNow() {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("buynow_product"));
    if (data) setProduct(data);
  }, []);

  if (!product) return <h2>No product selected</h2>;

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login as customer');
        navigate('/login/customer');
        return;
      }

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: product._id || product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity || 1,
              size: product.size,
              color: product.color,
            },
          ],
          totalAmount: product.total || product.price,
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          status: 'unassigned',
          shippingAddress: 'Default address',
          customerNote: '',
          // vendorId: product.vendorId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        message.error(data.message || 'Failed to place order');
        return;
      }

      message.success('Order placed successfully!');
      localStorage.removeItem('buynow_product');
      navigate('/customer/orders');
    } catch (err) {
      console.error(err);
      message.error('Failed to place order');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <Card title="Order Summary">
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Size:</strong> {product.size}</p>
        <p><strong>Color:</strong> {product.color}</p>
        <p><strong>Quantity:</strong> {product.quantity || 1}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Total:</strong> ₹{product.total || product.price}</p>

        {/* <Button type="primary" block onClick={handlePlaceOrder}>
          Place Order
        </Button> */}
        <Button
  type="primary"
  size="large"
  block
  icon={<ShoppingCartOutlined />}
  onClick={handlePlaceOrder}   // ✅ yahi function
>
  Place Order
</Button>

      </Card>
    </div>
  );
}
