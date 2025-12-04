import { useEffect, useState } from "react";
import { Table, Tag, message, Card, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function CustomerOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login again");
        navigate("/login/customer");
        return;
      }

      
      const res = await fetch(`${API_BASE}/orders/my`, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
            console.log("GET /orders/my :", data); 



      if (!res.ok) {
        message.error(data.message || `Failed to load orders: ${res.status}`);
        return;
      }

      if (!data.success) {
        message.error(data.message || "Failed to load orders");
        return;
      }
     if (!data.success){
      message.error(data.message  )
     }
      
      const list =
        (Array.isArray(data.orders) && data.orders) ||
        (Array.isArray(data.data) && data.data) ||
        [];

      setOrders(list);
    } catch (err) {
      message.error("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text, record) => (
        <Link to={`/customer/orders/${record._id}`}>
          <strong>{text || record._id}</strong>
        </Link>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) =>
        items && items.length > 0
          ? `${items[0].name}${items.length > 1 ? ` +${items.length - 1} more` : ""}`
          : "-",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => `₹${(val || 0).toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // render: (status) => {
      //   let color = "default";
      //   if (status === "pending") color = "gold";
      //   else if (status === "processing") color = "blue";
      //   else if (status === "shipped") color = "purple";
      //   else if (status === "delivered") color = "green";
      //   else if (status === "canceled") color = "red";

      //   return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      // },
      render: (status) => {
  let label = status;
  let color = "default";

  if (status === "unassigned") { label = "Pending"; color = "gold"; }
  else if (status === "accepted" || status === "packaging") { label = "Processing"; color = "blue"; }
  else if (status === "out_for_delivery") { label = "Shipped"; color = "purple"; }
  else if (status === "delivered") { label = "Delivered"; color = "green"; }
  else if (status === "canceled" || status === "refunded") { label = "Canceled"; color = "red"; }

  return <Tag color={color}>{label.toUpperCase()}</Tag>;
},

    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (val) => {
        let color = "red";
        if (val === "paid") color = "green";
        else if (val === "pending") color = "orange";
        else if (val === "partial") color = "gold";

        return <Tag color={color}>{val?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
    },
    {
       title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={record._id}>
          <Button size="small" type="primary">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Card
      title=" My Orders"
      extra={
        <Button onClick={fetchOrders} loading={loading}>
          Refresh
        </Button>
      }
    >
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: "No orders found",
        }}
      />
    </Card>
  );
}
