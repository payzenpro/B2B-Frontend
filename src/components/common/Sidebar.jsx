import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ menuItems, title }) {
  const location = useLocation();


  const processedMenuItems = menuItems.map(item => {
    if (item.type === 'group') {
      return item;
    }
    return {
      ...item,
      label: <Link to={item.key}>{item.label}</Link>
    };
  });

  return (
    <div style={{ 
      background: '#fff', 
      borderRight: '1px solid #f0f0f0',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Sidebar Title */}
      <div style={{ 
        padding: '16px', 
        fontSize: 18, 
        fontWeight: 700, 
        color: '#1890ff', 
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        {title}
      </div>

      {/* Menu */}
      <Menu 
        mode="inline" 
        selectedKeys={[location.pathname]} 
        items={processedMenuItems}
        style={{ borderRight: 0 }}
      />
    </div>
  );
}
