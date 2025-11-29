
// import { useState } from "react";
// import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Card, Row, Col, Drawer, Steps, Statistic } from "antd";
// import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";

// export default function VendorOrderRefunds() {
//   const [refunds, setRefunds] = useState([
//     {
//       _id: '1',
//       refundNo: 'REF-001',
//       orderNo: 'ORD-001',
//       customer: 'Rajesh Kumar',
//       phone: '9876543210',
//       amount: 174250,
//       reason: 'Product defective',
//       status: 'approved',
//       requestDate: '2025-10-30',
//       approvalDate: '2025-10-31',
//       refundDate: '2025-10-31',
//       paymentMethod: 'card',
//       items: [
//         { name: 'iPhone 14 Pro Max', qty: 1, price: 120000 }
//       ],
//       notes: 'Device had screen issue'
//     },
//     {
//       _id: '2',
//       refundNo: 'REF-002',
//       orderNo: 'ORD-002',
//       customer: 'Priya Singh',
//       phone: '9876543211',
//       amount: 142999,
//       reason: 'Wrong item sent',
//       status: 'pending',
//       requestDate: '2025-10-31',
//       approvalDate: null,
//       refundDate: null,
//       paymentMethod: 'upi',
//       items: [
//         { name: 'MacBook Air M2', qty: 1, price: 129999 }
//       ],
//       notes: 'Customer received different model'
//     },
//     {
//       _id: '3',
//       refundNo: 'REF-003',
//       orderNo: 'ORD-003',
//       customer: 'Amit Patel',
//       phone: '9876543212',
//       amount: 3998,
//       reason: 'Size issue',
//       status: 'processing',
//       requestDate: '2025-10-29',
//       approvalDate: '2025-10-30',
//       refundDate: null,
//       paymentMethod: 'cash',
//       items: [
//         { name: 'Formal Shirt (Blue)', qty: 2, price: 1999 }
//       ],
//       notes: 'Size was too small'
//     },
//     {
//       _id: '4',
//       refundNo: 'REF-004',
//       orderNo: 'ORD-004',
//       customer: 'Neha Sharma',
//       phone: '9876543213',
//       amount: 773,
//       reason: 'Expired product',
//       status: 'pending',
//       requestDate: '2025-10-28',
//       approvalDate: '2025-10-29',
//       refundDate: null,
//       paymentMethod: 'wallet',
//       items: [
//         { name: 'Paracetamol (500mg)', qty: 3, price: 35 }
//       ],
//       notes: 'Customer did not check expiry date'
//     },
//     {
//       _id: '5',
//       refundNo: 'REF-005',
//       orderNo: 'ORD-005',
//       customer: 'Vikram Singh',
//       phone: '9876543214',
//       amount: 1077,
//       reason: 'Changed mind',
//       status: 'approved',
//       requestDate: '2025-10-25',
//       approvalDate: '2025-10-26',
//       refundDate: '2025-10-27',
//       paymentMethod: 'cash',
//       items: [
//         { name: 'Basmati Rice (5kg)', qty: 1, price: 599 }
//       ],
//       notes: 'Customer returned unopened product'
//     }
//   ]);

//   const [searchText, setSearchText] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedRefund, setSelectedRefund] = useState(null);
//   const [form] = Form.useForm();

//   const statusColors = {
//     pending: 'orange',
//     processing: 'blue',
//     approved: 'green',
//     rejected: 'red'
//   };

//   const statusSteps = {
//     pending: 0,
//     processing: 1,
//     approved: 2,
//     rejected: 2
//   };

//   const handleViewRefund = (refund) => {
//     setSelectedRefund(refund);
//     setDrawerOpen(true);
//   };

//   const handleApproveRefund = (id) => {
//     setRefunds(refunds.map(refund =>
//       refund._id === id 
//         ? { ...refund, status: 'approved', approvalDate: new Date().toISOString().split('T')[0] } 
//         : refund
//     ));
//     message.success('Refund approved!');
//     setDrawerOpen(false);
//   };

