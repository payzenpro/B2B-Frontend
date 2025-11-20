import { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Switch, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getBanners, createBanner, updateBanner, deleteBanner } from '../app/api';

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);
      message.success(`Loaded ${data.length} banners`);
    } catch (error) {
      message.error('Failed to load banners');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      let response;
      if (editingId) {
        response = await updateBanner(editingId, values);
        message.success('Banner updated!');
      } else {
        response = await createBanner(values);
        message.success('Banner created!');
      }
      
      fetchBanners();
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Failed to save banner');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      message.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      message.error('Failed to delete banner');
      console.error(error);
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
      render: (url) => <img src={url} alt="banner" style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 4 }} />
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
        title=" Banners Management"
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
        <Table
          dataSource={banners}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
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
