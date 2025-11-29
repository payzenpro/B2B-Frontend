// import { useState, useEffect } from "react";
// import { Table, Button, Modal, Form, Input, Upload, Space, message, Popconfirm, Tag, Card } from "antd";
// import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, UploadOutlined } from "@ant-design/icons";
// import { getCategories, createCategories, updateCategories, deleteCategories } from "../../app/api";
// export default function VendorCategories() {
//   const [categories, setCategories] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [form] = Form.useForm();

//   // Load categories from API on mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   async function fetchCategories() {
//     try {
//       const data = await getCategories();
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (error) {
//       message.error('Failed to load categories');
//       console.error(error);
//     }
//   }

//   const handleImageUpload = (file) => {
//     const reader = new FileReader();
//     reader.onload = e => setUploadedImage({ name: file.name, preview: e.target.result });
//     reader.readAsDataURL(file);
//     return false;
//   };

//   const handleSave = async (values) => {
//     try {
//       const payload = {
//         ...values,
//         status: values.status || "active",
//         image: uploadedImage?.preview || null,
//       };

//       if (editingId) {
//         await updateCategories(editingId, payload);
//         message.success('Category updated!');
//       } else {
//         await createCategories({ ...payload, productsCount: 0 });
//         message.success('Category created!');
//       }

//       setModalOpen(false);
//       form.resetFields();
//       setEditingId(null);
//       setUploadedImage(null);
//       fetchCategories();
//     } catch (error) {
//       message.error('Failed to save category');
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteCategories(id);
//       message.success('Category deleted');
//       fetchCategories();
//     } catch (error) {
//       message.error('Failed to delete category');
//       console.error(error);
//     }
//   };

//   const handleEdit = (record) => {
//     setEditingId(record._id);
//     setUploadedImage(record.image ? { preview: record.image, name: 'current' } : null);
//     form.setFieldsValue({
//       name: record.name,
//       description: record.description,
//       icon: record.icon,
//       status: record.status || "active",
//     });
//     setModalOpen(true);
//   };

//   const filteredCategories = categories.filter(category => {
//     const name = (category.name || '').toLowerCase();
//     const search = searchText.toLowerCase();
//     return searchText === '' || name.includes(search);
//   });

//   const columns = [
//     {
//       title: 'Category',
//       key: 'category',
//       width: 200,
//       render: (_, record) => (
//         <div>
//           <div style={{ width: 50, height: 50, borderRadius: 4, marginBottom: 8, overflow: 'hidden', background: '#f0f0f0' }}>
//             {record.image && (
//               <img
//                 src={record.image}
//                 alt={record.name}
//                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//               />
//             )}
//           </div>
//           <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
//             <span style={{ fontSize: 20 }}>{record.icon}</span>
//             {record.name}
//           </div>
//           <div style={{ fontSize: 12, color: '#888' }}>{record.description}</div>
//         </div>
//       ),
//     },
//     {
//       title: 'Products',
//       dataIndex: 'productsCount',
//       key: 'productsCount',
//       width: 100,
//       render: (count) => <Tag color="blue">{count ?? 0} items</Tag>,
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       width: 100,
     
//       render: (status) => {
//         const normalized = (status || 'unknown').toString().toLowerCase();
//         const color = normalized === 'active' ? 'green' : 'red';
//         return (
//           <Tag color={color}>
//             {normalized.toUpperCase()}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       width: 150,
//       render: (_, record) => (
//         <Space size="small">
//           <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
//             Edit
//           </Button>
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
//             <Button size="small" danger type="link" icon={<DeleteOutlined />}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h2 style={{ margin: 0 }}> Categories</h2>
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
//           Create Category
//         </Button>
//       </div>

//       <div style={{ marginBottom: 16 }}>
//         <Input
//           prefix={<SearchOutlined />}
//           placeholder="Search categories..."
//           style={{ width: 250 }}
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           allowClear
//         />
//       </div>

//       <Table
//         dataSource={filteredCategories}
//         columns={columns}
//         rowKey="_id"
//         pagination={{ pageSize: 10 }}
//         scroll={{ x: 1000 }}
//       />

//       <Modal
//         title={editingId ? 'Edit Category' : 'Create Category'}
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
//           <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
//             <Input placeholder="e.g. Electronics" />
//           </Form.Item>

//           <Form.Item name="description" label="Description" rules={[{ required: true }]}>
//             <Input.TextArea placeholder="Category description" rows={2} />
//           </Form.Item>

         

//           <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//             <select
//               style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </Form.Item>

//           <Form.Item label="Category Image">
//             <div
//               style={{
//                 border: '2px dashed #1890ff',
//                 borderRadius: 8,
//                 padding: 16,
//                 textAlign: 'center',
//                 background: '#fafafa',
//               }}
//             >
//               {uploadedImage ? (
//                 <div>
//                   <img
//                     src={uploadedImage.preview}
//                     alt="preview"
//                     style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4, marginBottom: 12 }}
//                   />
//                   <div style={{ fontSize: 12, color: '#666' }}>{uploadedImage.name}</div>
//                 </div>
//               ) : (
//                 <FolderOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }} />
//               )}

//               <Upload beforeUpload={handleImageUpload} accept="image/*" maxCount={1}>
//                 <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
//                   Choose File
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
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Space,
  message,
  Popconfirm,
  Tag,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} from "../../app/api";

