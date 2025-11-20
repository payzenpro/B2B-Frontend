import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin } from "antd";
import { ShoppingOutlined, UserOutlined, ShopOutlined, AppstoreOutlined } from "@ant-design/icons";

const API_BASE_URL = 'http://localhost:4000/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
    
      const response = await fetch(`${API_BASE_URL}/auth/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '10px' }}>Welcome to Admin Dashboard</h2>
      <p style={{ color: "#888", marginBottom: '30px' }}>Business Analytics & Overview</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={stats?.totalUsers || 0} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: "#1890ff" }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Vendors" 
              value={stats?.totalVendors || 0} 
              prefix={<ShopOutlined />} 
              valueStyle={{ color: "#52c41a" }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Customers" 
              value={stats?.totalCustomers || 0} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: "#faad14" }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Orders" 
              value={stats?.totalOrders || 0} 
              prefix={<ShoppingOutlined />} 
              valueStyle={{ color: "#f5222d" }} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
