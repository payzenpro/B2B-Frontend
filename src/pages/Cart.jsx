import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, InputNumber, message, Row, Col, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  const loadCartFromLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      (item._id === productId || item.id === productId) 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Quantity updated');
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId && item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    message.info('Cart cleared');
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      message.warning('Please login to proceed with checkout');
      navigate('/');
      return;
    }
    
    navigate('/checkout');
  };

  
  const getImageUrl = (item) => {
    let imgSrc = item.image || item.images?.[0] || 'https://via.placeholder.com/100x100/e0e0e0/666?text=No+Image';
    
    if (imgSrc && typeof imgSrc === 'string' && !imgSrc.startsWith('http')) {
      const baseUrl = API_BASE.replace('/api', '');
      imgSrc = `${baseUrl}${imgSrc}`;
    }
    
    return imgSrc;
  };
  if (cartItems.length === 0) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 40 
      }}>
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ fontSize: 16, color: '#666' }}>
              Your cart is empty
            </span>
          }
        />
        <Button 
          type="primary" 
          size="large"
          icon={<ShoppingOutlined />}
          onClick={() => navigate('/')} 
          style={{ marginTop: 24 }}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h2>
        <Button danger onClick={clearCart}>Clear Cart</Button>
      </div>

      <Row gutter={24}>
        {/* Cart Items */}
        <Col xs={24} lg={16}>
          {cartItems.map(item => {
            const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
            const itemTotal = price * item.quantity;

            return (
              <Card 
                key={item._id || item.id} 
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: 16 }}
              >
                <Row gutter={16} align="middle">
                  {/* Product Image */}
                  <Col xs={8} sm={6} md={4}>
                    <div style={{ 
                      width: '100%', 
                      height: 100, 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fafafa',
                      borderRadius: 8,
                      padding: 8
                    }}>
                      <img 
                        src={getImageUrl(item)}
                        alt={item.name} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain' 
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/e0e0e0/666?text=No+Image';
                        }}
                      />
                    </div>
                  </Col>

                  {/* Product Details */}
                  <Col xs={16} sm={10} md={12}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 16 }}>{item.name}</h4>
                    <p style={{ color: '#666', margin: '0 0 8px 0', fontSize: 14 }}>
                      Price: <strong>₹{price.toLocaleString()}</strong>
                    </p>
                    {item.vendor?.name && (
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                        Sold by: {item.vendor.name}
                      </p>
                    )}
                  </Col>

                  {/* Quantity & Actions */}
                  <Col xs={24} sm={8} md={8} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>Qty:</span>
                        <InputNumber 
                          min={1} 
                          max={item.stock || 999}
                          value={item.quantity} 
                          onChange={(val) => updateQuantity(item._id || item.id, val)}
                          style={{ width: 80 }}
                        />
                      </div>

                      {/* Item Total */}
                      <p style={{ 
                        fontSize: 18, 
                        fontWeight: 700, 
                        color: '#1890ff',
                        margin: 0
                      }}>
                        ₹{itemTotal.toLocaleString()}
                      </p>

                      {/* Remove Button */}
                      <Button 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromCart(item._id || item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card 
            title="Order Summary" 
            style={{ position: 'sticky', top: 20 }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Subtotal:</span>
                <span>₹{getSubtotal().toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Shipping:</span>
                <span style={{ color: '#52c41a' }}>FREE</span>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
                <span>Total:</span>
                <span style={{ color: '#1890ff' }}>₹{getSubtotal().toLocaleString()}</span>
              </div>
            </div>

            <Button 
              type="primary" 
              size="large" 
              block
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>

            <Button 
              style={{ marginTop: 12 }} 
              block
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
