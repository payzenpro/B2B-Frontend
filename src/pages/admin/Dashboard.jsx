
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Statistic, Select } from 'antd';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,        
  AppstoreOutlined,   
  InboxOutlined,       
  BoxPlotOutlined,    
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';

const { Option } = Select;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  const API_BASE = 'http://localhost:4000/api';

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

    
      const ordersRes = await fetch(`${API_BASE}/orders`, { headers });
      const ordersJson = await ordersRes.json();
      const orders = ordersJson.data || ordersJson.orders || [];

      const productsRes = await fetch(`${API_BASE}/product`, { headers });
      const productsJson = await productsRes.json();
      const products = productsJson.data || [];

      let customers = [];
      try {
        const customersRes = await fetch(`${API_BASE}/user/customers`, { headers });
        const customersJson = await customersRes.json();
        customers = customersJson.data || [];
      } catch (err) {
        console.log('Customers API not available');
      }

   
      processChartsData(orders, products, customers);

    } catch (error) {
      console.error('Dashboard error:', error);
      setLoading(false);
    }
  };

  const processChartsData = (orders, products, customers) => {
  
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    
   
    const uniqueCustomers = customers.length || 
      new Set(orders.map(o => o.customerId || o.customer?._id).filter(Boolean)).size;

    setStats({
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      totalCustomers: uniqueCustomers,
      totalProducts: products.length
    });

   
    const ordersByDate = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      });
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });
    
    const ordersChartData = Object.keys(ordersByDate).map(date => ({
      date,
      orders: ordersByDate[date]
    })).slice(-7);
    setOrdersData(ordersChartData);

  
    const revenueByDate = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      });
      revenueByDate[date] = (revenueByDate[date] || 0) + Number(order.totalAmount || 0);
    });
    
    const revenueChartData = Object.keys(revenueByDate).map(date => ({
      date,
      revenue: revenueByDate[date]
    })).slice(-7);
    setRevenueData(revenueChartData);

  
    const categoryCount = {};
    products.forEach(product => {
      const cat = product.category || 'Unknown';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    const categoryChartData = Object.keys(categoryCount).map(category => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count: categoryCount[category]
    }));
    setCategoryData(categoryChartData);

    const statusCount = {};
    orders.forEach(order => {
      const status = order.status || 'pending';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    const statusChartData = Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCount[status]
    }));
    setStatusData(statusChartData);

    setLoading(false);
  };


  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
  const STATUS_COLORS = {
    Pending: '#faad14',
    Unassigned: '#d9d9d9',
    Processing: '#1890ff',
    Shipped: '#13c2c2',
    Delivered: '#52c41a',
    Cancelled: '#ff4d4f'
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
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24 
        }}>
          <h1 style={{ margin: 0 }}> Dashboard Analytics</h1>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 150 }}
            size="large"
          >
            <Option value="today">Today</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
          </Select>
        </div>

        {/* 📊 Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white' }}>Total Orders</span>}
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined style={{ color: 'white' }} />}
                valueStyle={{ color: 'white', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                border: 'none'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white' }}>Total Revenue</span>}
                value={stats.totalRevenue}
                prefix={<span style={{ color: 'white' }}>₹</span>}
                valueStyle={{ color: 'white', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white' }}>Total Customers</span>}
                value={stats.totalCustomers}
                prefix={<UserOutlined style={{ color: 'white' }} />}
                valueStyle={{ color: 'white', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white' }}>Total Products</span>}
                value={stats.totalProducts}
                // ✅ USE THIS INSTEAD OF PackageOutlined
                prefix={<AppstoreOutlined style={{ color: 'white' }} />}
                valueStyle={{ color: 'white', fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>

        {/* 📈 Charts Row 1 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
       
          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>📈 Orders Trend (Last 7 Days)</span>}
              style={{ borderRadius: 12 }}
            >
              {ordersData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                  No orders data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>

    
          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>💰 Revenue Trend (Last 7 Days)</span>}
              style={{ borderRadius: 12 }}
            >
              {revenueData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                  No revenue data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#52c41a" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>
        </Row>

        {/* 📊 Charts Row 2 */}
        <Row gutter={[16, 16]}>
       
          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>🏷️ Products by Category</span>}
              style={{ borderRadius: 12 }}
            >
              {categoryData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                  No category data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>

     
          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>📦 Orders by Status</span>}
              style={{ borderRadius: 12 }}
            >
              {statusData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                  No status data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
