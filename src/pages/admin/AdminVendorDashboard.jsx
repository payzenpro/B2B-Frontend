import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, Tag, Button, Modal, Form, Input, InputNumber } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminVendorDashboard() {
  const { vendorId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const [vendorData, setVendorData] = useState({
    name: 'TechHub Store',
    owner: 'Rajesh Kumar',
    email: 'rajesh@tech.com',
    phone: '9876543210',
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
      { id: 'ORD1003', customer: 'Neha', total: 7200, status: 'Pending', date: '2025-10-30' }
    ]
  });

  // Earnings Graph Data - Pie Chart
  const netEarning = vendorData.totalEarning - vendorData.commission;
  const earningsChartData = [
    { name: 'Net Earning', value: netEarning, color: '#52c41a' },
    { name: 'Commission', value: vendorData.commission, color: '#ff4d4f' }
  ];

  // Bar Chart Data - Monthly Earnings
  const monthlyEarningsData = [
    { month: 'Aug', earning: 95000, commission: 9500 },
    { month: 'Sep', earning: 98000, commission: 9800 },
    { month: 'Oct', earning: 110000, commission: 11000 },
    { month: 'Nov', earning: 542500, commission: 54250 }
  ];

  // Edit Button
  const handleEditClick = () => {
    setIsEditMode(true);
    form.setFieldsValue({
      name: vendorData.name,
      owner: vendorData.owner,
      email: vendorData.email,
      phone: vendorData.phone,
      commission: vendorData.commission
    });
    setIsModalOpen(true);
  };

  // Add Button
  const handleAddClick = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Save
  const handleSave = (values) => {
    if (isEditMode) {
      setVendorData({ ...vendorData, ...values });
      alert('✅ Vendor Updated!');
    } else {
      alert('✅ Vendor Added!');
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: 24, marginBottom: 24, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: 8 }}>📊 {vendorData.name} Dashboard</h2>
          <p style={{ margin: 0 }}>Owner: {vendorData.owner} | Email: {vendorData.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleEditClick}
            style={{ background: '#fff', color: '#667eea', fontWeight: 600 }}
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
          >
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Order Statistics */}
      <h3>📦 Order Statistics</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Confirmed" value={vendorData.confirmed} icon={<ShoppingCartOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Processing" value={vendorData.cooking} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Ready" value={vendorData.readyForDelivery} valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Delivered" value={`₹${vendorData.delivered.toLocaleString()}`} icon={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      {/* Earnings Summary + Pie Chart */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="💰 Earnings Summary">
            <div style={{ lineHeight: 2.5 }}>
              <div><strong>Total Earning:</strong> <span style={{ color: '#52c41a', fontSize: 18, fontWeight: 700 }}>₹{vendorData.totalEarning.toLocaleString()}</span></div>
              <div><strong>Commission:</strong> <span style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 700 }}>₹{vendorData.commission.toLocaleString()}</span></div>
              <div><strong>Net Earning:</strong> <span style={{ color: '#1890ff', fontSize: 18, fontWeight: 700 }}>₹{netEarning.toLocaleString()}</span></div>
            </div>
          </Card>
        </Col>

        
        <Col xs={24} lg={12}>
          <Card title="📊 Earnings Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={earningsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {earningsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Monthly Earnings Bar Chart */}
      <Card title="📈 Monthly Earnings Trend" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyEarningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="earning" fill="#1890ff" name="Gross Earning" />
            <Bar dataKey="commission" fill="#ff4d4f" name="Commission" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Orders */}
      <Card title="📋 Recent Orders" style={{ marginTop: 24 }}>
        <Table dataSource={vendorData.recentOrders} columns={[
          { title: 'Order ID', dataIndex: 'id', key: 'id' },
          { title: 'Customer', dataIndex: 'customer', key: 'customer' },
          { title: 'Amount', dataIndex: 'total', key: 'total', render: (amt) => `₹${amt.toLocaleString()}` },
          { title: 'Date', dataIndex: 'date', key: 'date' },
          { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Delivered' ? 'green' : 'orange'}>{status}</Tag> }
        ]} rowKey="id" pagination={false} />
      </Card>

      {/* Edit/Add Modal */}
      <Modal
        title={isEditMode ? '✏️ Edit Vendor' : '➕ Add New Vendor'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Store Name"
            name="name"
            rules={[{ required: true, message: 'Store name required!' }]}
          >
            <Input placeholder="Enter store name" />
          </Form.Item>

          <Form.Item
            label="Owner Name"
            name="owner"
            rules={[{ required: true, message: 'Owner name required!' }]}
          >
            <Input placeholder="Enter owner name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email required!' }]}
          >
            <Input type="email" placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Phone required!' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Commission (%)"
            name="commission"
            rules={[{ required: true, message: 'Commission required!' }]}
          >
            <InputNumber min={0} max={100} placeholder="Enter commission percentage" style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
              {isEditMode ? ' Update' : ' Add'}
            </Button>
            <Button onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
