// // import { Layout, Menu, Input, Select, Button, Tabs } from "antd";
// // import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// // import { SearchOutlined, LogoutOutlined, FilterOutlined } from "@ant-design/icons";
// // import { useState } from "react";

// // const { Header, Sider, Content } = Layout;

// // export default function AdminLayout() {
// //   const location = useLocation();
// //   const navigate = useNavigate();
  
// //   const [selectedZone, setSelectedZone] = useState('all');
// //   const [selectedStore, setSelectedStore] = useState('grocery');
// //   const [selectedPeriod, setSelectedPeriod] = useState('year');

// //   let userEmail = 'Admin';
// //   let userRole = 'SUPERADMIN';
  
// //   try {
// //     const userStr = localStorage.getItem('user');
// //     if (userStr) {
// //       const userData = JSON.parse(userStr);
// //       userEmail = userData.email || 'Admin';
// //       userRole = (userData.role || 'superadmin').toUpperCase();
// //     }
// //   } catch (e) {
// //     console.log('User data error:', e);
// //   }

// //   const menuItems = [
// //     { key: '/dashboard', label: <Link to="/dashboard">Dashboard</Link> },
    
// //     { key: 'pos-section', label: 'POS SECTION', type: 'group' },
// //     { key: '/pos', label: <Link to="/pos">New Sale</Link> },
    
// //     { key: 'order-mgmt', label: 'ORDER MANAGEMENT', type: 'group' },
// //     { key: '/orders', label: <Link to="/orders">Orders</Link> },
// //     { key: '/refunds', label: <Link to="/refunds">Order Refunds</Link> },
// //     { key: '/flash-sales', label: <Link to="/flash-sales">Flash Sales</Link> },

// //     { key: 'list-mgmt', label: 'DASHBOARD MANAGEMENT', type: 'group' },
// // //{ key: '/vendor-dashboard/1', label: <Link to="/vendor-dashboard/1">Vendor Dashboard</Link> },
// //     { key: '/vendor-list', label: <Link to="/vendor-list">Vendor List</Link> },
    
// //      //{ key: '/customer-dashboard/1', label: <Link to="/customer-dashboard/1">Customer Dashboard</Link> },
// //      { key: '/customer-list', label: <Link to="/customer-list">Customer List</Link> },


// //     { key: 'promo-mgmt', label: 'PROMOTION MANAGEMENT', type: 'group' },
// //     //{ key: '/campaigns', label: <Link to="/campaigns">Campaigns</Link> },
// //     { key: '/banners', label: <Link to="/banners">Banners</Link> },
// //     { key: '/coupons', label: <Link to="/coupons">Coupons</Link> },
    
// //     { key: 'product-mgmt', label: 'PRODUCT MANAGEMENT', type: 'group' },
// //     { key: '/categories', label: <Link to="/categories">Categories</Link> },
// //     { key: '/attributes', label: <Link to="/attributes">Attributes</Link> },
// //     { key: '/products', label: <Link to="/products">Product Setup</Link> },
    
// //     { key: 'store-mgmt', label: 'STORE MANAGEMENT', type: 'group' },
// //     { key: '/stores', label: <Link to="/stores">Stores List</Link> },
// //     { key: '/stores-new', label: <Link to="/stores/new">New Stores</Link> },
// //    // { key: '/stores-add', label: <Link to="/stores/add">Add Store</Link> }
// //   ];

// //   function handleLogout() {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     navigate('/login');
// //   }

// //   const userInitial = userEmail?.charAt(0).toUpperCase() || 'A';

// //   return (
// //     <Layout style={{ minHeight: '100vh' }}>
// //       <Sider width={260} theme="light" style={{ background: '#fff', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
// //         <div style={{ padding: '16px', fontSize: 18, fontWeight: 700, color: '#1890ff', borderBottom: '1px solid #f0f0f0' }}>
// //           Admin Panel
// //         </div>
// //         <Menu 
// //           mode="inline" 
// //           selectedKeys={[location.pathname]} 
// //           items={menuItems}
// //           style={{ borderRight: 0 }}
// //         />
// //       </Sider>
      
