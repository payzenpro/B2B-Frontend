import {
  Table,
  Card,
  Tag,
  Button,
  Empty,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { getOrders, deleteOrder, createOrder, updateOrder } from "../../app/api";

const { Option } = Select;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); 

  const [form] = Form.useForm();

  // 🔹 Get user from localStorage safely
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Invalid user in localStorage", e);
    user = null;
  }

  const role = (user?.role || "").toLowerCase();

  // 🔹 Orders fetch
  const loadOrders = async () => {
    try {
      const data = await getOrders();
      console.log("Orders data:", data);
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🔹 Open Add modal
  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 🔹 Open Edit modal
  const handleEdit = (order) => {
    setEditingOrder(order);
    form.setFieldsValue({
      orderId: order.orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      status: order.status,
    });
    setIsModalOpen(true);
  };

  // 🔹 Submit form – Add / Edit dono yahi se
  const handleFormFinish = async (values) => {
    try {
      if (editingOrder) {
        // UPDATE
        await updateOrder(editingOrder._id, values);
        message.success("Order updated successfully");
      } else {
        // CREATE
        await createOrder(values);
        message.success("Order created successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      loadOrders();
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    }
  };

  // 🔹 DELETE handler
  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success("Order deleted successfully");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error(error);
      message.error("Failed to delete order");
    }
  };

  // 🔹 UPDATE STATUS (simple prompt se)
  const handleUpdateStatus = async (order) => {
    const newStatus = window.prompt(
      "Enter new status (pending, processing, delivered, canceled, refunded):",
      order.status || "pending"
    );
    if (!newStatus) return;

    try {
      await updateOrder(order._id, { status: newStatus });
      message.success("Status updated");
      loadOrders();
    } catch (err) {
      console.error(err);
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (id) => <strong>{id || "N/A"}</strong>,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => name || "N/A",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
      render: (email) => email || "N/A",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `₹${Number(total || 0).toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "orange",
          processing: "blue",
          delivered: "green",
          canceled: "red",
          refunded: "purple",
        };
        return (
          <Tag color={colors[status] || "default"}>{status || "N/A"}</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, order) =>
        role === "superadmin" ? (
          <Space>
            <Button onClick={() => handleUpdateStatus(order)}>
              Update Status
            </Button>

            <Button type="primary" onClick={() => handleEdit(order)}>
              Edit
            </Button>

            <Popconfirm
              title="Are you sure to delete this order?"
              onConfirm={() => handleDelete(order._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        ) : (
          <span>No Access</span>
        ),
    },
  ];

  return (
    <>
      <Card
        title="Orders"
        loading={loading}
        extra={
          role === "superadmin" && (
            <Button type="primary" onClick={handleAdd}>
              Add Order
            </Button>
          )
        }
      >
        {orders.length === 0 ? (
          <Empty description="No orders found" />
        ) : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey={(record) => record._id || record.orderId || Math.random()}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* 🔹 Add/Edit Modal */}
      <Modal
        title={editingOrder ? "Edit Order" : "Add Order"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingOrder ? "Update" : "Create"}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleFormFinish}>
          <Form.Item
            label="Order ID"
            name="orderId"
            rules={[{ required: true, message: "Order ID is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: "Customer name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Customer Email"
            name="customerEmail"
            rules={[{ required: true, message: "Customer email is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Total Amount"
            name="total"
            rules={[{ required: true, message: "Total amount is required" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select placeholder="Select status">
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="canceled">Canceled</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
