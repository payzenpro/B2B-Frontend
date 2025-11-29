// import { Menu } from 'antd';
// import { Link, useLocation } from 'react-router-dom';

// export default function Sidebar({ menuItems, title }) {
//   const location = useLocation();


//   const processedMenuItems = menuItems.map(item => {
//     if (item.type === 'group') {
//       return item;
//     }
//     return {
//       ...item,
//       label: <Link to={item.key}>{item.label}</Link>
//     };
//   });

//   return (
//     <div style={{ 
//       background: '#fff', 
//       borderRight: '1px solid #f0f0f0',
//       height: '100%',
//       overflowY: 'auto'
//     }}>
//       {/* Sidebar Title */}
//       <div style={{ 
//         padding: '16px', 
//         fontSize: 18, 
//         fontWeight: 700, 
//         color: '#1890ff', 
//         borderBottom: '1px solid #f0f0f0',
//         textAlign: 'center'
//       }}>
//         {title}
//       </div>

//       {/* Menu */}
//       <Menu 
//         mode="inline" 
//         selectedKeys={[location.pathname]} 
//         items={processedMenuItems}
//         style={{ borderRight: 0 }}
//       />
//     </div>
//   );
// }


import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ menuItems, title }) {
  const location = useLocation();

  const processedMenuItems = menuItems.map(item => {
    if (item.type === 'group') return item;
    return { ...item, label: <Link to={item.key}>{item.label}</Link> };
  });

  return (
    <div
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        height: '100%',
        overflowY: 'auto',
            boxShadow: '1px 0 4px rgba(0,0,0,0.05)', // base shadow

        transition: 'box-shadow 0.3s ease',
      }}
      // onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '2px 0 10px rgba(0,0,0,0.08)')}
      // onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
       onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '4px 0 16px rgba(0,0,0,0.15)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '1px 0 4px rgba(0,0,0,0.05)')}
    >
      {/* Sidebar Title */}
      <div
        style={{
          padding: '16px',
          fontSize: 18,
          fontWeight: 700,
          color: '#101010ff',
          borderBottom: '1px solid #f0f0f0',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          background: 'linear-gradient(to right, #f8faff, #ffffff)',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#0958d9')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#1890ff')}
      >
        {title}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={processedMenuItems}
        style={{
          borderRight: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.cursor = 'pointer')}
      />

      <style>
        {`
          /* MENU ITEM ANIMATIONS */
          .ant-menu-item {
            margin: 6px 8px !important;
            border-radius: 6px !important;
            transition: background 0.3s ease, transform 0.25s ease;
            font-weight: 500;
          }

          .ant-menu-item:hover {
            background: #f0f7ff !important;
            transform: translateX(6px);
            color: #1677ff !important;
          }

          .ant-menu-item-selected {
            background: #8C00FF !important;
            color: #fff !important;
            border-right: 3px solid #fff !important;
            transform: translateX(6px);
            font-weight: 600 !important;
          }

          /* SCROLLBAR */
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-thumb {
            background: #DAD2FF;
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
}
