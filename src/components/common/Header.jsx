import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Header({ filters = {}, onFilterChange = () => {}, onReset = () => {}, showFilters = true }) {
  const navigate = useNavigate();

  let userRole = 'USER';
  let userInitial = 'U';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      userRole = (userData.role || 'user').toUpperCase();
      const email = userData.email || '';
      userInitial = email.charAt(0).toUpperCase() || userRole.charAt(0);
    }
  } catch (e) {
    console.error('User data error:', e);
  }

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: '12px 24px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        flexWrap: 'wrap',
        minHeight: 64,
      }}
    >
 
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search Menu... (Ctrl+K)"
        style={{ width: 200, height: 36 }}
        allowClear
      />
      {showFilters && filters.stores && (
        <Select
          value={filters.selectedStore}
          onChange={(val) => onFilterChange('selectedStore', val)}
          style={{ width: 130, height: 36 }}
          options={filters.stores.map((store) => ({ value: store.value, label: store.label }))}
        />
      )}

  
      {showFilters && filters.zones && (
        <Select
          value={filters.selectedZone}
          onChange={(val) => onFilterChange('selectedZone', val)}
          style={{ width: 140, height: 36 }}
          options={filters.zones.map((zone) => ({ value: zone.value, label: zone.label }))}
        />
      )}

     
      {showFilters && filters.periods && (
        <Select
          value={filters.selectedPeriod}
          onChange={(val) => onFilterChange('selectedPeriod', val)}
          style={{ width: 130, height: 36 }}
          options={filters.periods.map((period) => ({ value: period.value, label: period.label }))}
        />
      )}

      
      {showFilters && (
        <Button icon={<FilterOutlined />} onClick={onReset} style={{ height: 36 }}>
          Reset
        </Button>
      )}

     
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          paddingLeft: 16,
          borderLeft: '2px solid #f0f0f0',
          fontWeight: 600,
          color: '#000',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            userSelect: 'none',
          }}
        >
          {userInitial}
        </div>

        <div>{userRole}</div>

        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ height: 36, marginLeft: 8, fontWeight: 600 }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
