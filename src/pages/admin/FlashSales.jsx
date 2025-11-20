import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, Popconfirm, Tag } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FireOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { getFlashsales, createFlashsale, updateFlashsale, deleteFlashsale } from '../app/api.js';

export default function FlashSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    active: 'green',
    scheduled: 'blue',
    ended: 'red',
    paused: 'orange'
  };

  useEffect(() => {
    fetchFlashsales();
  }, []);

  const fetchFlashsales = async () => {
    setLoading(true);
    try {
      const data = await getFlashsales();
      setSales(data);
    } catch (error) {
      message.error('Failed to load flash sales');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  async function handleSave(values) {
    try {
      const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };
      if (editingId) {
        await updateFlashsale(editingId, payload);
        message.success('Flash sale updated successfully!');
      } else {
        await createFlashsale(payload);
        message.success('Flash sale created successfully!');
      }
      fetchFlashsales();
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Failed to save flash sale');
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteFlashsale(id);
      message.success('Flash sale deleted');
      fetchFlashsales();
    } catch (error) {
      message.error('Failed to delete flash sale');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      name: record.name,
      discount: record.discount,
      discountType: record.discountType,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
      startTime: record.startTime,
      endTime: record.endTime,
      status: record.status
    });
    setModalOpen(true);
  };

  const filteredSales = sales.filter(sale => {
    const matchStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchSearch = searchText === '' || sale.name.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    { 
      title: 'Sale Name', 
      dataIndex: 'name', 
      key: 'name',
      width: 180,
      render: (name) => <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><FireOutlined style={{ color: '#ff4d4f' }} /> {name}</div>
    },
    { 
      title: 'Discount', 
      key: 'discount',
      width: 120,
      render: (_, record) => (
        <div style={{ fontWeight: 600, color: '#ff4d4f', fontSize: 14 }}>
          {record.discount}{record.discountType === 'percent' ? '%' : ' ₹'}
        </div>
      )
    },
    { 
      title: 'Date Range', 
      key: 'dateRange',
      width: 160,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{dayjs(record.startDate).format('YYYY-MM-DD')} to {dayjs(record.endDate).format('YYYY-MM-DD')}</div>
          <div style={{ color: '#888' }}>{record.startTime} - {record.endTime}</div>
        </div>
      )
    },
    { 
      title: 'Products', 
      dataIndex: 'products', 
      key: 'products',
      width: 100,
      render: (p) => <Tag color="blue">{p} items</Tag>
    },
    { 
      title: 'Revenue', 
      dataIndex: 'revenue', 
      key: 'revenue',
      width: 120,
      // render: (r) => <div style={{ fontWeight: 600, color: '#52c41a' }}>₹{r.toLocaleString()}</div>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      width: 110,
    //  render: (status) => status ? <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag> : null

    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
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
            title="Delete Sale?"
            description="Are you sure to delete this flash sale?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              danger
              type="link"
              icon={<DeleteOutlined />}
            >
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
        <h2 style={{ margin: 0 }}>Flash Sales Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Create Flash Sale
        </Button>
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
        
        <Select 
          value={filterStatus} 
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="scheduled">Scheduled</Select.Option>
          <Select.Option value="ended">Ended</Select.Option>
          <Select.Option value="paused">Paused</Select.Option>
        </Select>
      </div>

      <Table 
        dataSource={filteredSales} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        pagination={{ 
          pageSize: 10, 
          showTotal: (total) => `Total ${total} flash sales` 
        }}
        scroll={{ x: 1200 }}
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
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item 
            name="name" 
            label="Sale Name" 
            rules={[{ required: true, message: 'Please enter sale name' }]}
          >
            <Input placeholder="e.g. Friday Flash Sale" />
          </Form.Item>

          <Form.Item label="Discount">
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item 
                name="discount" 
                style={{ marginBottom: 0, flex: 1 }}
                rules={[{ required: true }]}
              >
                <InputNumber 
                  placeholder="Amount" 
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
              <Form.Item 
                name="discountType" 
                style={{ marginBottom: 0, width: 120 }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="percent">% Off</Select.Option>
                  <Select.Option value="fixed">₹ Off</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="Date Range">
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item 
                name="startDate" 
                style={{ marginBottom: 0, flex: 1 }}
                rules={[{ required: true }]}
              >
                <DatePicker 
                  placeholder="Start Date"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item 
                name="endDate" 
                style={{ marginBottom: 0, flex: 1 }}
                rules={[{ required: true }]}
              >
                <DatePicker 
                  placeholder="End Date"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="Time Range">
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item 
                name="startTime" 
                style={{ marginBottom: 0, flex: 1 }}
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. 10:00 AM" />
              </Form.Item>
              <Form.Item 
                name="endTime" 
                style={{ marginBottom: 0, flex: 1 }}
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. 8:00 PM" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item 
            name="status" 
            label="Status" 
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="paused">Paused</Select.Option>
              <Select.Option value="ended">Ended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