const { Option } = Select;

export default function VendorCategories() {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Failed to load categories");
      console.error(error);
    }
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      setUploadedImage({ name: file.name, preview: e.target.result });
    reader.readAsDataURL(file);
    return false; // don't actually upload
  };

  // ⭐ yaha se main logic hai (active / inactive dono ke liye)
  const handleSave = async (values) => {
    try {
      // Form se aaya hua status (active / inactive)
      const statusValue = (values.status || "active").toString().toLowerCase();
      const isActive = statusValue === "active";

      const payload = {
        name: values.name,
        description: values.description,
        status: statusValue,              // "active" / "inactive"
        isActive,                         // true / false
        image: uploadedImage?.preview || null,
        productsCount: 0,
      };

      console.log("Category payload:", payload);

      let res;
      if (editingId) {
        res = await updateCategories(editingId, payload);
        console.log("Update response:", res);
        if (res && res.success === false) {
          throw new Error(res.message || "Update failed");
        }
        message.success("Category updated!");
      } else {
        res = await createCategories(payload);
        console.log("Create response:", res);
        if (res && res.success === false) {
          throw new Error(res.message || "Create failed");
        }
        message.success("Category created!");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      setUploadedImage(null);
      fetchCategories();
    } catch (error) {
      console.error("Save category error:", error);
      message.error(error.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategories(id);
      if (res && res.success === false) {
        message.error(res.message || "Failed to delete category");
      } else {
        message.success("Category deleted");
        fetchCategories();
      }
    } catch (error) {
      message.error("Failed to delete category");
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setUploadedImage(
      record.image ? { preview: record.image, name: "current" } : null
    );
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status || (record.isActive ? "active" : "inactive"),
    });
    setModalOpen(true);
  };

  const filteredCategories = categories.filter((category) => {
    const name = (category.name || "").toLowerCase();
    const search = searchText.toLowerCase();
    return searchText === "" || name.includes(search);
  });

  const columns = [
    {
      title: "Category",
      key: "category",
      width: 200,
      render: (_, record) => (
        <div>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 4,
              marginBottom: 8,
              overflow: "hidden",
              background: "#f0f0f0",
            }}
          >
            {record.image && (
              <img
                src={record.image}
                alt={record.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: "Products",
      dataIndex: "productsCount",
      key: "productsCount",
      width: 100,
      render: (count) => <Tag color="blue">{count ?? 0} items</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (_, record) => {
        const rawStatus =
          record.status || (record.isActive ? "active" : "inactive");
        const normalized = rawStatus.toString().toLowerCase();
        const color = normalized === "active" ? "green" : "red";
        return <Tag color={color}>{normalized.toUpperCase()}</Tag>;
      },
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete?"
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
        <h2 style={{ margin: 0 }}>Categories</h2>
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
          Create Category
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search categories..."
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <Table
        dataSource={filteredCategories}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingId ? "Edit Category" : "Create Category"}
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
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              placeholder="Category description"
              rows={2}
            />
          </Form.Item>

          {/* ⭐ yaha ab native <select> ki jagah Antd Select use kar rahe hain */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
            initialValue="active"
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category Image">
            <div
              style={{
                border: "2px dashed #1890ff",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
                background: "#fafafa",
              }}
            >
              {uploadedImage ? (
                <div>
                  <img
                    src={uploadedImage.preview}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 4,
                      marginBottom: 12,
                    }}
                  />
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {uploadedImage.name}
                  </div>
                </div>
              ) : (
                <FolderOutlined
                  style={{
                    fontSize: 48,
                    color: "#1890ff",
                    marginBottom: 12,
                  }}
                />
              )}

              <Upload beforeUpload={handleImageUpload} accept="image/*" maxCount={1}>
                <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
                  Choose File
                </Button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
