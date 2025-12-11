import { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Popconfirm, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getVendorStores, deleteVendorStore } from '../../app/api.js';

export default function VendorStoresList() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      console.log(' Fetching stores...');
      const response = await getVendorStores();
      console.log(' API Response:', response);
      
      // ✅ Check if response has correct format
      if (response && response.success && Array.isArray(response.data)) {
        const safeStores = response.data.map(store => ({
          key: store._id,
          _id: store._id,
          name: store.name || 'No Name',
          code: store.code || 'N/A',
          city: store.city || 'N/A',
          zone: store.zone || 'General',
          manager: store.manager || 'N/A',
          phone: store.phone || 'N/A',
          status: store.status || 'inactive'
        }));
        
        console.log(' Stores loaded:', safeStores.length);
        setStores(safeStores);
        
        if (safeStores.length === 0) {
          message.info('No stores found. Add your first store!');
        } else {
          message.success(`${safeStores.length} stores loaded successfully!`);
        }
      } else {
        console.error(' Invalid response format:', response);
        message.error('Invalid data format received from server');
        setStores([]);
      }
    } catch (error) {
      console.error(' Fetch stores error:', error);
      message.error(`Failed to load stores: ${error.message}`);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(' Deleting store:', id);
      await deleteVendorStore(id);
      message.success("Store deleted successfully!");
      fetchStores();
    } catch (error) {
      console.error(' Delete error:', error);
      message.error(`Failed to delete store: ${error.message}`);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    store.code?.toLowerCase().includes(searchText.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name) => <strong style={{ color: '#1890ff' }}>{name}</strong>
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 120
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 'zone',
      width: 120,
      render: (zone) => <Tag color="blue">{zone}</Tag>
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      width: 140
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 140
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {String(status).toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/vendor/stores/${record._id}`)}
          >
            View
          </Button>
          <Button 
            size="small" 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/vendor/stores/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm 
            title="Are you sure you want to delete this store?" 
            onConfirm={() => handleDelete(record._id)}
            okText="Yes" 
            cancelText="No"
          >
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            🏪 My Stores ({stores.length})
          </h2>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>
            Manage your store locations
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/vendor/stores/new')}
          size="large"
        >
          Add New Store
        </Button>
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search by name, code or city..."
        style={{ width: 350, marginBottom: 16 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        size="large"
      />

      <Table
        dataSource={filteredStores}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} stores`,
          pageSizeOptions: ['5', '10', '20', '50']
        }}
        scroll={{ x: 1200 }}
        locale={{ 
          emptyText: (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}></div>
              <h3 style={{ marginBottom: 8 }}>No Stores Found</h3>
              <p style={{ color: '#999', marginBottom: 24 }}>
                {searchText 
                  ? `No results for "${searchText}". Try different keywords.`
                  : 'Create your first store to get started!'
                }
              </p>
              {!searchText && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/vendor/stores/new')}
                  size="large"
                >
                  Add Your First Store
                </Button>
              )}
            </div>
          )
        }}
      />
    </div>
  );
}
