import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();

  let userEmail = 'User';
  let userRole = 'USER';

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      userEmail = userData.email || 'User';
      userRole = (userData.role || 'user').toUpperCase();
    }
  } catch (e) {
    console.log('User data error:', e);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/auth');
  };

  const userInitial = userEmail?.charAt(0).toUpperCase() || 'U';

  return (
    <div style={{ 
      display: 'flex', 
      gap: 12, 
      alignItems: 'center', 
      paddingLeft: 16, 
      borderLeft: '2px solid #f0f0f0' 
    }}>
      {/* Avatar Circle */}
      <div style={{ 
        width: 42, 
        height: 42, 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: 700, 
        fontSize: 18, 
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)' 
      }}>
        {userInitial}
      </div>

      {/* User Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#000' }}>
          {userEmail}
        </div>
        <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>
          {userRole}
        </div>
      </div>

      {/* Logout Button */}
      <Button 
        type="primary" 
        danger 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
        style={{ height: 36, marginLeft: 8 }}
      >
        Logout
      </Button>
    </div>
  );
}
