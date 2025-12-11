import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Row, Col, Card, Tag, Button, Checkbox, Slider, Input, Modal, Select, InputNumber, message } from "antd";
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Furniture", slug: "furniture" },
  { name: "Appliances", slug: "appliances" },
  { name: "Beauty", slug: "beauty" },
  { name: "Food & Drinks", slug: "food" },
  { name: "Grocery", slug: "grocery" },
  { name: "Stationary", slug: "stationary" },
  { name: "Toys", slug: "toys" },
];

export default function HomeProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [searchText, setSearchText] = useState("");

  // MODAL STATES
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [buyNowVisible, setBuyNowVisible] = useState(false);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

 
  const category = searchParams.get("category");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    fetchProducts();
  }, [category]); 

  useEffect(() => {
    applyFilters();
  }, [products, priceRange, inStockOnly, selectedColors, searchText]);

 
  const fetchProducts = async () => {
    try {
     
      let url = `${API_BASE}/product/public`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }

      console.log(" Fetching from:", url);
      console.log(" Category filter:", category);

      const res = await fetch(url);
      const data = await res.json();
     


console.log(' API Response:', data);
console.log(' Products received:', data.data?.length);
console.log(' Category:', data.category);

if (data.success) {
  const allProducts = data.data || [];
  console.log(` Loaded ${allProducts.length} products`);
  

  if (allProducts.length > 0) {
    console.log(' First product:', {
      name: allProducts[0].name,
      category: allProducts[0].category
    });
  }
  
  setProducts(allProducts);
  setFilteredProducts(allProducts);
}




      if (data.success) {
        const allProducts = data.data || [];
        console.log(` Loaded ${allProducts.length} products`);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } else {
        console.error(" API returned error:", data.message);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error(" Fetch products error:", err);
      message.error("Failed to load products");
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const allColors = [...new Set(products.flatMap((p) => p.colors || []))];

  const getImage = (product) => {
    let imgSrc =
      product.thumbnail ||
      (Array.isArray(product.images) && product.images[0]) ||
      product.image ||
      "https://via.placeholder.com/200x200/e0e0e0/666666?text=No+Image";

    if (imgSrc && typeof imgSrc === "string" && !imgSrc.startsWith("http")) {
      imgSrc = `http://localhost:4000${imgSrc}`;
    }
    return imgSrc;
  };

  const getPrice = (product) => {
    const rawPrice =
      product.priceInfo?.sellingPrice ??
      product.price ??
      product.priceInfo?.mrp ??
      0;
    return Number(rawPrice) || 0;
  };

  const applyFilters = () => {
    let result = [...products];

    result = result.filter((p) => {
      const price = getPrice(p);
      return price >= priceRange[0] && price <= priceRange[1];
    });

  
    if (inStockOnly) {
      result = result.filter((p) => Number(p.stock) > 0);
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        (p.colors || []).some((c) => selectedColors.includes(c))
      );
    }

   
    if (searchText.trim() !== "") {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    console.log(` Filtered: ${result.length} products`);
    setFilteredProducts(result);
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

    const price = getPrice(selectedProduct);
    const image = getImage(selectedProduct);

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
        vendorName: selectedProduct.vendor?.name || selectedProduct.vendorName || "Store",
      };

      existingCart.push(cartItem);
      message.success("Product added to cart");
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setProductModalVisible(false);
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

    const unitPrice = getPrice(selectedProduct);

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

      message.success(" Order placed successfully!");
      setBuyNowVisible(false);
      navigate("/customer/orders");
    } catch (err) {
      message.error(err.message || "Something went wrong while placing order");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#001529",
          padding: "16px 32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h2
            style={{ color: "white", margin: 0, fontSize: 20, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            ShopEasy
          </h2>

          <Input.Search
            placeholder="Search products, brands and more"
            allowClear
            enterButton="Search"
            size="middle"
            style={{ width: 370, borderRadius: 8, background: "#fff", marginLeft: 50 }}
            onSearch={(value) => setSearchText(value.toLowerCase())}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Button type="primary" onClick={() => navigate("/login/customer")}>
            Login/Register
          </Button>

          <Button
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate("/cart")}
            style={{ backgroundColor: "red", color: "white", borderColor: "red" }}
          >
            Cart
          </Button>

          <Button type="default" onClick={() => navigate("/login/vendor")}>
            Vendor Login
          </Button>
        </div>
      </div>

      {/* ✅ CATEGORY  */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          padding: "12px 16px",
          position: "sticky",
          top: 60,
          zIndex: 999,
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          background: "white",
          marginBottom: 20,
          overflowX: "auto",
        }}
      >
        {/* ALL PRODUCTS */}
        <div
          onClick={() => {
            console.log(" Navigating to: All Products");
            navigate("/products");
          }}
          style={{
            cursor: "pointer",
            textAlign: "center",
            minWidth: 100,
            padding: "10px 16px",
            borderRadius: 8,
            background: !category ? "#1890ff" : "transparent",
            color: !category ? "white" : "#333",
            fontWeight: 600,
            transition: "all 0.3s",
            border: !category ? "none" : "1px solid #d9d9d9",
          }}
        >
          All Products
        </div>

        {/* ✅ CATEGORY BUTTONS */}
        {categories.map((cat) => (
          <div
            key={cat.slug}
            onClick={() => {
              console.log(" Navigating to category:", cat.slug);
              navigate(`/products?category=${cat.slug}`);
            }}
            style={{
              cursor: "pointer",
              textAlign: "center",
              minWidth: 100,
              padding: "10px 16px",
              borderRadius: 8,
              background: category === cat.slug ? "#1890ff" : "transparent",
              color: category === cat.slug ? "white" : "#333",
              fontWeight: 600,
              transition: "all 0.3s",
              border: category === cat.slug ? "none" : "1px solid #d9d9d9",
            }}
            onMouseEnter={(e) => {
              if (category !== cat.slug) {
                e.currentTarget.style.background = "#f0f0f0";
              }
            }}
            onMouseLeave={(e) => {
              if (category !== cat.slug) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* ✅ CATEGORY HEADING */}
      {category && (
        <div style={{ padding: "0 24px", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            {categories.find(c => c.slug === category)?.name || category.toUpperCase()}
            <Tag color="blue" style={{ marginLeft: 12, fontSize: 14 }}>
              {filteredProducts.length} products
            </Tag>
          </h2>
        </div>
      )}

      {/* SEARCH BAR */}
      <Input
        size="large"
        placeholder="Search products (e.g., Redmi, Samsung)"
        prefix={<SearchOutlined />}
        value={searchText}
        style={{ marginBottom: 25, width: "40%", marginLeft: "30%", borderRadius: 8 }}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Row gutter={24} style={{ padding: "0 24px" }}>
        <Col xs={24} sm={8} md={6} lg={5}>
          <div
            style={{
              padding: 20,
              border: "1px solid #e8e8e8",
              position: "sticky",
              top: 140,
              borderRadius: 12,
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 20, fontSize: 18 }}>
               Filters
            </h3>

            {/* PRICE FILTER */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Price Range</p>
              <Slider
                range
                min={0}
                max={100000}
                step={500}
                value={priceRange}
                onChange={(v) => setPriceRange(v)}
              />
              <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </div>
            </div>

            {/* STOCK FILTER */}
            <div style={{ marginBottom: 24 }}>
              <Checkbox
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              >
                <span style={{ fontWeight: 600 }}>In stock only</span>
              </Checkbox>
            </div>

            {/* COLOR FILTER */}
            <div>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Colors</p>
              {allColors.length ? (
                allColors.map((color) => (
                  <Checkbox
                    key={color}
                    checked={selectedColors.includes(color)}
                    onChange={(e) => {
                      setSelectedColors((prev) =>
                        prev.includes(color)
                          ? prev.filter((c) => c !== color)
                          : [...prev, color]
                      );
                    }}
                    style={{ 
                      display: "block", 
                      marginBottom: 8,
                      textTransform: "capitalize" 
                    }}
                  >
                    {color}
                  </Checkbox>
                ))
              ) : (
                <p style={{ color: "#999", fontSize: 13 }}>No colors available</p>
              )}
            </div>

            {/* CLEAR FILTERS */}
            <Button
              block
              onClick={() => {
                setPriceRange([0, 100000]);
                setInStockOnly(false);
                setSelectedColors([]);
                setSearchText("");
              }}
              style={{ marginTop: 20 }}
            >
              Clear All Filters
            </Button>
          </div>
        </Col>

        {/* PRODUCT LIST */}
        <Col xs={24} sm={16} md={18} lg={19}>
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: 80,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No products found</p>
              <p style={{ color: "#666", fontSize: 14 }}>
                {category 
                  ? `No products available in ${category} category`
                  : "Try adjusting your filters"}
              </p>
              <Button type="primary" onClick={() => navigate("/")}>
                Browse All Products
              </Button>
            </div>
          ) : (
            <Row gutter={[20, 20]}>
              {filteredProducts.map((p) => {
                const price = getPrice(p);

                return (
                  <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "all 0.3s",
                      }}
                      cover={
                        <div
                          style={{
                            height: 220,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#fafafa",
                            padding: 16,
                          }}
                        >
                          <img
                            src={getImage(p)}
                            alt={p.name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/200x200/e0e0e0/666666?text=No+Image";
                            }}
                          />
                        </div>
                      }
                      actions={[
                        <Button
                          key="cart"
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => openProductModal(p, false)}
                          disabled={p.stock < 1}
                          block
                        >
                          {p.stock > 0 ? "Cart" : "Out of Stock"}
                        </Button>,
                        <Button
                          key="buy"
                          danger
                          onClick={() => openProductModal(p, true)}
                          disabled={p.stock < 1}
                          block
                        >
                          Buy Now
                        </Button>,
                      ]}
                    >
                      <div style={{ 
                        fontSize: 15, 
                        fontWeight: 600,
                        minHeight: 40,
                        marginBottom: 8
                      }}>
                        {p.name || "Untitled Product"}
                      </div>
                      <div style={{ fontSize: 20, color: "#1890ff", fontWeight: 700 }}>
                        ₹{price.toLocaleString("en-IN")}
                      </div>
                      <Tag 
                        color={p.stock > 0 ? "green" : "red"}
                        style={{ marginTop: 8 }}
                      >
                        {p.stock > 0 ? `In stock (${p.stock})` : "Out of Stock"}
                      </Tag>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>

      {/* PRODUCT MODAL */}
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
              src={getImage(selectedProduct)}
              alt={selectedProduct.name}
              style={{ 
                width: "100%", 
                maxHeight: 320, 
                objectFit: "contain",
                background: "#fafafa",
                padding: 20,
                borderRadius: 8
              }}
            />
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 16, marginBottom: 12 }}>
                <strong>Price:</strong> ₹
                {getPrice(selectedProduct).toLocaleString("en-IN")}
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong>Size:</strong>
                <Select
                  value={selectedSize}
                  style={{ width: 140, marginLeft: 12 }}
                  onChange={setSelectedSize}
                >
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
              <p style={{ marginBottom: 12 }}>
                <strong>Color:</strong>
                <Select
                  value={selectedColor}
                  style={{ width: 140, marginLeft: 12 }}
                  onChange={setSelectedColor}
                >
                  {(selectedProduct.colors || ["Black", "White"]).map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>Quantity:</strong>
                <InputNumber
                  min={1}
                  max={selectedProduct.stock || 10}
                  value={selectedQuantity}
                  onChange={setSelectedQuantity}
                  style={{ marginLeft: 12, width: 100 }}
                />
              </p>
            </div>
          </>
        )}
      </Modal>


      <Modal
        title=" Order Summary"
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
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1890ff" }}>
              <strong>Total:</strong> ₹
              {(getPrice(selectedProduct) * selectedQuantity).toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

