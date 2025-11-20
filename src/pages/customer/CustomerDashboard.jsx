import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, List, Tag } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';

export default function CustomerDashboard() {
  // Customer ka apna data - Same format as AdminCustomerDashboard
  const customerData = {
    name: 'Rajesh Kumar',
    email: 'rajesh@gmail.com',
    phone: '9876543210',
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 10,
    totalSpent: 45000,
    tier: 'Gold',
    joinDate: '2025-01-15',
    address: 'South Delhi',
    recentOrders: [
      { id: 'ORD1001', vendor: 'TechHub', total: 5000, status: 'Delivered', date: '2025-10-30' },
      { id: 'ORD1002', vendor: 'Fashion Paradise', total: 2800, status: 'Processing', date: '2025-10-29' },
      { id: 'ORD1003', vendor: 'FreshMart', total: 8000, status: 'Delivered', date: '2025-10-28' }
    ],
    wishlist: ['iPhone 14 Pro', 'MacBook Air', 'Formal Shirt'],
    addresses: [
      { label: 'Home', address: 'South Delhi, 110001' },
      { label: 'Office', address: 'Central Delhi, 110002' }
    ]
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #52c41a 0%, #87d068 100%)', color: '#fff', padding: 24, marginBottom: 24, borderRadius: 8 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>👤 {customerData.name}</h2>
        <p style={{ margin: 0 }}><Tag color="gold">{customerData.tier} Member</Tag> • {customerData.joinDate}</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Orders" value={customerData.totalOrders} icon={<ShoppingOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Pending" value={customerData.pendingOrders} icon={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Completed" value={customerData.completedOrders} icon={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Spent" value={customerData.totalSpent} suffix="₹" icon={<DollarOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title=" Recent Orders">
            <Table dataSource={customerData.recentOrders} columns={[
              { title: 'Order ID', dataIndex: 'id', key: 'id' },
              { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
              { title: 'Amount', dataIndex: 'total', key: 'total', render: (amt) => `₹${amt.toLocaleString()}` },
              { title: 'Date', dataIndex: 'date', key: 'date' },
              { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Delivered' ? 'green' : 'orange'}>{status}</Tag> }
            ]} rowKey="id" pagination={false} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title=" Profile" style={{ marginBottom: 16 }}>
            <div style={{ lineHeight: 2 }}>
              <div><strong>Email:</strong> {customerData.email}</div>
              <div><strong>Phone:</strong> {customerData.phone}</div>
              <div><strong>Address:</strong> {customerData.address}</div>
              <div><strong>Tier:</strong> <Tag color="gold">{customerData.tier}</Tag></div>
            </div>
          </Card>

          <Card title=" Wishlist">
            <List dataSource={customerData.wishlist} renderItem={(item) => <List.Item> {item}</List.Item>} />
          </Card>
        </Col>
      </Row>

      <Card title="Saved Addresses" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {customerData.addresses.map((addr) => (
            <Col xs={24} sm={12} key={addr.label}>
              <Card hoverable>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{addr.label}</div>
                <div style={{ color: '#666' }}>{addr.address}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
