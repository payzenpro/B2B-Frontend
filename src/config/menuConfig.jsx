import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagsOutlined,
  GiftOutlined,
  SettingOutlined,
} from '@ant-design/icons';


// Superadmin Menu Items
export const adminMenuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  
  { key: 'order-mgmt', label: 'ORDER MANAGEMENT', type: 'group' },
  { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
  { key: '/refunds', icon: <TagsOutlined />, label: 'Refunds' },
  
  { key: 'user-mgmt', label: 'USER MANAGEMENT', type: 'group' },
  { key: '/vendor-list', icon: <UserOutlined />, label: 'Vendors-list' },
  { key: '/customer-list', icon: <UserOutlined />, label: 'Customers-list' },
  
  { key: 'product-mgmt', label: 'PRODUCT MANAGEMENT', type: 'group' },
  { key: '/products', icon: <ShoppingOutlined />, label: 'Products' },
  { key: '/categories', icon: <TagsOutlined />, label: 'Categories' },
  
  { key: 'promo', label: 'PROMOTIONS', type: 'group' },
  { key: '/banners', icon: <GiftOutlined />, label: 'Banners' },
  { key: '/coupons', icon: <GiftOutlined />, label: 'Coupons' },

   { key: 'store-mgmt', label: 'STORE MANAGEMENT', type: 'group' },
   { key: '/stores', label: <GiftOutlined />, label: 'Stores List' },
    { key: '/stores-add', label: <GiftOutlined />, label: 'Add Store' },
];

// Vendor Menu Items
export const vendorMenuItems = [
  { key: '/vendor/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  
  { key: 'products', label: 'PRODUCTS', type: 'group' },
  { key: '/vendor/products', icon: <ShoppingOutlined />, label: 'My Products' },
  { key: '/vendor/categories', icon: <TagsOutlined />, label: 'Categories' },

    { key: 'listing', label: 'LIST MANAGEMENT', type: 'group'},
  { key: '/vendor/customer-list', icon: <TagsOutlined />, label: 'Customer List' },
  
  { key: 'orders', label: 'ORDERS', type: 'group' },
  { key: '/vendor/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
  { key: '/vendor/refunds', icon: <TagsOutlined />, label: 'Refunds' },
  
  { key: 'marketing', label: 'MARKETING', type: 'group' },
  { key: '/vendor/coupons', icon: <GiftOutlined />, label: 'Coupons' },
  { key: '/vendor/banners', icon: <GiftOutlined />, label: 'Banners' },
  { key: '/vendor/notifications', icon: <TagsOutlined />, label: 'Push Notification'},

   { key: 'business', label: 'BUSINESS SECTION', type: 'group' },
   { key: '/vendor/list', icon: <SettingOutlined />, label: 'Store List' },
   { key: '/vendor/new-stores', icon: <SettingOutlined />, label: 'New Stores' },
    { key: '/vendor/shop', icon: <SettingOutlined />, label: 'My Shop' },
    { key: '/vendor/reviews', icon: <SettingOutlined />, label:  'Reviews'},
    { key: '/vendor/chat', icon: <SettingOutlined />, label: 'Chat' },
   
];

// Customer Menu Items
export const customerMenuItems = [
  { key: '/customer/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/customer/products', icon: <ShoppingOutlined />, label: 'Browse Products' },
  { key: '/customer/cart', icon: <ShoppingCartOutlined />, label: 'My Cart' },
  { key: '/customer/orders', icon: <ShoppingCartOutlined />, label: 'My Orders' },
  { key: '/customer/profile', icon: <SettingOutlined />, label: 'Profile' },
];