//   const handleRejectRefund = (id) => {
//     Modal.confirm({
//       title: 'Reject Refund?',
//       content: 'Enter reason for rejection:',
//       okText: 'Reject',
//       cancelText: 'Cancel',
//       onOk() {
//         setRefunds(refunds.map(refund =>
//           refund._id === id 
//             ? { ...refund, status: 'rejected', approvalDate: new Date().toISOString().split('T')[0] } 
//             : refund
//         ));
//         message.success('Refund rejected!');
//         setDrawerOpen(false);
//       }
//     });
//   };

//   const handleProcessRefund = (id) => {
//     setRefunds(refunds.map(refund =>
//       refund._id === id 
//         ? { ...refund, status: 'processing' } 
//         : refund
//     ));
//     message.success('Refund processing started!');
//     setDrawerOpen(false);
//   };

//   const handleCompleteRefund = (id) => {
//     setRefunds(refunds.map(refund =>
//       refund._id === id 
//         ? { ...refund, refundDate: new Date().toISOString().split('T')[0] } 
//         : refund
//     ));
//     message.success('Refund completed!');
//     setDrawerOpen(false);
//   };

//   const filteredRefunds = refunds.filter(refund => {
//     const matchStatus = filterStatus === 'all' || refund.status === filterStatus;
//     const matchSearch = searchText === '' ||
//       refund.refundNo.toLowerCase().includes(searchText.toLowerCase()) ||
//       refund.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
//       refund.customer.toLowerCase().includes(searchText.toLowerCase());
//     return matchStatus && matchSearch;
//   });

//   const columns = [
//     {
//       title: 'Refund No',
//       key: 'refundNo',
//       width: 120,
//       render: (_, record) => (
//         <div style={{ fontWeight: 600, color: '#1890ff' }}>
//           {record.refundNo}
//         </div>
//       )
//     },
//     {
//       title: 'Order No',
//       key: 'orderNo',
//       width: 120,
//       render: (_, record) => (
//         <div style={{ color: '#666' }}>
//           {record.orderNo}
//         </div>
//       )
//     },
//     {
//       title: 'Customer',
//       key: 'customer',
//       width: 150,
//       render: (_, record) => (
//         <div>
//           <div style={{ fontWeight: 600 }}>{record.customer}</div>
//           <div style={{ fontSize: 12, color: '#888' }}>{record.phone}</div>
//         </div>
//       )
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       width: 120,
//       render: (amount) => (
//         <div style={{ fontWeight: 700, color: '#1890ff' }}>
//           ₹{amount.toLocaleString()}
//         </div>
//       )
//     },
//     {
//       title: 'Reason',
//       dataIndex: 'reason',
//       key: 'reason',
//       width: 150
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       width: 120,
//       render: (_, record) => (
//         <Tag color={statusColors[record.status]}>
//           {record.status.toUpperCase()}
//         </Tag>
//       )
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       width: 150,
//       render: (_, record) => (
//         <Space size="small">
//           <Button
//             size="small"
//             type="link"
//             icon={<EyeOutlined />}
//             onClick={() => handleViewRefund(record)}
//           >
//             View
//           </Button>
//         </Space>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div style={{ marginBottom: 16 }}>
//         <h2 style={{ margin: 0 }}>Order Refunds Management</h2>
//       </div>

