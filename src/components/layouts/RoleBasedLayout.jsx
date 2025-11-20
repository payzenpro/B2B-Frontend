import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { adminMenuItems, vendorMenuItems, customerMenuItems } from '../../config/menuConfig';
import { useEffect, useState } from 'react';

const { Sider, Content } = Layout;


export default function RoleBasedLayout() {
  const [menuItems, setMenuItems] = useState([]);
  const [title, setTitle] = useState('Panel');

  useEffect(() => {
    let role = 'guest';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        role = userData.role;
      }
    } catch (e) {
      console.error('Error parsing user data', e);
    }

    switch (role) {
      case 'superadmin':
        setMenuItems(adminMenuItems);
        setTitle('Admin Panel');
        break;
      case 'vendor':
        setMenuItems(vendorMenuItems);
        setTitle('Vendor Panel');
        break;
      case 'customer':
        setMenuItems(customerMenuItems);
        setTitle('Customer Panel');
        break;
      default:
        setMenuItems([]);
        setTitle('User Panel');
        break;
    }
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light">
        <Sidebar menuItems={menuItems} title={title} />
      </Sider>

      <Layout>
        <Header />

        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
