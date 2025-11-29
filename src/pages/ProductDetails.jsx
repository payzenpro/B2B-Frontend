import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Tag, Button, Spin, Select, message } from 'antd';
const { Option } = Select;

export default function ProductDetails() {
  const { id } = useParams();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/product/${id}`)
      .then(res => res.json())
      .then(data => {
          console.log('Product Details API response', data);
        setProduct(data.data || data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Cannot load product");
      });
  }, [id]);

  const sizes = product?.sizes || ["28", "30", "32", "34", "36"];
  const colors = product?.colors || ["Blue", "Black", "Grey"];

  if (loading) return (<div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>);
  if (!product) return (<div>Product not found.</div>);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <Row gutter={32}>
        <Col xs={24} md={10}>
          <Card bordered={false} style={{ textAlign: 'center' }}>
            <img 
              alt={product.name}
              src={product.image || product.images?.[0] || 'https://dummyimage.com/270x270/e0e0e0/666666&text=No+Image'}
              style={{ maxHeight: 270, objectFit: 'contain', margin: 'auto' }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://dummyimage.com/270x270/e0e0e0/444&text=No+Image';
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={14}>
          <h2>{product.name}</h2>
          <div style={{ fontSize: 24, color: '#1890ff', fontWeight: 700 }}>₹{Number(product.price).toLocaleString()}</div>
          <div style={{ margin: '16px 0' }}>
            <Tag color="blue">{product.category}</Tag>
            <Tag color={product.stock > 0 ? "green" : "red"}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</Tag>
          </div>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{product.description}</p>

          <div style={{ margin: '20px 0' }}>
            <span style={{ fontWeight: 500 }}>Size: </span>
            <Select style={{ width: 100 }} defaultValue={sizes[0]} onChange={setSelectedSize}>
              {sizes.map(size => <Option key={size} value={size}>{size}</Option>)}
            </Select>
          </div>
          <div style={{ margin: '20px 0' }}>
            <span style={{ fontWeight: 500 }}>Color: </span>
            <Select style={{ width: 120 }} defaultValue={colors[0]} onChange={setSelectedColor}>
              {colors.map(color => <Option key={color} value={color}>{color}</Option>)}
            </Select>
          </div>
          <Button type="primary" size="large" style={{ marginTop: 20 }} disabled={product.stock < 1}>
            Add to Cart
          </Button>

          
           <Button type="primary" size="large" style={{ marginTop: 20 }} disabled={product.stock < 1}>
            Buy Now
          </Button>
        </Col>
      </Row>
    </div>
  );
}
