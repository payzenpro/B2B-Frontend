import { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Select, Alert, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined, UserOutlined, ShopOutlined, PhoneOutlined } from '@ant-design/icons';




const API_BASE_URL = 'http://localhost:4000/api';
const AUTH_API_URL = `${API_BASE_URL}/auth`;

export default function Auth() {
  
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerRole, setRegisterRole] = useState('customer');

  // Handle Login
  const handleLogin = async values => {
    setLoginLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || 'Login failed');
        return;
      }
      if (!data.token || !data.user) {
        message.error('Invalid response');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user._id);

      message.success('Login successful!');
      setTimeout(() => {
          const role = data.user.role;
          if (role === 'superadmin') navigate('/dashboard');
         else if (role === 'vendor') navigate('/vendor/dashboard');
         else if (role === 'customer') navigate('/customer/dashboard');
         else {
          message.error('Unknown user role');
           navigate('/auth');
         }
         
      }, 500);
    } catch (error) {
      message.error('Error: ' + error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async values => {
    setRegisterLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          role: values.role,
          storeName: values.storeName,
          gstNumber: values.gstNumber,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        message.error(data.message || 'Registration failed');
        return;
      }
      message.success('Registration successful! Please login.');
      registerForm.resetFields();
    } catch (error) {
      message.error('Error: ' + error.message);
    } finally {
      setRegisterLoading(false);
    }
  };


  const handleDemoLogin = (email, password) => {
    loginForm.setFieldsValue({ email, password });
    setTimeout(() => handleLogin({ email, password }), 100);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          borderRadius: '10px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ margin: 0, color: '#667eea', marginBottom: 8, fontSize: 28 }}>
            Admin Panel
          </h1>
          <p style={{ color: '#999', margin: 0, fontSize: 14 }}>Multi-Vendor E-Commerce Platform</p>
        </div>

        {/* Tabs */}
        <Tabs
          items={[
            {
              key: 'login',
              label: ' Login',
              children: (
                <>
                  <Alert
                    message="Login with email + password"
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                  />
                  <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Invalid email' },
                      ]}
                    >
                      <Input
                        placeholder="email@example.com"
                        size="large"
                        prefix={<MailOutlined />}
                        disabled={loginLoading}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Minimum 6 characters' },
                      ]}
                    >
                      <Input.Password
                        placeholder="••••••••"
                        size="large"
                        prefix={<LockOutlined />}
                        disabled={loginLoading}
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loginLoading}
                      size="large"
                      style={{ height: 40, fontSize: 16, background: '#667eea' }}
                    >
                      {loginLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>

                  {/* Demo Credentials */}
                  {/* Uncomment below divs to enable demo login */}
                  {/* <Divider>Demo Credentials (Click to fill)</Divider> */}
                  {/* <div
                    style={{
                      fontSize: 12,
                      lineHeight: 2.2,
                      marginBottom: 12,
                      cursor: 'pointer',
                      border: '1px solid #e0e0e0',
                      padding: '10px 12px',
                      borderRadius: 6,
                      fontFamily: 'monospace',
                    }}
                    onClick={() => handleDemoLogin('admin@platform.com', 'Admin@123')}
                  >
                    👨‍💼 Superadmin:<br />
                    📧 admin@platform.com<br />
                    🔑 Admin@123
                  </div> */}
                  {/* <div
                    style={{
                      fontSize: 12,
                      lineHeight: 2.2,
                      marginBottom: 12,
                      cursor: 'pointer',
                      border: '1px solid #e0e0e0',
                      padding: '10px 12px',
                      borderRadius: 6,
                      fontFamily: 'monospace',
                    }}
                    onClick={() => handleDemoLogin('vendor@electronics.com', 'Vendor@123')}
                  >
                    🏪 Vendor:<br />
                    📧 vendor@electronics.com<br />
                    🔑 Vendor@123
                  </div> */}
                  {/* <div
                    style={{
                      fontSize: 12,
                      lineHeight: 2.2,
                      marginBottom: 12,
                      cursor: 'pointer',
                      border: '1px solid #e0e0e0',
                      padding: '10px 12px',
                      borderRadius: 6,
                      fontFamily: 'monospace',
                    }}
                    onClick={() => handleDemoLogin('customer@gmail.com', 'Customer@123')}
                  >
                    👥 Customer:<br />
                    📧 customer@gmail.com<br />
                    🔑 Customer@123
                  </div> */}
                </>
              ),
            },
            {
              key: 'register',
              label: ' Register',
              children: (
                <>
                  <Alert
                    message="Register with all details"
                    type="success"
                    showIcon
                    style={{ marginBottom: 20 }}
                  />
                  <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
                    <Form.Item name="role" label="Register as" initialValue="customer">
                      <Select onChange={setRegisterRole}>
                        <Select.Option value="customer"> Customer</Select.Option>
                        <Select.Option value="vendor"> Vendor</Select.Option>
                        <Select.Option value="superadmin"> Superadmin</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: 'Please enter name' }]}
                    >
                      <Input
                        placeholder="John Doe"
                        size="large"
                        prefix={<UserOutlined />}
                        disabled={registerLoading}
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Invalid email' },
                      ]}
                    >
                      <Input
                        placeholder="email@example.com"
                        size="large"
                        prefix={<MailOutlined />}
                        disabled={registerLoading}
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please enter phone' }]}
                    >
                      <Input
                        placeholder="9876543210"
                        size="large"
                        prefix={<PhoneOutlined />}
                        disabled={registerLoading}
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Minimum 6 characters' },
                      ]}
                    >
                      <Input.Password
                        placeholder="••••••••"
                        size="large"
                        prefix={<LockOutlined />}
                        disabled={registerLoading}
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      rules={[
                        { required: true, message: 'Please confirm password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="••••••••"
                        size="large"
                        prefix={<LockOutlined />}
                        disabled={registerLoading}
                      />
                    </Form.Item>

                    {registerRole === 'vendor' && (
                      <>
                        <Form.Item
                          name="storeName"
                          label="Store Name"
                          rules={[{ required: true, message: 'Please enter store name' }]}
                        >
                          <Input
                            placeholder="My Store"
                            size="large"
                            prefix={<ShopOutlined />}
                            disabled={registerLoading}
                          />
                        </Form.Item>
                        <Form.Item name="gstNumber" label="GST Number">
                          <Input
                            placeholder="18AABCU1234A1Z0"
                            size="large"
                            disabled={registerLoading}
                          />
                        </Form.Item>
                      </>
                    )}

                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={registerLoading}
                      size="large"
                      style={{ height: 40, fontSize: 16, background: '#667eea' }}
                    >
                      {registerLoading ? 'Registering...' : 'Register'}
                    </Button>
                  </Form>
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
