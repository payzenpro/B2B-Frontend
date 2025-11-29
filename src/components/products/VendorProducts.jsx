// import { useState, useEffect } from "react";
// import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, Space, message, Popconfirm, Tag, Card, Row, Col } from "antd";
// import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
// import { getProduct, createProduct, updateProduct, deleteProduct } from "../../app/api";

// export default function VendorProductSetup() {
//   const [products, setProducts] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [form] = Form.useForm();


//   useEffect(() => {
//     fetchProducts();
//   }, []);


//   async function fetchProducts() {
//   try {
//     const data = await getProduct();
//     console.log("Products in VendorProductSetup:", data); 
//     setProducts(data);
//   } catch (error) {
//     message.error('Failed to load products');
//     console.error(error);
//   }
// }


//   const handleImageUpload = (file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setUploadedImage({ name: file.name, preview: e.target.result });
//     };
//     reader.readAsDataURL(file);
//     return false; 
//   };

//   // const handleSave = async (values) => {
//   //   try {
//   //     if (editingId) {
        
//   //       await updateProduct(editingId, { ...values, image: uploadedImage?.preview });
//   //       message.success('Product updated!');
//   //     } else {
        
//   //       await createProduct({ ...values, image: uploadedImage?.preview });
//   //       message.success('Product created!');
//   //     }
//   //     setModalOpen(false);
//   //     form.resetFields();
//   //     setEditingId(null);
//   //     setUploadedImage(null);
//   //     fetchProducts(); 
//   //   } catch (error) {
//   //     message.error('Failed to save product');
//   //     console.error(error);
//   //   }
//   // };


//   const handleSave = async (values) => {
//   try {
//     let res;
//     if (editingId) {
//       res = await updateProduct(editingId, { ...values, image: uploadedImage?.preview });
//       if (!res.success) throw new Error(res.message || "Update failed");
//       message.success("Product updated!");
//     } else {
//       res = await createProduct({ ...values, image: uploadedImage?.preview });
//       if (!res.success) throw new Error(res.message || "Create failed");
//       message.success("Product created!");
//     }

//     setModalOpen(false);
//     form.resetFields();
//     setEditingId(null);
//     setUploadedImage(null);
//     fetchProducts();
//   } catch (error) {
//     console.error("Save error:", error);
//     message.error(error.message || "Failed to save product");
//   }
// };


//   const handleDelete = async (id) => {
//     try {
//       await deleteProduct(id);
//       message.success('Product deleted');
//       fetchProducts();
//     } catch (error) {
//       message.error('Failed to delete product');
//       console.error(error);
//     }
//   };

//   const handleEdit = (record) => {
//     setEditingId(record._id);
//     setUploadedImage({ preview: record.image, name: 'current' });
//     form.setFieldsValue({
//       name: record.name,
//       category: record.category,
//       price: record.price,
//       stock: record.stock,
//       status: record.status
//     });
//     setModalOpen(true);
//   };

//   const filteredProducts = products.filter(product => {
//     const matchStatus = filterStatus === 'all' || product.status === filterStatus;
//     const matchSearch = searchText === '' || product.name.toLowerCase().includes(searchText.toLowerCase());
//     return matchStatus && matchSearch;
//   });

//   const columns = [
//     { 
//       title: 'Product', 
//       key: 'product',
//       width: 200,
//       render: (_, record) => (
//         <div>
//           <img src={record.image} alt={record.name} style={{ width: 50, height: 50, borderRadius: 4, marginBottom: 8 }} />
//           <div style={{ fontWeight: 600 }}>{record.name}</div>
        
