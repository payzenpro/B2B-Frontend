import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Upload, Space, message, Popconfirm, Tag, Card, Select } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, UploadOutlined } from "@ant-design/icons";
import { getCategories, createCategories, updateCategories, deleteCategories } from '../app/api'; 

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    active: 'green',
    inactive: 'red'
  };

  // Fetch categories from API on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
      message.success(`Loaded ${data.length} categories`);
    } catch (error) {
      message.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        name: file.name,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = async (values) => {
    try {
      const categoryData = {
        ...values,
        image: uploadedImage?.preview || ''
      };

      if (editingId) {
        await updateCategories(editingId, categoryData);
        message.success('Category updated!');
      } else {
        await createCategories(categoryData);
        message.success('Category created!');
      }
      
      fetchCategories(); // Refresh list after save
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      setUploadedImage(null);
    } catch (error) {
      message.error('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategories(id);
      message.success('Category deleted');
      fetchCategories(); 
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setUploadedImage({ preview: record.image, name: 'current-image' });
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      icon: record.icon,
      status: record.isActive ? 'active' : 'inactive'
    });
    setModalOpen(true);
  };

  const filteredCategories = categories.filter(categories => {
    const status = categories.isActive ? 'active' : 'inactive';
    const matchStatus = filterStatus === 'all' || status === filterStatus;
    const matchSearch = searchText === '' || 
      category.name.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    { 
      title: 'Category', 
      key: 'category',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ 
            width: 50, 
            height: 50, 
            borderRadius: 4, 
            marginBottom: 8,
            overflow: 'hidden',
            background: '#f0f0f0'
          }}>
            <img 
              src={record.image || 'https://via.placeholder.com/50x50?text=No+Image'} 
              alt={record.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'}
            />
          </div>
          <div style={{ fontWeight: 600 }}>
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.description}</div>
        </div>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
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
            title="Delete Category?"
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
        <h2 style={{ margin: 0 }}>Categories Management</h2>
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

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Categories</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredCategories.length}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input 
          prefix={<SearchOutlined />}
          placeholder="Search categories..."
          style={{ width: 250 }}
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
        dataSource={filteredCategories} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

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
          <Form.Item 
            name="name" 
            label="Category Name" 
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Category description" rows={2} />
          </Form.Item>

          <Form.Item 
            name="status" 
            label="Status" 
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category Image">
            <div style={{ 
              border: '2px dashed #1890ff', 
              borderRadius: 8, 
              padding: 16, 
              textAlign: 'center',
              background: '#fafafa'
            }}>
              {uploadedImage ? (
                <div>
                  <img 
                    src={uploadedImage.preview} 
                    alt="preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 200, 
                      borderRadius: 4,
                      marginBottom: 12
                    }} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=Error'}
                  />
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {uploadedImage.name}
                  </div>
                </div>
              ) : (
                <FolderOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }} />
              )}
              
              <Upload
                beforeUpload={handleImageUpload}
                accept="image/*"
                maxCount={1}
              >
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
