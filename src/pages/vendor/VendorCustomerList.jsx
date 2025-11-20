import { useEffect, useState } from "react";
import { Table, Input, Card, Button, Tag, message, Statistic, Row, Col } from "antd";
import { SearchOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function VendorCustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login first!');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/all-users?role=customer', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customers');
      }
      
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setCustomers(data.data);
        message.success(`Loaded ${data.data.length} customers`);
      } else {
        setCustomers([]);
        message.warning('No customers found');
      }

    } catch (error) {
      message.error(error.message || 'Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 16
          }}>
            {record.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 100,
      render: (orders) => <Tag color="blue">{orders || 0} orders</Tag>,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 130,
      render: (spent) => <strong style={{ color: '#52c41a' }}>₹{Number(spent || 0).toLocaleString()}</strong>,
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date) => new Date(date).toLocaleDateString('en-IN'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status || 'active'}</Tag>,
    },
  ];

  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div>
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Customers" 
              value={customers.length} 
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Active Customers" 
              value={activeCustomers} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Inactive Customers" 
              value={inactiveCustomers} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Revenue" 
              value={totalSpent}
              prefix="₹"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Card */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Customer List (Vendor View)</span>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name, email, or phone..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', maxWidth: 400 }}
            allowClear
          />
        </div>

        <Table
          dataSource={filteredCustomers}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            showTotal: (total) => `Total ${total} customers`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
