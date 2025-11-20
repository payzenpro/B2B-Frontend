import { useEffect, useState } from "react";
import { Table, Card, Tag, Button, Modal, Descriptions, message, Select, Input } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";

const API_BASE_URL = 'http://localhost:4000/api';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Please login first!');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/order`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        message.success(`Loaded ${data.count} order`);
      }
    } catch (error) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchSearch = searchText === '' || 
      order.orderId?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    { 
      title: 'Order ID', 
      dataIndex: 'orderId', 
      key: 'orderId',
      render: (text) => <strong>{text}</strong>
    },
    { 
      title: 'Customer', 
      dataIndex: ['customerId', 'name'], 
      key: 'customer'
    },
    { 
      title: 'Amount', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (amount) => `₹${Number(amount).toLocaleString()}`
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const colors = {
          'pending': 'orange',
          'processing': 'blue',
          'shipped': 'cyan',
          'delivered': 'green',
          'cancelled': 'red'
        };
        return <Tag color={colors[status]}>{status?.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Date', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-IN')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewClick(record)}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div>
      <Card title="Orders Management">
        <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
          <Input 
            prefix={<SearchOutlined />}
            placeholder="Search order ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select 
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="processing">Processing</Select.Option>
            <Select.Option value="shipped">Shipped</Select.Option>
            <Select.Option value="delivered">Delivered</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
          </Select>
        </div>

        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Order Details - ${selectedOrder?.orderId}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Order ID" span={2}>
              <strong>{selectedOrder.orderId}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {selectedOrder.customerId?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              ₹{Number(selectedOrder.totalAmount).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedOrder.status === 'delivered' ? 'green' : 'orange'}>
                {selectedOrder.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
