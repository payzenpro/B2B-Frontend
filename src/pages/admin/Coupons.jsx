import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, Popconfirm, Tag, Card, Row, Col, Statistic } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from 'dayjs';

const API_BASE_URL = 'http://localhost:4000/api';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Please login first!');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/coupons`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCoupons(response.data.data);
        message.success(`Loaded ${response.data.count} coupons`);
      }
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.status === 401) {
        message.error('Session expired! Please login again.');
      } else {
        message.error('Failed to load coupons');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Please login first!');
        return;
      }

      // Backend expects: discount, discountType ('percentage' or 'fixed'), minOrderValue, validFrom, validUntil
      const payload = {
        code: values.code.toUpperCase(),
        discount: values.discountValue,
        discountType: values.discountType === 'percent' ? 'percentage' : 'fixed',
        minOrderValue: values.minPurchase,
        maxDiscount: values.maxDiscount || 0,
        validFrom: values.startDate.toISOString(),
        validUntil: values.endDate.toISOString(),
        usageLimit: values.usageLimit,
        isActive: values.status === 'active'
      };
      
      if (editingId) {
        await axios.put(`${API_BASE_URL}/coupons/${editingId}`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Coupon updated!');
      } else {
        await axios.post(`${API_BASE_URL}/coupons`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Coupon created!');
      }
      
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      console.error('Save Error:', error);
      message.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/coupons/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      console.error('Delete Error:', error);
      message.error('Failed to delete coupon');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      code: record.code,
      discountType: record.discountType === 'percentage' ? 'percent' : 'fixed',
      discountValue: record.discount,
      minPurchase: record.minOrderValue,
      maxDiscount: record.maxDiscount,
      startDate: dayjs(record.validFrom),
      endDate: dayjs(record.validUntil),
      usageLimit: record.usageLimit,
      status: record.isActive ? 'active' : 'inactive'
    });
    setModalOpen(true);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const isActive = new Date(coupon.validUntil) > new Date();
    const status = coupon.isActive ? (isActive ? 'active' : 'ended') : 'inactive';
    
    const matchStatus = filterStatus === 'all' || status === filterStatus;
    const matchSearch = searchText === '' || 
      coupon.code.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusColors = {
    active: 'green',
    scheduled: 'blue',
    ended: 'red',
    inactive: 'orange'
  };

  const columns = [
    { 
      title: 'Code', 
      key: 'code',
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color="blue" style={{ fontSize: 13, fontWeight: 700, padding: '4px 12px' }}>
            {record.code}
          </Tag>
          <Button 
            type="text" 
            size="small" 
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(record.code);
              message.success('Code copied!');
            }}
          />
        </div>
      )
    },
    { 
      title: 'Discount', 
      key: 'discount',
      width: 140,
      render: (_, record) => (
        <div style={{ fontWeight: 600, color: '#ff4d4f', fontSize: 14 }}>
          {record.discountType === 'percentage' 
            ? `${record.discount}% OFF` 
            : `₹${record.discount} OFF`}
        </div>
      )
    },
    { 
      title: 'Min Order', 
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      width: 100,
      render: (val) => `₹${val}`
    },
    { 
      title: 'Usage', 
      key: 'usage',
      width: 120,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600 }}>{record.usedCount || 0}/{record.usageLimit}</div>
          <div style={{ color: '#888', marginTop: 2 }}>
            {(((record.usedCount || 0) / record.usageLimit) * 100).toFixed(0)}% used
          </div>
        </div>
      )
    },
    { 
      title: 'Valid Until', 
      key: 'validity',
      width: 130,
      render: (_, record) => dayjs(record.validUntil).format('DD MMM YYYY')
    },
    { 
      title: 'Status', 
      key: 'status',
      width: 110,
      render: (_, record) => {
        const isActive = new Date(record.validUntil) > new Date();
        const status = record.isActive ? (isActive ? 'active' : 'ended') : 'inactive';
        return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
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
        <h2 style={{ margin: 0 }}>🎟️ Coupons Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Create Coupon
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Coupons" 
              value={filteredCoupons.length} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Active" 
              value={filteredCoupons.filter(c => c.isActive && new Date(c.validUntil) > new Date()).length} 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Used" 
              value={filteredCoupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)} 
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Inactive" 
              value={filteredCoupons.filter(c => !c.isActive).length} 
              valueStyle={{ color: '#ff4d4f' }} 
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input 
          prefix={<SearchOutlined />}
          placeholder="Search by code..."
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
          <Select.Option value="ended">Ended</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </div>

      <Table 
        dataSource={filteredCoupons} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? 'Edit Coupon' : 'Create Coupon'}
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
            name="code" 
            label="Coupon Code" 
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item label="Discount">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item 
                name="discountType" 
                noStyle
                rules={[{ required: true }]}
              >
                <Select style={{ width: '40%' }}>
                  <Select.Option value="percent">% Off</Select.Option>
                  <Select.Option value="fixed">₹ Off</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item 
                name="discountValue" 
                noStyle
                rules={[{ required: true }]}
              >
                <InputNumber placeholder="Value" style={{ width: '60%' }} min={0} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item 
            name="minPurchase" 
            label="Min Purchase (₹)" 
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item 
            name="maxDiscount" 
            label="Max Discount (₹)"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item label="Valid Period" required>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item 
                name="startDate" 
                noStyle
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '50%' }} />
              </Form.Item>
              <Form.Item 
                name="endDate" 
                noStyle
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '50%' }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item 
            name="usageLimit" 
            label="Usage Limit" 
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
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
        </Form>
      </Modal>
    </div>
  );
}