//         </div>
//       )
//     },
//     { 
//       title: 'Category', 
//       dataIndex: 'category', 
//       key: 'category',
//       width: 120,
//       render: (cat) => <Tag color="blue">{cat}</Tag>
//     },
//     { 
//       title: 'Price', 
//       dataIndex: 'price', 
//       key: 'price',
//       width: 100,
//       render: (price) => <div style={{ fontWeight: 600, color: '#1890ff' }}>₹{price.toLocaleString()}</div>
//     },
//     { 
//       title: 'Stock', 
//       dataIndex: 'stock', 
//       key: 'stock',
//       width: 80,
//       render: (stock) => (
//         <div style={{ color: stock < 20 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
//           {stock} units
//         </div>
//       )
//     },
//     { 
//       title: 'Status', 
//       dataIndex: 'status', 
//       key: 'status',
//       width: 100,
//       render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       width: 120,
//       render: (_, record) => (
//         <Space size="small">
//           <Button 
//             size="small" 
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//           >
//             Edit
//           </Button>
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
//             <Button size="small" danger type="link" icon={<DeleteOutlined />}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h2 style={{ margin: 0 }}> Product Setup</h2>
//         <Button 
//           type="primary" 
//           icon={<PlusOutlined />}
//           onClick={() => {
//             setEditingId(null);
//             form.resetFields();
//             setUploadedImage(null);
//             setModalOpen(true);
//           }}
//         >
//           Add Product
//         </Button>
//       </div>

//       <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//         <Card style={{ minWidth: 150 }}>
//           <div style={{ fontSize: 12, color: '#888' }}>Total Products</div>
//           <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
//             {filteredProducts.length}
//           </div>
//         </Card>
//         <Card style={{ minWidth: 150 }}>
//           <div style={{ fontSize: 12, color: '#888' }}>Total Stock</div>
//           <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
//             {filteredProducts.reduce((sum, p) => sum + p.stock, 0)}
//           </div>
//         </Card>
//       </div>

//       <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
//         <Input 
//           prefix={<SearchOutlined />}
//           placeholder="Search products..."
//           style={{ width: 250 }}
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
//           <Select.Option value="active">Active</Select.Option>
//           <Select.Option value="inactive">Inactive</Select.Option>
//         </Select>
//       </div>

//       <Table 
//         dataSource={filteredProducts} 
//         columns={columns} 
//         rowKey="_id" 
//         pagination={{ pageSize: 10 }}
//         scroll={{ x: 1100 }}
//       />

//       <Modal
//         title={editingId ? 'Edit Product' : 'Add Product'}
//         open={modalOpen}
//         onCancel={() => {
//           setModalOpen(false);
//           form.resetFields();
//           setEditingId(null);
//           setUploadedImage(null);
//         }}
//         onOk={() => form.submit()}
//         width={700}
//       >
//         <Form form={form} layout="vertical" onFinish={handleSave}>
//           <Row gutter={12}>
//             <Col span={12}>
//               <Form.Item 
//                 name="name" 
//                 label="Product Name" 
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="e.g. iPhone 14 Pro Max" />
//               </Form.Item>
//             </Col>
            
//           </Row>

//           <Row gutter={12}>
//             <Col span={12}>
//               <Form.Item 
//                 name="category" 
//                 label="Category" 
//                 rules={[{ required: true }]}
//               >
//                 <select style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}>
//                   <option value="">Select Category</option>
//                   <option value="Electronics">Electronics</option>
//                   <option value="Fashion">Fashion</option>
//                   <option value="Pharmacy">Pharmacy</option>
//                 </select>
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item 
//                 name="price" 
//                 label="Price (₹)" 
//                 rules={[{ required: true }]}
//               >
//                 <InputNumber style={{ width: '100%' }} min={0} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={12}>
//             <Col span={12}>
//               <Form.Item 
//                 name="stock" 
//                 label="Stock Quantity" 
//                 rules={[{ required: true }]}
//               >
//                 <InputNumber style={{ width: '100%' }} min={0} />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item 
//                 name="status" 
//                 label="Status" 
//                 rules={[{ required: true }]}
//               >
//                 <select style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item label="Product Image">
//             <div style={{ 
//               border: '2px dashed #1890ff', 
//               borderRadius: 8, 
//               padding: 16, 
//               textAlign: 'center',
//               background: '#fafafa'
//             }}>
//               {uploadedImage ? (
//                 <div>
//                   <img 
//                     src={uploadedImage.preview} 
//                     alt="preview" 
//                     style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 4, marginBottom: 12 }} 
//                   />
//                   <div style={{ fontSize: 12 }}>{uploadedImage.name}</div>
//                 </div>
//               ) : null}
              
