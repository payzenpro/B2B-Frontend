// import { Layout, Menu, Input, Select, Button } from "antd";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { 
//   DashboardOutlined, ShoppingCartOutlined, ShoppingOutlined, 
//   TagsOutlined, GiftOutlined, TeamOutlined, FileTextOutlined, SettingOutlined,
//   ShopOutlined, StarOutlined, MessageOutlined, LogoutOutlined,
//   TagOutlined, SearchOutlined, FilterOutlined
// } from "@ant-design/icons";
// import { useState } from "react";

// const { Header, Sider, Content } = Layout;

// export default function VendorLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const [selectedZone, setSelectedZone] = useState('all');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedPeriod, setSelectedPeriod] = useState('month');

//   // Get user from localStorage safely
//   let userEmail = 'Vendor';
//   let userRole = 'VENDOR';
  
//   try {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const userData = JSON.parse(userStr);
//       userEmail = userData.email || 'Vendor';
//       userRole = (userData.role || 'vendor').toUpperCase();
//     }
//   } catch (e) {
//     console.log('User data error:', e);
//   }

//   const menuItems = [
//     { key: '/vendor/dashboard', icon: <DashboardOutlined />, label: <Link to="/vendor/dashboard">Dashboard</Link> },
    
//     { key: 'pos-group', label: "POS MANAGEMENT", type: 'group'},
//     { key: '/vendor/pos', icon: <ShoppingCartOutlined />, label: <Link to="/vendor/pos">New Sale</Link> },

//      { key: 'listing', label: "LIST MANAGEMENT", type: 'listing'},
//     { key: '/vendor/customer-list', icon: <TagsOutlined />, label: <Link to="/vendor/customer-list">Customer List</Link> },
   
  

//     { key: 'order-mgmt', label: 'ORDER MANAGEMENT', type: 'group' },
//     { key: '/vendor/orders', icon: <ShoppingOutlined />, label: <Link to="/vendor/orders">Orders</Link> },
//     { key: '/vendor/order-refunds', icon: <ShoppingOutlined />, label: <Link to="/vendor/order-refunds">Order Refunds</Link> },
//     { key: '/vendor/flash-sales', icon: <ShoppingOutlined />, label: <Link to="/vendor/flash-sales">Flash Sales</Link> },

//     { key: 'marketing', label: 'MARKETING SECTION', type: 'group' },
//     { key: '/vendor/coupons', icon: <TagsOutlined />, label: <Link to="/vendor/coupons">Coupons</Link> },
//     { key: '/vendor/banners', icon: <TagsOutlined />, label: <Link to="/vendor/banners">Banners</Link> },
//     { key: '/vendor/notifications', icon: <TagsOutlined />, label: <Link to="/vendor/notifications">Push Notification</Link> },

//     { key: 'product', label: 'PRODUCT MANAGEMENT', type: 'group' },
//     { key: '/vendor/categories', icon: <TagOutlined />, label: <Link to="/vendor/categories">Categories</Link> },
//     { key: '/vendor/attributes', icon: <TagOutlined />, label: <Link to="/vendor/attributes">Attributes</Link> },
//     { key: '/vendor/product-setup', icon: <TagsOutlined />, label: <Link to="/vendor/product-setup">Product Setup</Link> },

//     { key: 'store-mgmt', label: 'STORE MANAGEMENT', type: 'group' },
//     { key: '/vendor/new-stores', icon: <FileTextOutlined />, label: <Link to="/vendor/new-stores">New Stores</Link> },
//     { key: '/vendor/stores-list', icon: <TagOutlined />, label: <Link to="/vendor/stores-list">Stores List</Link> },
//     { key: '/vendor/bulk-import', icon: <TagsOutlined />, label: <Link to="/vendor/bulk-import">Bulk Import</Link> },
//     { key: '/vendor/bulk-export', icon: <TeamOutlined />, label: <Link to="/vendor/bulk-export">Bulk Export</Link> },

//     { key: 'business', label: 'BUSINESS SECTION', type: 'group' },
//     { key: '/vendor/config', icon: <SettingOutlined />, label: <Link to="/vendor/config">Store Config</Link> },
//     { key: '/vendor/shop', icon: <ShopOutlined />, label: <Link to="/vendor/shop">My Shop</Link> },
//     { key: '/vendor/reviews', icon: <StarOutlined />, label: <Link to="/vendor/reviews">Reviews</Link> },
//     { key: '/vendor/chat', icon: <MessageOutlined />, label: <Link to="/vendor/chat">Chat</Link> }
//   ];

//   function handleLogout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   }

//   const userInitial = userEmail?.charAt(0).toUpperCase() || 'V';

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <Sider width={260} theme="light" style={{ background: '#fff', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
//         <div style={{ padding: '16px', fontSize: 18, fontWeight: 700, color: '#1890ff', borderBottom: '1px solid #f0f0f0' }}>
//            Vendor Panel
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
//             placeholder="Search Menu... (Ctrl+K)" 
//             style={{ width: 180, height: 36 }}
//             allowClear
//           />

//           {/* Category Select */}
//           <Select 
//             value={selectedCategory} 
//             onChange={setSelectedCategory}
//             style={{ width: 140, height: 36 }}
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

//           {/* Period Select */}
//           <Select 
//             value={selectedPeriod} 
//             onChange={setSelectedPeriod}
//             style={{ width: 130, height: 36 }}
//           >
//             <Select.Option value="today">Today</Select.Option>
//             <Select.Option value="week">This Week</Select.Option>
//             <Select.Option value="month">This Month</Select.Option>
//             <Select.Option value="year">This Year</Select.Option>
//           </Select>

//           {/* Reset Button */}
//           <Button 
//             icon={<FilterOutlined />}
//             onClick={() => {
//               setSelectedZone('all');
//               setSelectedCategory('all');
//               setSelectedPeriod('month');
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
//   </div>

// </div>

//         </Header>

//         {/* Active Filters Info */}
//         {(selectedZone !== 'all' || selectedCategory !== 'all' || selectedPeriod !== 'month') && (
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
//             {selectedPeriod !== 'month' && (
//               <span style={{ 
//                 background: '#fff', 
//                 padding: '2px 8px', 
//                 borderRadius: 3, 
//                 border: '1px solid #d9d9d9'
//               }}>
//                 Period: <strong>{selectedPeriod}</strong>
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
