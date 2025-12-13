
import React, { useState, useEffect } from 'react';
import {  Row,  Col,  Card, Statistic, Table, Tag, List, Avatar, Rate, Empty, Spin,Alert,Button } from 'antd';
import {DollarOutlined,ShoppingOutlined,ShoppingCartOutlined,StarOutlined,MessageOutlined,RiseOutlined,UserOutlined} from '@ant-design/icons';

const API_BASE = 'http://localhost:4000/api';

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    avgRating: 0,
    confirmed: 0,
    processing: 0,
    readyForDelivery: 0,
    delivered: 0
  });
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    totalEarning: 0,
    commission: 0,
    netEarning: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login to view dashboard');
      setLoading(false);
      return;
    }

    try {
      try {
        const dashboardRes = await fetch(`${API_BASE}/auth/vendor-dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (dashboardRes.ok) {
          const dashData = await dashboardRes.json();
          console.log(' Dashboard data:', dashData);
          
          if (dashData.success && dashData.data) {
            const vendorData = dashData.data;
            setStats(prev => ({
              ...prev,
              confirmed: vendorData.confirmed || 0,
              processing: vendorData.cooking || 0,
              readyForDelivery: vendorData.readyForDelivery || 0,
              delivered: vendorData.delivered || 0
            }));
            
            setEarnings({
              totalEarning: vendorData.totalEarning || 0,
              commission: vendorData.commission || 0,
              netEarning: (vendorData.totalEarning || 0) - (vendorData.commission || 0)
            });
            
            setRecentOrders(vendorData.recentOrders || []);
          }
        }
      } catch (err) {
        console.log('Dashboard stats not available:', err);
      }

      try {
        const productsRes = await fetch(`${API_BASE}/product`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (productsRes.ok) {
          const prodData = await productsRes.json();
          if (prodData.success && Array.isArray(prodData.data)) {
            setStats(prev => ({
              ...prev,
              totalProducts: prodData.data.length
            }));
          }
        }
      } catch (err) {
        console.log('Products not available');
      }

      //  Fetch reviews
      try {
        const reviewsRes = await fetch(`${API_BASE}/vendor/reviews`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (reviewsRes.ok) {
          const revData = await reviewsRes.json();
          if (revData.success && Array.isArray(revData.data)) {
            setReviews(revData.data.slice(0, 5));
            setStats(prev => ({
              ...prev,
              avgRating: revData.stats?.avgRating || 0
            }));
          }
        }
      } catch (err) {
        console.log('Reviews not available');
      }

      //  Fetch chats
      try {
        const chatsRes = await fetch(`${API_BASE}/vendor/chats`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (chatsRes.ok) {
          const chatData = await chatsRes.json();
          if (chatData.success && Array.isArray(chatData.data)) {
            setMessages(chatData.data.slice(0, 5));
          }
        }
      } catch (err) {
        console.log('Chats not available');
      }

      //  Fetch stores count
      try {
        const storesRes = await fetch(`${API_BASE}/stores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (storesRes.ok) {
          const storeData = await storesRes.json();
          console.log(' Stores data:', storeData);
        }
      } catch (err) {
        console.log('Stores not available');
      }

    } catch (error) {
      console.error(' Dashboard fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchDashboardData}>
            Retry
          </Button>
        }
      />
    );
  }


  const orderColumns = [
    { 
      title: 'Order ID', 
      dataIndex: 'id', 
      key: 'id',
      render: (id) => <span style={{ fontFamily: 'monospace' }}>#{id?.substring(0, 8)}</span>
    },
    { 
      title: 'Customer', 
      dataIndex: 'customer', 
      key: 'customer' 
    },
    { 
      title: 'Amount', 
      dataIndex: 'total', 
      key: 'total', 
      render: (amt) => <strong>₹{amt?.toLocaleString('en-IN') || 0}</strong>
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('en-IN')
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <Tag color={
          status === 'Delivered' ? 'green' : 
          status === 'Pending' ? 'orange' : 
          status === 'Processing' ? 'blue' :
          'default'
        }>
          {status}
        </Tag>
      )
    }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>📊 Vendor Dashboard</h1>

      {/* Order Statistics */}
      <h3 style={{ marginTop: 0, marginBottom: 16 }}>Order Statistics</h3>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Confirmed Orders"
              value={stats.confirmed}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Processing"
              value={stats.processing}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ready for Delivery"
              value={stats.readyForDelivery}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Delivered"
              value={stats.delivered}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Earnings & Products */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title=" Earnings Overview">
            <div style={{ lineHeight: 2.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Total Earning:</strong> 
                <span style={{ color: '#52c41a', fontSize: 20, fontWeight: 700 }}>
                  ₹{earnings.totalEarning.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Commission:</strong> 
                <span style={{ color: '#ff4d4f', fontSize: 20, fontWeight: 700 }}>
                  ₹{earnings.commission.toLocaleString('en-IN')}
                </span>
              </div>
              <hr style={{ border: '1px solid #f0f0f0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Net Earning:</strong> 
                <span style={{ color: '#1890ff', fontSize: 22, fontWeight: 700 }}>
                  ₹{earnings.netEarning.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title=" Quick Stats">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Total Products"
                  value={stats.totalProducts}
                  prefix={<ShoppingOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg Rating"
                  value={stats.avgRating}
                  suffix="/ 5"
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Reviews & Messages */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<span><StarOutlined /> Recent Reviews</span>}>
            {reviews.length > 0 ? (
              <List
                dataSource={reviews}
                renderItem={review => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{review.customer?.name || 'Customer'}</span>
                          <Rate disabled value={review.rating} style={{ fontSize: 12 }} />
                        </div>
                      }
                      description={
                        <div>
                          <div>{review.comment?.substring(0, 70)}{review.comment?.length > 70 && '...'}</div>
                          <Tag color="blue" style={{ fontSize: 10, marginTop: 4 }}>
                            {review.product?.name}
                          </Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No reviews yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<span><MessageOutlined /> Customer Messages</span>}>
            {messages.length > 0 ? (
              <List
                dataSource={messages}
                renderItem={chat => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{chat.customer?.name || 'Customer'}</span>
                          {chat.unreadCount?.vendor > 0 && (
                            <Tag color="red">{chat.unreadCount.vendor} new</Tag>
                          )}
                        </div>
                      }
                      description={chat.lastMessage?.text?.substring(0, 50) + '...'}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No messages yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card title={<span><RiseOutlined /> Recent Orders</span>}>
        {recentOrders.length > 0 ? (
          <Table
            dataSource={recentOrders}
            columns={orderColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Empty description="No recent orders" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </div>
  );
}
