import React, { useEffect, useState } from "react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/orders/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <div>Order #{order._id} | Total: ₹{order.total} | Status: {order.status}</div>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
