import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Card } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getPushNotifications, createPushNotification, updatePushNotification, deletePushNotification } from '../../app/api.js';

const API_BASE_URL = 'http://localhost:4000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export default function VendorPushNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pushNotifications`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
        message.success(`Loaded ${data.data.length} notifications`);
      } else {
        message.error('Failed to load notifications');
      }
    } catch (error) {
      message.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { sent: 'green', scheduled: 'blue', draft: 'orange', failed: 'red' };

  const handleSave = async (values) => {
    try {
      const url = editingId ? `${API_BASE_URL}/pushNotifications/${editingId}` : `${API_BASE_URL}/pushNotifications`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to save notification');
      const data = await response.json();

      if (data.success) {
        message.success(editingId ? 'Notification updated!' : 'Notification created!');
        setModalOpen(false);
        form.resetFields();
        setEditingId(null);
        fetchNotifications();
      } else {
        message.error(data.message || 'Failed to save notification');
      }
    } catch (error) {
      message.error(error.message || 'Failed to save notification');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pushNotifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      const data = await response.json();
      if (data.success) {
        message.success('Notification deleted');
        fetchNotifications();
      } else {
        message.error('Failed to delete notification');
      }
    } catch (error) {
      message.error(error.message || 'Failed to delete notification');
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      title: record.title,
      message: record.message,
      audience: record.audience,
      status: record.status,
    });
    setModalOpen(true);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchStatus = filterStatus === 'all' || n.status === filterStatus;
    const matchSearch = !searchText || n.title.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Notification',
      key: 'notification',
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.title}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {record.message?.substring(0, 50)}...
          </div>
        </div>
      )
    },
    {
      title: 'Audience',
      key: 'audience',
      width: 150,
      render: (_, record) => <Tag>{record.audience}</Tag>
    },
    {
      title: 'Performance',
      key: 'performance',
      width: 130,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div> {record.recipients || 0}</div>
          <div> {record.clicks || 0}</div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const color = statusColors[record.status] || 'gray';
        return <Tag color={color}>{(record.status || 'UNKNOWN').toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}> Push Notifications</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          New Notification
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Sent</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
            {filteredNotifications.filter(n => n.status === 'sent').reduce((sum, n) => sum + (n.recipients || 0), 0).toLocaleString()}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Clicks</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredNotifications.reduce((sum, n) => sum + (n.clicks || 0), 0).toLocaleString()}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input prefix={<SearchOutlined />} placeholder="Search..." style={{ width: 250 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} allowClear />
        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="sent">Sent</Select.Option>
          <Select.Option value="scheduled">Scheduled</Select.Option>
          <Select.Option value="draft">Draft</Select.Option>
        </Select>
      </div>

      <Table dataSource={filteredNotifications} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
      
      <Modal title={editingId ? 'Edit Notification' : 'Create Notification'} open={modalOpen} onCancel={() => {
        setModalOpen(false);
        form.resetFields();
        setEditingId(null);
      }} onOk={() => form.submit()} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Notification title" />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Notification message" rows={3} />
          </Form.Item>
          <Form.Item name="audience" label="Target Audience" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="all">All Customers</Select.Option>
              <Select.Option value="electronics_lovers">Electronics Lovers</Select.Option>
              <Select.Option value="fashion_lovers">Fashion Lovers</Select.Option>
              <Select.Option value="health_conscious">Health Conscious</Select.Option>
              <Select.Option value="new_users">New Users</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="sent">Send Now</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
