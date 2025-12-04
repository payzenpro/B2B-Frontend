import { useState, useEffect } from "react";
import { Table, Tag, Select, message, Button } from "antd";
import { getVendorOrders, updateOrderStatus } from "../../app/api";

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    unassigned: "orange",
    accepted: "blue",
    packaging: "cyan",
    out_for_delivery: "purple",
    delivered: "green",
    canceled: "red",
    refunded: "magenta",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const list = await getVendorOrders();
      setOrders(Array.isArray(list) ? list : []);
      message.success(`Loaded ${list.length || 0} orders`);
    } catch (e) {
      console.error(e);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await updateOrderStatus(orderId, status);
      if (res?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        message.success(
          `Order status updated to: ${status.replace("_", " ")}`
        );
      } else {
        message.error(res?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating order status");
    }
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 140,
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (record) => {
        if (record.customerName) return record.customerName;

        // 2) Populated customer object
        const c = record.customerId;
        if (c && typeof c === "object") {
          return c.name || c.email || c._id;
        }
        return "N/A";
      },
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "total",
      width: 120,
      render: (t) => `₹${t}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      width: 180,
      render: (d) =>
        d ? new Date(d).toLocaleString("en-IN") : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        const s = status || "unassigned";
        const color = statusColors[s] || "default";
        return (
          <Tag color={color}>
            {s.replace("_", " ").toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Change Status",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Select
          size="small"
          value={record.status || "unassigned"}
          onChange={(val) => handleStatusChange(record._id, val)}
          style={{ width: 180 }}
        >
          <Select.Option value="unassigned">Unassigned</Select.Option>
          <Select.Option value="accepted">Accepted</Select.Option>
          <Select.Option value="packaging">Packaging</Select.Option>
          <Select.Option value="out_for_delivery">
            Out for Delivery
          </Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
          <Select.Option value="refunded">Refunded</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Orders Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Select defaultValue="all" style={{ width: 140 }}>
            <Select.Option value="all">All Orders</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
          <Button>Export</Button>
        </div>
      </div>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
}
