import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export default function CustomerAuth() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();

  // LOGIN HANDLER
const onLogin = async (values) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    if (!data.user || data.user.role !== 'customer') {
      message.error('This is not a customer account.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    message.success('Login successful!');
    navigate('/');  
  } catch (err) {
    message.error(err.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  // REGISTER HANDLER
  const onRegister = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, role: 'customer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      message.success('Registration successful! Please login.');
      setTab('login');
    } catch (err) {
      message.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
      <Card title="Customer Portal" style={{ width: 400 }}>
        <Tabs activeKey={tab} onChange={setTab} centered>
          <Tabs.TabPane tab="Login" key="login">
            <Form name="login_customer" onFinish={onLogin} layout="vertical">
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="email@example.com" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Login 
                </Button>
                <Button type="link" block onClick={() => setTab('register')}>
                  New customer? Register here
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Register" key="register">
            <Form name="register_customer" onFinish={onRegister} layout="vertical">
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="Your name" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="email@example.com" />
              </Form.Item>
              <Form.Item name="phone" label="Mobile" rules={[{ required: true, len: 10 }]}>
                <Input prefix={<PhoneOutlined />} placeholder="9876543210" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Register 
                </Button>
                <Button type="link" block onClick={() => setTab('login')}>
                  Already have an account? Login
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