// //       <Layout>
// //        <Header style={{ 
// //   background: '#fff', 
// //   padding: '12px 24px',
// //   display: 'flex', 
// //   gap: 12, 
// //   alignItems: 'center',
// //   borderBottom: '1px solid #f0f0f0',
// //   flexWrap: 'wrap',
// //   height: 'auto',
// //   minHeight: 64
// // }}>
// //   <Input 
// //     prefix={<SearchOutlined />}
// //     placeholder="Search Menu... (Ctrl+K)" 
// //     style={{ width: 180, height: 36 }}
// //     allowClear
// //   />

// //   <Select 
// //     value={selectedStore} 
// //     onChange={setSelectedStore}
// //     style={{ width: 120, height: 36 }}
// //   >
// //     <Select.Option value="grocery">🛒 Grocery</Select.Option>
// //     <Select.Option value="electronics">📱 Electronics</Select.Option>
// //     <Select.Option value="fashion">👗 Fashion</Select.Option>
// //     <Select.Option value="pharmacy">💊 Pharmacy</Select.Option>
// //   </Select>

// //   <Select 
// //     value={selectedZone} 
// //     onChange={setSelectedZone}
// //     style={{ width: 140, height: 36 }}
// //   >
// //     <Select.Option value="all">📍 All Zones</Select.Option>
// //     <Select.Option value="south">🔴 South Delhi</Select.Option>
// //     <Select.Option value="north">🟢 North Delhi</Select.Option>
// //     <Select.Option value="east">🔵 East Delhi</Select.Option>
// //     <Select.Option value="west">🟡 West Delhi</Select.Option>
// //     <Select.Option value="central">⚫ Central Delhi</Select.Option>
// //     <Select.Option value="ncr">🟣 NCR Region</Select.Option>
// //     <Select.Option value="gurugram">🟠 Gurugram</Select.Option>
// //     <Select.Option value="noida">⭐ Noida</Select.Option>
// //   </Select>

// //   <Select 
// //     value={selectedPeriod} 
// //     onChange={setSelectedPeriod}
// //     style={{ width: 130, height: 36 }}
// //   >
// //     <Select.Option value="today">Today</Select.Option>
// //     <Select.Option value="week">This Week</Select.Option>
// //     <Select.Option value="month">This Month</Select.Option>
// //     <Select.Option value="year">This Year</Select.Option>
// //   </Select>

// //   <Button 
// //     icon={<FilterOutlined />}
// //     onClick={() => {
// //       setSelectedZone('all');
// //       setSelectedStore('grocery');
// //       setSelectedPeriod('year');
// //     }}
// //     style={{ height: 36 }}
// //   >
// //     Reset
// //   </Button>

// //   <div style={{ flex: 1 }} />

// //   {/* User Info Section - FIXED CSS */}
// //   <div style={{ 
// //     display: '', 
// //     gap: 16,
// //     alignItems: 'center',
// //     paddingLeft: 16,
// //     borderLeft: '2px solid #f0f0f0'
// //   }}>



// // {/* User Info Container - Avatar + Email/Role + Logout */}
// // <div style={{ 
// //   display: 'flex', 
// //   gap: 12,
// //   alignItems: 'center',
// //   paddingLeft: 16,
// //   borderLeft: '2px solid #f0f0f0'
// // }}>
  
// //   {/* Avatar Circle */}
// //   <div 
// //     style={{ 
// //       width: 42, 
// //       height: 42, 
// //       borderRadius: '50%', 
// //       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
// //       color: '#fff', 
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       fontWeight: 700,
// //       fontSize: 18,
// //       flexShrink: 0,
// //       boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
// //     }}
// //   >
// //     {userInitial}
// //   </div>

// //   {/* User Details */}
// //   <div style={{ 
// //     display: 'flex', 
// //     flexDirection: 'column', 
// //     gap: 2,
// //     justifyContent: 'center'
// //   }}>
// //     <div style={{ 
// //       fontWeight: 600, 
// //       fontSize: 13, 
// //       color: '#000',
// //       letterSpacing: '-0.3px',
// //       lineHeight: '1.2'
// //     }}>
// //       {userEmail}
// //     </div>
// //     <div style={{ 
// //       fontSize: 11, 
// //       color: '#888',
// //       fontWeight: 500,
// //       letterSpacing: '0.5px',
// //       lineHeight: '1.2'
// //     }}>
// //       {userRole}
// //     </div>
// //   </div>

