import { Table, Card, Tag, Button, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { getOrders } from '../../app/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        console.log('Orders data:', data); 
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => <strong>{id || 'N/A'}</strong>
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name) => name || 'N/A'
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
      render: (email) => email || 'N/A'
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products) => {
        if (!products || !Array.isArray(products)) return 'No products';
        return (
          <div>
            {products.map((p, i) => (
              <div key={i}>{p?.name || 'Unknown'} × {p?.quantity || 0}</div>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => {
        if (!total) return '₹0';
        return `₹${Number(total).toLocaleString()}`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pending: 'orange',
          processing: 'blue',
          delivered: 'green',
          canceled: 'red',
          refunded: 'purple'
        };
        return <Tag color={colors[status] || 'default'}>{status || 'N/A'}</Tag>;
      }
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'paymentStatus',
      render: (payment) => {
        const status = payment?.status || 'pending';
        return <Tag color={status === 'completed' ? 'green' : 'orange'}>{status}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => {
        if (!date) return 'N/A';
        try {
          return new Date(date).toLocaleDateString();
        } catch (e) {
          return 'Invalid date';
        }
      }
    }
  ];

  if (!orders || orders.length === 0) {
    return (
      <Card title="Orders" loading={loading}>
        <Empty description="No orders found" />
      </Card>
    );
  }

  return (
    <Card title="Orders" loading={loading}>
      <Table 
        dataSource={orders} 
        columns={columns} 
        rowKey={(record) => record._id || record.orderId || Math.random()}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
