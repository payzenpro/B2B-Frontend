
// import { Layout, Menu, Input, Select, Button, Badge } from "antd";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { 
//   DashboardOutlined, ShoppingCartOutlined, ShoppingOutlined,
//   UserOutlined, HeartOutlined, EnvironmentOutlined, LogoutOutlined,
//   SearchOutlined, FilterOutlined
// } from "@ant-design/icons";
// import { useState } from "react";

// const { Header, Sider, Content } = Layout;

// export default function CustomerLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const [cartCount] = useState(3);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedZone, setSelectedZone] = useState('all');
//   const [priceRange, setPriceRange] = useState('all');

//   // Get user from localStorage safely
//   let userEmail = 'Customer';
//   let userRole = 'CUSTOMER';
  
//   try {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const userData = JSON.parse(userStr);
//       userEmail = userData.email || 'Customer';
//       userRole = (userData.role || 'customer').toUpperCase();
//     }
//   } catch (e) {
//     console.log('User data error:', e);
//   }

//   const menuItems = [
//     { key: '/customer/dashboard', icon: <DashboardOutlined />, label: <Link to="/customer/dashboard">Dashboard</Link> },
//     { key: '/customer/products', icon: <ShoppingOutlined />, label: <Link to="/customer/products">Browse Products</Link> },
//     { key: '/customer/cart', icon: <ShoppingCartOutlined />, label: <Link to="/customer/cart"><Badge count={cartCount} offset={[10, 0]}>Cart</Badge></Link> },
//     { key: '/customer/orders', icon: <ShoppingOutlined />, label: <Link to="/customer/orders">My Orders</Link> },
//     { key: '/customer/wishlist', icon: <HeartOutlined />, label: <Link to="/customer/wishlist">Wishlist</Link> },
//     { key: '/customer/addresses', icon: <EnvironmentOutlined />, label: <Link to="/customer/addresses">Addresses</Link> },
//     { key: '/customer/profile', icon: <UserOutlined />, label: <Link to="/customer/profile">Profile</Link> }
//   ];

//   function handleLogout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   }

