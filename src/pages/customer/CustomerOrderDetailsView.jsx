import React, { useState, useEffect } from 'react';
import {Card, Row, Col, Typography, Tag,Button, Spin, message, Descriptions, Timeline, Progress, Space,Image,Divider, Statistic} from 'antd';
import {ArrowLeftOutlined,CheckCircleOutlined,ClockCircleOutlined, TruckOutlined,ShoppingCartOutlined,UserOutlined,EnvironmentOutlined, PhoneOutlined,CalendarOutlined, DollarOutlined,PrinterOutlined} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function CustomerOrderDetailsView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    console.log('CustomerOrderDetailsView loaded with orderId:', orderId);
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login first');
        navigate('/login/customer');
        return;
      }

      console.log('Fetching order:', `${API_BASE}/orders/${orderId}`);

      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log('Order details response:', data);

      if (!res.ok) {
        message.error(data.message || 'Failed to load order details');
        return;
      }

      setOrder(data.success ? data.data : data.order || data);
    } catch (error) {
      console.error('Error fetching order:', error);
      message.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

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
      refunded: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      unassigned: 'Pending',
      pending: 'Pending',
      accepted: 'Processing',
      packaging: 'Processing',
      processing: 'Processing',
      out_for_delivery: 'Shipped',
      shipped: 'Shipped',
      delivered: 'Delivered',
      canceled: 'Canceled',
      cancelled: 'Canceled',
      refunded: 'Refunded'
    };
    return labels[status] || status;
  };

  const getStatusProgress = (status) => {
    const progress = {
      unassigned: 20,
      pending: 25,
      accepted: 40,
      packaging: 50,
      processing: 50,
      out_for_delivery: 75,
      shipped: 75,
      delivered: 100,
      canceled: 0,
      cancelled: 0
    };
    return progress[status] || 0;
  };

  const getProductImage = (item) => {
    const product = item.productId || item.product;
    let imgSrc = product?.images?.[0]?.url || 
                 product?.images?.[0] || 
                 product?.image?.url || 
                 product?.image || 
                 'https://dummyimage.com/100x100/667eea/fff&text=Product';
    
    if (imgSrc && typeof imgSrc === 'string' && !imgSrc.startsWith('http')) {
      const baseUrl = API_BASE.replace('/api', '');
      imgSrc = `${baseUrl}${imgSrc}`;
    }
    return imgSrc;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5'
      }}>
        <Spin size="large" tip="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3}>Order not found</Title>
        <Button type="primary" onClick={() => navigate('/customer/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate('/customer/orders')}
                >
                  Back to Orders
                </Button>
                <Divider type="vertical" />
                <Space direction="vertical" size={0}>
                  <Text type="secondary">Order ID</Text>
                  <Title level={4} style={{ margin: 0 }} copyable>
                    #{order.orderNumber || order._id?.slice(-8)}
                  </Title>
                </Space>
              </Space>
            </Col>
            <Col>
              <Button 
                icon={<PrinterOutlined />} 
                onClick={() => window.print()}
              >
                Print Invoice
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Quick Info Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <Statistic
                title={<span><CalendarOutlined /> Order Date</span>}
                value={new Date(order.createdAt).toLocaleDateString('en-IN')}
                valueStyle={{ fontSize: 14 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ background: '#fef3c7', border: '1px solid #fde047' }}>
              <Statistic
                title={<span><ShoppingCartOutlined /> Total Items</span>}
                value={order.items?.length || 0}
                valueStyle={{ fontSize: 16 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
              <Statistic
                title={<span><DollarOutlined /> Payment</span>}
                value={order.paymentMethod?.toUpperCase() || 'COD'}
                valueStyle={{ fontSize: 14 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ background: '#fce7f3', border: '1px solid #f9a8d4' }}>
              <Statistic
                title="Total Amount"
                value={`₹${Number(order.totalAmount || 0).toLocaleString()}`}
                valueStyle={{ fontSize: 18, color: '#667eea', fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>

    
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Title level={5} style={{ marginBottom: 16 }}>
                <TruckOutlined /> Order Status Tracking
              </Title>
              <Progress
                percent={getStatusProgress(order.status)}
                strokeColor={{
                  '0%': '#667eea',
                  '100%': '#764ba2',
                }}
                status={['canceled', 'cancelled'].includes(order.status) ? 'exception' : 'active'}
                style={{ marginBottom: 20 }}
                strokeWidth={12}
              />
              <Timeline
                items={[
                  {
                    dot: <CheckCircleOutlined style={{ fontSize: 18 }} />,
                    color: 'green',
                    children: (
                      <div>
                        <Text strong style={{ fontSize: 15 }}>Order Placed</Text>
                        <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'long',
                            timeStyle: 'short'
                          })}
                        </div>
                      </div>
                    )
                  },
                  {
                    dot: <ClockCircleOutlined style={{ fontSize: 18 }} />,
                    color: ['accepted', 'packaging', 'processing', 'out_for_delivery', 'shipped', 'delivered'].includes(order.status) ? 'blue' : 'gray',
                    children: (
                      <div>
                        <Text strong style={{ fontSize: 15 }}>Processing</Text>
                        <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                          {['unassigned', 'pending'].includes(order.status)
                            ? 'Waiting for confirmation...' 
                            : 'Order is being prepared'}
                        </div>
                      </div>
                    )
                  },
                  {
                    dot: <TruckOutlined style={{ fontSize: 18 }} />,
                    color: ['out_for_delivery', 'shipped', 'delivered'].includes(order.status) ? 'cyan' : 'gray',
                    children: (
                      <div>
                        <Text strong style={{ fontSize: 15 }}>Shipped</Text>
                        <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                          {['out_for_delivery', 'shipped'].includes(order.status)
                            ? 'Package is on the way' 
                            : 'Not yet shipped'}
                        </div>
                      </div>
                    )
                  },
                  {
                    dot: <CheckCircleOutlined style={{ fontSize: 18 }} />,
                    color: order.status === 'delivered' ? 'green' : 'gray',
                    children: (
                      <div>
                        <Text strong style={{ fontSize: 15 }}>Delivered</Text>
                        <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                          {order.status === 'delivered'
                            ? 'Order delivered successfully' 
                            : 'Pending delivery'}
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </Col>

            <Col xs={24} lg={8}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Card size="small" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Order ID</Text>
                    <Text strong copyable style={{ fontSize: 14 }}>
                      {order.orderNumber || order._id}
                    </Text>
                  </Space>
                </Card>

                <Card size="small" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Current Status</Text>
                    <Tag
                      color={getStatusColor(order.status)}
                      style={{ fontSize: 14, padding: '6px 14px', borderRadius: 6 }}
                    >
                      {getStatusLabel(order.status).toUpperCase()}
                    </Tag>
                  </Space>
                </Card>

                <Card size="small" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Payment Status</Text>
                    <Tag
                      color={order.paymentStatus === 'paid' ? 'green' : 'orange'}
                      style={{ fontSize: 14, padding: '6px 14px', borderRadius: 6 }}
                    >
                      {(order.paymentStatus || 'pending').toUpperCase()}
                    </Tag>
                  </Space>
                </Card>

                <Card size="small" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Payment Method</Text>
                    <Text strong style={{ fontSize: 14 }}>
                      {(order.paymentMethod || 'COD').toUpperCase()}
                    </Text>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Order Items */}
        <Card 
          title={
            <span style={{ fontSize: 16 }}>
              <ShoppingCartOutlined /> Order Items ({order.items?.length || 0})
            </span>
          } 
          style={{ marginBottom: 24 }}
        >
          {order.items?.map((item, idx) => (
            <Card
              key={idx}
              size="small"
              style={{ 
                marginBottom: 16, 
                background: '#f9fafb',
                border: '1px solid #e5e7eb'
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Row gutter={16} align="middle">
                <Col xs={6} sm={4} md={3}>
                  <Image
                    src={getProductImage(item)}
                    alt={item.name}
                    style={{ 
                      width: '100%', 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                    fallback="https://dummyimage.com/100x100/667eea/fff&text=Product"
                  />
                </Col>
                <Col xs={18} sm={12} md={13}>
                  <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
                    {item.name || item.productId?.name || 'Product Name'}
                  </Text>
                  <Space split={<Divider type="vertical" />} size="small" wrap>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <strong>Size:</strong> {item.size || 'N/A'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <strong>Color:</strong> {item.color || 'N/A'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <strong>Qty:</strong> {item.quantity || 1}
                    </Text>
                  </Space>
                </Col>
                <Col xs={24} sm={8} md={8} style={{ textAlign: 'right' }}>
                  <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>
                    ₹{Number(item.price || 0).toLocaleString()} × {item.quantity || 1}
                  </Text>
                  <Text strong style={{ fontSize: 20, color: '#667eea' }}>
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </Text>
                </Col>
              </Row>
            </Card>
          ))}

          <Divider style={{ margin: '24px 0' }} />

          {/* Price Summary */}
          <div style={{ padding: '0 16px' }}>
            <Row justify="space-between" style={{ padding: '12px 0', borderBottom: '1px dashed #e5e7eb' }}>
              <Text style={{ fontSize: 15 }}>Subtotal</Text>
              <Text strong style={{ fontSize: 15 }}>
                ₹{Number(order.totalAmount || 0).toLocaleString()}
              </Text>
            </Row>
            <Row justify="space-between" style={{ padding: '12px 0', borderBottom: '1px dashed #e5e7eb' }}>
              <Text style={{ fontSize: 15 }}>Shipping Charges</Text>
              <Text style={{ color: '#10b981', fontSize: 15 }} strong>FREE</Text>
            </Row>
            <Row justify="space-between" style={{ padding: '12px 0', borderBottom: '1px dashed #e5e7eb' }}>
              <Text style={{ fontSize: 15 }}>Tax (Included)</Text>
              <Text style={{ fontSize: 15 }}>₹0</Text>
            </Row>
            <Row justify="space-between" style={{ padding: '16px 0 0 0' }}>
              <Title level={4} style={{ margin: 0 }}>Total Amount</Title>
              <Title level={3} style={{ margin: 0, color: '#667eea' }}>
                ₹{Number(order.totalAmount || 0).toLocaleString()}
              </Title>
            </Row>
          </div>
        </Card>

        {/* Customer & Delivery Info */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card 
              title={<><UserOutlined /> Customer Details</>}
              style={{ height: '100%' }}
            >
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Name">
                  <Text strong>
                    {order.customer?.name || 
                     order.customerId?.name || 
                     order.customerName ||
                     'N/A'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {order.customer?.email || 
                   order.customerId?.email || 
                   order.customerEmail ||
                   'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <PhoneOutlined /> {
                    order.customer?.phone || 
                    order.customerId?.phone || 
                    order.customerPhone ||
                    'N/A'
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Note">
                  {order.customerNote || order.note || 'No special instructions'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card 
              title={<><EnvironmentOutlined /> Delivery Address</>}
              style={{ height: '100%' }}
            >
              <div style={{ 
                padding: 16, 
                background: '#f9fafb', 
                borderRadius: 8,
                minHeight: 120,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 14, lineHeight: 1.8 }}>
                  {order.shippingAddress || 
                   order.deliveryAddress ||
                   order.customer?.address || 
                   'Address not provided'}
                </Text>
              </div>
              
              {order.deliveryDate && (
                <>
                  <Divider style={{ margin: '16px 0' }} />
                  <Space direction="vertical" size={8}>
                    <Text type="secondary">Expected Delivery:</Text>
                    <Text strong style={{ fontSize: 15 }}>
                      {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </Space>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
