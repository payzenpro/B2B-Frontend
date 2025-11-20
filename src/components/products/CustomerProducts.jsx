import { useState } from "react";
import { Card, Row, Col, Button, message, Input, Select, Tag } from "antd";
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";

export default function CustomerProducts() {
  const [products] = useState([
    // Electronics
    { _id: '1', name: 'iPhone 14 Pro Max', price: 120000, category: 'Electronics', image: '📱', store: 'TechHub Store', rating: 4.8 },
    { _id: '2', name: 'Samsung Galaxy S23', price: 95000, category: 'Electronics', image: '📱', store: 'Mobile World', rating: 4.7 },
    { _id: '3', name: 'MacBook Air M2', price: 129999, category: 'Electronics', image: '💻', store: 'Apple Store', rating: 4.9 },
    { _id: '4', name: 'Apple Watch Series 8', price: 45000, category: 'Electronics', image: '⌚', store: 'Gadget Zone', rating: 4.6 },
    { _id: '5', name: 'Sony Headphones WH-1000XM5', price: 29999, category: 'Electronics', image: '🎧', store: 'Audio Paradise', rating: 4.8 },
    { _id: '6', name: 'iPad Pro 11"', price: 89999, category: 'Electronics', image: '📱', store: 'Apple Store', rating: 4.7 },
    { _id: '7', name: 'Dell XPS 13', price: 115000, category: 'Electronics', image: '💻', store: 'Laptop Store', rating: 4.5 },
    { _id: '8', name: 'Sony PlayStation 5', price: 54999, category: 'Electronics', image: '🎮', store: 'Gaming World', rating: 4.9 },

    // Fashion
    { _id: '9', name: 'Formal Shirt - Blue', price: 1999, category: 'Fashion', image: '👔', store: 'Fashion Hub', rating: 4.3 },
    { _id: '10', name: 'Jeans - Slim Fit', price: 2499, category: 'Fashion', image: '👖', store: 'Denim Store', rating: 4.4 },
    { _id: '11', name: 'Cotton T-Shirt', price: 599, category: 'Fashion', image: '👕', store: 'Casual Wear', rating: 4.2 },
    { _id: '12', name: 'Designer Saree', price: 4999, category: 'Fashion', image: '🥻', store: 'Ethnic Trends', rating: 4.6 },
    { _id: '13', name: 'Leather Jacket', price: 8999, category: 'Fashion', image: '🧥', store: 'Premium Fashion', rating: 4.7 },
    { _id: '14', name: 'Sports Shoes', price: 3499, category: 'Fashion', image: '👟', store: 'Footwear Palace', rating: 4.5 },
    { _id: '15', name: 'Designer Handbag', price: 5999, category: 'Fashion', image: '👜', store: 'Luxury Bags', rating: 4.4 },
    { _id: '16', name: 'Formal Blazer', price: 6499, category: 'Fashion', image: '🧥', store: 'Men\'s Fashion', rating: 4.6 },

    // Pharmacy
    { _id: '17', name: 'Paracetamol 500mg (10 tablets)', price: 35, category: 'Pharmacy', image: '💊', store: 'MedPlus', rating: 4.5 },
    { _id: '18', name: 'Vitamin C 1000mg (30 tablets)', price: 299, category: 'Pharmacy', image: '💊', store: 'HealthCare Store', rating: 4.7 },
    { _id: '19', name: 'Cough Syrup 200ml', price: 120, category: 'Pharmacy', image: '🧪', store: 'Apollo Pharmacy', rating: 4.4 },
    { _id: '20', name: 'Hand Sanitizer 500ml', price: 149, category: 'Pharmacy', image: '🧴', store: 'Guardian Pharmacy', rating: 4.6 },
    { _id: '21', name: 'Face Mask (Pack of 50)', price: 250, category: 'Pharmacy', image: '😷', store: 'MedLife', rating: 4.3 },
    { _id: '22', name: 'Vitamin D3 60K', price: 89, category: 'Pharmacy', image: '💊', store: 'Wellness Store', rating: 4.5 },
    { _id: '23', name: 'Protein Powder 1kg', price: 1899, category: 'Pharmacy', image: '🥤', store: 'Nutrition Hub', rating: 4.8 },
    { _id: '24', name: 'Digital Thermometer', price: 299, category: 'Pharmacy', image: '🌡️', store: 'MedEquip Store', rating: 4.6 },

    // Grocery
    { _id: '25', name: 'Basmati Rice 5kg', price: 599, category: 'Grocery', image: '🍚', store: 'FreshMart', rating: 4.4 },
    { _id: '26', name: 'Wheat Flour 10kg', price: 449, category: 'Grocery', image: '🌾', store: 'Grocery Store', rating: 4.3 },
    { _id: '27', name: 'Cooking Oil 1L', price: 189, category: 'Grocery', image: '🫒', store: 'Daily Essentials', rating: 4.5 },
    { _id: '28', name: 'Milk 1L (Pack of 6)', price: 390, category: 'Grocery', image: '🥛', store: 'Dairy Fresh', rating: 4.6 },
    { _id: '29', name: 'Sugar 5kg', price: 249, category: 'Grocery', image: '🍬', store: 'Grocery World', rating: 4.2 },
    { _id: '30', name: 'Tea Powder 1kg', price: 399, category: 'Grocery', image: '☕', store: 'Tea House', rating: 4.7 }
  ]);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch = searchText === '' || 
      product.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  function handleAddToCart(product) {
    message.success(`${product.name} added to cart! 🛒`);
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>🛍️ Browse Products</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Search products..." 
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select 
            value={selectedCategory} 
            onChange={setSelectedCategory}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Categories</Select.Option>
            <Select.Option value="Electronics">📱 Electronics</Select.Option>
            <Select.Option value="Fashion">👗 Fashion</Select.Option>
            <Select.Option value="Pharmacy">💊 Pharmacy</Select.Option>
            <Select.Option value="Grocery">🛒 Grocery</Select.Option>
          </Select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tag color="blue">Showing {filteredProducts.length} products</Tag>
      </div>

      <Row gutter={[16, 16]}>
        {filteredProducts.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 80,
                  background: '#f5f5f5'
                }}>
                  {product.image}
                </div>
              }
            >
              <Card.Meta
                title={<div style={{ fontSize: 14, height: 40, overflow: 'hidden' }}>{product.name}</div>}
                description={
                  <div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>
                      <Tag color="green" style={{ fontSize: 10 }}>{product.category}</Tag>
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>
                      📍 {product.store}
                    </div>
                    <div style={{ fontSize: 11, color: '#faad14', marginBottom: 8 }}>
                      ⭐ {product.rating} / 5
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#52c41a' }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                      <Button 
                        type="primary" 
                        size="small"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <SearchOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No products found</div>
        </div>
      )}
    </div>
  );
}
