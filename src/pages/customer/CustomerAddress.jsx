import { useEffect, useState, useCallback } from "react";
import { Card, Button, Form, Input, List, Tag, message } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function CustomerAddress() {
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchAddresses = useCallback(async () => {
    if (!token) {
      message.warning("Please login first");
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Fetching addresses...");
      
      const res = await fetch(`${API_BASE}/address`, {
        headers: { ...headers, "Content-Type": undefined }, // GET me Content-Type mat bhejo
      });

      console.log("Address response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Address API error:", errorData);
        throw new Error(errorData.message || `Status ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ ADDRESSES DATA:", data);
      setAddresses(data.addresses || data || []);
    } catch (err) {
      console.error("❌ fetchAddresses error:", err);
      message.error(err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createAddress = async (values) => {
    if (!token) {
      message.warning("Please login first");
      return;
    }

    try {
      console.log("📝 Creating address:", values);
      
      const payload = {
        label: values.label || "Home",
        name: values.fullName,
        phone: values.phone,
        street: values.line1,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        isDefault: addresses.length === 0,
      };

      const res = await fetch(`${API_BASE}/address`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      console.log("Create response status:", res.status);
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("Create error data:", data);
        throw new Error(data.message || "Failed to create address");
      }

      console.log("✅ Created:", data);
      message.success("Address added successfully!");
      form.resetFields();
      await fetchAddresses(); // refresh list
    } catch (err) {
      console.error("❌ createAddress error:", err);
      message.error(err.message || "Failed to add address");
    }
  };

  const deleteAddress = async (id) => {
    if (!token) return;

    try {
      console.log("🗑️ Deleting address:", id);
      
      const res = await fetch(`${API_BASE}/address/${id}`, {
        method: "DELETE",
        headers: { ...headers, "Content-Type": undefined },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete");
      }

      console.log("✅ Deleted:", data);
      setAddresses(addresses.filter((a) => a._id !== id));
      message.success("Address deleted");
    } catch (err) {
      console.error("❌ deleteAddress error:", err);
      message.error(err.message || "Failed to delete address");
    }
  };

  useEffect(() => {
    const newToken = localStorage.getItem("token");
    setToken(newToken);
    if (newToken) {
      fetchAddresses();
    }
  }, []);

  const onFinish = (values) => {
    createAddress(values);
  };

  return (
    <Card 
      title={
        <span>
          <EnvironmentOutlined /> My Addresses ({addresses.length})
        </span>
      } 
      loading={loading}
    >
      <Form layout="vertical" form={form} onFinish={onFinish} style={{ maxWidth: 500 }}>
        <Form.Item name="label" label="Label" initialValue="Home">
          <Input placeholder="Home, Office, etc." />
        </Form.Item>

        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input placeholder="9876543210" />
        </Form.Item>

        <Form.Item name="line1" label="Address" rules={[{ required: true }]}>
          <Input placeholder="House no, street, landmark" />
        </Form.Item>

        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input placeholder="Mumbai" />
        </Form.Item>

        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input placeholder="Maharashtra" />
        </Form.Item>

        <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
          <Input placeholder="400001" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          ➕ Add New Address
        </Button>
      </Form>

      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
          <EnvironmentOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <h3>No addresses saved</h3>
          <p>Add your first address above</p>
        </div>
      ) : (
        <List
          style={{ marginTop: 24 }}
          dataSource={addresses}
          bordered
          renderItem={(addr) => (
            <List.Item
              actions={[
                <Button
                  size="small"
                  danger
                  onClick={() => deleteAddress(addr._id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <>
                    {addr.label || "Address"}{" "}
                    {addr.isDefault && <Tag color="green">Default</Tag>}
                  </>
                }
                description={
                  <>
                    <div>{addr.name} • {addr.phone}</div>
                    <div>{addr.street}</div>
                    <div>{addr.city}, {addr.state} - {addr.pincode}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
