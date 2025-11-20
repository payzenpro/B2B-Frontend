import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Upload, Space, message, Popconfirm, Tag, Card, Row, Col } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, PictureOutlined } from "@ant-design/icons";

export default function Banners() {
  const [banners, setBanners] = useState([
    { 
      _id: '1', 
      title: 'Summer Collection 2025', 
      description: 'New summer products now available',
      image: '/images/images.jpeg',
      imagePreview: '🖼️ summer',
      position: 'home-top',
      type: 'promotional',
      zone: 'south',
      store: 'grocery',
      link: '/products?category=summer',
      status: 'active',
      startDate: '2025-10-30',
      endDate: '2025-11-30',
      clicks: 1250,
      impressions: 25000
    },
    { 
      _id: '2', 
      title: 'Diwali Mega Sale', 
      description: 'Up to 50% off on selected items',
      image: '/images/diwali.jpg',
      imagePreview: '🎆 diwali',
      position: 'home-middle',
      type: 'flash-sale',
      zone: 'all',
      store: 'electronics',
      link: '/flash-sales',
      status: 'scheduled',
      startDate: '2025-11-01',
      endDate: '2025-11-15',
      clicks: 0,
      impressions: 0
    },
    { 
      _id: '3', 
      title: 'Electronics Special', 
      description: 'Latest gadgets at unbeatable prices',
      image: '/images/Electronics.jpg',
      imagePreview: '📱 electronics',
      position: 'products-page',
      type: 'category',
      zone: 'north',
      store: 'electronics',
      link: '/categories/electronics',
      status: 'active',
      startDate: '2025-10-25',
      endDate: '2025-11-25',
      clicks: 890,
      impressions: 18500
    }
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStore, setFilterStore] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    active: 'green',
    scheduled: 'blue',
    inactive: 'red'
  };

  const bannerTypes = [
    { value: 'promotional', label: '🎯 Promotional' },
    { value: 'flash-sale', label: '⚡ Flash Sale' },
    { value: 'category', label: '🏷️ Category' },
    { value: 'brand', label: '🏪 Brand' },
    { value: 'seasonal', label: '🎄 Seasonal' }
  ];

  const zones = [
    { value: 'all', label: '📍 All Zones' },
    { value: 'south', label: '🔴 South Delhi' },
    { value: 'north', label: '🟢 North Delhi' },
    { value: 'east', label: '🔵 East Delhi' },
    { value: 'west', label: '🟡 West Delhi' },
    { value: 'ncr', label: '🟣 NCR Region' }
  ];

  const stores = [
    { value: 'all', label: '🛒 All Stores' },
    { value: 'grocery', label: '🛒 Grocery' },
    { value: 'electronics', label: '📱 Electronics' },
    { value: 'fashion', label: '👗 Fashion' },
    { value: 'pharmacy', label: '💊 Pharmacy' }
  ];

  const positionOptions = [
    { value: 'home-top', label: 'Home - Top Banner' },
    { value: 'home-middle', label: 'Home - Middle Banner' },
    { value: 'home-bottom', label: 'Home - Bottom Banner' },
    { value: 'products-page', label: 'Products Page' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'mobile-top', label: 'Mobile - Top' }
  ];

  const handleImageUpload = (file) => {
    setUploadedImage({
      name: file.name,
      preview: URL.createObjectURL(file)
    });
    return false;
  };

  async function handleSave(values) {
    try {
      if (editingId) {
        setBanners(banners.map(b => 
          b._id === editingId ? { 
            ...b, 
            ...values, 
            image: uploadedImage?.preview || b.image,
            _id: editingId 
          } : b
        ));
        message.success('Banner updated successfully!');
      } else {
        setBanners([...banners, { 
          ...values, 
          _id: Date.now().toString(),
          image: uploadedImage?.preview || '',
          clicks: 0,
          impressions: 0
        }]);
        message.success('Banner created successfully!');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      setUploadedImage(null);
    } catch (error) {
      message.error('Failed to save banner');
    }
  }

  const handleDelete = (id) => {
    setBanners(banners.filter(b => b._id !== id));
    message.success('Banner deleted');
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setUploadedImage({ preview: record.image, name: 'current-image' });
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      position: record.position,
      type: record.type,
      zone: record.zone,
      store: record.store,
      link: record.link,
      status: record.status
    });
    setModalOpen(true);
  };

  const filteredBanners = banners.filter(banner => {
    const matchStatus = filterStatus === 'all' || banner.status === filterStatus;
    const matchType = filterType === 'all' || banner.type === filterType;
    const matchZone = filterZone === 'all' || banner.zone === filterZone;
    const matchStore = filterStore === 'all' || banner.store === filterStore;
    const matchSearch = searchText === '' || 
      banner.title.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchType && matchZone && matchStore && matchSearch;
  });

  const columns = [
    { 
      title: 'Banner', 
      key: 'banner',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {record.imagePreview}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{record.title}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.description}</div>
        </div>
      )
    },
    { 
      title: 'Details', 
      key: 'details',
      width: 180,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>Type: <Tag color="blue">{bannerTypes.find(t => t.value === record.type)?.label}</Tag></div>
          <div>Zone: <Tag color="cyan">{zones.find(z => z.value === record.zone)?.label}</Tag></div>
          <div>Store: <Tag color="green">{stores.find(s => s.value === record.store)?.label}</Tag></div>
        </div>
      )
    },
    { 
      title: 'Performance', 
      key: 'performance',
      width: 120,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>👁️ {record.impressions.toLocaleString()}</div>
          <div>👆 {record.clicks.toLocaleString()}</div>
        </div>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
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
            title="Delete Banner?"
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
        <h2 style={{ margin: 0 }}>Banners Management</h2>
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
          Create Banner
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Active</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
            {filteredBanners.filter(b => b.status === 'active').length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Scheduled</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredBanners.filter(b => b.status === 'scheduled').length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Impressions</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#faad14' }}>
            {filteredBanners.reduce((s, b) => s + b.impressions, 0).toLocaleString()}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Clicks</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredBanners.reduce((s, b) => s + b.clicks, 0).toLocaleString()}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input 
          prefix={<SearchOutlined />}
          placeholder="Search banners..."
          style={{ width: 220 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        
        <Select 
          value={filterStatus} 
          onChange={setFilterStatus}
          style={{ width: 140 }}
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="scheduled">Scheduled</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>

        <Select 
          value={filterType} 
          onChange={setFilterType}
          style={{ width: 160 }}
        >
          <Select.Option value="all">All Types</Select.Option>
          {bannerTypes.map(t => <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>)}
        </Select>

        <Select 
          value={filterZone} 
          onChange={setFilterZone}
          style={{ width: 160 }}
        >
          {zones.map(z => <Select.Option key={z.value} value={z.value}>{z.label}</Select.Option>)}
        </Select>

        <Select 
          value={filterStore} 
          onChange={setFilterStore}
          style={{ width: 160 }}
        >
          {stores.map(s => <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>)}
        </Select>
      </div>

      <Table 
        dataSource={filteredBanners} 
        columns={columns} 
        rowKey="_id" 
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1300 }}
      />

      <Modal
        title={editingId ? 'Edit Banner' : 'Create Banner'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingId(null);
          setUploadedImage(null);
        }}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="title" 
                label="Banner Title" 
                rules={[{ required: true }]}
              >
                <Input placeholder="Summer Collection 2025" />
              </Form.Item>

              <Form.Item 
                name="description" 
                label="Description" 
                rules={[{ required: true }]}
              >
                <Input.TextArea placeholder="Banner description" rows={2} />
              </Form.Item>

              <Form.Item 
                name="type" 
                label="Banner Type" 
                rules={[{ required: true }]}
              >
                <Select placeholder="Select type">
                  {bannerTypes.map(t => (
                    <Select.Option key={t.value} value={t.value}>
                      {t.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                name="zone" 
                label="Zone" 
                rules={[{ required: true }]}
              >
                <Select placeholder="Select zone">
                  {zones.map(z => (
                    <Select.Option key={z.value} value={z.value}>
                      {z.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                name="store" 
                label="Store" 
                rules={[{ required: true }]}
              >
                <Select placeholder="Select store">
                  {stores.map(s => (
                    <Select.Option key={s.value} value={s.value}>
                      {s.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                name="position" 
                label="Position" 
                rules={[{ required: true }]}
              >
                <Select placeholder="Select position">
                  {positionOptions.map(p => (
                    <Select.Option key={p.value} value={p.value}>
                      {p.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                name="link" 
                label="Link URL" 
                rules={[{ required: true }]}
              >
                <Input placeholder="/products?category=summer" />
              </Form.Item>

              <Form.Item 
                name="status" 
                label="Status" 
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="scheduled">Scheduled</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
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
                        maxHeight: 250, 
                        borderRadius: 4,
                        marginBottom: 12
                      }} 
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                      {uploadedImage.name}
                    </div>
                  </div>
                ) : (
                  <div>
                    <PictureOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }} />
                    <div style={{ color: '#666' }}>No image selected</div>
                  </div>
                )}
                
                <Upload
                  beforeUpload={handleImageUpload}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button 
                    icon={<UploadOutlined />}
                    style={{ marginTop: 12 }}
                  >
                    Choose File
                  </Button>
                </Upload>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
