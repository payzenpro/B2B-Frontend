import React, { useState, useEffect } from "react";
import { Carousel, Row, Col, Card, Tag, Button, message, Spin, Tabs, Form, Input, Select, Modal } from "antd";
import { ShoppingCartOutlined, MailOutlined, LockOutlined, UserOutlined, ShopOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const banners = [
  "https://rukminim1.flixcart.com/flap/840/140/image/1c385b84764a68a1.jpg?q=50",
  "https://rukminim1.flixcart.com/flap/840/140/image/50ed17b4bab82560.jpg?q=50",
];

const categories = [
  { name: "Electronics", image: "https://img.icons8.com/color/96/000000/electronics.png", slug: "electronics" },
  { name: "Fashion", image: "https://img.icons8.com/color/96/000000/t-shirt.png", slug: "fashion" },
  { name: "Home & Furniture", image: "https://img.icons8.com/color/96/000000/sofa--v1.png", slug: "furniture" },
  { name: "Appliances", image: "https://img.icons8.com/color/96/000000/washing-machine.png", slug: "appliances" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerRole, setRegisterRole] = useState("customer");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      let res = await fetch(`${API_BASE}/product/public`);
      if (!res.ok && res.status === 404) {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        res = await fetch(`${API_BASE}/product`, { headers });
      }
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const data = await res.json();
      const productList = data.success ? data.data : (Array.isArray(data) ? data : []);
      setProducts(productList);
      if (productList.length === 0) {
        message.info("No products available at the moment");
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const onLoginFinish = async (values) => {
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      message.success("Login successful");
      setModalVisible(false);

      if (data.user.role === "superadmin") navigate("/dashboard");
      else if (data.user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegisterFinish = async (values) => {
    setRegisterLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      message.success("Registration successful. Please login.");
      setActiveTab("login");
    } catch (error) {
      message.error(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

 
  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = existingCart.findIndex(item => item._id === product._id || item.id === product.id);
    if (idx !== -1) {
      existingCart[idx].quantity += 1;
      message.success(`${product.name} quantity increased!`);
    } else {
      existingCart.push({ ...product, quantity: 1 });
      message.success(`${product.name} added to cart!`);
    }
    localStorage.setItem('cart', JSON.stringify(existingCart));
  };

 
  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleVendorLoginClick = () => {
    setModalVisible(true);
    setActiveTab("login");
  };

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#001529",
          padding: "16px 32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        <h2 style={{ color: "white", margin: 0, fontSize: 20 }}>Admin panel </h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Login / Register
          </Button>
          <Button icon={<ShoppingCartOutlined />} onClick={handleCartClick}>
            Cart
          </Button>
          <Button type="default" onClick={handleVendorLoginClick}>
            Vendor Login
          </Button>
        </div>
      </div>
      {/* Login/Register Modal.. */}
      <Modal 
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null} 
        destroyOnClose width={500}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Login" key="login">
            <Form layout="vertical" onFinish={onLoginFinish}>
              <Form.Item name="email" label="Email"
                rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
              >
                <Input prefix={<MailOutlined />} placeholder="email@example.com" />
              </Form.Item>
              <Form.Item name="password" label="Password"
                rules={[{ required: true, message: "Please input your password!" }, { min: 6 }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loginLoading} block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Register" key="register">
            <Form layout="vertical" onFinish={onRegisterFinish}>
              <Form.Item name="role" label="Register as" initialValue="customer" rules={[{ required: true }]}>
                <Select onChange={setRegisterRole}>
                  <Select.Option value="customer">Customer</Select.Option>
                  <Select.Option value="vendor">Vendor</Select.Option>
                  <Select.Option value="superadmin">Superadmin</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="John Doe" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input prefix={<MailOutlined />} placeholder="email@example.com" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} placeholder="9876543210" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              {registerRole === "vendor" && (
                <Form.Item name="storeName" label="Store Name" rules={[{ required: true }]}>
                  <Input prefix={<ShopOutlined />} placeholder="My Store" />
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={registerLoading} block>
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Modal>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
        {/* Banner */}
        <Carousel 
          autoplay 
          autoplaySpeed={3000}
          style={{ marginBottom: 30, borderRadius: 8, overflow: 'hidden' }}
        >
          {banners.map((url, idx) => (
            <div key={idx}>
              <img 
                src={url} alt={`banner-${idx}`} 
                style={{ width: "100%", height: 180, objectFit: "cover", display: 'block' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x180/1890ff/ffffff?text=Banner+Image';
                }}
              />
            </div>
          ))}
        </Carousel>
        {/* Categories */}
        <h2 style={{ marginTop: 30, marginBottom: 20 }}>Shop by Category</h2>
        <Row gutter={[16, 16]}>
          {categories.map((cat) => (
            <Col key={cat.name} xs={12} sm={8} md={6} style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{ 
                padding: 20, background: '#f5f5f5', borderRadius: 8,
                transition: 'all 0.3s'
              }}>
                <img src={cat.image} alt={cat.name} style={{ width: 70, marginBottom: 8 }} />
                <div style={{ fontWeight: 500 }}>{cat.name}</div>
              </div>
            </Col>
          ))}
        </Row>
        {/* Products */}
        <h2 style={{ marginTop: 40, marginBottom: 20 }}>Featured Products for B2B</h2>
        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: '#f9f9f9', borderRadius: 8 }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No products available</p>
            <p style={{ fontSize: 12, color: '#888' }}>Check back later for new products</p>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((prod) => {
              const img = prod.images?.[0] || prod.image || "https://via.placeholder.com/200";
              const price = typeof prod.price === "number" ? prod.price : Number(prod.price) || 0;
              const stock = typeof prod.stock === "number" ? prod.stock : 0;
              const vendorName = prod.vendor?.name || prod.vendorName || "Unknown";

              return (
                <Col key={prod._id || prod.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img 
                        alt={prod.name} 
                        src={img} 
                        style={{ height: 200, objectFit: "contain", padding: 10 }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Product+Image';
                        }}
                      />
                    }
                    actions={[
                      <Button
                        key="cart"
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(prod)}
                        disabled={stock === 0}
                      >
                        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </Button>,
                    ]}
                  >
                    <Meta 
                      title={prod.name}
                      description={`₹${price.toLocaleString()}`}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Tag color="blue">B2B</Tag>
                      {stock > 0 ? (
                        <Tag color="green">In Stock ({stock})</Tag>
                      ) : (
                        <Tag color="red">Out of Stock</Tag>
                      )}
                    </div>
                    <p style={{ fontSize: 12, marginTop: 10, color: '#666' }}>
                      Vendor: <strong>{vendorName}</strong>
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
}
