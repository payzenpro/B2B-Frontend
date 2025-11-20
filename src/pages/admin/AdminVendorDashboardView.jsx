import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Button, Descriptions, Tag, Avatar } from "antd";
import { ArrowLeftOutlined, ShoppingOutlined, UserOutlined, DollarOutlined, StarOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminVendorDashboard() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorData();
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/vendors/${vendorId}`);
      const data = await response.json();
      
      if (data.success) {
        setVendor(data.data);
      } else {
        setVendor(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!vendor) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Vendor not found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {/* Store Header Card */}
      <Card 
        style={{ marginBottom: '20px' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Avatar size={50} style={{ backgroundColor: '#1890ff' }}>
              {vendor.owner?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h2 style={{ margin: 0 }}>🏪 {vendor.storeName}</h2>
              <p style={{ margin: 0, color: '#999' }}>Owner: {vendor.owner}</p>
            </div>
          </div>
        }
      >
        <Tag color={vendor.status === 'active' ? 'green' : 'red'}>
          {vendor.status?.toUpperCase()}
        </Tag>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={vendor.totalOrders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={`₹${(vendor.totalRevenue || 0).toLocaleString()}`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rating"
              value={vendor.rating || 0}
              suffix="⭐"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={vendor.totalProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Vendor Details */}
      <Card title="📋 Vendor Information" style={{ marginBottom: '20px' }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Store Name" span={2}>
            {vendor.storeName}
          </Descriptions.Item>
          <Descriptions.Item label="Owner Name">
            {vendor.owner}
          </Descriptions.Item>
          <Descriptions.Item label="Owner Email">
            {vendor.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {vendor.phone}
          </Descriptions.Item>
          <Descriptions.Item label="GST Number">
            {vendor.gstNumber || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Commission Rate">
            {vendor.commission || 15}%
          </Descriptions.Item>
          <Descriptions.Item label="Total Reviews">
            {vendor.reviews || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Joined Date">
            {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
          {vendor.storeAddress && (
            <Descriptions.Item label="Address" span={2}>
              {vendor.storeAddress.addressLine1}, {vendor.storeAddress.city}, {vendor.storeAddress.state} - {vendor.storeAddress.pincode}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Quick Actions */}
      <Card title="🚀 Actions">
        <Button type="primary" style={{ marginRight: '10px' }}>
          View Products
        </Button>
        <Button style={{ marginRight: '10px' }}>
          View Orders
        </Button>
        <Button danger>
          Deactivate Store
        </Button>
      </Card>
    </div>
  );
}
