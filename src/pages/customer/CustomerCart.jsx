
import React, { useState, useEffect } from "react";
import {Card,Table,Button,InputNumber,Image,message,Empty,Popconfirm,Row, Col, Divider, Space, Spin, Alert} from "antd";
import {DeleteOutlined, ShoppingCartOutlined, MinusOutlined, PlusOutlined, ShoppingOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:4000/api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        message.error('Please login first');
        navigate('/login/customer');
        return;
      }

      console.log('Fetching cart from:', `${API_BASE}/cart`);
      console.log(' Token:', token.substring(0, 20) + '...');

      const res = await fetch(`${API_BASE}/cart`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' Response status:', res.status);

      const data = await res.json();
      console.log(' Cart API Response:', data);

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      let items = [];
      
      if (data.items) {
        items = data.items;
      } else if (data.cart?.items) {
        items = data.cart.items;
      } else if (data.data?.items) {
        items = data.data.items;
      } else if (Array.isArray(data)) {
        items = data;
      }

      console.log(' Cart items found:', items.length);
      if (items.length > 0) {
        console.log(' item structure:', items[0]);
      }

      setCart(Array.isArray(items) ? items : []);

    } catch (error) {
      console.error(' Cart fetch error:', error);
      setError(error.message);
      message.error(`Failed to load cart: ${error.message}`);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (cartItemId, newQty) => {
    if (newQty < 1) {
      message.warning('Quantity must be at least 1');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          cartItemId, 
          quantity: newQty 
        })
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Quantity updated");
        fetchCart();
      } else {
        message.error(data.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      message.error("Failed to update quantity");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Item removed from cart");
        fetchCart();
      } else {
        message.error(data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove item error:", error);
      message.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        message.success("Cart cleared");
        setCart([]);
      } else {
        message.error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      message.error("Failed to clear cart");
    }
  };

  const getProductImage = (item) => {
    console.log(' Getting image for item:', item);
    
    const product = item.productId || item.product || item;
    
    
    let imgSrc = 
      product?.images?.[0]?.url ||
      product?.images?.[0] ||
      product?.image?.url ||
      product?.image ||
      item.image ||
      item.thumbnail ||
      'https://via.placeholder.com/80x80/667eea/fff?text=Product';
    
    console.log(' Image source:', imgSrc);
    
    
    if (imgSrc && typeof imgSrc === 'string' && !imgSrc.startsWith('http')) {
      if (imgSrc.startsWith('/')) {
        imgSrc = `http://localhost:4000${imgSrc}`;
      } else {
        imgSrc = `http://localhost:4000/${imgSrc}`;
      }
    }
    
    console.log(' Final image URL:', imgSrc);
    return imgSrc;
  };

  const getProductName = (item) => {
    const product = item.productId || item.product || item;
    const name = item.name || product?.name || item.productName || 'Unknown Product';
    console.log(' Product name:', name);
    return name;
  };

  const getProductPrice = (item) => {
    const product = item.productId || item.product || item;
    const price = item.price || product?.price || item.salePrice || product?.salePrice || 0;
    console.log(' Product price:', price);
    return price;
  };
  const subtotal = cart.reduce((sum, item) => 
    sum + (getProductPrice(item) * (item.quantity || 1)), 0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: '40%',
      render: (_, item) => {
        console.log('🔍 Rendering item:', item);
        return (
          <Space size="middle">
            <Image
              src={getProductImage(item)}
              alt={getProductName(item)}
              width={80}
              height={80}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              fallback="https://via.placeholder.com/80x80/667eea/fff?text=No+Image"
              onError={(e) => {
                console.error(' Image load failed:', e.target.src);
              }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                {getProductName(item)}
              </div>
              {item.size && (
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  Size: {item.size}
                </div>
              )}
              {item.color && (
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  Color: {item.color}
                </div>
              )}
              {/* Debug info */}
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                ID: {item._id?.slice(-6)}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Price',
      key: 'price',
      align: 'center',
      render: (_, item) => (
        <span style={{ fontWeight: 600, fontSize: 15 }}>
          ₹{getProductPrice(item).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      align: 'center',
      render: (_, item) => (
        <Space>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => updateQty(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          />
          <InputNumber
            min={1}
            max={10}
            value={item.quantity}
            onChange={(val) => updateQty(item._id, val)}
            style={{ width: 60 }}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => updateQty(item._id, item.quantity + 1)}
            disabled={item.quantity >= 10}
          />
        </Space>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      align: 'center',
      render: (_, item) => (
        <span style={{ fontWeight: 700, fontSize: 16, color: '#667eea' }}>
          ₹{(getProductPrice(item) * item.quantity).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, item) => (
        <Popconfirm
          title="Remove this item?"
          description="This action cannot be undone."
          onConfirm={() => removeItem(item._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            danger 
            icon={<DeleteOutlined />}
            size="small"
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Spin size="large" tip="Loading cart..." />
      </div>
    );
  }

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <Alert
          message="Error Loading Cart"
          description={error}
          type="error"
          closable
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" onClick={fetchCart}>
              Retry
            </Button>
          }
        />
      )}

      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            <ShoppingCartOutlined /> My Cart
          </h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {cart.length > 0 && (
          <Popconfirm
            title="Clear all items?"
            description="This will remove all items from your cart."
            onConfirm={clearCart}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              Clear Cart
            </Button>
          </Popconfirm>
        )}
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            {cart.length > 0 ? (
              <Table
                columns={columns}
                dataSource={cart}
                rowKey="_id"
                pagination={false}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <p style={{ fontSize: 16, marginBottom: 16 }}>Your cart is empty</p>
                    <Button 
                      type="primary" 
                      icon={<ShoppingOutlined />}
                      onClick={() => navigate('/')}
                      size="large"
                    >
                      Start Shopping
                    </Button>
                  </div>
                }
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>

        {cart.length > 0 && (
          <Col xs={24} lg={8}>
            <Card 
              title={<span style={{ fontSize: 18, fontWeight: 600 }}>Order Summary</span>}
              bordered={false}
              style={{ borderRadius: 12, position: 'sticky', top: 24 }}
            >
              <div style={{ marginBottom: 16 }}>
                <Row justify="space-between" style={{ marginBottom: 12 }}>
                  <span style={{ color: '#6b7280' }}>Subtotal ({cart.length} items)</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 12 }}>
                  <span style={{ color: '#6b7280' }}>Tax (18% GST)</span>
                  <span style={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</span>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 12 }}>
                  <span style={{ color: '#6b7280' }}>Shipping</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? '#10b981' : '#000' }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </Row>
                
                {subtotal < 500 && subtotal > 0 && (
                  <div style={{ 
                    padding: 12, 
                    background: '#fef3c7', 
                    borderRadius: 8,
                    marginTop: 12,
                    fontSize: 13,
                    color: '#92400e'
                  }}>
                    Add ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
                  </div>
                )}
                
                <Divider style={{ margin: '16px 0' }} />
                
                <Row justify="space-between" style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#667eea' }}>
                    ₹{total.toFixed(2)}
                  </span>
                </Row>
              </div>

              <Button 
                type="primary" 
                size="large" 
                block
                style={{ 
                  height: 50,
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  marginBottom: 12
                }}
                onClick={() => message.info('Checkout coming soon!')}
              >
                Proceed to Checkout
              </Button>

              <Button 
                size="large" 
                block
                style={{ height: 45 }}
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
