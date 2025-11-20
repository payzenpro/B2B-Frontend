
import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../../app/api';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (values) => {
    try {
      await createProduct(values);
      message.success('Product created successfully');
      form.resetFields();
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      message.error('Failed to create product');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (p) => `₹${p}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {title: 'images ' ,  dataIndex: 'images',key: 'images '}
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>
      <Table dataSource={products} columns={columns} loading={loading} rowKey="_id" />

      <Modal
        title="Add Product"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
           <Form.Item name="images " label="images " rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
