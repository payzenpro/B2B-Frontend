import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, InputNumber, message, Empty, Tag, Select } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item._id === productId || item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Quantity updated');
  };

  const updateSize = (productId, size) => {
    const updatedCart = cartItems.map(item =>
      item._id === productId || item.id === productId
        ? { ...item, selectedSize: size }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateColor = (productId, color) => {
    const updatedCart = cartItems.map(item =>
      item._id === productId || item.id === productId
        ? { ...item, selectedColor: color }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => 
      item._id !== productId && item.id !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    message.success('Cart cleared');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // const handleCheckout = () => {
  //   if (cartItems.length === 0) {
  //     message.warning('Your cart is empty');
  //     return;
  //   }
  //   navigate('/checkout');
  // };
const handleCheckout = () => {
  if (cartItems.length === 0) {
    message.warning('Your cart is empty');
    return;
  }
  navigate('/checkout');
};

  const getProductImage = (item) => {
    return item.image?.[0]?.url || 
           item.image?.[0] || 
           item.image?.url || 
           item.image || 
           'https://dummyimage.com/150x150/e0e0e0/666666&text=No+Image';
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', minHeight: '70vh' }}>
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 20 }}>
          Continue Shopping
        </Button>
      </div>
    );
  }


  const handlePlaceOrder = async () => {
  if (cartItems.length === 0) {
    message.warning('Your cart is empty');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Please login as customer');
      navigate('/login/customer');
      return;
    }

    const itemsPayload = cartItems.map(item => ({
      productId: item._id || item.id,
      name: item.name,
      price: Number(item.price) || 0,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor,
    }));

    const subtotal = calculateTotal();
    const totalAmount = subtotal * 1.18; // ya tumhara logic

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: itemsPayload,
        totalAmount,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        status: 'unassigned',
        shippingAddress: 'Test address',
        customerNote: '',
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      message.error(data.message || 'Failed to place order');
      return;
    }

    message.success('Order placed successfully!');
    clearCart();
    navigate('/customer/orders');
  } catch (err) {
    console.error(err);
    message.error('Failed to place order');
  }
};


  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: 24 }}>Shopping Cart ({cartItems.length} items)</h1>

      <Row gutter={[24, 24]}>
        {/* Left: Cart Items */}
        <Col xs={24} lg={16}>
        {cartItems.map((item) => {
  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
  const itemTotal = price * item.quantity;
  const imgSrc = getProductImage(item);

  return (
    <Card key={item._id || item.id} style={{ marginBottom: 16 }}>
      
      <Row gutter={16}>
        {/* Product Image */}
        <Col xs={24} sm={6}>
          <img
            alt={item.name}
            src={imgSrc}
            style={{ width: '100%', maxWidth: 150, borderRadius: 8, objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://dummyimage.com/150x150/e0e0e0/666666&text=No+Image';
            }}
          />
        </Col>

        {/* Product Details */}
        <Col xs={24} sm={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeItem(item._id || item.id)}
            />
          </div>

          <p style={{ color: '#1890ff', fontSize: 18, fontWeight: 600, margin: '8px 0' }}>
            ₹{price.toLocaleString()} × {item.quantity} = ₹{itemTotal.toLocaleString()}
          </p>

          {/* Size Selector */}
          <div style={{ marginTop: 12 }}>
            <span style={{ marginRight: 8, fontWeight: 500 }}>Size:</span>
            <Select
              value={item.selectedSize || 'M'}
              onChange={(value) => updateSize(item._id || item.id, value)}
              style={{ width: 100 }}
            >
              <Option value="S">S</Option>
              <Option value="M">M</Option>
              <Option value="L">L</Option>
              <Option value="XL">XL</Option>
              <Option value="XXL">XXL</Option>
            </Select>
          </div>

          {/* Color Selector */}
          <div style={{ marginTop: 12 }}>
            <span style={{ marginRight: 8, fontWeight: 500 }}>Color:</span>
            <Select
              value={item.selectedColor || 'Black'}
              onChange={(value) => updateColor(item._id || item.id, value)}
              style={{ width: 120 }}
            >
              <Option value="Black">Black</Option>
              <Option value="White">White</Option>
              <Option value="Red">Red</Option>
              <Option value="Blue">Blue</Option>
              <Option value="Green">Green</Option>
            </Select>
          </div>

          {/* Quantity */}
          <div style={{ marginTop: 12 }}>
            <span style={{ marginRight: 8, fontWeight: 500 }}>Quantity:</span>
            <InputNumber
              min={1}
              max={item.stock || 99}
              value={item.quantity}
              onChange={(value) => updateQuantity(item._id || item.id, value)}
            />
            {item.stock && (
              <Tag color="green" style={{ marginLeft: 8 }}>
                {item.stock} in stock
              </Tag>
            )}
          </div>

          {/* Vendor */}
          {item.vendorName && (
            <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              Sold by: <strong>{item.vendorName}</strong>
            </p>
          )}
        </Col>
      </Row>
    </Card>
  );
})}


          <Button danger onClick={clearCart} style={{ marginTop: 16 }}>
            Clear Cart
          </Button>
        </Col>

        {/* Right: Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Shipping:</span>
                <span style={{ color: 'green', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Tax (18%):</span>
                <span style={{ fontWeight: 600 }}>₹{(calculateTotal() * 0.18).toLocaleString()}</span>
              </div>
              <hr style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                <strong>Total:</strong>
                <strong style={{ color: '#1890ff' }}>
                  ₹{(calculateTotal() * 1.18).toLocaleString()}
                </strong>
              </div>
            </div>

              <Button
             type="primary"
               size="large"
                       block
               icon={<ShoppingCartOutlined />}
               onClick={handleCheckout}
                   >
              Proceed to Checkout
                  </Button>


            <Button
              type="default"
              size="large"
              block
              onClick={() => navigate('/')}
              style={{ marginTop: 12 }}
            >
              Continue Shopping
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