//       <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//         <Card style={{ minWidth: 150 }}>
//           <div style={{ fontSize: 12, color: '#888' }}>Total Refunds</div>
//           <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
//             {filteredRefunds.length}
//           </div>
//         </Card>
//         <Card style={{ minWidth: 150 }}>
//           <div style={{ fontSize: 12, color: '#888' }}>Pending</div>
//           <div style={{ fontSize: 20, fontWeight: 700, color: '#faad14' }}>
//             {filteredRefunds.filter(r => r.status === 'pending').length}
//           </div>
//         </Card>
//         <Card style={{ minWidth: 150 }}>
//           <div style={{ fontSize: 12, color: '#888' }}>Approved</div>
//           <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
//             {filteredRefunds.filter(r => r.status === 'approved').length}
//           </div>
//         </Card>
//         <Card style={{ minWidth: 150 }}>
//           <div style={{ fontSize: 12, color: '#888' }}>Total Amount</div>
//           <div style={{ fontSize: 18, fontWeight: 700, color: '#ff4d4f' }}>
//             ₹{filteredRefunds.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
//           </div>
//         </Card>
//       </div>

//       <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//         <Input
//           prefix={<SearchOutlined />}
//           placeholder="Search by refund/order no or customer..."
//           style={{ width: 300 }}
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           allowClear
//         />

//         <Select
//           value={filterStatus}
//           onChange={setFilterStatus}
//           style={{ width: 150 }}
//         >
//           <Select.Option value="all">All Status</Select.Option>
//           <Select.Option value="pending">Pending</Select.Option>
//           <Select.Option value="processing">Processing</Select.Option>
//           <Select.Option value="approved">Approved</Select.Option>
//           <Select.Option value="rejected">Rejected</Select.Option>
//         </Select>
//       </div>

//       <Table
//         dataSource={filteredRefunds}
//         columns={columns}
//         rowKey="_id"
//         pagination={{ pageSize: 10 }}
//         scroll={{ x: 1200 }}
//       />

//       {/* Refund Details Drawer */}
//       <Drawer
//         title={`Refund Details - ${selectedRefund?.refundNo}`}
//         onClose={() => setDrawerOpen(false)}
//         open={drawerOpen}
//         width={500}
//       >
//         {selectedRefund && (
//           <div>
//             <div style={{ marginBottom: 20 }}>
//               <h3>Refund Status</h3>
//               <Steps
//                 current={statusSteps[selectedRefund.status]}
//                 items={[
//                   { title: 'Pending' },
//                   { title: 'Processing' },
//                   { title: selectedRefund.status === 'rejected' ? 'Rejected' : 'Approved', icon: selectedRefund.status === 'rejected' ? <CloseCircleOutlined /> : <CheckCircleOutlined /> }
//                 ]}
//               />
//             </div>

//             <div style={{ marginBottom: 20, background: '#f6f8fb', padding: 12, borderRadius: 6 }}>
//               <Statistic title="Refund Amount" value={selectedRefund.amount} prefix="₹" />
//             </div>

//             <div style={{ marginBottom: 20 }}>
//               <h3>Order Information</h3>
//               <div style={{ marginBottom: 8 }}>
//                 <strong>Order No:</strong> {selectedRefund.orderNo}
//               </div>
//               <div style={{ marginBottom: 8 }}>
//                 <strong>Customer:</strong> {selectedRefund.customer}
//               </div>
//               <div style={{ marginBottom: 8 }}>
//                 <strong>Phone:</strong> {selectedRefund.phone}
//               </div>
//             </div>

//             <div style={{ marginBottom: 20 }}>
//               <h3>Refund Reason</h3>
//               <div style={{ background: '#fff7e6', padding: 12, borderRadius: 6, marginBottom: 8 }}>
//                 <strong>{selectedRefund.reason}</strong>
//               </div>
//               <div style={{ marginBottom: 8 }}>
//                 <strong>Notes:</strong> {selectedRefund.notes}
//               </div>
//             </div>

//             <div style={{ marginBottom: 20 }}>
//               <h3>Items in Refund</h3>
//               {selectedRefund.items.map((item, idx) => (
//                 <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
//                   <div>
//                     <div style={{ fontWeight: 600 }}>{item.name}</div>
//                     <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.qty}</div>
//                   </div>
//                   <div style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString()}</div>
//                 </div>
//               ))}
//             </div>

