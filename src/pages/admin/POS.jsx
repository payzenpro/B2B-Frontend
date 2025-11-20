import { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag, Card, Row, Col } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined, DollarOutlined, PrinterOutlined } from "@ant-design/icons";

export default function POS() {
  const [products] = useState([
    { _id: '1', name: 'iPhone 14 Pro Max', category: 'Electronics', price: 120000, stock: 25 },
    { _id: '2', name: 'Refrigerator 4-Door', category: 'Appliances', price: 85000, stock: 12 },
    { _id: '3', name: 'Leather Ladies Bag', category: 'Fashion', price: 2500, stock: 45 },
    { _id: '4', name: 'Straps Plaid Dress', category: 'Fashion', price: 1800, stock: 60 },
    { _id: '5', name: 'Copper Alloy Bracelet', category: 'Jewelry', price: 450, stock: 100 },
    { _id: '6', name: 'Concrete Planter', category: 'Home', price: 680, stock: 30 },
    { _id: '7', name: 'Wireless Headphones', category: 'Electronics', price: 3500, stock: 48 },
    { _id: '8', name: 'Laptop Stand', category: 'Electronics', price: 1200, stock: 35 },
    { _id: '9', name: 'USB-C Cable', category: 'Electronics', price: 299, stock: 150 },
    { _id: '10', name: 'Phone Case', category: 'Accessories', price: 499, stock: 200 }
  ]);

  const [cartItems, setCartItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [form] = Form.useForm();

  // Filter products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.category.toLowerCase().includes(searchText.toLowerCase())
  );

  // Add product to cart
  const handleAddToCart = (product) => {
    if (!product) {
      message.error('Please select a product');
      return;
    }

    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        message.error(`Only ${product.stock} items available`);
        return;
      }
      setCartItems(cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      if (quantity > product.stock) {
        message.error(`Only ${product.stock} items available`);
        return;
      }
      setCartItems([...cartItems, { ...product, quantity, cartId: Date.now() }]);
    }
    
    message.success(`${product.name} added to cart`);
    setModalOpen(false);
    setQuantity(1);
  };

  // Remove from cart
  const handleRemoveItem = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
    message.success('Item removed from cart');
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
          <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
          <p><strong>Total Items:</strong> {cartItems.length}</p>
          <p><strong>Subtotal:</strong> ₹{subtotal.toLocaleString()}</p>
          {discount > 0 && (
            <>
              <p><strong>Discount:</strong> {discount}% (₹{discountAmount.toLocaleString()})</p>
            </>
          )}
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1890ff', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
            <strong>Total Amount:</strong> ₹{total.toLocaleString()}
          </p>
        </div>
      ),
      okText: 'Complete Sale',
      cancelText: 'Cancel',
      onOk() {
        message.success('Sale completed successfully! 🎉');
        setCartItems([]);
        setCustomerName('Walk-in Customer');
        setDiscount(0);
        setPaymentMethod('cash');
      }
    });
  };

  const cartColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, item) => (
        <div>
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{item.category}</div>
        </div>
      ),
      width: 150
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price.toLocaleString()}`,
      width: 100
    },
    {
      title: 'Qty',
      key: 'quantity',
      render: (_, item) => (
        <InputNumber
          min={1}
          max={item.stock}
          value={item.quantity}
          onChange={(val) => handleUpdateQuantity(item.cartId, val)}
          style={{ width: 70 }}
          size="small"
        />
      ),
      width: 90
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, item) => `₹${(item.price * item.quantity).toLocaleString()}`,
      width: 120
    },
    {
      title: 'Remove',
      key: 'action',
      render: (_, item) => (
        <Popconfirm
          title="Remove item?"
          onConfirm={() => handleRemoveItem(item.cartId)}
        >
          <Button size="small" danger type="link" icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Popconfirm>
      ),
      width: 80
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>POS - New Sale</h2>
        <Tag color="green">Active</Tag>
      </div>

      <Row gutter={16}>
        {/* Products Section */}
        <Col xs={24} lg={16}>
          <Card title="Products" style={{ marginBottom: 16 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: 16 }}
              allowClear
              size="large"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {filteredProducts.map(product => (
                <Card
                  key={product._id}
                  size="small"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setQuantity(1);
                    setModalOpen(true);
                  }}
                  hoverable
                >
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                    {product.category}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1890ff', marginBottom: 8 }}>
                    ₹{product.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: product.stock > 0 ? '#52c41a' : '#ff4d4f' }}>
                    Stock: {product.stock}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>

        {/* Cart Section */}
        <Col xs={24} lg={8}>
          <Card
            title={<><ShoppingCartOutlined /> Cart ({cartItems.length})</>}
            style={{ position: 'sticky', top: 80 }}
          >
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
                />

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                  <div style={{ marginBottom: 12, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Subtotal:</span>
                      <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <span>Discount %:</span>
                      <InputNumber
                        min={0}
                        max={100}
                        value={discount}
                        onChange={setDiscount}
                        style={{ width: 70 }}
                        size="small"
                      />
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#ff4d4f' }}>
                        <span>Discount:</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div style={{
                    background: '#f6f8fb',
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 12,
                    fontSize: 18,
                    fontWeight: 700,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: '#1890ff' }}>₹{total.toLocaleString()}</span>
                  </div>

                  <Form form={form} layout="vertical" style={{ marginBottom: 12 }}>
                    <Form.Item label="Customer Name" style={{ marginBottom: 8 }}>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item label="Payment Method" style={{ marginBottom: 8 }}>
                      <Select
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        size="large"
                      >
                        <Select.Option value="cash">💵 Cash</Select.Option>
                        <Select.Option value="card">💳 Card</Select.Option>
                        <Select.Option value="upi">📱 UPI</Select.Option>
                        <Select.Option value="wallet">👛 Wallet</Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>

                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleCheckout}
                    style={{ marginBottom: 8 }}
                    icon={<DollarOutlined />}
                  >
                    Complete Sale
                  </Button>

                  <Button
                    block
                    size="large"
                    icon={<PrinterOutlined />}
                    onClick={() => window.print()}
                  >
                    Print Receipt
                  </Button>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Add Product Modal */}
      <Modal
        title={`Add ${selectedProduct?.name} to Cart`}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setQuantity(1);
        }}
        onOk={() => handleAddToCart(selectedProduct)}
        okText="Add to items"
        width={500}
      >
        {selectedProduct && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#888', fontSize: 12 }}>Category</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedProduct.category}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#888', fontSize: 12 }}>Price per Unit</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1890ff' }}>
                ₹{selectedProduct.price.toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#888', fontSize: 12 }}>Available Stock</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: selectedProduct.stock > 0 ? '#52c41a' : '#ff4d4f' }}>
                {selectedProduct.stock} units
              </div>
            </div>

            <Form layout="vertical">
              <Form.Item label="Quantity" required>
                <InputNumber
                  min={1}
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={setQuantity}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              <div style={{
                background: '#f6f8fb',
                padding: 12,
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 700
              }}>
                <span>Total:</span>
                <span style={{ color: '#1890ff' }}>₹{(selectedProduct.price * quantity).toLocaleString()}</span>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
