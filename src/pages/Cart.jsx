

// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Button, InputNumber, message, Empty, Tag, Select } from 'antd';
// import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// export default function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadCart();
//   }, []);

//   const loadCart = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     console.log(' Cart loaded:', cart);
//     setCartItems(cart);
//   };

//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) return;
//     const updatedCart = cartItems.map(item =>
//       (item._id === productId || item.id === productId)
//         ? { ...item, quantity: newQuantity }
//         : item
//     );
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     message.success('Quantity updated');
//   };

//   const updateSize = (productId, size) => {
//     const updatedCart = cartItems.map(item =>
//       (item._id === productId || item.id === productId)
//         ? { ...item, selectedSize: size }
//         : item
//     );
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const updateColor = (productId, color) => {
//     const updatedCart = cartItems.map(item =>
//       (item._id === productId || item.id === productId)
//         ? { ...item, selectedColor: color }
//         : item
//     );
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const removeItem = (productId) => {
//     const updatedCart = cartItems.filter(item => 
//       item._id !== productId && item.id !== productId
//     );
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     message.success('Item removed from cart');
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem('cart');
//     message.success('Cart cleared');
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const price = Number(item.price) || 0;
//       const quantity = Number(item.quantity) || 1;
//       return total + (price * quantity);
//     }, 0);
//   };

//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       message.warning('Your cart is empty');
//       return;
//     }
//     navigate('/checkout');
//   };

//   // IMPROVED IMAGE 
//   const getProductImage = (item) => {
//     console.log(' Getting image for:', item.name, {
//       image: item.image,
//       images: item.images
//     });
    
    
//     const imageUrl = 
//       item.image ||                         
//       item.images?.[0] ||                    
//       item.image?.[0] ||                    
//       '';
    
//     console.log(' Image URL:', imageUrl);
    
//     return imageUrl || 'https://via.placeholder.com/120x120/e0e0e0/666666?text=No+Image';
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div style={{ padding: 40, textAlign: 'center', minHeight: '70vh' }}>
//         <Empty
//           description="Your cart is empty"
//           image={Empty.PRESENTED_IMAGE_SIMPLE}
//         />
//         <Button 
//           type="primary" 
//           size="large"
//           onClick={() => navigate('/')} 
//           style={{ marginTop: 20 }}
//         >
//           Continue Shopping
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
//       <h1 style={{ marginBottom: 24 }}>🛒 Shopping Cart ({cartItems.length} items)</h1>

//       <Row gutter={[24, 24]}>
//         {/* Left: Cart Items */}
//         <Col xs={24} lg={16}>
//           {cartItems.map((item) => {
//             const price = Number(item.price) || 0;
//             const quantity = Number(item.quantity) || 1;
//             const itemTotal = price * quantity;
//             const imgSrc = getProductImage(item);

//             console.log(' Rendering item:', {
//               name: item.name,
//               price,
//               quantity,
//               imgSrc
//             });

//             return (
//               <Card 
//                 key={item._id || item.id} 
//                 style={{ marginBottom: 16 }}
//                 bodyStyle={{ padding: 16 }}
//               >
//                 <Row gutter={16} align="top">
//                   {/* ✅ FIXED SIZE IMAGE */}
//                   <Col xs={24} sm={6} md={4} style={{ textAlign: 'center' }}>
//                     <div style={{
//                       width: '120px',
//                       height: '120px',
//                       overflow: 'hidden',
//                       borderRadius: 8,
//                       background: '#f5f5f5',
//                       border: '1px solid #e8e8e8',
//                       margin: '0 auto',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}>
//                       <img
//                         alt={item.name}
//                         src={imgSrc}
//                         style={{ 
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'cover',
//                           objectPosition: 'center'
//                         }}
//                         onError={(e) => {
//                           console.error(' Image load error for:', item.name);
//                           e.target.onerror = null;
//                           e.target.src = 'https://via.placeholder.com/120x120/e0e0e0/666666?text=No+Image';
//                         }}
//                       />
//                     </div>
//                   </Col>

//                   {/* Product Details */}
//                   <Col xs={24} sm={18} md={20}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                       <h3 style={{ 
//                         margin: 0, 
//                         fontSize: 16,
//                         fontWeight: 600,
//                         maxWidth: 'calc(100% - 50px)'
//                       }}>
//                         {item.name || 'Unknown Product'}
//                       </h3>
//                       <Button
//                         type="text"
//                         danger
//                         icon={<DeleteOutlined />}
//                         onClick={() => removeItem(item._id || item.id)}
//                       />
//                     </div>

//                     {item.vendorName && (
//                       <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#666' }}>
//                         Sold by: <strong>{item.vendorName}</strong>
//                       </p>
//                     )}

//                     <p style={{ 
//                       color: '#1890ff', 
//                       fontSize: 20, 
//                       fontWeight: 700, 
//                       margin: '8px 0 12px' 
//                     }}>
//                       ₹{price.toLocaleString('en-IN')} × {quantity} = <span style={{ color: '#52c41a' }}>₹{itemTotal.toLocaleString('en-IN')}</span>
//                     </p>

//                     <Row gutter={[12, 12]}>
//                       <Col xs={8} sm={6}>
//                         <div>
//                           <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Size</div>
//                           <Select
//                             value={item.selectedSize || 'M'}
//                             onChange={(value) => updateSize(item._id || item.id, value)}
//                             style={{ width: '100%' }}
//                             size="small"
//                           >
//                             <Option value="S">S</Option>
//                             <Option value="M">M</Option>
//                             <Option value="L">L</Option>
//                             <Option value="XL">XL</Option>
//                             <Option value="XXL">XXL</Option>
//                           </Select>
//                         </div>
//                       </Col>

//                       <Col xs={8} sm={6}>
//                         <div>
//                           <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Color</div>
//                           <Select
//                             value={item.selectedColor || 'Black'}
//                             onChange={(value) => updateColor(item._id || item.id, value)}
//                             style={{ width: '100%' }}
//                             size="small"
//                           >
//                             <Option value="Black">Black</Option>
//                             <Option value="White">White</Option>
//                             <Option value="Red">Red</Option>
//                             <Option value="Blue">Blue</Option>
//                             <Option value="Green">Green</Option>
//                           </Select>
//                         </div>
//                       </Col>

//                       <Col xs={8} sm={6}>
//                         <div>
//                           <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Qty</div>
//                           <InputNumber
//                             min={1}
//                             max={item.stock || 99}
//                             value={quantity}
//                             onChange={(value) => updateQuantity(item._id || item.id, value)}
//                             style={{ width: '100%' }}
//                             size="small"
//                           />
//                         </div>
//                       </Col>

//                       {item.stock && (
//                         <Col xs={24} sm={6}>
//                           <Tag color="green" style={{ marginTop: 18 }}>
//                             {item.stock} in stock
//                           </Tag>
//                         </Col>
//                       )}
//                     </Row>
//                   </Col>
//                 </Row>
//               </Card>
//             );
//           })}

//           <Button danger onClick={clearCart} style={{ marginTop: 16 }}>
//             Clear Cart
//           </Button>
//         </Col>

//         {/* Right: Order Summary */}
//         <Col xs={24} lg={8}>
//           <Card 
//             title=" Order Summary" 
//             style={{ position: 'sticky', top: 20 }}
//           >
//             <div style={{ marginBottom: 16 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                 <span>Subtotal:</span>
//                 <span style={{ fontWeight: 600 }}>₹{calculateTotal().toLocaleString('en-IN')}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                 <span>Shipping:</span>
//                 <span style={{ color: 'green', fontWeight: 600 }}>FREE</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                 <span>Tax (18%):</span>
//                 <span style={{ fontWeight: 600 }}>₹{(calculateTotal() * 0.18).toLocaleString('en-IN')}</span>
//               </div>
//               <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid #e8e8e8' }} />
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, marginTop: 12 }}>
//                 <strong>Total:</strong>
//                 <strong style={{ color: '#1890ff' }}>
//                   ₹{(calculateTotal() * 1.18).toLocaleString('en-IN')}
//                 </strong>
//               </div>
//             </div>