//             <div style={{ marginBottom: 20 }}>
//               <h3>Timeline</h3>
//               <div style={{ marginBottom: 8 }}>
//                 <strong>Request Date:</strong> {selectedRefund.requestDate}
//               </div>
//               {selectedRefund.approvalDate && (
//                 <div style={{ marginBottom: 8 }}>
//                   <strong>Approval Date:</strong> {selectedRefund.approvalDate}
//                 </div>
//               )}
//               {selectedRefund.refundDate && (
//                 <div style={{ marginBottom: 8 }}>
//                   <strong>Refund Date:</strong> {selectedRefund.refundDate}
//                 </div>
//               )}
//             </div>

//             {selectedRefund.status === 'pending' && (
//               <div style={{ display: 'flex', gap: 8 }}>
//                 <Button type="primary" block onClick={() => handleApproveRefund(selectedRefund._id)} icon={<CheckCircleOutlined />}>
//                   Approve Refund
//                 </Button>
//                 <Button danger block onClick={() => handleRejectRefund(selectedRefund._id)} icon={<CloseCircleOutlined />}>
//                   Reject Refund
//                 </Button>
//               </div>
//             )}

//             {selectedRefund.status === 'approved' && !selectedRefund.refundDate && (
//               <Button type="primary" block onClick={() => handleCompleteRefund(selectedRefund._id)} icon={<DollarOutlined />}>
//                 Mark as Refunded
//               </Button>
//             )}
//           </div>
//         )}
//       </Drawer>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Tag,
  Card,
  Row,
  Col,
  Drawer,
  Steps,
  Statistic,
  Select,
  Input,
  Space,
  Popconfirm,
  Spin,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function VendorOrderRefunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusColors = {
    pending: "orange",
    processing: "blue",
    approved: "green",
    rejected: "red",
  };

  const statusSteps = {
    pending: 0,
    processing: 1,
    approved: 2,
    rejected: 2,
  };

  // API se refunds fetch karo
  useEffect(() => {
    const fetchRefunds = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Please login first!");
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE}/refunds`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setRefunds(response.data.data);
        } else {
          setRefunds([]);
          message.warning("No refunds found");
        }
      } catch (error) {
        message.error("Failed to load refunds");
        setRefunds([]);
        console.error("Fetch refunds error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Filters aur search lagao
  const filteredRefunds = refunds.filter((refund) => {
    const matchStatus = filterStatus === "all" || refund.status === filterStatus;
    const matchSearch =
      searchText === "" ||
      refund.refundNo.toLowerCase().includes(searchText.toLowerCase()) ||
      refund.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Drawer open karne ke liye
  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setDrawerOpen(true);
  };

  // API calls ke jaga local state update ka example handlers
  const handleApproveRefund = (id) => {
    setRefunds(
      refunds.map((refund) =>
        refund._id === id
          ? { ...refund, status: "approved", approvalDate: new Date().toISOString().split("T")[0] }
          : refund
      )
    );
    message.success("Refund approved!");
    setDrawerOpen(false);
  };

  const handleRejectRefund = (id) => {
    Modal.confirm({
      title: "Reject Refund?",
      content: "Enter reason for rejection:",
      okText: "Reject",
      cancelText: "Cancel",
      onOk() {
        setRefunds(
          refunds.map((refund) =>
            refund._id === id
              ? { ...refund, status: "rejected", approvalDate: new Date().toISOString().split("T")[0] }
              : refund
          )
        );
        message.success("Refund rejected!");
        setDrawerOpen(false);
      },
    });
  };

  const handleProcessRefund = (id) => {
    setRefunds(
      refunds.map((refund) =>
        refund._id === id ? { ...refund, status: "processing" } : refund
      )
    );
    message.success("Refund processing started!");
    setDrawerOpen(false);
  };

  const handleCompleteRefund = (id) => {
    setRefunds(
      refunds.map((refund) =>
        refund._id === id ? { ...refund, refundDate: new Date().toISOString().split("T")[0] } : refund
      )
    );
    message.success("Refund completed!");
    setDrawerOpen(false);
  };

  // Table columns define karo
  const columns = [
    {
      title: "Refund No",
      key: "refundNo",
      width: 120,
      render: (_, record) => (
        <div style={{ fontWeight: 600, color: "#1890ff" }}>{record.refundNo}</div>
      ),
    },
    {
      title: "Order No",
      key: "orderNo",
      width: 120,
      render: (_, record) => <div style={{ color: "#666" }}>{record.orderNo}</div>,
    },
    {
      title: "Customer",
      key: "customer",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.customer}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) => (
        <div style={{ fontWeight: 700, color: "#1890ff" }}>
          ₹{amount.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 150,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Tag color={statusColors[record.status]}>{record.status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewRefund(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading refunds..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Order Refunds Management</h2>
      </div>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by refund/order no or customer..."
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />

        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Option value="all">All Status</Option>
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Refunds"
              value={filteredRefunds.length}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Pending"
              value={filteredRefunds.filter((r) => r.status === "pending").length}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Approved"
              value={filteredRefunds.filter((r) => r.status === "approved").length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Amount"
              value={`₹${filteredRefunds.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filteredRefunds}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Drawer
        title={`Refund Details - ${selectedRefund?.refundNo}`}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={500}
      >
        {selectedRefund && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3>Refund Status</h3>
              <Steps
                current={statusSteps[selectedRefund.status]}
                items={[
                  { title: "Pending" },
                  { title: "Processing" },
                  {
                    title:
                      selectedRefund.status === "rejected"
                        ? "Rejected"
                        : "Approved",
                    icon:
                      selectedRefund.status === "rejected" ? (
                        <CloseCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      ),
                  },
                ]}
              />
            </div>

            <div
              style={{
                marginBottom: 20,
                background: "#f6f8fb",
                padding: 12,
                borderRadius: 6,
              }}
            >
              <Statistic
                title="Refund Amount"
                value={selectedRefund.amount}
                prefix="₹"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3>Order Information</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Order No:</strong> {selectedRefund.orderNo}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Customer:</strong> {selectedRefund.customer}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Phone:</strong> {selectedRefund.phone}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3>Refund Reason</h3>
              <div
                style={{
                  background: "#fff7e6",
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <strong>{selectedRefund.reason}</strong>
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Notes:</strong> {selectedRefund.notes}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3>Items in Refund</h3>
              {selectedRefund.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    paddingBottom: 8,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Qty: {item.qty}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    ₹{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3>Timeline</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Request Date:</strong> {selectedRefund.requestDate}
              </div>
              {selectedRefund.approvalDate && (
                <div style={{ marginBottom: 8 }}>
                  <strong>Approval Date:</strong> {selectedRefund.approvalDate}
                </div>
              )}
              {selectedRefund.refundDate && (
                <div style={{ marginBottom: 8 }}>
                  <strong>Refund Date:</strong> {selectedRefund.refundDate}
                </div>
              )}
            </div>

            {selectedRefund.status === "pending" && (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  type="primary"
                  block
                  onClick={() => handleApproveRefund(selectedRefund._id)}
                  icon={<CheckCircleOutlined />}
                >
                  Approve Refund
                </Button>
                <Button
                  danger
                  block
                  onClick={() => handleRejectRefund(selectedRefund._id)}
                  icon={<CloseCircleOutlined />}
                >
                  Reject Refund
                </Button>
              </div>
            )}

            {selectedRefund.status === "approved" && !selectedRefund.refundDate && (
              <Button
                type="primary"
                block
                onClick={() => handleCompleteRefund(selectedRefund._id)}
                icon={<DollarOutlined />}
              >
                Mark as Refunded
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
