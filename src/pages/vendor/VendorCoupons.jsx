import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, Popconfirm, Tag, Card, Row, Col, Statistic } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../app/api';

export default function VendorCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
      message.success(`Loaded ${data.length} coupons`);
    } catch (error) {
      message.error('Failed to load coupons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    active: 'green',
    scheduled: 'blue',
    ended: 'red',
    inactive: 'orange'
  };

  const handleSave = async (values) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };
      if (editingId) {
        await updateCoupon(editingId, formattedValues);
        message.success('Coupon updated!');
      } else {
        await createCoupon(formattedValues);
        message.success('Coupon created!');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      message.error('Failed to save coupon');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id);
      message.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      message.error('Failed to delete coupon');
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      code: record.code,
      description: record.description,
      discountType: record.discountType,
      discountValue: record.discount,
      minPurchase: record.minPurchase,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
      usageLimit: record.usageLimit,
      status: record.status
    });
    setModalOpen(true);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchStatus = filterStatus === 'all' || coupon.status === filterStatus;
    const matchSearch = searchText === '' || coupon.code?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Code',
      key: 'code',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color="blue" style={{ fontSize: 12, fontWeight: 700 }}>
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
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = statusColors[status?.toLowerCase()] || 'gray';
        return <Tag color={color}>{status ? status.toUpperCase() : "UNKNOWN"}</Tag>;
      },
    },
    {
      title: 'Discount',
      key: 'discount',
      width: 100,
      render: (_, record) => {
        const discountValue = record.discount !== undefined ? record.discount : record.discountValue;
        const discountType = record.discountType || 'fixed';
        return (
          <div style={{ fontWeight: 600, color: '#ff4d4f' }}>
            {discountType === 'percentage'
              ? `${discountValue}% off`
              : `₹${discountValue} off`}
          </div>
        );
      },
    },
    {
      title: 'Usage',
      key: 'usage',
      width: 100,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          {record.used || 0}/{record.usageLimit}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
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
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

      <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: "#888" }}>Total Coupons</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1890ff" }}>{filteredCoupons.length}</div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by code..."
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />

        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="scheduled">Scheduled</Select.Option>
          <Select.Option value="ended">Ended</Select.Option>
        </Select>
      </div>

      <Table dataSource={filteredCoupons} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
    
      <Modal
        title={editingId ? "Edit Coupon" : "Create Coupon"}
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
          <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. SUMMER50" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input placeholder="Coupon description" />
          </Form.Item>

          <Form.Item label="Discount">
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="discountType" style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="percentage">% Off</Select.Option>
                    <Select.Option value="fixed">₹ Off</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="discount" style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                  <InputNumber placeholder="Amount" style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="minPurchase" label="Min Purchase (₹)" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Valid Period" required>
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item name="startDate" noStyle rules={[{ required: true }]}>
                <DatePicker style={{ width: "50%" }} />
              </Form.Item>
              <Form.Item name="endDate" noStyle rules={[{ required: true }]}>
                <DatePicker style={{ width: "50%" }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item name="usageLimit" label="Usage Limit" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="ended">Ended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
