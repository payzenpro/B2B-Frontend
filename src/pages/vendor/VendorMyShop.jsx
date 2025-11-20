import { Card, Statistic, Row, Col, Button, Tag, Table, Space, message } from "antd";
import { EditOutlined, EyeOutlined, ShareAltOutlined } from "@ant-design/icons";

export default function VendorMyShop() {
  const shopData = {
    name: "My Premium Store",
    followers: 1250,
    rating: 4.8,
    totalProducts: 245,
    totalOrders: 1520,
    revenue: 542500
  };

  const recentOrders = [
    { _id: 1, orderNo: 'ORD001', customer: 'Rajesh Kumar', amount: 5000, status: 'Delivered', date: '2025-10-31' },
    { _id: 2, orderNo: 'ORD002', customer: 'Priya Singh', amount: 3500, status: 'Processing', date: '2025-10-31' },
    { _id: 3, orderNo: 'ORD003', customer: 'Amit Patel', amount: 7200, status: 'Pending', date: '2025-10-30' }
  ];

  const columns = [
    { title: 'Order No', dataIndex: 'orderNo', key: 'orderNo' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt) => `₹${amt.toLocaleString()}` },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => {
        const colors = { Delivered: 'green', Processing: 'blue', Pending: 'orange' };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    },
    { title: 'Date', dataIndex: 'date', key: 'date' }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🏪 My Shop</h2>
        <Space>
          <Button icon={<EditOutlined />}>Edit Shop</Button>
          <Button type="primary" icon={<EyeOutlined />}>View Shop</Button>
          <Button icon={<ShareAltOutlined />}>Share</Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Shop Name" value={shopData.name} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Followers" value={shopData.followers} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Rating" value={shopData.rating} suffix="⭐" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Total Revenue" value={`₹${shopData.revenue.toLocaleString()}`} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card><Statistic title="Total Products" value={shopData.totalProducts} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card><Statistic title="Total Orders" value={shopData.totalOrders} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Card title="Recent Orders">
        <Table dataSource={recentOrders} columns={columns} rowKey="_id" pagination={false} />
      </Card>
    </div>
  );
}
