import { useEffect, useState } from "react";
import { Card, Button, Form, Input, List, Tag, message } from "antd";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function CustomerAddress() {
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/customer/address`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAddresses(data.data || []);
    } catch (err) {
      message.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async (newAddresses) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/customer/address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: newAddresses })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      setAddresses(data.data);
      message.success("Address saved");
    } catch (err) {
      message.error(err.message || "Failed to save address");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const onFinish = (values) => {
    const newAddr = {
      ...values,
      isDefault: addresses.length === 0
    };
    saveAddresses([...addresses, newAddr]);
    form.resetFields();
  };

  return (
    <Card title="My Addresses" loading={loading}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="label" label="Label" initialValue="Home">
          <Input placeholder="e.g. Home, Office" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Enter full name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Enter phone" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="line1"
          label="Address Line 1"
          rules={[{ required: true, message: "Enter address" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="line2" label="Address Line 2">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Address
        </Button>
      </Form>

      <List
        style={{ marginTop: 24 }}
        dataSource={addresses}
        bordered
        renderItem={(addr, idx) => (
          <List.Item
            actions={[
              <Button
                size="small"
                danger
                onClick={() =>
                  saveAddresses(addresses.filter((_, i) => i !== idx))
                }
              >
                Delete
              </Button>
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
                  <div>{addr.fullName} ({addr.phone})</div>
                  <div>
                    {addr.line1}, {addr.line2 && `${addr.line2}, `}
                    {addr.city}, {addr.state} - {addr.pincode}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
