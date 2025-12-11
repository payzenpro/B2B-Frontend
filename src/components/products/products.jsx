import { useState, useEffect } from "react";
import {Table,Button,Modal,Form,Input,InputNumber,Select,Space,message,Popconfirm,Tag,} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined,} from "@ant-design/icons";
import {getProduct,createProduct,updateProduct,deleteProduct} from "../../app/api";

const { Option } = Select;
const { TextArea } = Input;

export default function SuperadminProducts() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProduct();          
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load products");
    }
  };

  const mapProductToForm = (p) => ({
    name: p.name,
    brand: p.brand,
    category: p.category,
    subCategory: p.subCategory,
    description: p.description,
    image: p.thumbnail || (p.images && p.images[0]) || "",
    mrp: p.priceInfo?.mrp,
    sellingPrice: p.priceInfo?.sellingPrice,
    discountPercent: p.priceInfo?.discountPercent,
    stock: p.stock,
    colors: (p.colors || []).join(", "),
    sizesText: (p.sizes || [])
      .map((s) => `${s.label}:${s.stock}`)
      .join(", "),
    returnDays: p.policy?.returnDays,
    returnPolicyText: p.policy?.returnPolicyText,
    warrantyText: p.policy?.warrantyText,
    status: p.status || "active",
  });


  const mapFormToPayload = (v) => {
    // colors: "Blue, Red" -> ["Blue","Red"]
    const colorsArr = v.colors
      ? v.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    
    const sizesArr = v.sizesText
      ? v.sizesText
          .split(",")
          .map((pair) => pair.trim())
          .filter(Boolean)
          .map((pair) => {
            const [label, stockStr] = pair.split(":").map((x) => x.trim());
            return {
              label,
              stock: Number(stockStr) || 0,
            };
          })
      : [];

    return {
      name: v.name,
      slug:
        v.name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") || undefined,
      brand: v.brand,
      category: v.category,
      subCategory: v.subCategory || v.category,
      description: v.description || "",
      images: v.image ? [v.image] : [],
      thumbnail: v.image || "",
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
      seller: {},
      services: { codAvailable: true, fastDelivery: false },
      isActive: true,
      status: v.status || "active",
    };
  };

  const handleSave = async (values) => {
    try {
      const payload = mapFormToPayload(values);

      let res;
      if (editingId) {
        res = await updateProduct(editingId, payload);
        if (!res.success) throw new Error(res.message || "Update failed");
        message.success("Product updated");
      } else {
        res = await createProduct(payload);
        // if (!res.success) throw new Error(res.message || "Create failed");
        message.success("Product created");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to save product");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue(mapProductToForm(record));
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(id);
      if (!res.success && res.message) {
        message.error(res.message);
      } else {
        message.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to delete product");
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <div>
          {(record.thumbnail || (record.images && record.images[0])) && (
            <img
              src={record.thumbnail || record.images[0]}
              alt={record.name}
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
          )}
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.brand}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "priceInfo",
      key: "priceInfo",
      render: (pi) =>
        pi ? (
          <span style={{ fontWeight: 600, color: "#1890ff" }}>
            ₹{Number(pi.sellingPrice).toLocaleString()}
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (s) => (
        <span style={{ fontWeight: 600, color: s < 20 ? "#ff4d4f" : "#52c41a" }}>
          {s} units
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const st = (status || "active").toLowerCase();
        return (
          <Tag color={st === "active" ? "green" : "red"}>{st.toUpperCase()}</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
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
          <Popconfirm
            title="Delete product?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Superadmin Products</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? "Edit Product" : "Add Product"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {/* Basic info */}
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: "Brand is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select placeholder="Select Category">
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
            <Input placeholder="e.g. Casual Shirts" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>

          {/* Price */}
          <Form.Item
            name="mrp"
            label="MRP (₹)"
            rules={[{ required: true, message: "MRP is required" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="sellingPrice"
            label="Selling Price (₹)"
            rules={[{ required: true, message: "Selling price is required" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="discountPercent" label="Discount %">
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>

          {/* Stock & status */}
          <Form.Item
            name="stock"
            label="Total Stock"
            rules={[{ required: true, message: "Stock is required" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          {/* Image */}
          <Form.Item
            name="image"
            label="Main Image URL"
            rules={[{ required: true, message: "Image URL is required" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          {/* Colors & sizes */}
          <Form.Item
            name="colors"
            label="Colors"
            tooltip="Example: Blue, Red, Black"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="sizesText"
            label="Sizes & stock"
            tooltip="Example: S:10, M:20, L:5"
          >
            <Input />
          </Form.Item>

          {/* Policy */}
          <Form.Item name="returnDays" label="Return Days">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="returnPolicyText" label="Return Policy Text">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="warrantyText" label="Warranty Text">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
