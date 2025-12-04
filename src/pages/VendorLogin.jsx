import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export default function VendorAuth() {
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
      if (!data.user || data.user.role !== 'vendor') {
        message.error('This is not a vendor account. Please use vendor credentials.');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('Login successful! Redirecting to vendor dashboard');
      navigate('/vendor/dashboard');
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
        body: JSON.stringify({ ...values, role: 'vendor' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      message.success('Vendor registration successful! Now login.');
      setTab('login');
    } catch (err) {
      message.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: 551
    }}>
      <Card title="Vendor Portal" style={{ width: 400, textAlign: 'center' }}>
        <Tabs activeKey={tab} onChange={setTab} centered>
          <Tabs.TabPane tab="Login" key="login">
            <Form name="login_vendor" onFinish={onLogin} layout="vertical">
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="vendor@example.com" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ background: "#7132CA", borderColor: "#7132CA" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#9B5DE0"; // darker purple
                    e.currentTarget.style.borderColor = "#9B5DE0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#7132CA"; // original color
                    e.currentTarget.style.borderColor = "#7132CA";
                  }}>
                  Login as Vendor
                </Button>
                <Button type="link" block onClick={() => setTab('register')} style={{ color: "black" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9B5DE0"; // darker purple
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "black"; // original color

                  }}>
                  New vendor? Register here
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="Register" key="register">
            <Form name="register_vendor" onFinish={onRegister} layout="vertical">
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="Vendor name" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="vendor@example.com" />
              </Form.Item>
              <Form.Item name="phone" label="Mobile" rules={[{ required: true, len: 10 }]}>
                <Input prefix={<PhoneOutlined />} placeholder="9876543210" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Register as Vendor
                </Button>
                <Button type="link" block onClick={() => setTab('login')}>
                  Already have an account? Login
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane> */}

          <Tabs.TabPane tab="Register" key="register">
            <Form
              name="register_vendor"
              onFinish={onRegister}
              layout="vertical"
              style={{ marginTop: -12 }}  // reduces space below tab
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true }]}
                style={{ marginBottom: 8 }}  // reduces form item height
              >
                <Input prefix={<UserOutlined />} placeholder="Vendor name" size="small" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
                style={{ marginBottom: 8 }}
              >
                <Input prefix={<MailOutlined />} placeholder="vendor@example.com" size="small" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Mobile"
                rules={[{ required: true, len: 10 }]}
                style={{ marginBottom: 8 }}
              >
                <Input prefix={<PhoneOutlined />} placeholder="9876543210" size="small" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 6 }]}
                style={{ marginBottom: 12 }}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="small" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="middle"
                  style={{ padding: "4px 0" }} // reduces button height
                >
                  Register as Vendor
                </Button>

                <Button
                  type="link"
                  block
                  onClick={() => setTab("login")}
                  style={{ paddingTop: 2 }}
                >
                  Already have an account? Login
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>



        </Tabs>
      </Card>
      <div >
        <Link to="/login/superadmin" style={{ color: "white", textDecoration: "none" }}>Login to Superadmin Panel</Link>
      </div>
    </div>
  );
}
