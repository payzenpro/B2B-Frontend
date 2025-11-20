import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';

export default function VendorDashboard() {
  const vendorData = {
    name: 'TechHub Store',
    owner: 'Rajesh Kumar',
    confirmed: 12,
    delivered: 542500,
    cooking: 0,
    readyForDelivery: 3,
    refunded: 5,
    all: 45,
    totalEarning: 542500,
    commission: 54250,
    recentOrders: [
      { id: 'ORD1001', customer: 'Amit', total: 5000, status: 'Delivered', date: '2025-11-01' },
      { id: 'ORD1002', customer: 'Priya', total: 3500, status: 'Processing', date: '2025-10-31' },
      { id: 'ORD1003', customer: 'Neha', total: 7200, status: 'Pending', date: '2025-10-30' },
      { id: 'ORD1004', customer: 'Isha', total: 6200, status: 'Pending', date: '2025-10-25' }
    ]
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: 24, marginBottom: 24, borderRadius: 8 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>📊 {vendorData.name} Dashboard</h2>
        <p style={{ margin: 0 }}>Owner: {vendorData.owner}</p>
      </div>

      <h3> Order Statistics</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Confirmed" value={vendorData.confirmed} icon={<ShoppingCartOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Processing" value={vendorData.cooking} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Ready" value={vendorData.readyForDelivery} valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Delivered" value={`₹${vendorData.delivered.toLocaleString()}`} icon={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title=" Earnings">
            <div style={{ lineHeight: 2 }}>
              <div><strong>Total Earning:</strong> <span style={{ color: '#52c41a', fontSize: 18, fontWeight: 700 }}>₹{vendorData.totalEarning.toLocaleString()}</span></div>
              <div><strong>Commission:</strong> <span style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 700 }}>₹{vendorData.commission.toLocaleString()}</span></div>
              <div><strong>Net Earning:</strong> <span style={{ color: '#1890ff', fontSize: 18, fontWeight: 700 }}>₹{(vendorData.totalEarning - vendorData.commission).toLocaleString()}</span></div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title=" Recent Orders" style={{ marginTop: 24 }}>
        <Table dataSource={vendorData.recentOrders} columns={[
          { title: 'Order ID', dataIndex: 'id', key: 'id' },
          { title: 'Customer', dataIndex: 'customer', key: 'customer' },
          { title: 'Amount', dataIndex: 'total', key: 'total', render: (amt) => `₹${amt.toLocaleString()}` },
          { title: 'Date', dataIndex: 'date', key: 'date' },
          { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Delivered' ? 'green' : 'orange'}>{status}</Tag> }
        ]} rowKey="id"  pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
}