//             <Button
//               type="primary"
//               size="large"
//               block
//               icon={<ShoppingCartOutlined />}
//               onClick={handleCheckout}
//             >
//               Proceed to Checkout
//             </Button>

//             <Button
//               type="default"
//               size="large"
//               block
//               onClick={() => navigate('/')}
//               style={{ marginTop: 12 }}
//             >
//               Continue Shopping
//             </Button>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

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
      (item._id === productId || item.id === productId)
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Quantity updated');
  };

  const updateSize = (productId, size) => {
    const updatedCart = cartItems.map(item =>
      (item._id === productId || item.id === productId)
        ? { ...item, selectedSize: size }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateColor = (productId, color) => {
    const updatedCart = cartItems.map(item =>
      (item._id === productId || item.id === productId)
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
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const getProductImage = (item) => {
    const imageUrl = 
      item.image ||
      item.images?.[0] ||
      item.image?.[0] ||
      '';
    
    return imageUrl || 'https://via.placeholder.com/150x150/f0f0f0/999?text=No+Image';
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', minHeight: '70vh' }}>
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button 
          type="primary" 
          size="large"
          onClick={() => navigate('/')} 
          style={{ marginTop: 20 }}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700 }}>
         Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </h1>

      <Row gutter={[24, 24]}>
        {/* Left: Cart Items */}
        <Col xs={24} lg={16}>
          {cartItems.map((item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;
            const imgSrc = getProductImage(item);

            return (
              <Card 
                key={item._id || item.id} 
                style={{ 
                  marginBottom: 16,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Row gutter={16} align="middle">
                  {/* ✅ FIXED SIZE IMAGE CONTAINER */}
                  <Col xs={24} sm={6} md={4}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: 8,
                      background: '#fafafa',
                      border: '1px solid #e8e8e8',
                      margin: '0 auto',
                      padding: 8
                    }}>
                      <img
                        alt={item.name}
                        src={imgSrc}
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x150/f0f0f0/999?text=No+Image';
                        }}
                      />
                    </div>
                  </Col>

                  {/* Product Details */}
                  <Col xs={24} sm={18} md={20}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: 12
                    }}>
                      <div style={{ flex: 1, paddingRight: 16 }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: 17,
                          fontWeight: 600,
                          color: '#1f2937',
                          lineHeight: 1.4
                        }}>
                          {item.name || 'Unknown Product'}
                        </h3>
                        
                        {item.vendorName && (
                          <p style={{ 
                            margin: '4px 0 0', 
                            fontSize: 13, 
                            color: '#6b7280' 
                          }}>
                            Sold by: <span style={{ fontWeight: 600 }}>{item.vendorName}</span>
                          </p>
                        )}
                      </div>

                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(item._id || item.id)}
                        style={{ 
                          height: 32,
                          width: 32,
                          minWidth: 32,
                          padding: 0
                        }}
                      />
                    </div>

                    {/* Price */}
                    <div style={{ 
                      background: '#f0f9ff',
                      padding: '8px 12px',
                      borderRadius: 8,
                      marginBottom: 12,
                      display: 'inline-block'
                    }}>
                      <span style={{ 
                        fontSize: 18, 
                        fontWeight: 700,
                        color: '#1e40af'
                      }}>
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ 
                        margin: '0 8px',
                        color: '#6b7280' 
                      }}>
                        × {quantity}
                      </span>
                      <span style={{ 
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#059669'
                      }}>
                        = ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Options Grid */}
                    <Row gutter={[12, 12]}>
                      <Col xs={8} sm={6} md={5}>
                        <div>
                          <div style={{ 
                            fontSize: 12, 
                            color: '#6b7280', 
                            marginBottom: 6,
                            fontWeight: 600
                          }}>
                            Size
                          </div>
                          <Select
                            value={item.selectedSize || 'M'}
                            onChange={(value) => updateSize(item._id || item.id, value)}
                            style={{ width: '100%' }}
                          >
                            <Option value="S">S</Option>
                            <Option value="M">M</Option>
                            <Option value="L">L</Option>
                            <Option value="XL">XL</Option>
                            <Option value="XXL">XXL</Option>
                          </Select>
                        </div>
                      </Col>

                      <Col xs={8} sm={6} md={6}>
                        <div>
                          <div style={{ 
                            fontSize: 12, 
                            color: '#6b7280', 
                            marginBottom: 6,
                            fontWeight: 600
                          }}>
                            Color
                          </div>
                          <Select
                            value={item.selectedColor || 'Black'}
                            onChange={(value) => updateColor(item._id || item.id, value)}
                            style={{ width: '100%' }}
                          >
                            <Option value="Black">Black</Option>
                            <Option value="White">White</Option>
                            <Option value="Red">Red</Option>
                            <Option value="Blue">Blue</Option>
                            <Option value="Green">Green</Option>
                          </Select>
                        </div>
                      </Col>

                      <Col xs={8} sm={6} md={5}>
                        <div>
                          <div style={{ 
                            fontSize: 12, 
                            color: '#6b7280', 
                            marginBottom: 6,
                            fontWeight: 600
                          }}>
                            Quantity
                          </div>
                          <InputNumber
                            min={1}
                            max={item.stock || 99}
                            value={quantity}
                            onChange={(value) => updateQuantity(item._id || item.id, value)}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </Col>

                      {item.stock && (
                        <Col xs={24} sm={6} md={8}>
                          <div style={{ paddingTop: 20 }}>
                            <Tag 
                              color="success" 
                              style={{ 
                                fontSize: 13,
                                padding: '4px 12px',
                                borderRadius: 6
                              }}
                            >
                              ✓ {item.stock} in stock
                            </Tag>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Card>
            );
          })}

          <Button 
            danger 
            size="large"
            onClick={clearCart} 
            style={{ marginTop: 16 }}
          >
             Clear Cart
          </Button>
        </Col>

        {/* Right: Order Summary */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <span style={{ fontSize: 18, fontWeight: 700 }}>
                 Order Summary
              </span>
            }
            style={{ 
              position: 'sticky', 
              top: 20,
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 12,
                fontSize: 15
              }}>
                <span style={{ color: '#6b7280' }}>Subtotal:</span>
                <span style={{ fontWeight: 600, color: '#1f2937' }}>
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 12,
                fontSize: 15
              }}>
                <span style={{ color: '#6b7280' }}>Shipping:</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 16,
                fontSize: 15
              }}>
                <span style={{ color: '#6b7280' }}>Tax (18%):</span>
                <span style={{ fontWeight: 600, color: '#1f2937' }}>
                  ₹{(calculateTotal() * 0.18).toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{
                borderTop: '2px solid #e5e7eb',
                marginTop: 16,
                paddingTop: 16
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>
                    Total:
                  </span>
                  <span style={{ 
                    fontSize: 24, 
                    fontWeight: 800,
                    color: '#1e40af'
                  }}>
                    ₹{(calculateTotal() * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              onClick={handleCheckout}
              style={{
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                marginBottom: 12
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              type="default"
              size="large"
              block
              onClick={() => navigate('/')}
              style={{
                height: 50,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 8
              }}
            >
              Continue Shopping
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
