import { useState, useEffect } from "react";
import { Card, List, Button, InputNumber, message, Tag, Divider, Row, Col, Spin } from "antd";
import { DeleteOutlined, ShoppingOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart, clearCart } from '../app/api.js';

export default function CustomerCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCartItems(data.items || []);
      setSubtotal(data.subtotal || 0);
      setTax(data.tax || 0);
      setShipping(data.shipping || 0);
      setTotal(data.total || 0);
    } catch (error) {
      message.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, qty) => {
    if (qty <= 0) return;
    try {
      await updateCartItem(itemId, qty);
      message.success('Quantity updated');
      fetchCart();
    } catch (error) {
      message.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      message.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      message.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error('Cart is empty!');
      return;
    }
    navigate('/customer/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/customer/products');
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      message.success('Cart cleared');
      fetchCart();
    } catch (error) {
      message.error('Failed to clear cart');
    }
  };
  const itemsByCategory = cartItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: 8 }}> Shopping Cart</h2>
          <p style={{ color: '#888', margin: 0 }}>{cartItems.length} items in cart</p>
        </div>
        {cartItems.length > 0 && (
          <Button danger onClick={handleClearCart}>Clear Cart</Button>
        )}
      </div>

      <Row gutter={[16, 16]}>
        {/* Cart Items */}
        <Col xs={24} lg={16}>
          {cartItems.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: 60 }}>
              <ShoppingOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
              <div style={{ color: '#999', marginBottom: 16 }}>Your cart is empty</div>
              <Button type="primary" size="large" onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </Card>
          ) : (
            <>
              {/* Group by category */}
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category} style={{ marginBottom: 24 }}>
                  <Card>
                    <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
                      {category === 'Electronics' && '📱'} 
                      {category === 'Fashion' && '👗'} 
                      {category === 'Pharmacy' && '💊'} 
                      {category}
                    </div>
                    <List
                      dataSource={items}
                      renderItem={item => (
                        <List.Item style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                              <div style={{ fontSize: 40 }}>{item.image || '📦'}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                                <div style={{ fontSize: 12, color: '#888' }}>
                                  Store: <strong>{item.store}</strong>
                                </div>
                                <div style={{ fontSize: 14, color: '#52c41a', fontWeight: 600, marginTop: 4 }}>
                                  ₹{item.price.toLocaleString()} each
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end', minWidth: 300 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Qty</div>
                                <InputNumber 
                                  min={1} 
                                  max={10} 
                                  value={item.quantity} 
                                  onChange={(val) => handleQuantityChange(item._id, val)}
                                  style={{ width: 60 }}
                                />
                              </div>
                              <div style={{ textAlign: 'right', minWidth: 100 }}>
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Total</div>
                                <div style={{ fontWeight: 700, fontSize: 16, color: '#1890ff' }}>
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                              <Button 
                                danger 
                                icon={<DeleteOutlined />} 
                                onClick={() => handleRemove(item._id)}
                                style={{ minWidth: 40 }}
                              />
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </div>
              ))}
            </>
          )}
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Tax (5%)</span>
                <span style={{ fontWeight: 600 }}>₹{tax.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#52c41a' : '#000' }}>
                  {shipping === 0 ? '✓ Free' : `₹${shipping}`}
                </span>
              </div>

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#52c41a' }}>
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={handleCheckout}
                icon={<CreditCardOutlined />}
                style={{ marginBottom: 12 }}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>

              <Button 
                block 
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>

            <div style={{ background: '#f6f8fb', padding: 12, borderRadius: 8, marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}> Payment Methods</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                ✓ Credit Card<br/>
                ✓ Debit Card<br/>
                ✓ UPI<br/>
                ✓ Net Banking<br/>
                ✓ Wallet
              </div>
            </div>

            <div style={{ background: '#f6f8fb', padding: 12, borderRadius: 8, marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}> Offers Available</div>
              <Tag color="green" style={{ marginBottom: 8 }}>30% off on first order</Tag><br/>
              <Tag color="blue">Free delivery above ₹50000</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
