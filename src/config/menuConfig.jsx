import {DashboardOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined, TagsOutlined, GiftOutlined, SettingOutlined, HomeOutlined,} from '@ant-design/icons';
import { icons } from 'antd/es/image/PreviewGroup';


// Superadmin Menu Items
export const adminMenuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  
  { key: 'order-mgmt', label: 'ORDER MANAGEMENT', type: 'group' },
  { key: '/dashboard/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
  { key: '/dashboard/refunds', icon: <TagsOutlined />, label: 'Refunds' },
  
  { key: 'user-mgmt', label: 'USER MANAGEMENT', type: 'group' },
  { key: '/dashboard/vendor-list', icon: <UserOutlined />, label: 'Vendor-list' },
  { key: '/dashboard/customer-list', icon: <UserOutlined />, label: 'Customers-list' },
  
  { key: 'product-mgmt', label: 'PRODUCT MANAGEMENT', type: 'group' },
  { key: '/dashboard/products', icon: <ShoppingOutlined />, label: 'Products' },
  { key: '/dashboard/categories', icon: <TagsOutlined />, label: 'Categories' },
  
  { key: 'promo', label: 'PROMOTIONS', type: 'group' },
  { key: '/dashboard/banners', icon: <GiftOutlined />, label: 'Banners' },
  { key: '/dashboard/coupons', icon: <GiftOutlined />, label: 'Coupons' },

   { key: 'store-mgmt', label: 'STORE MANAGEMENT', type: 'group' },
   { key: '/dashboard/stores', icon: <SettingOutlined  />, label: 'Stores List' },
    { key: '/dashboard/stores-add', icon: <SettingOutlined  />, label: 'Add Store' },
];

// Vendor Menu Items
export const vendorMenuItems = [
  { key: '/vendor/dashboard', icon: <DashboardOutlined />, label: 'VendorDashboard' },
  
  { key: 'products', label: 'PRODUCTS', type: 'group' },
  { key: '/vendor/dashboard/products', icon: <ShoppingOutlined />, label: 'Products' },
  { key: '/vendor/dashboard/categories', icon: <TagsOutlined />, label: 'Categories' },

    { key: 'listing', label: 'LIST MANAGEMENT', type: 'group'},
  { key: '/vendor/dashboard/customer-list', icon: <TagsOutlined />, label: 'Customer List' },
  
  
  { key: 'orders', label: 'ORDERS', type: 'group' },
  { key: '/vendor/dashboard/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
  { key: '/vendor/dashboard/refunds', icon: <TagsOutlined />, label: 'Refunds' },
  
  { key: 'marketing', label: 'MARKETING', type: 'group' },
  { key: '/vendor/dashboard/coupons', icon: <GiftOutlined />, label: 'Coupons' },
  { key: '/vendor/dashboard/banners', icon: <GiftOutlined />, label: 'Banners' },
  { key: '/vendor/dashboard/notifications', icon: <TagsOutlined />, label: 'Push Notification'},

   { key: 'business', label: 'BUSINESS SECTION', type: 'group' },
   { key: '/vendor/dashboard/stores', icon: <SettingOutlined />, label: 'Store List' },
   { key: '/vendor/dashboard/add stores', icon: <SettingOutlined />, label: 'Add Stores' },
    { key: '/vendor/dashboard/shop', icon: <SettingOutlined />, label: 'My Shop' },
    // { key: '/vendor/reviews', icon: <SettingOutlined />, label:  'Reviews'},
    // { key: '/vendor/chat', icon: <SettingOutlined />, label: 'Chat' },
   
];

// Customer Menu Items
export const customerMenuItems = [
  { key: '/customer/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/customer/dashboard/cart', icon: <ShoppingCartOutlined />, label: 'My Cart' },
  { key: '/customer/dashboard/orders', icon: <ShoppingCartOutlined />, label: 'My Orders' },
  { key: '/customer/dashboard/profile', icon: <SettingOutlined />, label: 'Profile' },
  { key: '/customer/dashboard/address',  icon: <HomeOutlined />, label: 'Address' },
    { key: '/customer/dashboard/wishlist',  icon: <HomeOutlined />, label: 'Wishlist' }
  
];




