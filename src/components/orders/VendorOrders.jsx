import { useState, useEffect } from "react";
import { Table, Tag, Select, message, Button } from "antd";
import { getOrders, updateOrderStatus } from '../../app/api'; 


export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Status colors dictionary
  const statusColors = {
    unassigned: 'orange',
    accepted: 'blue',
    packaging: 'cyan',
    out_for_delivery: 'purple',
    delivered: 'green',
    canceled: 'red',
    refunded: 'magenta'
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(); 
      setOrders(data);
      message.success(`Loaded ${data.length} orders`);
    } catch (error) {
      message.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle order status change and update API
  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await updateOrderStatus(orderId, status);
      if (res.success) {
        setOrders(orders.map(o => (o._id === orderId ? { ...o, status } : o)));
        message.success(`Order status updated to: ${status.replace('_', ' ')}`);
      } else {
        message.error('Failed to update order status');
      }
    } catch (error) {
      message.error('Error updating order status');
      console.error(error);
    }
  };

  const columns = [
    { title: 'Order #', dataIndex: 'orderId', key: 'orderId', width: 120 },
    { title: 'Customer', dataIndex: ['customerId', 'name'], key: 'customer' },
    { title: 'Total', dataIndex: 'totalAmount', key: 'total', render: (t) => `₹${t}`, width: 100 },
    { title: 'Date', dataIndex: 'createdAt', key: 'date', width: 140 },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      width: 140,
      render: (status) => <Tag color={statusColors[status]}>{status.replace('_', ' ').toUpperCase()}</Tag> 
    },
    {
      title: 'Change Status',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Select 
          size="small" 
          value={record.status} 
          onChange={(val) => handleStatusChange(record._id, val)}
          style={{ width: 160 }}
        >
          <Select.Option value="unassigned">Unassigned</Select.Option>
          <Select.Option value="accepted">Accepted</Select.Option>
          <Select.Option value="packaging">Packaging</Select.Option>
          <Select.Option value="out_for_delivery">Out for Delivery</Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
          <Select.Option value="refunded">Refunded</Select.Option>
        </Select>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Orders Management</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Select defaultValue="all" style={{ width: 140 }}>
            <Select.Option value="all">All Orders</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
          <Button>Export</Button>
        </div>
      </div>
      <Table 
        dataSource={orders} 
        columns={columns} 
        rowKey="_id" 
        pagination={{ pageSize: 10 }} 
        loading={loading}
      />
    </div>
  );
}