//   const userInitial = userEmail?.charAt(0).toUpperCase() || 'C';

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <Sider width={260} theme="light" style={{ background: '#fff', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
//         <div style={{ padding: '16px', fontSize: 18, fontWeight: 700, color: '#1890ff', borderBottom: '1px solid #f0f0f0' }}>
//           🛍️ Customer Portal
//         </div>
//         <Menu 
//           mode="inline" 
//           selectedKeys={[location.pathname]} 
//           items={menuItems}
//           style={{ borderRight: 0 }}
//         />
//       </Sider>
      
//       <Layout>
//         {/* TOP HEADER - FILTERS */}
//         <Header style={{ 
//           background: '#fff', 
//           padding: '12px 24px',
//           display: 'flex', 
//           gap: 12, 
//           alignItems: 'center',
//           borderBottom: '1px solid #f0f0f0',
//           flexWrap: 'wrap',
//           height: 'auto',
//           minHeight: 64
//         }}>
//           {/* Search */}
//           <Input 
//             prefix={<SearchOutlined />}
//             placeholder="Search products... (Ctrl+K)" 
//             style={{ width: 200, height: 36 }}
//             allowClear
//           />

//           {/* Category Select */}
//           <Select 
//             value={selectedCategory} 
//             onChange={setSelectedCategory}
//             style={{ width: 150, height: 36 }}
//           >
//             <Select.Option value="all">📦 All Categories</Select.Option>
//             <Select.Option value="electronics">📱 Electronics</Select.Option>
//             <Select.Option value="fashion">👗 Fashion</Select.Option>
//             <Select.Option value="pharmacy">💊 Pharmacy</Select.Option>
//             <Select.Option value="grocery">🛒 Grocery</Select.Option>
//           </Select>

//           {/* Zone Select */}
//           <Select 
//             value={selectedZone} 
//             onChange={setSelectedZone}
//             style={{ width: 140, height: 36 }}
//           >
//             <Select.Option value="all">📍 All Zones</Select.Option>
//             <Select.Option value="south">🔴 South Delhi</Select.Option>
//             <Select.Option value="north">🟢 North Delhi</Select.Option>
//             <Select.Option value="east">🔵 East Delhi</Select.Option>
//             <Select.Option value="west">🟡 West Delhi</Select.Option>
//             <Select.Option value="central">⚫ Central Delhi</Select.Option>
//             <Select.Option value="ncr">🟣 NCR Region</Select.Option>
//             <Select.Option value="gurugram">🟠 Gurugram</Select.Option>
//             <Select.Option value="noida">⭐ Noida</Select.Option>
//           </Select>

//           {/* Price Range Select */}
//           <Select 
//             value={priceRange} 
//             onChange={setPriceRange}
//             style={{ width: 130, height: 36 }}
//           >
//             <Select.Option value="all">💰 All Prices</Select.Option>
//             <Select.Option value="0-500">₹0 - ₹500</Select.Option>
//             <Select.Option value="500-2000">₹500 - ₹2000</Select.Option>
//             <Select.Option value="2000-10000">₹2000 - ₹10000</Select.Option>
//             <Select.Option value="10000+">₹10000+</Select.Option>
//           </Select>

//           {/* Reset Button */}
//           <Button 
//             icon={<FilterOutlined />}
//             onClick={() => {
//               setSelectedZone('all');
//               setSelectedCategory('all');
//               setPriceRange('all');
//             }}
//             style={{ height: 36 }}
//           >
//             Reset
//           </Button>

//           {/* Spacer */}
//           <div style={{ flex: 1, minWidth: 20 }} />

//           {/* USER SECTION */}
//           <div style={{ 
//             display: 'flex', 
//             gap: 12, 
//             alignItems: 'center',
//             paddingLeft: 12,
//             borderLeft: '1px solid #f0f0f0'
//           }}>


//            {/* User Info Container - Avatar + Email/Role + Logout */}
// <div style={{ 
//   display: 'flex', 
//   gap: 12,
//   alignItems: 'center',
//   paddingLeft: 16,
//   borderLeft: '2px solid #f0f0f0'
// }}>
  
//   {/* Avatar Circle */}
//   <div 
//     style={{ 
//       width: 42, 
//       height: 42, 
//       borderRadius: '50%', 
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
//       color: '#fff', 
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontWeight: 700,
//       fontSize: 18,
//       flexShrink: 0,
//       boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
//     }}
//   >
//     {userInitial}
//   </div>

//   {/* User Details */}
//   <div style={{ 
//     display: 'flex', 
//     flexDirection: 'column', 
//     gap: 2,
//     justifyContent: 'center'
//   }}>
//     <div style={{ 
//       fontWeight: 600, 
//       fontSize: 13, 
//       color: '#000',
//       letterSpacing: '-0.3px',
//       lineHeight: '1.2'
//     }}>
//       {userEmail}
//     </div>
//     <div style={{ 
//       fontSize: 11, 
//       color: '#888',
//       fontWeight: 500,
//       letterSpacing: '0.5px',
//       lineHeight: '1.2'
//     }}>
//       {userRole}
//     </div>
//   </div>

//   {/* Logout Button */}
//   <Button 
//     type="primary"
//     danger
//     icon={<LogoutOutlined />}
//     onClick={handleLogout}
//     style={{ 
//       height: 36,
//       display: 'flex',
//       alignItems: 'center',
//       gap: 6,
//       marginLeft: 8,
//       fontWeight: 500
//     }}
//   >
//     Logout
//   </Button>

// </div>
// </div>

//         </Header>

//         {/* Active Filters Info */}
//         {(selectedZone !== 'all' || selectedCategory !== 'all' || priceRange !== 'all') && (
//           <div style={{ 
//             background: '#f6f8fb', 
//             padding: '10px 24px', 
//             borderBottom: '1px solid #e6eef7',
//             display: 'flex',
//             gap: 12,
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             fontSize: 12
//           }}>
//             <span style={{ fontWeight: 600, color: '#666' }}>🔎 Active Filters:</span>
//             {selectedZone !== 'all' && (
//               <span style={{ 
//                 background: '#fff', 
//                 padding: '2px 8px', 
//                 borderRadius: 3, 
//                 border: '1px solid #d9d9d9'
//               }}>
//                 Zone: <strong>{selectedZone}</strong>
//               </span>
//             )}
//             {selectedCategory !== 'all' && (
//               <span style={{ 
//                 background: '#fff', 
//                 padding: '2px 8px', 
//                 borderRadius: 3, 
//                 border: '1px solid #d9d9d9'
//               }}>
//                 Category: <strong>{selectedCategory}</strong>
//               </span>
//             )}
//             {priceRange !== 'all' && (
//               <span style={{ 
//                 background: '#fff', 
//                 padding: '2px 8px', 
//                 borderRadius: 3, 
//                 border: '1px solid #d9d9d9'
//               }}>
//                 Price: <strong>{priceRange}</strong>
//               </span>
//             )}
//           </div>
//         )}
        
//         {/* MAIN CONTENT */}
//         <Content style={{ 
//           padding: 24, 
//           background: '#f5f5f5', 
//           minHeight: 'calc(100vh - 200px)',
//           overflowY: 'auto'
//         }}>
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }
