import { useState } from "react";
import { Card, Table, Rate, Tag, Button, Space, Input, Select, message, Popconfirm } from "antd";
import { SearchOutlined, DeleteOutlined, CommentOutlined } from "@ant-design/icons";

export default function VendorReviews() {
  const [reviews, setReviews] = useState([
    { _id: 1, product: 'iPhone 14 Pro Max', customer: 'Rajesh Kumar', rating: 5, comment: 'Excellent product! Great quality.', date: '2025-10-31', status: 'approved' },
    { _id: 2, product: 'MacBook Air M2', customer: 'Priya Singh', rating: 4, comment: 'Good, but shipping took time', date: '2025-10-30', status: 'approved' },
    { _id: 3, product: 'Formal Shirt', customer: 'Amit Patel', rating: 3, comment: 'Average quality, sizing issue', date: '2025-10-29', status: 'pending' }
  ]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = (id) => {
    setReviews(reviews.filter(r => r._id !== id));
    message.success('Review deleted');
  };

  const handleApprove = (id) => {
    setReviews(reviews.map(r => r._id === id ? { ...r, status: 'approved' } : r));
    message.success('Review approved');
  };

  const filteredReviews = reviews.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = searchText === '' || r.product.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: 150,
      render: (_, record) => <strong>{record.product}</strong>
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 120
    },
    {
      title: 'Rating',
      key: 'rating',
      width: 100,
      render: (_, record) => <Rate value={record.rating} disabled />
    },
    {
      title: 'Comment',
      key: 'comment',
      width: 250,
      render: (_, record) => <div style={{ fontSize: 12, color: '#666' }}>{record.comment}</div>
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => <Tag color={record.status === 'approved' ? 'green' : 'orange'}>{record.status.toUpperCase()}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" icon={<CommentOutlined />}>Reply</Button>
          {record.status === 'pending' && (
            <Button size="small" type="link" onClick={() => handleApprove(record._id)}>Approve</Button>
          )}
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}> Reviews & Ratings</h2>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search reviews..."
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
            <Select.Option value="all">All Reviews</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
          </Select>
        </div>
      </Card>

      <Table 
        dataSource={filteredReviews} 
        columns={columns} 
        rowKey="_id" 
        pagination={{ pageSize: 10 }} 
        scroll={{ x: 1000 }} 
      />
    </div>
  );
}
