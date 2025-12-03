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
      navigate('/customer/dashboard');
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

  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40}}>
  //       <Card title="Customer Portal" style={{ width: 400 ,textAlign:'center',boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  // }}>
  //         <Tabs activeKey={tab} onChange={setTab} centered>
  //           <Tabs.TabPane tab="Login" key="login">
  //             <Form name="login_customer" onFinish={onLogin} layout="vertical">
  //               <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
  //                 <Input prefix={<MailOutlined />} placeholder="email@example.com" />
  //               </Form.Item>
  //               <Form.Item name="password" label="Password" rules={[{ required: true }]}>
  //                 <Input.Password prefix={<LockOutlined />} placeholder="Password" />
  //               </Form.Item>
  //               <Form.Item>
  //                 <Button type="primary" htmlType="submit" loading={loading} block>
  //                   Login 
  //                 </Button>
  //                 <Button type="link" block onClick={() => setTab('register')}>
  //                   New customer? Register here
  //                 </Button>
  //               </Form.Item>
  //             </Form>
  //           </Tabs.TabPane>
  //           <Tabs.TabPane tab="Register" key="register">
  //             <Form name="register_customer" onFinish={onRegister} layout="vertical">
  //               <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
  //                 <Input prefix={<UserOutlined />} placeholder="Your name" />
  //               </Form.Item>
  //               <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
  //                 <Input prefix={<MailOutlined />} placeholder="email@example.com" />
  //               </Form.Item>
  //               <Form.Item name="phone" label="Mobile" rules={[{ required: true, len: 10 }]}>
  //                 <Input prefix={<PhoneOutlined />} placeholder="9876543210" />
  //               </Form.Item>
  //               <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
  //                 <Input.Password prefix={<LockOutlined />} placeholder="Password" />
  //               </Form.Item>
  //               <Form.Item>
  //                 <Button type="primary" htmlType="submit" loading={loading} block>
  //                   Register 
  //                 </Button>
  //                 <Button type="link" block onClick={() => setTab('login')}>
  //                   Already have an account? Login
  //                 </Button>
  //               </Form.Item>
  //             </Form>
  //           </Tabs.TabPane>
  //         </Tabs>
  //       </Card>
  //     </div>
  //   );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

      }}
    >
      <Card
        title="Customer Portal"
        style={{
          width: 420,
          textAlign: "center",
          borderRadius: 12,
          padding: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",

        }}
        // onMouseEnter={(e) => {
        //   e.currentTarget.style.transform = "scale(1.02)";
        //   e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
        // }}
        // onMouseLeave={(e) => {
        //   e.currentTarget.style.transform = "scale(1)";
        //   e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
        // }}
      >
        <Tabs activeKey={tab} onChange={setTab} centered animated>
          {/* Login Tab */}
          <Tabs.TabPane tab="Login" key="login" >
            <Form name="login_customer" onFinish={onLogin} layout="vertical">
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true }]} >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ background: "#7132CA", borderColor: "#7132CA" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#9B5DE0"; // darker purple
                    e.currentTarget.style.borderColor = "#9B5DE0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#7132CA"; // original color
                    e.currentTarget.style.borderColor = "#7132CA";
                  }}
                >
                  Login
                </Button>
                <Button type="link" block onClick={() => setTab("register")} style={{ color: "black" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9B5DE0"; // darker purple
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "black"; // original color

                  }}>
                  New customer? Register here
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          {/* Register Tab */}
          {/* <Tabs.TabPane tab="Register" key="register">
          <Form name="register_customer" onFinish={onRegister} layout="vertical">
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Your name" size="large" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
            </Form.Item>
            <Form.Item name="phone" label="Mobile" rules={[{ required: true, len: 10 }]}>
              <Input prefix={<PhoneOutlined />} placeholder="9876543210" size="large" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ background: "#7132CA"}}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#9B5DE0"; // darker purple
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#7132CA"; // original color
  }}>
                Register
              </Button>
              <Button type="link" block onClick={() => setTab("login")} style={{ color: "black" }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#9B5DE0"; // darker purple
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "black"; // original color
  }}>
                Already have an account? Login
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane> */}



          <Tabs.TabPane tab="Register" key="register">
            <Form
              name="register_customer"
              onFinish={onRegister}
              layout="vertical"
              style={{ marginTop: -22 }} // pulls content up
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true }]}
                style={{ marginBottom: 6 }} // reduced spacing
              >
                <Input prefix={<UserOutlined />} placeholder="Your name" size="small" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
                style={{ marginBottom: 6 }}
              >
                <Input prefix={<MailOutlined />} placeholder="email@example.com" size="small" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Mobile"
                rules={[{ required: true, len: 10 }]}
                style={{ marginBottom: 6 }}
              >
                <Input prefix={<PhoneOutlined />} placeholder="9876543210" size="small" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 6 }]}
                style={{ marginBottom: 10 }}
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
                  style={{ background: "#7132CA", transition: "0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#9B5DE0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#7132CA")}
                >
                  Register
                </Button>

                <Button
                  type="link"
                  block
                  onClick={() => setTab("login")}
                  style={{ color: "black", paddingTop: 2 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#9B5DE0")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
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
