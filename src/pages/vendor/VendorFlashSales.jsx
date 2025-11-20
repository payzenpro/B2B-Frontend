import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, Popconfirm, Tag, Card, Row, Col } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';


 //import { getVendorFlashsales, createVendorFlashsale, updateVendorFlashsale, deleteVendorFlashsale } from '..app/api';

export default function VendorFlashSales() {
  const [flashSales, setFlashSales] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    upcoming: 'blue',
    active: 'green',
    ended: 'red'
  };

  useEffect(() => {
    async function fetchFlashsales() {
      try {
        // Call apne API function
        const data = await getVendorFlashsales();
        setFlashSales(data);
      } catch (error) {
        message.error('Failed to load flash sales');
      }
    }
    fetchFlashsales();
  }, []);

  const handleSave = async (values) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        products: [],
        totalSold: 0,
        totalRevenue: 0
      };

      if (editingId) {
        // TODO: API call for update
        setFlashSales(flashSales.map(sale =>
          sale._id === editingId ? { ...sale, ...formattedValues } : sale
        ));
        message.success('Flash sale updated!');
      } else {
        // TODO: API call for create
        setFlashSales([...flashSales, {
          ...formattedValues,
          _id: Date.now().toString(),
          status: 'upcoming'
        }]);
        message.success('Flash sale created!');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Failed to save flash sale');
    }
  };

  const handleDelete = async (id) => {
    // TODO: API call for delete
    setFlashSales(flashSales.filter(sale => sale._id !== id));
    message.success('Flash sale deleted');
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      discount: record.discount,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
      startTime: record.startTime,
      endTime: record.endTime,
      status: record.status
    });
    setModalOpen(true);
  };

  const filteredFlashSales = flashSales.filter(sale => {
    const matchStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchSearch = searchText === '' || sale.name.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Flash Sale',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: 'Discount',
      key: 'discount',
      width: 100,
      render: (_, record) => (
        <Tag color="red" style={{ fontSize: 14, fontWeight: 700 }}>
          {record.discount}% OFF
        </Tag>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      width: 180,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div><ClockCircleOutlined /> {record.startDate} - {record.endDate}</div>
          <div style={{ color: '#888' }}>{record.startTime} to {record.endTime}</div>
        </div>
      )
    },
    {
      title: 'Products',
      key: 'products',
      width: 100,
      render: (_, record) => (
        <div style={{ fontWeight: 600, color: '#1890ff' }}>
          {record.products.length} items
        </div>
      )
    },
    {
      title: 'Performance',
      key: 'performance',
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>Sold: <strong>{record.totalSold}</strong></div>
          <div>Revenue: <strong style={{ color: '#52c41a' }}>₹{record.totalRevenue.toLocaleString()}</strong></div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag color={statusColors[record.status]}>
          {record.status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Delete Flash Sale?" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>⚡ Flash Sales Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingId(null);
          form.resetFields();
          setModalOpen(true);
        }}>
          Create Flash Sale
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Sales</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredFlashSales.length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Active</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
            {filteredFlashSales.filter(s => s.status === 'active').length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Revenue</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#faad14' }}>
            ₹{filteredFlashSales.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search flash sales..."
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="upcoming">Upcoming</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="ended">Ended</Select.Option>
        </Select>
      </div>

      <Table
        dataSource={filteredFlashSales}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: 16, background: '#fafafa' }}>
              <h4 style={{ marginBottom: 12 }}>Products in this Flash Sale:</h4>
              {record.products.length === 0 ? (
                <div style={{ color: '#888' }}>No products added yet</div>
              ) : (
                <Row gutter={[12, 12]}>
                  {record.products.map((product, idx) => (
                    <Col xs={24} sm={12} md={8} key={idx}>
                      <Card size="small">
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{product.name}</div>
                        <div style={{ fontSize: 12 }}>
                          <div style={{ textDecoration: 'line-through', color: '#888' }}>
                            ₹{product.originalPrice.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#ff4d4f' }}>
                            ₹{product.discountedPrice.toLocaleString()}
                          </div>
                          <div style={{ color: '#52c41a' }}>Stock: {product.stock}</div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )
        }}
      />

      <Modal
        title={editingId ? 'Edit Flash Sale' : 'Create Flash Sale'}
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
          <Form.Item name="name" label="Flash Sale Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Diwali Mega Sale" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Sale description" rows={2} />
          </Form.Item>
          <Form.Item name="discount" label="Discount Percentage" rules={[{ required: true }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} suffix="%" size="large" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
                <Input placeholder="e.g. 09:00" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
                <Input placeholder="e.g. 21:00" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="upcoming">Upcoming</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="ended">Ended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
