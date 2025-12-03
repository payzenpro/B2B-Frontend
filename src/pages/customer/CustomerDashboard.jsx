import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tag, Spin } from "antd";

export default function CustomerDashboard() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMyOrders(data.orders || []))
      .catch(err => setMyOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Customer Orders</h1>
      {loading ? <Spin /> : myOrders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <ul>
          {myOrders.map(order => (
            <li key={order._id}>{order.orderNumber} : ₹{order.totalAmount}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

