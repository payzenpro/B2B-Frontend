import { useState, useEffect } from "react";
import { 
  Table, Button, Modal, Form, Input, InputNumber, Select, 
  Space, message, Popconfirm, Tag, Card
} from "antd";
import { 
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

export default function VendorProductSetup() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    fetchProducts();
  }, []);

async function fetchProducts() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/vendor`, {  
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("HTTP:", res.status);
    const data = await res.json();
    console.log(" Response:", data);

    if (data.success && Array.isArray(data.data)) {
      setProducts(data.data);
      console.log(" Loaded:", data.data.length);
    } else {
      setProducts([]);
    }
  } catch (error) {
    message.error("Failed to load");
    console.error(" Error:", error);
    setProducts([]);
  }
}

  const mapFormToPayload = (v) => {
    const colorsArr = v.colors
      ? v.colors.split(",").map(c => c.trim()).filter(Boolean)
      : [];
    const sizesArr = v.sizesText
      ? v.sizesText.split(",").map(pair => {
          const [label, stock] = pair.split(":").map(x => x.trim());
          return { label, stock: Number(stock) || 0 };
        })
      : [];
    const imagesArr = v.images
      ? v.images.split(",").map(url => url.trim()).filter(Boolean)
      : [];

    return {
      name: v.name,
      slug: v.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "",
      brand: v.brand,
      category: v.category,
      subCategory: v.subCategory || v.category,
      description: v.description || "",
      
      images: imagesArr,
      thumbnail: imagesArr[0] || "",
      
      colors: colorsArr,
      sizes: sizesArr,
      
      priceInfo: {
        mrp: Number(v.mrp),
        sellingPrice: Number(v.sellingPrice),
        discountPercent: Number(v.discountPercent) || 0,
      },
      
      stock: Number(v.stock) || 0,
      
      rating: 0,
      ratingCount: 0,
      reviewCount: 0,
      
      offers: [],
      
      policy: {
        returnDays: Number(v.returnDays) || 0,
        returnPolicyText: v.returnPolicyText || "",
        warrantyText: v.warrantyText || "",
      },
      
      specifications: [],
      
      seller: {
        name: v.sellerName || "",
        rating: Number(v.sellerRating) || 0,
      },
      
      services: {
        codAvailable: v.codAvailable === true || v.codAvailable === "true",
        fastDelivery: v.fastDelivery === true || v.fastDelivery === "true",
      },
      
      isActive: true,
      status: v.status || "active",
    };
  };

  const mapProductToForm = (p) => ({
    name: p.name || "",
    brand: p.brand || "",
    category: p.category || "",
    subCategory: p.subCategory || "",
    description: p.description || "",
    
    images: (p.images || []).join(", "),
    
    colors: (p.colors || []).join(", "),
    sizesText: (p.sizes || []).map(s => `${s.label}:${s.stock}`).join(", "),
    
    mrp: p.priceInfo?.mrp || 0,
    sellingPrice: p.priceInfo?.sellingPrice || 0,
    discountPercent: p.priceInfo?.discountPercent || 0,
    
    stock: p.stock || 0,
    
    returnDays: p.policy?.returnDays || 7,
    returnPolicyText: p.policy?.returnPolicyText || "",
    warrantyText: p.policy?.warrantyText || "",
    
    sellerName: p.seller?.name || "",
    sellerRating: p.seller?.rating || 0,
    
    codAvailable: p.services?.codAvailable !== false,
    fastDelivery: p.services?.fastDelivery === true, 
    
    status: p.status || "active",
  });

  const handleSave = async (values) => {
    try {
      console.log(" Form values:", values);
      const payload = mapFormToPayload(values);
      console.log(" Payload to send:", payload);
      
      const token = localStorage.getItem("token");

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/product/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      console.log(" Response:", res.status, data);
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save");
      }

      message.success(editingId ? "Product updated!" : "Product created!");
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error(" Save error:", error);
      message.error(error.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      message.success('Product deleted');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  const handleEdit = (record) => {
    console.log(" Editing product:", record);
    setEditingId(record._id);
    const formData = mapProductToForm(record);
    console.log(" Form data:", formData);
    form.setFieldsValue(formData);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.resetFields();
    // Set default values
    form.setFieldsValue({
      status: 'active',
      codAvailable: true,
      fastDelivery: false,
      discountPercent: 0,
      returnDays: 7,
      stock: 0,
    });
    setModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const matchStatus = filterStatus === "all" || (p.status || "").toLowerCase() === filterStatus;
    const matchSearch = !searchText || p.name?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, r) => (
        <div>
          {(r.thumbnail || r.images?.[0]) && (
            <img 
              src={r.thumbnail || r.images[0]} 
              alt={r.name} 
              style={{ width: 50, height: 50, borderRadius: 4, objectFit: "cover", marginBottom: 4 }} 
            />
          )}
          <div style={{ fontWeight: 600 }}>{r.name}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.brand}</div>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: cat => <Tag color="blue">{cat}</Tag>
    },
    {
      title: 'Price',
      dataIndex: 'priceInfo',
      render: pi => pi ? (
        <span style={{ fontWeight: 600, color: '#1890ff' }}>
          ₹{pi.sellingPrice?.toLocaleString()}
        </span>
      ) : "-"
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      render: s => (
        <span style={{ fontWeight: 600, color: s < 20 ? '#ff4d4f' : '#52c41a' }}>
          {s}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: s => (
        <Tag color={(s || "").toLowerCase() === 'active' ? 'green' : 'red'}>
          {(s || "active").toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      render: (_, r) => (
        <Space>
          <Button 
            size="small" 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(r)}
          >
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(r._id)}>
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Vendor Products</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddNew}
        >
          Add Product
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
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
          placeholder="Search..." 
          style={{ width: 250 }} 
          value={searchText} 
          onChange={e => setSearchText(e.target.value)} 
          allowClear 
        />
        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
          <Option value="all">All</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      <Table 
        dataSource={filteredProducts} 
        columns={columns} 
        rowKey="_id" 
        pagination={{ pageSize: 10 }} 
      />

      <Modal
        title={editingId ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={() => { 
          setModalOpen(false); 
          form.resetFields(); 
          setEditingId(null); 
        }}
        onOk={() => form.submit()}
        width={900}
        okText={editingId ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Required!' }]}>
            <Input placeholder="Men Slim Fit Striped Casual Shirt" />
          </Form.Item>

          <Form.Item name="brand" label="Brand" rules={[{ required: true, message: 'Required!' }]}>
            <Input placeholder="URBAN EDGE" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Required!' }]}>
            <Select placeholder="Select category">
              <Option value="Shirts">Shirts</Option>
              <Option value="T-Shirts">T-Shirts</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Fashion">Fashion</Option>
              <option value="Home & Furniture">Home & Furniture</option>
              <option value= "Appliances">Appliances</option>
              <option value= "Beauty">Beauty</option>
             <option value= "Food & Drinks">Food & Drinks</option>
              <option value= "Grocery">Grocery</option>
             <option value= "Stationary">Stationary</option>
              <option value= "Toys">Toys</option>

            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="Sub Category">
            <Input placeholder="Casual Shirts" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Product description..." />
          </Form.Item>

          <Form.Item 
            name="images" 
            label="Images ( URL)" 
            rules={[{ required: true, message: 'At least one image required!' }]}
          >
            <TextArea 
              rows={2} 
              placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg" 
            />
          </Form.Item>

          <Form.Item 
            name="colors" 
            label="Colors" 
            tooltip="Example: Black, White, Blue"
          >
            <Input placeholder="Black, White" />
          </Form.Item>

          <Form.Item 
            name="sizesText" 
            label="Sizes (format: label:stock)" 
            tooltip="Example: S:18, M:24, L:16, XL:9"
          >
            <Input placeholder="S:18, M:24, L:16, XL:9, XXL:6" />
          </Form.Item>

          <Form.Item 
            name="mrp" 
            label="MRP (₹)" 
            rules={[{ required: true, message: 'Required!' }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="1799" />
          </Form.Item>

          <Form.Item 
            name="sellingPrice" 
            label="Selling Price (₹)" 
            rules={[{ required: true, message: 'Required!' }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="299" />
          </Form.Item>

          <Form.Item name="discountPercent" label="Discount %">
            <InputNumber style={{ width: "100%" }} min={0} max={100} placeholder="83" />
          </Form.Item>

          <Form.Item 
            name="stock" 
            label="Total Stock" 
            rules={[{ required: true, message: 'Required!' }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="73" />
          </Form.Item>

          <Form.Item 
            name="status" 
            label="Status" 
            rules={[{ required: true, message: 'Required!' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="returnDays" label="Return Days">
            <InputNumber style={{ width: "100%" }} min={0} placeholder="7" />
          </Form.Item>

          <Form.Item name="returnPolicyText" label="Return Policy">
            <TextArea rows={2} placeholder="7 days return & exchange..." />
          </Form.Item>

          <Form.Item name="warrantyText" label="Warranty">
            <Input placeholder="No warranty" />
          </Form.Item>

          <Form.Item name="sellerName" label="Seller Name">
            <Input placeholder="UrbanStyle Retail" />
          </Form.Item>

          <Form.Item name="sellerRating" label="Seller Rating">
            <InputNumber style={{ width: "100%" }} min={0} max={5} step={0.1} placeholder="4.3" />
          </Form.Item>

          {/*  FIXED - Remove valuePropName="checked" */}
          <Form.Item name="codAvailable" label="COD Available">
            <Select placeholder="Select option">
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>

          <Form.Item name="fastDelivery" label="Fast Delivery">
            <Select placeholder="Select option">
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}
