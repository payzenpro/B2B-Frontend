import { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Popconfirm, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getVendorStores, deleteVendorStore } from '../app/api.js';


export default function VendorStoresList() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  // API se vendor stores fetch karo
  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getVendorStores();
      setStores(data);
    } catch (error) {
      message.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteStoreById(id);
  //     message.success("Store deleted");
  //     fetchStores();
  //   } catch {
  //     message.error("Failed to delete store");
  //   }
  // };
  const handleDelete = async (id) => {
  try {
    await deleteVendorStore(id);
    message.success("Store deleted");
    fetchStores();
  } catch {
    message.error("Failed to delete store");
  }
};


  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'Store Name', dataIndex: 'name', key: 'name', width: 180, render: (text) => <strong>{text}</strong> },
    { title: 'Code', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'City', dataIndex: 'city', key: 'city', width: 120 },
    { title: 'Zone', dataIndex: 'zone', key: 'zone', width: 120, render: (zone) => <Tag>{zone}</Tag> },
    { title: 'Manager', dataIndex: 'manager', key: 'manager', width: 140 },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 140 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" icon={<EyeOutlined />} onClick={() => navigate(`/vendor/stores/${record._id}`)}>View</Button>
          <Button size="small" type="link" icon={<EditOutlined />} onClick={() => navigate(`/vendor/stores/edit/${record._id}`)}>Edit</Button>
          <Popconfirm title="Delete this store?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}> Stores List</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/vendor/stores/new')}>
          Add Store
        </Button>
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search stores..."
        style={{ width: 300, marginBottom: 16 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />

      <Table
        dataSource={filteredStores}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
}
