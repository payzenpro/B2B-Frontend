import { useEffect, useState } from "react";
import { Table, Input, Card, Button, Tag, message } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function AdminCustomerList() {
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
        message.error('No customers found');
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

  const handleViewClick = (customerId) => {
    navigate(`/customer-list/${customerId}/dashboard`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders) => orders || 0,
    },
    {
      title: 'Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (spent) => `₹${Number(spent || 0).toLocaleString()}`,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-IN'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status || 'active'}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewClick(record._id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="👥 Admin - Customer List">
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
          pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} customers` }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
}
