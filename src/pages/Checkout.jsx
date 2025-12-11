import React, { useState, useEffect } from 'react';
import {Card,  Form, Input, Button, Radio,  message,  Row,  Col, Divider,Space, Tag} from 'antd';
import { ShoppingCartOutlined, HomeOutlined, PhoneOutlined, UserOutlined,EnvironmentOutlined,CreditCardOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

export default function Checkout() {
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  useEffect(() => {
    loadCart();
    loadUserData();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      message.warning('Your cart is empty');
      navigate('/cart');
      return;
    }
    setCartItems(cart);
  };

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePlaceOrder = async (values) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login to place order');
        navigate('/login/customer');
        return;
      }

      const shippingAddress = `${values.address}, ${values.city}, ${values.state} - ${values.pincode}`;

      const items = cartItems.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      }));

      const orderData = {
        items: items,
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
        status: 'pending',
        shippingAddress: shippingAddress,
        customerNote: values.notes || '',
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
      };

      console.log(' Placing order:', orderData);

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      message.success(' Order placed successfully!');
      localStorage.removeItem('cart');
      
      setTimeout(() => {
        navigate('/customer/orders');
      }, 1500);

    } catch (error) {
      console.error(' Order error:', error);
      message.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            <ShoppingCartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Checkout
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>Complete your order</p>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card 
              title={
                <Space>
                  <HomeOutlined />
                  <span>Shipping & Payment Details</span>
                </Space>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handlePlaceOrder}
              >
                <Divider orientation="left">Contact Information</Divider>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        { required: true, message: 'Please enter phone number' },
                        { pattern: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' }
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="9876543210" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Enter valid email' }
                  ]}
                >
                  <Input placeholder="john@example.com" size="large" />
                </Form.Item>

                <Divider orientation="left">Shipping Address</Divider>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: 'Please enter address' }]}
                >
                  <TextArea placeholder="House No, Building Name, Street" rows={3} />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="City"
                      name="city"
                      rules={[{ required: true, message: 'Please enter city' }]}
                    >
                      <Input placeholder="Mumbai" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[{ required: true, message: 'Please enter state' }]}
                    >
                      <Input placeholder="Maharashtra" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="PIN Code"
                  name="pincode"
                  rules={[
                    { required: true, message: 'Please enter PIN code' },
                    { pattern: /^[0-9]{6}$/, message: 'Enter valid 6 digit PIN' }
                  ]}
                >
                  <Input placeholder="400001" size="large" style={{ width: 200 }} />
                </Form.Item>

                <Divider orientation="left">
                  <CreditCardOutlined /> Payment Method
                </Divider>

                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Card 
                      hoverable 
                      style={{ 
                        border: paymentMethod === 'COD' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        cursor: 'pointer'
                      }}
                    >
                      <Radio value="COD">
                        <strong>Cash on Delivery (COD)</strong>
                        <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                          Pay when you receive the product
                        </div>
                      </Radio>
                    </Card>

                    <Card 
                      hoverable 
                      style={{ 
                        border: paymentMethod === 'Online' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        cursor: 'pointer',
                        opacity: 0.6
                      }}
                    >
                      <Radio value="Online" disabled>
                        <strong>Online Payment</strong>
                        <Tag color="orange" style={{ marginLeft: 8 }}>Coming Soon</Tag>
                        <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                          Pay via UPI, Card, Net Banking
                        </div>
                      </Radio>
                    </Card>
                  </Space>
                </Radio.Group>

                <Form.Item
                  label="Order Notes (Optional)"
                  name="notes"
                  style={{ marginTop: 24 }}
                >
                  <TextArea placeholder="Any special instructions..." rows={3} />
                </Form.Item>

                <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                  <Space style={{ width: '100%' }}>
                    <Button size="large" onClick={() => navigate('/cart')}>
                      Back to Cart
                    </Button>
                    <Button 
                      type="primary" 
                      size="large" 
                      htmlType="submit"
                      loading={loading}
                      icon={<ShoppingCartOutlined />}
                      style={{ flex: 1 }}
                    >
                      Place Order ₹{calculateTotal().toLocaleString('en-IN')}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card title="Order Summary" style={{ position: 'sticky', top: 20 }}>
              <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
                {cartItems.map((item) => (
                  <div 
                    key={item._id || item.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <img 
                      src={item.image || 'https://via.placeholder.com/60'} 
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 8,
                        background: '#f5f5f5'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        {item.selectedSize} | {item.selectedColor} | Qty: {item.quantity}
                      </div>
                      <div style={{ fontWeight: 600, color: '#1890ff', marginTop: 4 }}>
                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Divider />

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span style={{ fontWeight: 600 }}>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Shipping:</span>
                  <span style={{ color: 'green', fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Tax (18% GST):</span>
                  <span style={{ fontWeight: 600 }}>₹{calculateTax().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Divider style={{ borderColor: '#1890ff' }} />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: 20,
                fontWeight: 700
              }}>
                <span>Total:</span>
                <span style={{ color: '#1890ff' }}>
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ 
                marginTop: 16, 
                padding: 12, 
                background: '#e6f7ff', 
                borderRadius: 8,
                fontSize: 13,
                color: '#0050b3'
              }}>
                <strong>✓ Safe & Secure Checkout</strong>
                <div style={{ marginTop: 4, fontSize: 12 }}>
                  100% money-back guarantee
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
