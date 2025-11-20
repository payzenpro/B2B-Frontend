import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Button, Descriptions, Tag, Avatar, Empty, Spin, message } from "antd";
import { ArrowLeftOutlined, ShoppingOutlined, UserOutlined, DollarOutlined, StarOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:4000/api';

export default function AdminCustomerDashboard() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      console.log('📡 Fetching customer data for ID:', customerId);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Please login first!');
        navigate('/login');
        return;
      }

      // ✅ Fetch customer details
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
        
        // TODO: Fetch real orders when API is ready
        // const ordersResponse = await fetch(`${API_BASE_URL}/orders?customerId=${customerId}`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // const ordersData = await ordersResponse.json();
        // if (ordersData.success) setOrders(ordersData.data);
        
        // Dummy orders for now
        setOrders([
          { _id: '1', orderId: '#ORD001', amount: 5000, status: 'delivered', date: '2025-11-05' },
          { _id: '2', orderId: '#ORD002', amount: 8500, status: 'pending', date: '2025-11-04' },
          { _id: '3', orderId: '#ORD003', amount: 3200, status: 'processing', date: '2025-11-03' },
        ]);
        
        message.success('Customer data loaded');
      } else {
        message.error('Customer not found');
        setCustomer(null);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      message.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading customer data..." />
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Customer not found</h2>
        <Button onClick={() => navigate('/customer-list')}>Back to Customer List</Button>
      </div>
    );
  }

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${amount.toLocaleString('en-IN')}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { 
          'delivered': 'green', 
          'pending': 'orange', 
          'processing': 'blue',
          'cancelled': 'red'
        };
        return <Tag color={colors[status]}>{status?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('en-IN')
    }
  ];

  return (
    <div>
      {/* Back Button */}
      <div style={{ marginBottom: '20px' }}>
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/customer-list')}
        >
          Back to Customer List
        </Button>
      </div>

      {/* Customer Header Card */}
      <Card 
        style={{ marginBottom: '20px' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Avatar size={50} style={{ backgroundColor: '#1890ff' }}>
              {customer.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h2 style={{ margin: 0 }}>👤 {customer.name}</h2>
              <p style={{ margin: 0, color: '#999' }}>{customer.email}</p>
            </div>
          </div>
        }
      >
        <Tag color={customer.status === 'active' ? 'green' : 'red'}>
          {customer.status?.toUpperCase() || 'ACTIVE'}
        </Tag>
        {customer.verified && (
          <Tag color="blue" style={{ marginLeft: '10px' }}>
            ✓ VERIFIED
          </Tag>
        )}
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
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
              value={`₹${(customer.totalSpent || 0).toLocaleString('en-IN')}`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rating"
              value={customer.rating || 0}
              suffix="⭐"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Reviews"
              value={customer.reviews || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Customer Details */}
      <Card title="📋 Customer Information" style={{ marginBottom: '20px' }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Full Name" span={2}>
            <strong>{customer.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            <MailOutlined /> {customer.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            <PhoneOutlined /> {customer.phone || 'Not provided'}
          </Descriptions.Item>
          <Descriptions.Item label="Total Orders">
            {customer.totalOrders || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount Spent">
            ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}
          </Descriptions.Item>
          <Descriptions.Item label="Joined Date">
            {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Last Login">
            {customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString('en-IN') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={customer.status === 'active' ? 'green' : 'red'}>
              {customer.status?.toUpperCase() || 'ACTIVE'}
            </Tag>
          </Descriptions.Item>
          {customer.address && (
            <Descriptions.Item label="Address" span={2}>
              {customer.address}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Orders Table */}
      <Card title="📦 Recent Orders">
        {orders.length > 0 ? (
          <Table
            columns={orderColumns}
            dataSource={orders}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            size="small"
          />
        ) : (
          <Empty description="No orders found" />
        )}
      </Card>

      {/* Actions */}
      <Card title="🚀 Actions" style={{ marginTop: '20px' }}>
        <Button type="primary" style={{ marginRight: '10px' }}>
          View All Orders
        </Button>
        <Button style={{ marginRight: '10px' }}>
          Send Message
        </Button>
        <Button danger>
          Deactivate Customer
        </Button>
      </Card>
    </div>
  );
}
