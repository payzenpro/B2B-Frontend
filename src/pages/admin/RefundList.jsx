import React, { useEffect, useState } from "react";
import { Table, Card, Tag, Spin, Empty, Button, Modal, Descriptions, Row, Col, Statistic, Input, Select, message, Popconfirm } from "antd";
import { EyeOutlined, SearchOutlined, DollarOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

const API_BASE_URL = 'http://localhost:4000/api';

export default function RefundList() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      console.log(' Fetching refunds...');
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error(' No token found');
        message.error('Please login first!');
        setLoading(false);
        return;
      }

      console.log('Token:', token.substring(0, 20) + '...');

      const response = await axios.get(`${API_BASE_URL}/refunds`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' Response:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        setRefunds(response.data.data);
        message.success(`Loaded ${response.data.data.length} refunds`);
        console.log(' Refunds:', response.data.data);
      } else {
        console.warn(' Invalid response:', response.data);
        setRefunds([]);
        message.warning('No refunds found');
      }
    } catch (error) {
      console.error(' Error:', error);
      console.error('Status:', error.response?.status);
      console.error(' Data:', error.response?.data);
      
      // if (error.response?.status === 401) {
      //   message.error(' Session expired! Please login again.');
      // } else {
      //   message.error('Failed to load refunds');
      // }
      
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (refund) => {
    setSelectedRefund(refund);
    setIsModalOpen(true);
  };

  const handleApprove = async (refundId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/refunds/${refundId}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success(' Refund approved!');
      fetchRefunds();
    } catch (error) {
      console.error('Approve Error:', error);
      if (error.response?.status === 404) {
        message.error(' Approve endpoint not found. Check routes.');
      } else {
        message.error(' Error approving refund');
      }
    }
  };

  const handleReject = async (refundId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/refunds/${refundId}/reject`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success(' Refund rejected!');
      fetchRefunds();
    } catch (error) {
      console.error(' Reject Error:', error);
      if (error.response?.status === 404) {
        message.error(' Reject endpoint not found. Check routes.');
      } else {
        message.error(' Error rejecting refund');
      }
    }
  };

  const filteredRefunds = refunds.filter(refund => {
    const matchStatus = filterStatus === 'all' || refund.status === filterStatus;
    const matchSearch = searchText === '' || 
      refund.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
      refund.customerName?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    { 
      title: 'Order ID', 
      dataIndex: 'orderId', 
      key: 'orderId', 
      width: 130,
      render: (text) => <strong>{text || 'N/A'}</strong> 
    },
    { 
      title: 'Customer', 
      dataIndex: 'customerName', 
      key: 'customerName',
      width: 150
    },
    { 
      title: 'Reason', 
      dataIndex: 'reason', 
      key: 'reason',
      width: 200,
      render: (reason) => <span style={{ color: '#666' }}>{reason}</span> 
    },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount',
      width: 120,
      render: (amount) => <strong style={{ color: '#52c41a' }}>₹{Number(amount).toLocaleString('en-IN')}</strong> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = { 
          'requested': 'orange',
          'pending': 'orange', 
          'approved': 'green', 
          'rejected': 'red', 
          'processed': 'blue' 
        };
        return <Tag color={colors[status] || 'default'}>{status?.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Date', 
      dataIndex: 'requestedAt', 
      key: 'requestedAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('en-IN') 
    },
    {
      title: 'Action',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewClick(record)}
          >
            View
          </Button>
          {(record.status === 'pending' || record.status === 'requested') && (
            <>
              <Popconfirm 
                title="Approve this refund?" 
                onConfirm={() => handleApprove(record._id)}
              >
                <Button 
                  type="primary" 
                  size="small" 
                  style={{ background: '#52c41a', borderColor: '#52c41a' }} 
                  icon={<CheckOutlined />}
                >
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm 
                title="Reject this refund?" 
                onConfirm={() => handleReject(record._id)}
              >
                <Button 
                  danger 
                  size="small" 
                  icon={<CloseOutlined />}
                >
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
          {record.status !== 'pending' && record.status !== 'requested' && (
            <Tag color={record.status === 'approved' ? 'green' : 'red'}>
              {record.status === 'approved' ? '✓ Processed' : '✗ Rejected'}
            </Tag>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading refunds..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}> Refunds Management</h2>
        <div style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
          Total: ₹{filteredRefunds.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}
        </div>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Search order ID or customer..." 
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
          <Select.Option value="requested">Requested</Select.Option>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="approved">Approved</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
          <Select.Option value="processed">Processed</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Refunds" 
              value={filteredRefunds.length} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Pending" 
              value={filteredRefunds.filter(r => r.status === 'pending' || r.status === 'requested').length} 
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Approved" 
              value={filteredRefunds.filter(r => r.status === 'approved').length} 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Amount" 
              value={`₹${filteredRefunds.reduce((s, r) => s + (r.amount || 0), 0).toLocaleString()}`} 
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="📋 Refund Requests">
        {filteredRefunds.length === 0 ? (
          <Empty description="No refunds found" />
        ) : (
          <Table 
            dataSource={filteredRefunds} 
            columns={columns} 
            rowKey="_id" 
            pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} refunds` }} 
            scroll={{ x: 1300 }} 
          />
        )}
      </Card>

      <Modal 
        title={` Refund Details - ${selectedRefund?.orderId}`} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null} 
        width={700}
      >
        {selectedRefund && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Order ID" span={2}>
              <strong>{selectedRefund.orderId}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {selectedRefund.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRefund.customerEmail}
            </Descriptions.Item>
            <Descriptions.Item label="Amount" span={2}>
              <strong style={{ fontSize: 18, color: '#52c41a' }}>
                ₹{Number(selectedRefund.amount).toLocaleString()}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Reason" span={2}>
              {selectedRefund.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedRefund.status === 'pending' || selectedRefund.status === 'requested' ? 'orange' : 
                selectedRefund.status === 'approved' ? 'green' : 'red'
              }>
                {selectedRefund.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Requested Date">
              {new Date(selectedRefund.requestedAt).toLocaleDateString('en-IN')}
            </Descriptions.Item>
            {selectedRefund.processedAt && (
              <Descriptions.Item label="Processed Date" span={2}>
                {new Date(selectedRefund.processedAt).toLocaleDateString('en-IN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
