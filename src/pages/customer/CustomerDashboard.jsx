import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Tag, Spin, message, Table,Empty,Button  } from "antd";
import { ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined, ShoppingCartOutlined, ArrowRightOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:4000/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data);
        const orders = data.success ? data.data : (data.orders || []);
        setMyOrders(orders);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        message.error('Failed to load orders');
        setMyOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = myOrders.length;
  const pendingOrders = myOrders.filter(o => 
    ['pending', 'unassigned', 'accepted', 'packaging', 'processing'].includes(o.status)
  ).length;
  const deliveredOrders = myOrders.filter(o => o.status === 'delivered').length;
  const totalSpent = myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusColor = (status) => {
    const colors = {
      unassigned: 'gold',
      pending: 'orange',
      accepted: 'blue',
      packaging: 'blue',
      processing: 'blue',
      out_for_delivery: 'purple',
      shipped: 'cyan',
      delivered: 'green',
      canceled: 'red',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text, record) => (
        <a 
          onClick={() => navigate(`/customer/orders/${record._id}`)}
          style={{ color: '#667eea', fontWeight: 600, cursor: 'pointer' }}
        >
          #{text || record._id?.slice(-8)}
        </a>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => items?.length || 0,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <span style={{ fontWeight: 600, color: '#667eea' }}>
          ₹{(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-IN'),
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          Dashboard Overview
        </h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>
          Welcome back! Here's your order summary.
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', opacity: 0.9 }}>Total Orders</span>}
              value={totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: 'white', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', opacity: 0.9 }}>Pending</span>}
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: 'white', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', opacity: 0.9 }}>Delivered</span>}
              value={deliveredOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'white', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', opacity: 0.9 }}>Total Spent</span>}
              value={totalSpent}
              prefix="₹"
              valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card 
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <ShoppingCartOutlined style={{ marginRight: 8, color: '#667eea' }} />
            Recent Orders
          </span>
        }
        bordered={false}
        style={{ borderRadius: 12 }}
        extra={
          <Button 
            type="link" 
            onClick={() => navigate('/customer/orders')}
            icon={<ArrowRightOutlined />}
            style={{ 
              color: '#667eea', 
              fontWeight: 500,
              padding: 0
            }}
          >
            {/* View All */}
          </Button>
        }
      >
        {myOrders.length > 0 ? (
          <Table
            columns={columns}
            dataSource={myOrders.slice(0, 5)}
            rowKey="_id"
            pagination={false}
          />
        ) : (
          <Empty 
            description="No orders found" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}
