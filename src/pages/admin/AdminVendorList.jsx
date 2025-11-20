// import { useEffect, useState } from "react";
// import { Table, Input, Card, Button, Tag } from "antd";
// import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// export default function AdminVendorList() {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadVendors();
//   }, []);

//   const loadVendors = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/api/vendors');
//       const data = await response.json();
      
//       let vendorsArray = [];
//       if (data.success && Array.isArray(data.data)) {
//         vendorsArray = data.data;
//       } else if (Array.isArray(data)) {
//         vendorsArray = data;
//       }
      
//       setVendors(vendorsArray);
//     } catch (error) {
//       console.error('Error:', error);
//       setVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredVendors = vendors.filter(vendor =>
//     (vendor.storeName?.toLowerCase().includes(searchText.toLowerCase()) ||
//     vendor.owner?.toLowerCase().includes(searchText.toLowerCase()) ||
//     vendor.email?.toLowerCase().includes(searchText.toLowerCase()))
//   );

//   // ✅ View button - dashboard route को navigate करो
//   const handleViewClick = (vendorId) => {
//     navigate(`/vendor-list/${vendorId}/dashboard`);
//   };

//   const columns = [
//     {
//       title: 'Store Name',
//       dataIndex: 'storeName',
//       key: 'storeName',
//       render: (text) => <strong>{text}</strong>
//     },
//     {
//       title: 'Owner',
//       dataIndex: 'owner',
//       key: 'owner'
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email'
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone'
//     },
//     {
//       title: 'Orders',
//       dataIndex: 'totalOrders',
//       key: 'totalOrders'
//     },
//     {
//       title: 'Revenue',
//       dataIndex: 'totalRevenue',
//       key: 'totalRevenue',
//       render: (rev) => `₹${Number(rev).toLocaleString()}`
//     },
//     {
//       title: 'Rating',
//       dataIndex: 'rating',
//       key: 'rating',
//       render: (rating) => `${rating || 0}`
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button 
//           type="primary" 
//           size="small" 
//           icon={<EyeOutlined />}
//           onClick={() => handleViewClick(record._id)}  
//         >
//           View
//         </Button>
//       )
//     }
//   ];

//   return (
//     <div>
//       <Card title=" Admin - Vendor List">
//         <div style={{ marginBottom: 16 }}>
//           <Input
//             placeholder="Search by store name, owner, or email..."
//             prefix={<SearchOutlined />}
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: '100%', maxWidth: 400 }}
//           />
//         </div>

//         <Table
//           dataSource={filteredVendors}
//           columns={columns}
//           rowKey="_id"
//           loading={loading}
//           pagination={{ pageSize: 10 }}
//           scroll={{ x: 1200 }}
//         />
//       </Card>
//     </div>
//   );
// }


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

  return (
    <div>
      <Card title=" Admin - Vendor List">
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by store name, owner, or email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', maxWidth: 400 }}
            allowClear
          />
        </div>

        <Table
          dataSource={filteredVendors}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} vendors` }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
