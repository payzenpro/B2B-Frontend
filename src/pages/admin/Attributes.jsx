import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Card } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BgColorsOutlined } from "@ant-design/icons";
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '../app/api.js';

export default function Attributes() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const statusColors = {
    active: 'green',
    inactive: 'red'
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const data = await getAttributes();
      setAttributes(data.map(attr => ({
        ...attr,
        status: attr.status || (attr.isActive ? 'active' : 'inactive')
      })));
      message.success(`Loaded ${data.length} attributes`);
    } catch (error) {
      message.error('Failed to load attributes');
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      const valuesList = values.values ? values.values.split(',').map(v => v.trim()) : [];
      const payload = { ...values, values: valuesList };

      if (editingId) {
        await updateAttribute(editingId, payload);
        message.success('Attribute updated!');
      } else {
        await createAttribute(payload);
        message.success('Attribute created!');
      }

      fetchAttributes();
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Failed to save attribute');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttribute(id);
      message.success('Attribute deleted');
      fetchAttributes();
    } catch (error) {
      message.error('Failed to delete attribute');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      values: record.values.join(', '),
      status: record.status
    });
    setModalOpen(true);
  };

  const filteredAttributes = attributes.filter(attribute => {
    const matchStatus = filterStatus === 'all' || attribute.status === filterStatus;
    const matchSearch = searchText === '' || attribute.name.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Attribute Name',
      key: 'name',
      width: 150,
      render: (_, record) => (
        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BgColorsOutlined style={{ color: '#1890ff' }} />
          {record.name}
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => <Tag color={type === 'dropdown' ? 'blue' : 'orange'}>{type}</Tag>
    },
    {
      title: 'Values',
      key: 'values',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {record.values.slice(0, 3).map((val, idx) => (
            <Tag key={idx}>{val}</Tag>
          ))}
          {record.values.length > 3 && (
            <Tag>+{record.values.length - 3} more</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Used in Products',
      dataIndex: 'productsUsing',
      key: 'productsUsing',
      width: 130,
      render: (count = 0) => (
        <div style={{ fontWeight: 600, color: '#1890ff' }}>
          {count} products
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={statusColors[status]}>{status?.toUpperCase()}</Tag>
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
            title="Delete Attribute?"
            description="Are you sure? This will affect products."
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
        <h2 style={{ margin: 0 }}>Attributes Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Create Attribute
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Attributes</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredAttributes.length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Active</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
            {filteredAttributes.filter(a => a.status === 'active').length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Values</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#faad14' }}>
            {filteredAttributes.reduce((sum, a) => sum + (a.values?.length || 0), 0)}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search attributes..."
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
        dataSource={filteredAttributes}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? 'Edit Attribute' : 'Create Attribute'}
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
            name="name"
            label="Attribute Name"
            rules={[{ required: true, message: 'Please enter attribute name' }]}
          >
            <Input placeholder="e.g. Color, Size, Brand" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Attribute Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select attribute type">
              <Select.Option value="dropdown">Dropdown</Select.Option>
              <Select.Option value="text">Text</Select.Option>
              <Select.Option value="color">Color</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="values"
            label="Attribute Values (comma separated)"
            rules={[{ required: true, message: 'Please enter values' }]}
          >
            <Input.TextArea
              placeholder="e.g. Red, Blue, Green, Black, White"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
