import { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Switch, message, Popconfirm, Alert } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getBanners, createBanner, updateBanner, deleteBanner } from '../app/api';

export default function VendorBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getBanners();
      
      console.log(' Banners fetched:', data);
      
      if (Array.isArray(data)) {
        setBanners(data);
        message.success(`Loaded ${data.length} banners`);
      } else {
        setBanners([]);
        message.info('No banners found');
      }
    } catch (error) {
      console.error(' Fetch error:', error);
      setError('Failed to load banners. Please check your login status.');
      message.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingId) {
        await updateBanner(editingId, values);
        message.success('Banner updated!');
      } else {
        await createBanner(values);
        message.success('Banner created!');
      }
      
      fetchBanners();
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      console.error('Save error:', error);
      message.error('Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      message.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      message.error('Failed to delete banner');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const columns = [
    { 
      title: 'Image', 
      dataIndex: 'image', 
      key: 'image',
      width: 150,
      render: (url) => (
        <img 
          src={url} 
          alt="banner" 
          style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 4 }} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/120x60?text=No+Image' }}
        />
      )
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Link', dataIndex: 'link', key: 'link' },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (active) => active ? '✅ Active' : '❌ Inactive'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div>
      <Card 
        title=" Vendor Banners"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Create Banner
          </Button>
        }
      >
        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            closable 
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" onClick={fetchBanners}>
                Retry
              </Button>
            }
          />
        )}
        
        <Table
          dataSource={banners}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No banners available' }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Banner' : 'Create Banner'}
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Banner title" />
          </Form.Item>

          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="link" label="Link" rules={[{ required: true }]}>
            <Input placeholder="/products" />
          </Form.Item>

          <Form.Item name="order" label="Order" rules={[{ required: true }]}>
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
