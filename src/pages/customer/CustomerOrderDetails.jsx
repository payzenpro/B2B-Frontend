import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Descriptions, Table, Tag, message, Button } from "antd";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function CustomerOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login again");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!data.success) {
        message.error(data.message || "Failed to load order");
        return;
      }

      setOrder(data.data);
    } catch (err) {
      console.error(err);
      message.error("Error while fetching order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (val) => `₹${val.toLocaleString()}`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, item) => `₹${(item.price * item.quantity).toLocaleString()}`,
    },
  ];

  return (
    <Card
      loading={loading}
      title={`Order Details`}
      extra={<Link to="/customer/orders">Back to Orders</Link>}
    >
      {order && (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Order ID">
              {order.orderId || order._id}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag>{order.status?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag>{order.paymentStatus?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              ₹{(order.total || 0).toLocaleString()}
            </Descriptions.Item>
            {order.buyerCompanyName && (
              <Descriptions.Item label="Company">
                {order.buyerCompanyName}
              </Descriptions.Item>
            )}
            {order.buyerGstNumber && (
              <Descriptions.Item label="GST">
                {order.buyerGstNumber}
              </Descriptions.Item>
            )}
            {order.billingAddress && (
              <Descriptions.Item label="Billing Address">
                {order.billingAddress}
              </Descriptions.Item>
            )}
            {order.shippingAddress && (
              <Descriptions.Item label="Shipping Address">
                {order.shippingAddress}
              </Descriptions.Item>
            )}
          </Descriptions>

          <h3 style={{ marginTop: 24 }}>Items</h3>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={order.items || []}
            pagination={false}
            size="small"
          />
        </>
      )}
    </Card>
  );
}