// //   {/* Logout Button */}
// //   <Button 
// //     type="primary"
// //     danger
// //     icon={<LogoutOutlined />}
// //     onClick={handleLogout}
// //     style={{ 
// //       height: 36,
// //       display: 'flex',
// //       alignItems: 'center',
// //       gap: 6,
// //       marginLeft: 8,
// //       fontWeight: 500
// //     }}
// //   >
// //     Logout
// //   </Button>

// // </div>
// // </div>

  
// // </Header>


// //         {(selectedZone !== 'all' || selectedStore !== 'grocery' || selectedPeriod !== 'year') && (
// //           <div style={{ 
// //             background: '#f6f8fb', 
// //             padding: '10px 24px', 
// //             borderBottom: '1px solid #e6eef7',
// //             display: 'flex',
// //             gap: 12,
// //             alignItems: 'center',
// //             flexWrap: 'wrap',
// //             fontSize: 12
// //           }}>
// //             <span style={{ fontWeight: 600, color: '#666' }}>Active Filters:</span>
// //             {selectedZone !== 'all' && (
// //               <span style={{ background: '#fff', padding: '2px 8px', borderRadius: 3, border: '1px solid #d9d9d9' }}>
// //                 Zone: <strong>{selectedZone}</strong>
// //               </span>
// //             )}
// //             {selectedStore !== 'grocery' && (
// //               <span style={{ background: '#fff', padding: '2px 8px', borderRadius: 3, border: '1px solid #d9d9d9' }}>
// //                 Store: <strong>{selectedStore}</strong>
// //               </span>
// //             )}
// //             {selectedPeriod !== 'year' && (
// //               <span style={{ background: '#fff', padding: '2px 8px', borderRadius: 3, border: '1px solid #d9d9d9' }}>
// //                 Period: <strong>{selectedPeriod}</strong>
// //               </span>
// //             )}
// //           </div>
// //         )}
        
// //         <Content style={{ 
// //           padding: 24, 
// //           background: '#f5f5f5', 
// //           minHeight: 'calc(100vh - 200px)',
// //           overflowY: 'auto'
// //         }}>
// //           <Outlet />
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   );
// // }


// import { Layout } from 'antd';
// import { Outlet } from 'react-router-dom';
// import { useState } from 'react';
// import Header from '../common/Header';
// import Sidebar from '../common/Sidebar';
// import { adminMenuItems } from '../../config/menuConfig';

// const { Sider, Content } = Layout;

// export default function AdminLayout() {
//   const [selectedZone, setSelectedZone] = useState('all');
//   const [selectedStore, setSelectedStore] = useState('grocery');
//   const [selectedPeriod, setSelectedPeriod] = useState('year');

//   const filters = {
//     selectedStore,
//     selectedZone,
//     selectedPeriod,
//     stores: [
//       { value: 'grocery', label: '🛒 Grocery' },
//       { value: 'electronics', label: '📱 Electronics' },
//     ],
//     zones: [
//       { value: 'all', label: '📍 All Zones' },
//       { value: 'north', label: '🟢 North' },
//     ],
//     periods: [
//       { value: 'today', label: 'Today' },
//       { value: 'week', label: 'This Week' },
//       { value: 'year', label: 'This Year' },
//     ]
//   };

//   const handleFilterChange = (key, value) => {
//     if (key === 'selectedStore') setSelectedStore(value);
//     if (key === 'selectedZone') setSelectedZone(value);
//     if (key === 'selectedPeriod') setSelectedPeriod(value);
//   };

//   const handleReset = () => {
//     setSelectedZone('all');
//     setSelectedStore('grocery');
//     setSelectedPeriod('year');
//   };

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider width={260} theme="light">
//         <Sidebar menuItems={adminMenuItems} title="Admin Panel" />
//       </Sider>
      
//       <Layout>
//         <Header 
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onReset={handleReset}
//         />
        
//         <Content style={{ 
//           padding: 24, 
//           background: '#f5f5f5', 
//           minHeight: 'calc(100vh - 64px)'
//         }}>
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