//               <Upload
//                 beforeUpload={handleImageUpload}
//                 accept="image/*"
//                 maxCount={1}
//               >
//                 <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
//                   Upload Image
//                 </Button>
//               </Upload>
//             </div>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { 
  Table, Button, Modal, Form, Input, InputNumber, Select, Upload, 
  Space, message, Popconfirm, Tag, Card, Row, Col 
} from "antd";
import { 
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined 
} from "@ant-design/icons";
import { getProduct, createProduct, updateProduct, deleteProduct } from "../../app/api";

const { Option } = Select;

export default function VendorProductSetup() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getProduct();
      console.log("Products in VendorProductSetup:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Failed to load products');
      console.error(error);
    }
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({ name: file.name, preview: e.target.result });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = async (values) => {
    try {
      // agar user ne status nahi diya toh default active
      const payload = {
        ...values,
        status: values.status || "active",
        image: uploadedImage?.preview || null,
      };

      let res;
      if (editingId) {
        res = await updateProduct(editingId, payload);
        if (!res.success) throw new Error(res.message || "Update failed");
        message.success("Product updated!");
      } else {
        res = await createProduct(payload);
        if (!res.success) throw new Error(res.message || "Create failed");
        message.success("Product created!");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      setUploadedImage(null);
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      message.error(error.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(id);
      if (!res.success && res.message) {
        message.error(res.message);
      } else {
        message.success('Product deleted');
        fetchProducts();
      }
    } catch (error) {
      message.error('Failed to delete product');
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setUploadedImage({ preview: record.image, name: 'current' });
    form.setFieldsValue({
      name: record.name,
      category: record.category,
      price: record.price,
      stock: record.stock,
      status: record.status?.toLowerCase() || "active",
    });
    setModalOpen(true);
  };

  // 🔥 Yaha status filter ko safe + normalize kiya
  const filteredProducts = products.filter((product) => {
    const normalizedStatus = (product.status || "").toLowerCase();

    const matchStatus =
      filterStatus === "all" || filterStatus === normalizedStatus;

    const matchSearch =
      searchText === "" ||
      product.name?.toLowerCase().includes(searchText.toLowerCase());

    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <div>
          {record.image && (
            <img
              src={record.image}
              alt={record.name}
              style={{ width: 50, height: 50, borderRadius: 4, marginBottom: 8, objectFit: "cover" }}
            />
          )}
          <div style={{ fontWeight: 600 }}>{record.name}</div>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => (
        <div style={{ fontWeight: 600, color: '#1890ff' }}>
          ₹{Number(price).toLocaleString()}
        </div>
      )
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock) => (
        <div style={{ color: stock < 20 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
          {stock} units
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const normalized = (status || "").toLowerCase();
        return (
          <Tag color={normalized === 'active' ? 'green' : 'red'}>
            {normalized.toUpperCase() || "UNKNOWN"}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}> Product Setup</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setUploadedImage(null);
            setModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Products</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
            {filteredProducts.length}
          </div>
        </Card>
        <Card style={{ minWidth: 150 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Total Stock</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
            {filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search products..."
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
          <Option value="all">All Status</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1100 }}
      />

      <Modal
        title={editingId ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingId(null);
          setUploadedImage(null);
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: "Product name is required" }]}
              >
                <Input placeholder="e.g. iPhone 14 Pro Max" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select placeholder="Select Category">
                  <Option value="Electronics">Electronics</Option>
                  <Option value="Fashion">Fashion</Option>
                  <Option value="Pharmacy">Pharmacy</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price (₹)"
                rules={[{ required: true, message: "Price is required" }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Stock Quantity"
                rules={[{ required: true, message: "Stock is required" }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Status is required" }]}
              >
                <Select placeholder="Select Status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Product Image">
            <div
              style={{
                border: '2px dashed #1890ff',
                borderRadius: 8,
                padding: 16,
                textAlign: 'center',
                background: '#fafafa'
              }}
            >
              {uploadedImage && (
                <div>
                  <img
                    src={uploadedImage.preview}
                    alt="preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 150,
                      borderRadius: 4,
                      marginBottom: 12
                    }}
                  />
                  <div style={{ fontSize: 12 }}>{uploadedImage.name}</div>
                </div>
              )}

              <Upload
                beforeUpload={handleImageUpload}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
                  Upload Image
                </Button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

