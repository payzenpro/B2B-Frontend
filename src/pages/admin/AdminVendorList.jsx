import { useEffect, useState } from "react";
import { Table, Input, Card, Button, Tag, message } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function AdminVendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      console.log(' Fetching vendors...');
      
      const token = localStorage.getItem('token');
      
     
if (!token) {
  message.error('Please login first!');
  setLoading(false);
  return;
}

const response = await fetch('http://localhost:4000/api/auth/all-users?role=vendor', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || 'Failed to fetch vendors');

  
}



const data = await response.json();

      console.log(' Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vendors');
      }

      let vendorsArray = [];
      if (data.success && Array.isArray(data.data)) {
        vendorsArray = data.data;
      } else if (Array.isArray(data)) {
        vendorsArray = data;
      }
      
      setVendors(vendorsArray);
      message.success(` Loaded ${vendorsArray.length} vendors`);
      console.log(' Vendors:', vendorsArray);
      
    } catch (error) {
      console.error(' Error:', error);
      message.error('Failed to load vendors');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    (vendor.storeName?.toLowerCase().includes(searchText.toLowerCase()) ||
    vendor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleViewClick = (vendorId) => {
    navigate(`/vendor-list/${vendorId}/dashboard`);
  };

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
      render: (text) => <strong>{text || 'N/A'}</strong>
    },
    {
      title: 'Owner',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders) => orders || 0
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (rev) => `₹${Number(rev || 0).toLocaleString()}`
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => ` ${rating || 0}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status || 'active'}</Tag>
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
      )
    }
  ];

  // return (
  //   <div>
  //     <Card title=" Admin - Vendor List">
  //       <div style={{ marginBottom: 16 }}>
  //         <Input
  //           placeholder="Search by store name, owner, or email..."
  //           prefix={<SearchOutlined />}
  //           value={searchText}
  //           onChange={(e) => setSearchText(e.target.value)}
  //           style={{ width: '100%', maxWidth: 400 ,background:'#fff'}}
  //           allowClear
  //         />
  //       </div>

  //       <Table
  //         dataSource={filteredVendors}
  //         columns={columns}
  //         rowKey="_id"
  //         loading={loading}
  //         pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} vendors` }}
  //         scroll={{ x: 1200 }}
  //       />
  //     </Card>
  //   </div>
  // );

return (
  <div
    style={{
      minHeight: '100vh',
      padding: '30px',
      background: 'linear-gradient(135deg, #6e00ff 0%, #00eaff 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      transition: 'all 0.4s ease',
    }}
  >
    <Card
      title="✨ Admin - Vendor List"
      style={{
        width: '100%',
        maxWidth: '1200px',
        borderRadius: '16px',
        border: 'none',
        padding: '16px 0',
        background: 'rgba(255, 255, 255, 0.20)',
        boxShadow: '0 14px 40px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
        animation: 'fadeIn 0.6s ease',
      }}
      headStyle={{
        fontSize: '22px',
        fontWeight: '700',
        color: '#fff',
        textShadow: '0 0 6px rgba(255,255,255,0.6)',
      }}
    >
      {/* Search Box */}
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
        <Input
          placeholder="Search vendors by name, owner, or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: '50px',
            padding: '10px 20px',
            border: '1px solid #ffffff66',
            background: 'rgba(255,255,255,0.95)',
            transition: '0.3s',
          }}
          onFocus={(e) => (e.target.style.boxShadow = '0 0 12px rgba(255,255,255,0.8)')}
          onBlur={(e) => (e.target.style.boxShadow = 'none')}
        />
      </div>

      {/* Table */}
      <Table
        dataSource={filteredVendors}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} vendors`,
        }}
        scroll={{ x: 1200 }}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          animation: 'slideUp 0.7s ease',
        }}
      />

      <style>
        {`
          /* Row Hover Animation */
          .ant-table-row:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            cursor: pointer;
            transform: scale(1.01);
            transition: 0.2s;
          }

          /* Table Header Style */
          .ant-table-thead > tr > th {
            background: rgba(255, 255, 255, 0.2) !important;
            color: #0f0f0fff !important;


            font-size: 15px;
            font-weight: 600;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
          }

          .ant-table {
            background: rgba(255,255,255,0.10) !important;
            color: #fff !important;
          }

          .ant-table-cell {
            color: #0f0f0fff !important;
          }

          /* Animations */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Card>
  </div>
);




}
