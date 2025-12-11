import React, { useState, useEffect } from "react";
import {Carousel, Row, Col, Card, Tag, Button, message, Spin, Modal, Select, Typography, Input, InputNumber, Badge,} from "antd";
import {ShoppingCartOutlined,MailOutlined,UserOutlined,ShopOutlined,PhoneOutlined,SearchOutlined,FireOutlined,StarFilled,} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;
const { Option } = Select;
const { Text } = Typography;

const banners = [
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1600&h=400&fit=crop",  
  "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=400&fit=crop",  
];

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200",
    icon: "📱"
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200",
    icon: "👗"
  },
  {
    name: "Home & Furniture",
    slug: "furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200",
    icon: "🛋️"
  },
  {
    name: "Appliances",
    slug: "appliances",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200",
    icon: "🔌"
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200",
    icon: "🌸"  
  },
  {
    name: "Grocery",
    slug: "grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
    icon: "🛒"
  },
  {
    name: "Toys",
    slug: "toys",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=200",
    icon: "🧸"
  },
  {
    name: "Sports",
    slug: "sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200",
    icon: "⚽"
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [buyNowVisible, setBuyNowVisible] = useState(false);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      let res = await fetch(`${API_BASE}/product/public`);
      if (!res.ok && res.status === 404) {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        res = await fetch(`${API_BASE}/product`, { headers });
      }
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const data = await res.json();
      const productList = data.success ? data.data : Array.isArray(data) ? data : [];
      setProducts(productList);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getProductImage = (product) => {
    let imgSrc =
      product?.images?.[0]?.url ||
      product?.images?.[0] ||
      product?.image?.url ||
      product?.image ||
      "https://dummyimage.com/300x300/f0f0f0/999&text=No+Image";

    if (imgSrc && typeof imgSrc === "string" && !imgSrc.startsWith("http")) {
      const baseUrl = API_BASE.replace("/api", "");
      imgSrc = `${baseUrl}${imgSrc}`;
    }
    return imgSrc;
  };

  const openProductModal = (product, buyNow = false) => {
    setSelectedProduct(product);
    const defaultSize = Array.isArray(product.sizes)
      ? product.sizes[0]?.label || product.sizes[0]
      : "M";
    setSelectedSize(defaultSize || "M");
    setSelectedColor(product.colors?.[0] || "Black");
    setSelectedQuantity(1);
    setIsBuyNowFlow(buyNow);
    setProductModalVisible(true);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartId = `${selectedProduct._id}-${selectedSize}-${selectedColor}`;
    const idx = existingCart.findIndex((item) => item.cartId === cartId);

    const price = Number(
      selectedProduct.priceInfo?.sellingPrice ??
      selectedProduct.price ??
      selectedProduct.priceInfo?.mrp ??
      0
    );
    const image = getProductImage(selectedProduct);

    if (idx !== -1) {
      existingCart[idx].quantity += selectedQuantity;
      message.success("Product quantity updated in cart");
    } else {
      const cartItem = {
        _id: selectedProduct._id,
        id: selectedProduct._id,
        name: selectedProduct.name,
        price: price,                          
        image: image,                           
        stock: selectedProduct.stock || 99,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        quantity: selectedQuantity,
        cartId: cartId,
        vendorName: selectedProduct.vendor?.name || selectedProduct.vendorName || 'Store'
      };

      existingCart.push(cartItem);
      message.success("Product added to cart");
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setProductModalVisible(false);
    updateCartCount();
  };

  const handleConfirmBuyNow = async () => {
    if (!selectedProduct) {
      message.error("No product selected");
      return;
    }
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user || user.role !== "customer") {
      message.error("Please login as customer to place order");
      navigate("/login/customer");
      return;
    }

    const unitPrice =
      selectedProduct?.priceInfo?.sellingPrice ??
      Number(selectedProduct?.price) ??
      0;

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: selectedProduct._id,
              name: selectedProduct.name,
              quantity: selectedQuantity,
              price: unitPrice,
              size: selectedSize,
              color: selectedColor,
            },
          ],
          totalAmount: unitPrice * selectedQuantity,
          paymentMethod: "COD",
          paymentStatus: "pending",
          status: "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Order create failed");
      }

      message.success("Order placed successfully!");
      setBuyNowVisible(false);
    } catch (err) {
      message.error(err.message || "Something went wrong while placing order");
    }
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
   
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "14px 0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(102,126,234,0.3)",
        }}
      >
     
        <div style={{ padding: "0 24px" }}>
          <Row align="middle" gutter={24}>
            <Col>
              <div
                onClick={() => navigate("/")}
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "white",
                  cursor: "pointer",
                  letterSpacing: "-0.5px",
                }}
              >
                Shop<span style={{ color: "#ffd700" }}>Easy</span>
              </div>
            </Col>

            <Col flex="1">
              <Input
                size="large"
                placeholder="Search for products, brands and more..."
                prefix={<SearchOutlined style={{ color: "#999" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value.toLowerCase())}
                style={{
                  height: 46,
                  borderRadius: 23,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </Col>

            <Col>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Button
                  type="text"
                  onClick={() => navigate("/login/customer")}
                  style={{
                    color: "white",
                    fontWeight: 600,
                    height: "auto",
                    padding: "8px 20px",
                  }}
                >
                  Login
                </Button>

                <Badge count={cartCount} offset={[0, 4]}>
                  <Button
                    type="text"
                    icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                    onClick={() => navigate("/cart")}
                    style={{ color: "white" }}
                  />
                </Badge>

                <Button
                  type="text"
                  icon={<UserOutlined style={{ fontSize: 18 }} />}
                  onClick={() => navigate("/customer/dashboard")}
                  style={{ color: "white" }}
                />

                <Button
                  type="text"
                  onClick={() => navigate("/login/vendor")}
                  style={{
                    color: "white",
                    fontWeight: 600,
                    height: "auto",
                    padding: "8px 20px",
                  }}
                >
                  Vendor Login
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </header>

      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", marginTop: 0 }}>  
        <div style={{ padding: "16px 24px" }}>
          <Row gutter={[24, 18]} justify="space-around">
            {categories.map((cat) => (
              <Col key={cat.slug}>
                <div
                  onClick={() => navigate(`/products?category=${cat.slug}`)}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{cat.icon}</div>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    {cat.name}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>


      <div style={{ margin: "24px 0 32px", padding: "0 24px" }}>
        <Carousel autoplay autoplaySpeed={4000} dots={{ className: "custom-dots" }}>
          {banners.map((url, idx) => (
            <div key={idx}>
              <img
                src={url}
                alt={`Banner ${idx + 1}`}
                style={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                  borderRadius: 16,
                  display: "block",
                }}
                onError={(e) => {
                  e.target.src = "https://dummyimage.com/1200x280/667eea/ffffff&text=Shop+Now";
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>

      <div style={{ margin: "0 0 60px", padding: "0 24px" }}>
        <div
          style={{
            background: "white",
            padding: 32,
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <FireOutlined style={{ fontSize: 28, color: "#f43f5e" }} />
            <Text style={{ fontSize: 26, fontWeight: 700, color: "#1f2937" }}>
              Featured Products
            </Text>
          </div>

          {loadingProducts ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <Spin size="large" />
              <p style={{ marginTop: 20, color: "#6b7280", fontSize: 15 }}>
                Loading amazing products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 80,
                background: "#f9fafb",
                borderRadius: 16,
              }}
            >
              <Text style={{ fontSize: 16, color: "#6b7280" }}>
                No products available right now
              </Text>
            </div>
          ) : (
            <Row gutter={[20, 20]}>
              {products
                .filter(
                  (prod) =>
                    prod.name?.toLowerCase().includes(searchText) ||
                    prod.category?.toLowerCase().includes(searchText)
                )
                .map((prod) => {
                  const imgSrc = getProductImage(prod);
                  const rawPrice =
                    prod.priceInfo?.sellingPrice ??
                    prod.price ??
                    prod.priceInfo?.mrp ??
                    0;
                  const price = Number(rawPrice) || 0;
                  const stock = typeof prod.stock === "number" ? prod.stock : 0;

                  return (
                    <Col key={prod._id || prod.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 16,
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          transition: "all 0.3s",
                          height: "100%",
                        }}
                        cover={
                          <div
                            style={{
                              height: 220,
                              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 16,
                              position: "relative",
                            }}
                          >
                            <img
                              alt={prod.name}
                              src={imgSrc}
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://dummyimage.com/300x300/f0f0f0/999&text=No+Image";
                              }}
                            />
                            {stock > 0 && (
                              <Tag
                                color="green"
                                style={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  fontWeight: 600,
                                }}
                              >
                                In Stock
                              </Tag>
                            )}
                          </div>
                        }
                        bodyStyle={{ padding: 20 }}
                      >
                        <Meta
                          title={
                            <Text
                              ellipsis={{ rows: 2 }}
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#1f2937",
                                minHeight: 40,
                                display: "block",
                              }}
                            >
                              {prod.name}
                            </Text>
                          }
                        />

                        <div style={{ marginTop: 12 }}>
                          <Text
                            strong
                            style={{ fontSize: 22, color: "#1f2937", display: "block" }}
                          >
                            ₹{price.toLocaleString()}
                          </Text>

                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "#10b981",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              3.5<StarFilled style={{ fontSize: 10 }} />
                            </div>
                            <Text style={{ color: "#6b7280", fontSize: 12 }}>
                              (3.6 reviews)
                            </Text>
                          </div>
                        </div>

                        <Row gutter={8} style={{ marginTop: 16 }}>
                          <Col span={12}>
                            <Button
                              block
                              type="primary"
                              icon={<ShoppingCartOutlined />}
                              onClick={() => openProductModal(prod, false)}
                              disabled={stock === 0}
                              style={{
                                height: 42,
                                borderRadius: 21,
                                fontWeight: 600,
                                background: stock === 0 ? "#d1d5db" : "linear-gradient(45deg, #667eea, #764ba2)",
                                border: "none",
                              }}
                            >
                              Cart
                            </Button>
                          </Col>
                          <Col span={12}>
                            <Button
                              block
                              danger
                              onClick={() => openProductModal(prod, true)}
                              disabled={stock === 0}
                              style={{
                                height: 42,
                                borderRadius: 21,
                                fontWeight: 600,
                              }}
                            >
                              Buy Now
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          )}
        </div>
      </div>

   
      <Modal
        title={selectedProduct?.name || "Product Details"}
        open={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        width={600}
        footer={
          isBuyNowFlow
            ? [
                <Button key="cancel" onClick={() => setProductModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="proceed"
                  type="primary"
                  onClick={() => {
                    setProductModalVisible(false);
                    setBuyNowVisible(true);
                  }}
                >
                  Proceed to Buy
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setProductModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="add"
                  type="primary"
                  onClick={handleAddToCart}
                  disabled={selectedProduct?.stock < 1}
                >
                  Add to Cart
                </Button>,
              ]
        }
      >
        {selectedProduct && (
          <>
            <img
              src={getProductImage(selectedProduct)}
              alt={selectedProduct.name}
              style={{
                width: "100%",
                maxHeight: 320,
                objectFit: "contain",
                background: "#f9fafb",
                padding: 20,
                borderRadius: 12,
              }}
            />
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 16 }}>
                <strong>Price: </strong>₹
                {Number(
                  selectedProduct.priceInfo?.sellingPrice ??
                    selectedProduct.priceInfo?.mrp ??
                    selectedProduct.price ??
                    0
                ).toLocaleString()}
              </p>

              <p style={{ marginTop: 12 }}>
                <strong>Size: </strong>
                <Select value={selectedSize} style={{ width: 160 }} onChange={setSelectedSize}>
                  {(selectedProduct.sizes || ["S", "M", "L", "XL"]).map((s) => {
                    const label = s.label || s;
                    return (
                      <Option key={label} value={label}>
                        {label}
                      </Option>
                    );
                  })}
                </Select>
              </p>

              <p style={{ marginTop: 12 }}>
                <strong>Color: </strong>
                <Select value={selectedColor} style={{ width: 160 }} onChange={setSelectedColor}>
                  {(selectedProduct.colors || ["Black", "White", "Blue"]).map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>
              </p>

              <p style={{ marginTop: 12 }}>
                <strong>Quantity: </strong>
                <InputNumber
                  min={1}
                  max={selectedProduct.stock || 10}
                  value={selectedQuantity}
                  onChange={setSelectedQuantity}
                  style={{ width: 100 }}
                />
              </p>
            </div>
          </>
        )}
      </Modal>

      <Modal
        title="Order Summary"
        open={buyNowVisible}
        onCancel={() => setBuyNowVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBuyNowVisible(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmBuyNow}>
            Confirm Purchase
          </Button>,
        ]}
      >
        {selectedProduct && (
          <div style={{ lineHeight: 2 }}>
            <p>
              <strong>Product:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Size:</strong> {selectedSize}
            </p>
            <p>
              <strong>Color:</strong> {selectedColor}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedQuantity}
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
              <strong>Total:</strong> ₹
              {(
                (selectedProduct.priceInfo?.sellingPrice || selectedProduct.price) *
                selectedQuantity
              ).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>

     
      <footer
        style={{
          background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          color: "white",
          padding: "60px 24px 30px",
          marginTop: 60,
        }}
      >
 
        <div>
          <Row gutter={[40, 40]}>
            <Col xs={24} sm={12} md={6}>
              <h3 style={{ color: "white", fontSize: 22, marginBottom: 16 }}>ShopEasy</h3>
              <p style={{ color: "#bdc3c7", lineHeight: 1.8 }}>
                Your trusted marketplace for electronics, fashion, home, and more.
              </p>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Quick Links</h4>
              <div style={{ color: "#bdc3c7", lineHeight: 2 }}>
                <div style={{ cursor: "pointer" }}>About Us</div>
                <div style={{ cursor: "pointer" }}>Contact Us</div>
                <div style={{ cursor: "pointer" }}>Privacy Policy</div>
                <div style={{ cursor: "pointer" }}>Terms & Conditions</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Customer Support</h4>
              <div style={{ color: "#bdc3c7", lineHeight: 2 }}>
                <div style={{ cursor: "pointer" }}>Help Center</div>
                <div style={{ cursor: "pointer" }}>Returns</div>
                <div style={{ cursor: "pointer" }}>Shipping Info</div>
                <div style={{ cursor: "pointer" }}>FAQs</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Contact Us</h4>
              <p style={{ color: "#bdc3c7" }}>
                <PhoneOutlined /> +91 98765 43210
              </p>
              <p style={{ color: "#bdc3c7" }}>
                <MailOutlined /> support@shopeasy.com
              </p>
              <p style={{ color: "#bdc3c7" }}>
                <ShopOutlined /> Mumbai, India
              </p>
            </Col>
          </Row>

          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid #34495e",
              textAlign: "center",
              color: "#bdc3c7",
              fontSize: 14,
            }}
          >
            © {new Date().getFullYear()} ShopEasy. Made with ❤️ for India
          </div>
        </div>
      </footer>
    </div>
  );
}
