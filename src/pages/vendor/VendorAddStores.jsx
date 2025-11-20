import { useState } from "react";
import { Card, Button, Form, Input, Select, Row, Col, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function VendorAddStores() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Store added successfully!');
      setLoading(false);
      navigate('/vendor/stores-list');
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/vendor/new-stores')} />
        <h2 style={{ margin: 0 }}>Add New Store</h2>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="storeName" label="Store Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Delhi East Store" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="storeCode" label="Store Code" rules={[{ required: true }]}>
                <Input placeholder="e.g. DELEAST001" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input placeholder="e.g. Delhi" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="zone" label="Zone" rules={[{ required: true }]}>
                <Select placeholder="Select Zone">
                  <Select.Option value="north">North</Select.Option>
                  <Select.Option value="south">South</Select.Option>
                  <Select.Option value="east">East</Select.Option>
                  <Select.Option value="west">West</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Full address" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="Contact number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="manager" label="Manager Name" rules={[{ required: true }]}>
                <Input placeholder="Store manager" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="openTime" label="Opening Time" rules={[{ required: true }]}>
                <Input placeholder="e.g. 09:00 AM" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="closeTime" label="Closing Time" rules={[{ required: true }]}>
                <Input placeholder="e.g. 10:00 PM" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => navigate('/vendor/stores-list')}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} htmlType="submit">
              Save Store
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
