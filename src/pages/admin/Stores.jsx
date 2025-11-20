import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Card } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PhoneOutlined, EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import { getStores, createStore, updateStore, deleteStore } from '../../app/api.js';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    true: 'green',
    false: 'red'
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getStores();
      setStores(data);
      message.success(`Loaded ${data.length} stores`);
    } catch (error) {
      message.error('Failed to load stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        ...values,
        isActive: values.isActive === 'true' || values.isActive === true
      };

      if (editingId) {
        await updateStore(editingId, payload);
        message.success('Store updated!');
      } else {
        await createStore(payload);
        message.success('Store created!');
      }

      fetchStores();
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Failed to save store');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStore(id);
      message.success('Store deleted');
      fetchStores();
    } catch (error) {
      message.error('Failed to delete store');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      name: record.name,
      ownerId: record.ownerId?._id || record.ownerId,
      description: record.description,
      address: record.address,
      phone: record.phone,
      email: record.email,
      isActive: record.isActive ? 'true' : 'false'
    });
    setModalOpen(true);
  };

  const filteredStores = stores.filter(store => {
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && store.isActive) || 
      (filterStatus === 'inactive' && !store.isActive);
    const matchSearch = searchText === '' || 
      store.name.toLowerCase().includes(searchText.toLowerCase()) ||
      store.address?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    { 
      title: 'Store Name', 
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name) => <div style={{ fontWeight: 600 }}>{name}</div>
    },
    { 
      title: 'Location', 
      key: 'location',
      width: 250,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <EnvironmentOutlined />
            {record.address || 'N/A'}
          </div>
        </div>
      )
    },
    { 
      title: 'Contact', 
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          {record.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <PhoneOutlined />
              {record.phone}
            </div>
          )}
          {record.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MailOutlined />
              {record.email}
            </div>
          )}
        </div>
      )
    },
    { 
      title: 'Description', 
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (desc) => (
        <div style={{ fontSize: 12, color: '#666' }}>
          {desc || 'No description'}
        </div>
      )
    },
    { 
      title: 'Status', 
      key: 'isActive',
      width: 100,
      render: (_, record) => (
        <Tag color={statusColors[record.isActive]}>
          {record.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Store?"
            description="Are you sure?"
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
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Stores Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Create Store
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Stores</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredStores.length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Active</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
            {filteredStores.filter(s => s.isActive).length}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input 
          prefix={<SearchOutlined />}
          placeholder="Search by store name or address..."
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        
        <Select 
          value={filterStatus} 
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </div>

      <Table 
        dataSource={filteredStores} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? 'Edit Store' : 'Create Store'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item 
            name="name" 
            label="Store Name" 
            rules={[{ required: true, message: 'Please enter store name' }]}
          >
            <Input placeholder="e.g. SuperMart Downtown" />
          </Form.Item>

          <Form.Item 
            name="ownerId" 
            label="Owner ID" 
            rules={[{ required: true, message: 'Please enter owner ID' }]}
          >
            <Input placeholder="MongoDB ObjectId of store owner" />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description"
          >
            <Input.TextArea placeholder="Store description" rows={2} />
          </Form.Item>

          <Form.Item 
            name="address" 
            label="Address"
          >
            <Input placeholder="Store address" />
          </Form.Item>

          <Form.Item 
            name="phone" 
            label="Phone"
          >
            <Input placeholder="+91-9876543210" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="Email"
          >
            <Input type="email" placeholder="store@example.com" />
          </Form.Item>

          <Form.Item 
            name="isActive" 
            label="Status" 
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="true">Active</Select.Option>
              <Select.Option value="false">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
