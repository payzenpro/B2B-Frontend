import React, { useState, useEffect } from 'react';
import {Card,Table,Rate, Tag, Button, Modal, Input,message,Space,Avatar,Row,Col,Statistic,Progress} from 'antd';
import { StarOutlined,UserOutlined,MessageOutlined} from '@ant-design/icons';

const API_BASE = 'http://localhost:4000/api';

export default function VendorReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/vendor/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setReviews(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      message.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/reviews/${selectedReview._id}/respond`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: replyText })
      });

      const data = await res.json();

      if (data.success) {
        message.success('Response posted successfully');
        setReplyModal(false);
        setReplyText('');
        fetchReviews();
      }
    } catch (error) {
      message.error('Failed to post response');
    }
  };

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.customer?.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
      width: 200
    },
    {
      title: 'Rating',
      key: 'rating',
      width: 150,
      render: (_, record) => (
        <div>
          <Rate disabled value={record.rating} style={{ fontSize: 16 }} />
          <div style={{ marginTop: 4 }}>
            <Tag color={record.rating >= 4 ? 'green' : record.rating >= 3 ? 'orange' : 'red'}>
              {record.rating} Stars
            </Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Review',
      key: 'comment',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>{record.comment}</div>
          {record.isVerifiedPurchase && (
            <Tag color="blue">Verified Purchase</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Response',
      key: 'response',
      width: 150,
      render: (_, record) => (
        record.vendorResponse ? (
          <Tag color="green">Responded</Tag>
        ) : (
          <Button
            size="small"
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => {
              setSelectedReview(record);
              setReplyModal(true);
            }}
          >
            Reply
          </Button>
        )
      )
    }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Customer Reviews</h1>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Reviews"
                value={stats.totalReviews}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Average Rating"
                value={stats.avgRating}
                suffix="/ 5"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ marginBottom: 8 }}>Rating Distribution</div>
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} style={{ marginBottom: 4 }}>
                  <span style={{ width: 60, display: 'inline-block' }}>
                    {star} 
                  </span>
                  <Progress
                    percent={(stats.ratingDistribution[star] / stats.totalReviews * 100).toFixed(0)}
                    size="small"
                    style={{ width: 150, display: 'inline-block' }}
                  />
                  <span style={{ marginLeft: 8 }}>
                    ({stats.ratingDistribution[star]})
                  </span>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      )}

      {/* Reviews Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Reply Modal */}
      <Modal
        title="Reply to Review"
        open={replyModal}
        onOk={handleReply}
        onCancel={() => {
          setReplyModal(false);
          setReplyText('');
        }}
      >
        <Input.TextArea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your response..."
        />
      </Modal>
    </div>
  );
}
