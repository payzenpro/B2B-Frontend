// import { useEffect, useState } from "react";
// import { Card, Col, Row, Statistic, Spin } from "antd";
// import { ShoppingOutlined, UserOutlined, ShopOutlined, AppstoreOutlined } from "@ant-design/icons";

// const API_BASE_URL = 'http://localhost:4000/api';

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
    
//       const response = await fetch(`${API_BASE_URL}/auth/analytics`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setStats(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
//   }

//   return (
//     <div>
//       <h2 style={{ marginBottom: '10px' }}>Welcome to Admin Dashboard</h2>
//       <p style={{ color: "#888", marginBottom: '30px' }}>Business Analytics & Overview</p>

//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic 
//               title="Total Users" 
//               value={stats?.totalUsers || 0} 
//               prefix={<UserOutlined />} 
//               valueStyle={{ color: "#1890ff" }} 
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic 
//               title="Total Vendors" 
//               value={stats?.totalVendors || 0} 
//               prefix={<ShopOutlined />} 
//               valueStyle={{ color: "#52c41a" }} 
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic 
//               title="Total Customers" 
//               value={stats?.totalCustomers || 0} 
//               prefix={<UserOutlined />} 
//               valueStyle={{ color: "#faad14" }} 
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic 
//               title="Total Orders" 
//               value={stats?.totalOrders || 0} 
//               prefix={<ShoppingOutlined />} 
//               valueStyle={{ color: "#f5222d" }} 
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin, Alert } from "antd";
import { ShoppingOutlined, UserOutlined, ShopOutlined, AppstoreOutlined } from "@ant-design/icons";

const API_BASE_URL = 'http://localhost:4000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn("No token found, using default stats");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/analytics`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is ok
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Analytics endpoint not found, using default stats");
          setError("Analytics data not available");
          setLoading(false);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setStats(data.data);
      } else {
        console.warn("Invalid response structure:", data);
        setError("Invalid analytics data format");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "Failed to fetch dashboard data");
      
      // Use default stats even on error
      setStats({
        totalUsers: 0,
        totalVendors: 0,
        totalCustomers: 0,
        totalOrders: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: "#888" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: '8px' }}>Welcome to Admin Dashboard</h2>
        <p style={{ color: "#888", margin: 0 }}>Business Analytics & Overview</p>
        
        {error && (
          <Alert
            message="Analytics Info"
            description={error}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <button onClick={refreshData} style={{ padding: 4, border: '1px solid #1890ff', borderRadius: 4, background: 'none', color: '#1890ff' }}>
                Refresh
              </button>
            }
          />
        )}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={stats.totalUsers || 0} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: "#1890ff" }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Vendors" 
              value={stats.totalVendors || 0} 
              prefix={<ShopOutlined />} 
              valueStyle={{ color: "#52c41a" }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Customers" 
              value={stats.totalCustomers || 0} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: "#faad14" }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Orders" 
              value={stats.totalOrders || 0} 
              prefix={<ShoppingOutlined />} 
              valueStyle={{ color: "#f5222d" }} 
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <button 
          onClick={refreshData} 
          style={{
            padding: '8px 16px',
            border: '1px solid #1890ff',
            borderRadius: 6,
            background: 'white',
            color: '#1890ff',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}
