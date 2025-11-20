import { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Tag, Card, Row, Col } from "antd";
import { SearchOutlined,  DeleteOutlined, ShoppingCartOutlined, DollarOutlined, PrinterOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function VendorPOS() {
  const navigate = useNavigate();

  // Vendor's own items (from VendorItems)
  const [items] = useState([
    // Electronics
    { _id: '1', name: 'iPhone 14 Pro Max', price: 120000, stock: 15, category: 'Electronics', image: '📱' },
    { _id: '2', name: 'Samsung Galaxy S23', price: 95000, stock: 20, category: 'Electronics', image: '📱' },
    { _id: '3', name: 'MacBook Air M2', price: 129999, stock: 8, category: 'Electronics', image: '💻' },
    { _id: '4', name: 'Apple Watch Series 8', price: 45000, stock: 23, category: 'Electronics', image: '⌚' },
    { _id: '7', name: 'Wireless Headphones', price: 3500, stock: 48, category: 'Electronics', image: '🎧' },
    { _id: '8', name: 'Laptop Stand', price: 1200, stock: 35, category: 'Electronics', image: '💻' },

    // Fashion
    { _id: '9', name: 'Formal Shirt (Blue)', price: 1999, stock: 45, category: 'Fashion', image: '👔' },
    { _id: '10', name: 'Jeans (Slim Fit)', price: 2499, stock: 60, category: 'Fashion', image: '👖' },
    { _id: '11', name: 'T-Shirt (Cotton)', price: 599, stock: 120, category: 'Fashion', image: '👕' },
    { _id: '12', name: 'Saree (Silk)', price: 4999, stock: 25, category: 'Fashion', image: '👗' },

    // Pharmacy
    { _id: '19', name: 'Paracetamol (500mg)', price: 35, stock: 200, category: 'Pharmacy', image: '💊' },
    { _id: '20', name: 'Aspirin (100mg)', price: 45, stock: 150, category: 'Pharmacy', image: '💊' },
    { _id: '21', name: 'Vitamin C (1000mg)', price: 299, stock: 100, category: 'Pharmacy', image: '🏥' },
    { _id: '23', name: 'Cough Syrup (200ml)', price: 120, stock: 90, category: 'Pharmacy', image: '🧪' },

    // Grocery
    { _id: '29', name: 'Basmati Rice (5kg)', price: 599, stock: 45, category: 'Grocery', image: '🍚' },
    { _id: '30', name: 'Wheat Flour (5kg)', price: 249, stock: 60, category: 'Grocery', image: '🌾' },
    { _id: '31', name: 'Cooking Oil (1L)', price: 189, stock: 85, category: 'Grocery', image: '🫒' },
    { _id: '34', name: 'Milk (1L)', price: 65, stock: 200, category: 'Grocery', image: '🥛' }
  ]);

  const [cartItems, setCartItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('Customer');
  const [form] = Form.useForm();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: '📱 Electronics' },
    { value: 'Fashion', label: '👔 Fashion' },
    { value: 'Pharmacy', label: '💊 Pharmacy' },
    { value: 'Grocery', label: '🍚 Grocery' }
  ];

  // Filter items
  const filteredItems = items.filter(item => {
    const matchCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchSearch = searchText === '' || 
      item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Add item to cart
  const handleAddToCart = (item) => {
    if (!item) {
      message.error('Please select an item');
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > item.stock) {
        message.error(`Only ${item.stock} items available`);
        return;
      }
      setCartItems(cartItems.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      if (quantity > item.stock) {
        message.error(`Only ${item.stock} items available`);
        return;
      }
      setCartItems([...cartItems, { ...item, quantity, cartId: Date.now() }]);
    }
    
    message.success(`${item.name} added to cart`);
    setModalOpen(false);
    setQuantity(1);
  };

  // Remove from cart
  const handleRemoveItem = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
    message.success('Item removed');
  };

  // Update quantity
  const handleUpdateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error('Cart is empty');
      return;
    }

    Modal.confirm({
      title: 'Confirm Sale',
      content: (
        <div>
          <p><strong>Customer:</strong> {customerName}</p>
          <p><strong>Payment:</strong> {paymentMethod.toUpperCase()}</p>
          <p><strong>Items:</strong> {cartItems.length}</p>
          <p><strong>Subtotal:</strong> ₹{subtotal.toLocaleString()}</p>
          {discount > 0 && <p><strong>Discount:</strong> {discount}% (₹{discountAmount.toLocaleString()})</p>}
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1890ff', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
            <strong>Total:</strong> ₹{total.toLocaleString()}
          </p>
        </div>
      ),
      okText: 'Complete Sale',
      cancelText: 'Cancel',
      onOk() {
        message.success('Sale completed! 🎉');
        setCartItems([]);
        setCustomerName('Customer');
        setDiscount(0);
        setPaymentMethod('cash');
      }
    });
  };

  const cartColumns = [
    {
      title: 'Item',
      key: 'name',
      render: (_, item) => (
        <div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{item.image}</span> {item.name}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{item.category}</div>
        </div>
      ),
      width: 150
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `₹${price.toLocaleString()}`,
      width: 100
    },
    {
      title: 'Qty',
      render: (_, item) => (
        <InputNumber
          min={1}
          max={item.stock}
          value={item.quantity}
          onChange={(val) => handleUpdateQuantity(item.cartId, val)}
          size="small"
          style={{ width: 70 }}
        />
      ),
      width: 90
    },
    {
      title: 'Total',
      render: (_, item) => `₹${(item.price * item.quantity).toLocaleString()}`,
      width: 120
    },
    {
      title: 'Action',
      render: (_, item) => (
        <Popconfirm title="Remove?" onConfirm={() => handleRemoveItem(item.cartId)}>
          <Button size="small" danger type="link" icon={<DeleteOutlined />}>Remove</Button>
        </Popconfirm>
      ),
      width: 80
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/vendor/dashboard')}
          />
          <h2 style={{ margin: 0 }}>Vendor POS - New Sale</h2>
        </div>
        <Tag color="green">Active</Tag>
      </div>

      <Row gutter={16}>
        {/* Items Section */}
        <Col xs={24} lg={16}>
          <Card title="Your Items" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search items..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ flex: 1 }}
              />
              <Select
                value={filterCategory}
                onChange={setFilterCategory}
                style={{ width: 180 }}
              >
                {categories.map(cat => (
                  <Select.Option key={cat.value} value={cat.value}>{cat.label}</Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {filteredItems.map(item => (
                <Card
                  key={item._id}
                  size="small"
                  onClick={() => {
                    setSelectedItem(item);
                    setQuantity(1);
                    setModalOpen(true);
                  }}
                  hoverable
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 28, textAlign: 'center', marginBottom: 8 }}>{item.image}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{item.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1890ff' }}>₹{item.price.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: item.stock > 0 ? '#52c41a' : '#ff4d4f' }}>
                    Stock: {item.stock}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>

        {/* Cart Section */}
        <Col xs={24} lg={8}>
          <Card title={<><ShoppingCartOutlined /> Cart ({cartItems.length})</>} style={{ position: 'sticky', top: 80 }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                <ShoppingCartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>Cart is empty</div>
              </div>
            ) : (
              <>
                <Table
                  dataSource={cartItems}
                  columns={cartColumns}
                  rowKey="cartId"
                  pagination={false}
                  size="small"
                  style={{ marginBottom: 16 }}
                  scroll={{ x: 400 }}
                />

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                  <div style={{ marginBottom: 12, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Subtotal:</span>
                      <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <span>Discount %:</span>
                      <InputNumber min={0} max={100} value={discount} onChange={setDiscount} size="small" style={{ width: 70 }} />
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#ff4d4f' }}>
                        <span>Discount:</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#f6f8fb', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: 18, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total:</span>
                    <span style={{ color: '#1890ff' }}>₹{total.toLocaleString()}</span>
                  </div>

                  <Form form={form} layout="vertical" style={{ marginBottom: 12 }}>
                    <Form.Item label="Customer Name" style={{ marginBottom: 8 }}>
                      <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} size="large" />
                    </Form.Item>
                    <Form.Item label="Payment" style={{ marginBottom: 8 }}>
                      <Select value={paymentMethod} onChange={setPaymentMethod} size="large">
                        <Select.Option value="cash">💵 Cash</Select.Option>
                        <Select.Option value="card">💳 Card</Select.Option>
                        <Select.Option value="upi">📱 UPI</Select.Option>
                        <Select.Option value="wallet">👛 Wallet</Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>

                  <Button type="primary" block size="large" onClick={handleCheckout} style={{ marginBottom: 8 }} icon={<DollarOutlined />}>
                    Complete Sale
                  </Button>
                  <Button block size="large" icon={<PrinterOutlined />} onClick={() => window.print()}>
                    Print Receipt
                  </Button>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Add Item Modal */}
      <Modal
        title={`Add ${selectedItem?.name} to Cart`}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setQuantity(1); }}
        onOk={() => handleAddToCart(selectedItem)}
        okText="Add to items"
        width={500}
      >
        {selectedItem && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Category</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedItem.category}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Price</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1890ff' }}>₹{selectedItem.price.toLocaleString()}</div>
            </div>
            <Form layout="vertical">
              <Form.Item label="Quantity" required>
                <InputNumber min={1} max={selectedItem.stock} value={quantity} onChange={setQuantity} style={{ width: '100%' }} size="large" />
              </Form.Item>
              <div style={{ background: '#f6f8fb', padding: 12, borderRadius: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total:</span>
                <span style={{ color: '#1890ff' }}>₹{(selectedItem.price * quantity).toLocaleString()}</span>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
