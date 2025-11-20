import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Descriptions, Tag, Button, Spin, message, Empty } from 'antd';
import { ShoppingOutlined, DollarOutlined, LogoutOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';

const API_BASE_URL = 'http://localhost:4000/api';

export default function AdminCustomerDashboardView() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      console.log('📡 Fetching customer:', customerId);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Please login first!');
        navigate('/login');
        return;
      }

      // ✅ Fetch ONLY real customer data
      const response = await fetch(`${API_BASE_URL}/auth/user/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('✅ Customer data:', data);
      
      if (data.success) {
        setCustomer(data.data);
        message.success('Customer data loaded');
      } else {
        message.error('Customer not found');
        navigate('/customer-list');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      message.error('Failed to load customer data');
      navigate('/customer-list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading customer dashboard..." />
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description="Customer not found" />
        <Button type="primary" onClick={() => navigate('/customer-list')} style={{ marginTop: 20 }}>
          Back to Customer List
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #52c41a 0%, #87d068 100%)', 
        color: '#fff', 
        padding: 24, 
        marginBottom: 24, 
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: 8, color: '#fff' }}>
            👤 {customer.name}
          </h2>
          <p style={{ margin: 0, fontSize: 14 }}>
            <Tag color="gold" style={{ marginRight: 8 }}>Customer</Tag>
            {customer.email}
          </p>
          <p style={{ margin: 0, fontSize: 14, marginTop: 4 }}>
            {customer.phone || 'No phone number'}
          </p>
        </div>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={() => navigate('/customer-list')}
          size="large"
        >
          Back to List
        </Button>
      </div>

      {/* Stats Cards - Real Data Only */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Orders" 
              value={customer.totalOrders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Spent" 
              value={`₹${Number(customer.totalSpent || 0).toLocaleString()}`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Account Status" 
              value={customer.status?.toUpperCase() || 'ACTIVE'}
              valueStyle={{ color: customer.status === 'active' ? '#52c41a' : '#ff4d4f', fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Member Since" 
              value={new Date(customer.createdAt).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'short' 
              })}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Customer Details - Real Data Only */}
      <Card title="👤 Customer Information" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Full Name" span={2}>
            <strong>{customer.name}</strong>
          </Descriptions.Item>
          
          <Descriptions.Item label={<><MailOutlined /> Email</>} span={2}>
            {customer.email}
          </Descriptions.Item>
          
          <Descriptions.Item label={<><PhoneOutlined /> Phone</>} span={2}>
            {customer.phone || 'Not provided'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Role">
            <Tag color="blue">{customer.role?.toUpperCase()}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            <Tag color={customer.status === 'active' ? 'green' : 'red'}>
              {customer.status?.toUpperCase() || 'ACTIVE'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Account Created">
            {new Date(customer.createdAt).toLocaleString('en-IN')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Last Updated">
            {new Date(customer.updatedAt).toLocaleString('en-IN')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Customer ID" span={2}>
            <code>{customer._id}</code>
          </Descriptions.Item>
          
          {customer.address && (
            <Descriptions.Item label="Address" span={2}>
              {customer.address}
            </Descriptions.Item>
          )}
          
          {customer.gstNumber && (
            <Descriptions.Item label="GST Number" span={2}>
              {customer.gstNumber}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Additional Info */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="📊 Order Statistics">
            <div style={{ lineHeight: 2.5 }}>
              <div>
                <strong>Total Orders:</strong> 
                <span style={{ float: 'right', color: '#1890ff', fontWeight: 'bold' }}>
                  {customer.totalOrders || 0}
                </span>
              </div>
              <div>
                <strong>Total Spent:</strong> 
                <span style={{ float: 'right', color: '#52c41a', fontWeight: 'bold' }}>
                  ₹{Number(customer.totalSpent || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <strong>Average Order:</strong> 
                <span style={{ float: 'right', color: '#faad14', fontWeight: 'bold' }}>
                  ₹{customer.totalOrders > 0 
                    ? Math.round((customer.totalSpent || 0) / customer.totalOrders).toLocaleString() 
                    : 0}
                </span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="⚙️ Account Details">
            <div style={{ lineHeight: 2.5 }}>
              <div>
                <strong>Account Status:</strong> 
                <Tag color={customer.status === 'active' ? 'green' : 'red'} style={{ float: 'right' }}>
                  {customer.status?.toUpperCase() || 'ACTIVE'}
                </Tag>
              </div>
              <div>
                <strong>Role:</strong> 
                <Tag color="blue" style={{ float: 'right' }}>
                  {customer.role?.toUpperCase()}
                </Tag>
              </div>
              <div>
                <strong>Joined:</strong> 
                <span style={{ float: 'right' }}>
                  {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card title="🚀 Quick Actions" style={{ marginTop: 24 }}>
        <Button type="primary" style={{ marginRight: 10 }}>
          View All Orders
        </Button>
        <Button style={{ marginRight: 10 }}>
          Send Email
        </Button>
        <Button danger>
          {customer.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
        </Button>
      </Card>
    </div>
  );
}
