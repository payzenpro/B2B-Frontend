import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";

export default function BuyNow() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("buynow_product"));
    if (data) setProduct(data);
  }, []);

  if (!product) return <h2>No product selected</h2>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <Card title="Order Summary">
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Size:</strong> {product.size}</p>
        <p><strong>Color:</strong> {product.color}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Total:</strong> ₹{product.total}</p>

        <Button type="primary" block>
          Place Order
        </Button>
      </Card>
    </div>
  );
}
