import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, Space, message, Popconfirm, Tag, Card } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, UploadOutlined } from "@ant-design/icons";
import { getCategories, createCategories, updateCategories, deleteCategories } from "../app/api";

export default function VendorCategories() {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();

  // Load categories from API on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to load categories');
      console.error(error);
    }
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = e => setUploadedImage({ name: file.name, preview: e.target.result });
    reader.readAsDataURL(file);
    return false; // prevent upload
  };

  const handleSave = async (values) => {
    try {
      if (editingId) {
        await updateCategories(editingId, { ...values, image: uploadedImage?.preview });
        message.success('Categories updated!');
      } else {
        await createCategories({ ...values, image: uploadedImage?.preview, productsCount: 0, status: values.status });
        message.success('Categories created!');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      setUploadedImage(null);
      fetchCategories();
    } catch (error) {
      message.error('Failed to save categories ');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategories(id);
      message.success('Category deleted');
      fetchCategories();
    } catch (error) {
      message.error('Failed to delete categories');
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setUploadedImage({ preview: record.image, name: 'current' });
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      icon: record.icon,
      status: record.status,
    });
    setModalOpen(true);
  };

  const filteredCategories = categories.filter(category => {
    return searchText === '' || category.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const columns = [
    {
      title: 'Category',
      key: 'category',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ width: 50, height: 50, borderRadius: 4, marginBottom: 8, overflow: 'hidden', background: '#f0f0f0' }}>
            <img src={record.image} alt={record.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{record.icon}</span>
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'productsCount',
      key: 'productsCount',
      width: 100,
      render: (count) => <Tag color="blue">{count} items</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>📁 Categories</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setUploadedImage(null);
            setModalOpen(true);
          }}
        >
          Create Category
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search categories..."
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <Table dataSource={filteredCategories} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />

      <Modal
        title={editingId ? 'Edit Category' : 'Create Category'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingId(null);
          setUploadedImage(null);
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Category description" rows={2} />
          </Form.Item>

          <Form.Item name="icon" label="Category Icon/Emoji" rules={[{ required: true }]}>
            <Input placeholder="e.g. 📱 or 👗" maxLength={2} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <select style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Form.Item>

          <Form.Item label="Category Image">
            <div
              style={{
                border: '2px dashed #1890ff',
                borderRadius: 8,
                padding: 16,
                textAlign: 'center',
                background: '#fafafa',
              }}
            >
              {uploadedImage ? (
                <div>
                  <img
                    src={uploadedImage.preview}
                    alt="preview"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4, marginBottom: 12 }}
                  />
                  <div style={{ fontSize: 12, color: '#666' }}>{uploadedImage.name}</div>
                </div>
              ) : (
                <FolderOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }} />
              )}

              <Upload beforeUpload={handleImageUpload} accept="image/*" maxCount={1}>
                <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
                  Choose File
                </Button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
