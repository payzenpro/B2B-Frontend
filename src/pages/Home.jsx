

// import React, { useState, useEffect } from "react";
// import {Carousel,Row,Col,Card, Tag,Button,message,Spin,Modal,Select,Typography,Dropdown,Space,Tabs,Form,Input,} from "antd";
// import {ShoppingCartOutlined,MailOutlined,LockOutlined,UserOutlined,ShopOutlined,PhoneOutlined,DownOutlined,MenuOutlined,} from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// const { Meta } = Card;
// const { Option } = Select;
// const { Text } = Typography;

// const banners = [
  
//  "https://rukminim1.flixcart.com/fk-p-flap/960/960/image/bf156fff6d3eacbe.jpg?q=50",

//   "https://rukminim1.flixcart.com/fk-p-flap/960/960/image/68243aee3b5240eb.jpg?q=50",
//   "https://rukminim1.flixcart.com/fk-p-flap/960/960/image/bf156fff6d3eacbe.jpg?q=50",
//   "https://rukminim1.flixcart.com/fk-p-flap/960/960/image/bf156fff6d3eacbe.jpg?q=50"

// ];

// const categories = [


//   {
//     name: "Electronics",
//     slug: "electronics",
//     subcategories: [
//       { key: 'mobiles', label: 'Mobiles' },
//       { key: 'laptops', label: 'Laptops' },
//       { key: 'cameras', label: 'Cameras' },
//       { key: 'accessories', label: 'Accessories' }
//     ]
//   },
//   {
//     name: "Fashion",
//     slug: "fashion",
//     subcategories: [
//       { key: 'mens', label: "Men's Wear" },
//       { key: 'womens', label: "Women's Wear" },
//       { key: 'kids', label: 'Kids Fashion' },
//       { key: 'footwear', label: 'Footwear' }
//     ]
//   },
//   {
//     name: "Home & Furniture",
//     slug: "furniture",
//     subcategories: [
//       { key: 'furniture', label: 'Furniture' },
//       { key: 'decor', label: 'Home Decor' },
//       { key: 'kitchen', label: 'Kitchen' },
//       { key: 'lighting', label: 'Lighting' }
//     ]
//   },
//   {
//     name: "Appliances",
//     slug: "appliances",
//     subcategories: [
//       { key: 'tv', label: 'TVs' },
//       { key: 'washing', label: 'Washing Machines' },
//       { key: 'ac', label: 'Air Conditioners' },
//       { key: 'refrigerator', label: 'Refrigerators' }
//     ]
//   }
// ];

// const categoryMenuItems = [
//   {
//     key: 'electronics',
//     label: 'Electronics',
//     children: [
//       { key: 'mobiles', label: 'Mobiles' },
//       { key: 'laptops', label: 'Laptops' },
//       { key: 'cameras', label: 'Cameras' }
//     ]
//   },
//   {
//     key: 'fashion',
//     label: 'Fashion',
//     children: [
//       { key: 'mens', label: "Men's Wear" },
//       { key: 'womens', label: "Women's Wear" },
//       { key: 'kids', label: 'Kids Fashion' }
//     ]
//   },
//   {
//     key: 'home',
//     label: 'Home & Furniture',
//     children: [
//       { key: 'furniture', label: 'Furniture' },
//       { key: 'decor', label: 'Home Decor' },
//       { key: 'kitchen', label: 'Kitchen' }
//     ]
//   },
//   {
//     key: 'appliances',
//     label: 'Appliances',
//     children: [
//       { key: 'tv', label: 'TVs' },
//       { key: 'washing', label: 'Washing Machines' }
//     ]
//   }
// ];


  

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState("login");
//   const [loginLoading, setLoginLoading] = useState(false);
//   const [registerLoading, setRegisterLoading] = useState(false);
//   const [registerRole, setRegisterRole] = useState("customer");

//   const [productModalVisible, setProductModalVisible] = useState(false);
//   const [buyNowVisible, setBuyNowVisible] = useState(false);
//   const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("M");
//   const [selectedColor, setSelectedColor] = useState("Black");
//   const [selectedQuantity, setSelectedQuantity] = useState(1);

//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoadingProducts(true);
//     try {
//       let res = await fetch(`${API_BASE}/product/public`);
//       if (!res.ok && res.status === 404) {
//         const token = localStorage.getItem("token");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
//         res = await fetch(`${API_BASE}/product`, { headers });
//       }
//       if (!res.ok) {
//         setProducts([]);
//         return;
//       }
//       const data = await res.json();
//       const productList = data.success ? data.data : (Array.isArray(data) ? data : []);
//       setProducts(productList);
//       if (productList.length === 0) {
//         message.info("No products available at the moment");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setProducts([]);
//     } finally {
//       setLoadingProducts(false);
//     }
//   };

//   const openProductModal = (product, buyNow = false) => {
//     setSelectedProduct(product);
//     setSelectedSize(product.sizes?.[0] || "M");
//     setSelectedColor(product.colors?.[0] || "Black");
//     setSelectedQuantity(1);
//     setProductModalVisible(true);
//     setIsBuyNowFlow(buyNow);
//   };

//   const handleAddToCart = () => {
//     if (!selectedProduct || !selectedSize || !selectedColor) {
//       message.warning("Please select size and color");
//       return;
//     }

//     const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const cartId = `${selectedProduct._id}-${selectedSize}-${selectedColor}`;
//     const idx = existingCart.findIndex((item) => item.cartId === cartId);

//     if (idx !== -1) {
//       existingCart[idx].quantity += selectedQuantity;
//       message.success("Product quantity updated in cart");
//     } else {
//       existingCart.push({
//         ...selectedProduct,
//         selectedSize,
//         selectedColor,
//         quantity: selectedQuantity,
//         cartId,
//       });
//       message.success("Product added to cart");
//     }

//     localStorage.setItem("cart", JSON.stringify(existingCart));
//     setProductModalVisible(false);
//   };

//   const handleBuyNow = () => {
//     if (!selectedProduct || !selectedSize || !selectedColor) {
//       message.warning("Please select size and color");
//       return;
//     }
//     setProductModalVisible(false);
//     setBuyNowVisible(true);
//     setIsBuyNowFlow(false);
//   };

//   const closeBuyNow = () => {
//     setBuyNowVisible(false);
//   };

//   const getProductImage = (product) => {
//     let imgSrc =
//       product.images?.[0]?.url ||
//       product.images?.[0] ||
//       product.image?.url ||
//       product.image ||
//       "https://dummyimage.com/200x200/e0e0e0/666666&text=No+Image";

//     if (imgSrc && typeof imgSrc === "string" && !imgSrc.startsWith("http")) {
//       const baseUrl = API_BASE.replace("/api", "");
//       imgSrc = `${baseUrl}${imgSrc}`;
//     }

//     return imgSrc;
//   };

//   return (
//     <>
//       {/* Header */}
//       <div
//         style={{
//           backgroundColor: "#001529",
//           padding: "16px 32px",
//           color: "white",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <h2 style={{ color: "white", margin: 0, fontSize: 20 }}>Admin Panel</h2>

//           <Dropdown
//             menu={{
//               items: categoryMenuItems.map((cat) => ({
//                 key: cat.key,
//                 label: cat.label,
//                 children: cat.children?.map((sub) => ({
//                   key: sub.key,
//                   label: sub.label,
//                   onClick: () => message.info(`Navigating to ${sub.label}`),
//                 })),
//               })),
//             }}
//             trigger={["click"]}
//           >
//             <Button type="text" style={{ color: "white", fontWeight: 500 }} icon={<MenuOutlined />}>
//               <Space>
//                 All
//                 <DownOutlined />
//               </Space>
//             </Button>
//           </Dropdown>
// <Input.Search
//       placeholder="Search for products, brands and more"
//       allowClear
//       enterButton="Search"
//       size="middle"
//       style={{ width: 370, borderRadius: 8, background: "#fff" }}
//       onSearch={(value) => {
        
//         message.info(`Search: ${value}`);
//         // navigate(`/search?q=${encodeURIComponent(value)}`);
//       }}
//     />
//         </div>

//         <div style={{ display: "flex", gap: 12 }}>
//           <Button type="primary" onClick={() => navigate("/login/customer")}>
//             Login/Register
//           </Button>
//           <Button icon={<ShoppingCartOutlined />} onClick={() => navigate("/cart")}>
//             Cart
//           </Button>
//           <Button type="default" onClick={() => navigate("/login/vendor")}>
//             Vendor Login
//           </Button>
//         </div>
//       </div>

//       {/* Banner */}
//       <Carousel autoplay autoplaySpeed={5000} effect="fade" style={{ marginBottom: 30, borderRadius: 8, overflow: "hidden" }}>
//         {banners.map((url, idx) => (
//           <div key={idx}>
//             <img
//               src={url}
//               alt={`banner-${idx}`}
//               style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
//               onError={(e) => {
//                 e.target.src = "https://dummyimage.com/1200x180/1890ff/ffffff&text=Banner";
//               }}
//             />
//           </div>
//         ))}
//       </Carousel>

//       {/* Categories */}
//       <h2 style={{ marginTop: 30, marginBottom: 20 }}>Shop by Category</h2>
//       <div
//         style={{
//           display: "flex",
//           gap: 24,
//           flexWrap: "wrap",
//           padding: "12px 0",
//           borderBottom: "1px solid #f0f0f0",
//         }}
//       >
//         {categories.map((cat) => (
//           <Dropdown
//             key={cat.name}
//             menu={{
//               items: cat.subcategories.map((sub) => ({
//                 key: sub.key,
//                 label: sub.label,
//                 onClick: () => message.success(`Selected: ${sub.label} from ${cat.name}`),
//               })),
//             }}
//             trigger={["click"]}
//           >
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#333",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 transition: "color 0.3s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "#1890ff")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
//             >
//               {cat.name}
//               <DownOutlined style={{ fontSize: 10 }} />
//             </div>
//           </Dropdown>
//         ))}
//       </div>

//       {/* Products */}
//       <h2 style={{ marginTop: 40, marginBottom: 20 }}>Featured Products for B2B</h2>
//       {loadingProducts ? (
//         <div style={{ textAlign: "center", padding: 60 }}>
//           <Spin size="large" />
//           <p style={{ marginTop: 16, color: "#888" }}>Loading products...</p>
//         </div>
//       ) : products.length === 0 ? (
//         <div style={{ textAlign: "center", padding: 60, background: "#f9f9f9", borderRadius: 8 }}>
//           <p style={{ fontSize: 16, marginBottom: 8 }}>No products available</p>
//           <p style={{ fontSize: 12, color: "#888" }}>Check back later for new products</p>
//         </div>
//       ) : (
//         <Row gutter={[16, 16]}>
//           {products.map((prod) => {
//             const imgSrc = getProductImage(prod);
//             const price = typeof prod.price === "number" ? prod.price : Number(prod.price) || 0;
//             const stock = typeof prod.stock === "number" ? prod.stock : 0;
//             const vendorName = prod.vendor?.name || prod.vendorName || "Unknown";

//             return (
//               <Col key={prod._id || prod.id} xs={24} sm={12} md={8} lg={6}>
//                 <Card
//                   hoverable
//                   style={{ height: "100%" }}
//                   cover={
//                     <div
//                       style={{
//                         height: 200,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         background: "#fafafa",
//                         padding: 10,
//                       }}
//                     >
//                       <img
//                         alt={prod.name}
//                         src={imgSrc}
//                         style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "https://dummyimage.com/200x200/e0e0e0/666666&text=No+Image";
//                         }}
//                       />
//                     </div>
//                   }
//                   actions={[
//                     <Button
//                       key="addtocart"
//                       type="primary"
//                       icon={<ShoppingCartOutlined />}
//                       onClick={() => openProductModal(prod, false)}
//                       disabled={stock === 0}
//                     >
//                       {stock > 0 ? "Add to Cart" : "Out of Stock"}
//                     </Button>,
//                     <Button
//                       key="buynow"
//                       type="danger"
//                       onClick={() => openProductModal(prod, true)}
//                       disabled={stock === 0}
//                     >
//                       Buy Now
//                     </Button>,
//                   ]}
//                 >
//                   <Meta
//                     title={<div style={{ fontSize: 14, fontWeight: 600 }}>{prod.name}</div>}
//                     description={
//                       <div style={{ fontSize: 16, color: "#1890ff", fontWeight: 700 }}>
//                         ₹{price.toLocaleString()}
//                       </div>
//                     }
//                   />
//                   <div style={{ marginTop: 12 }}>
//                     <Tag color="blue">B2B</Tag>
//                     {stock > 0 ? (
//                       <Tag color="green">In stock ({stock})</Tag>
//                     ) : (
//                       <Tag color="red">Out of Stock</Tag>
//                     )}
//                   </div>
//                   <p style={{ fontSize: 12, marginTop: 10, color: "#666" }}>
//                     Vendor: <strong>{vendorName}</strong>
//                   </p>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       )}

//       {/* Product Modal */}
//       <Modal
//         open={productModalVisible}
//         onCancel={() => setProductModalVisible(false)}
//         width={600}
//         footer={
//           isBuyNowFlow
//             ? [
//                 <Button key="cancel" onClick={() => setProductModalVisible(false)}>
//                   Cancel
//                 </Button>,
//                 <Button
//                   key="confirmBuy"
//                   type="primary"
//                   onClick={() => {
//                     setProductModalVisible(false);
//                     setBuyNowVisible(true);
//                     setIsBuyNowFlow(false);
//                   }}
//                   disabled={selectedProduct?.stock < 1}
//                 >
//                   Confirm Buy Now
//                 </Button>,
//               ]
//             : [
//                 <Button key="cancel" onClick={() => setProductModalVisible(false)}>
//                   Cancel
//                 </Button>,
//                 <Button
//                   key="addToCart"
//                   type="primary"
//                   onClick={handleAddToCart}
//                   disabled={selectedProduct?.stock < 1}
//                 >
//                   Add to Cart
//                 </Button>,
//               ]
//         }
//       >
//         <img
//           alt={selectedProduct?.name}
//           src={getProductImage(selectedProduct || {})}
//           style={{ width: "100%", marginBottom: 20, objectFit: "contain" }}
//         />
//         <div>
//           <Text strong>Price:</Text> ₹{selectedProduct?.price}
//         </div>
//         <div style={{ marginTop: 16 }}>
//           <Text strong>Size:</Text>{" "}
//           <Select style={{ width: 150 }} value={selectedSize} onChange={setSelectedSize}>
//             {(selectedProduct?.sizes || ["S", "M", "L"]).map((size) => (
//               <Option key={size} value={size}>
//                 {size}
//               </Option>
//             ))}
//           </Select>
//         </div>
//         <div style={{ marginTop: 16 }}>
//           <Text strong>Color:</Text>{" "}
//           <Select style={{ width: 150 }} value={selectedColor} onChange={setSelectedColor}>
//             {(selectedProduct?.colors || ["Black", "White"]).map((color) => (
//               <Option key={color} value={color}>
//                 {color}
//               </Option>
//             ))}
//           </Select>
//         </div>
//         <div style={{ marginTop: 16 }}>
//           <Text strong>Quantity:</Text>{" "}
//           <Select style={{ width: 150 }} value={selectedQuantity} onChange={setSelectedQuantity}>
//             {[...Array(10).keys()].map((i) => (
//               <Option key={i + 1} value={i + 1}>
//                 {i + 1}
//               </Option>
//             ))}
//           </Select>
//         </div>
//       </Modal>

//       {/* Buy Now Summary Modal */}
//       <Modal
//         title="Order Summary"
//         open={buyNowVisible}
//         onCancel={() => setBuyNowVisible(false)}
//         footer={[
//           <Button key="cancel" onClick={() => setBuyNowVisible(false)}>
//             Cancel
//           </Button>,
//           <Button
//             key="confirm"
//             type="primary"
//             onClick={() => {
//               message.success("Order placed successfully!");
//               setBuyNowVisible(false);
//             }}
//           >
//             Confirm Purchase
//           </Button>,
//         ]}
//       >
//         {selectedProduct && (
//           <>
//             <p>
//               <strong>Product:</strong> {selectedProduct.name}
//             </p>
//             <p>
//               <strong>Size:</strong> {selectedSize}
//             </p>
//             <p>
//               <strong>Color:</strong> {selectedColor}
//             </p>
//             <p>
//               <strong>Quantity:</strong> {selectedQuantity}
//             </p>
//             <p>
//               <strong>Price per item:</strong> ₹{selectedProduct.price}
//             </p>
//             <p>
//               <strong>Total Price:</strong> ₹
//               {(selectedProduct.price * selectedQuantity).toLocaleString()}
//             </p>
//           </>
//         )}
//       </Modal>
//     </>
//   );
// }


// // const { addToCart } = useCart();

// const handleAddToCart = async (product, size, color, quantity) => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch("/api/cart/add", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : ""
//       },
//       body: JSON.stringify({
//         productId: product._id,
//         size,
//         color,
//         quantity
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Failed to add product");
//     }

//     // ✅ Update cart context
//     addToCart({
//       ...product,
//       selectedSize: size,
//       selectedColor: color,
//       quantity,
//       cartId: `${product._id}-${size}-${color}`
//     });

//     message.success(" Added to cart");

//   } catch (error) {
//     console.error(error);
//     message.error(error.message || "Something went wrong");
//   }
// };


// function getProductImage(product) {
//   let imgSrc =
//     product.images?.[0]?.url || product.images?.[0] || product.image?.url || product.image;
//   if (imgSrc && typeof imgSrc === "string" && !imgSrc.startsWith("http")) {
//     const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(
//       "/api",
//       ""
//     );
//     imgSrc = `${baseUrl}${imgSrc}`;
//   }
//   return imgSrc || "https://dummyimage.com/200x200/e0e0e0/666666&text=No+Image";
// }

// ...........................................................................................................



import React, { useState, useEffect } from "react";
import {Carousel,Row,Col,Card, Tag,Button,message,Spin,Modal,Select,Typography,Dropdown,Space,Tabs,Form,Input,} from "antd";
import {ShoppingCartOutlined,MailOutlined,LockOutlined,UserOutlined,ShopOutlined,PhoneOutlined,DownOutlined,MenuOutlined,} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;
const { Option } = Select;
const { Text } = Typography;

const banners = [
  
 "https://static.vecteezy.com/system/resources/thumbnails/002/006/774/small/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-backgroud-for-banner-market-ecommerce-free-vector.jpg",
 "https://static.vecteezy.com/system/resources/thumbnails/011/871/820/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/004/299/835/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg",
  "https://www.shutterstock.com/image-vector/ecommerce-website-banner-template-presents-260nw-2252124451.jpg"

];

const categories = [


  {
    name: "Electronics",
    slug: "electronics",
    image:"https://media.istockphoto.com/id/178716575/photo/mobile-devices.jpg?s=612x612&w=0&k=20&c=9YyINgAbcmjfY_HZe-i8FrLUS43-qZh6Sx6raIc_9vQ=",
    subcategories: [
      { key: 'mobiles', label: 'Mobiles' },
      { key: 'laptops', label: 'Laptops' },
      { key: 'cameras', label: 'Cameras' },
      { key: 'accessories', label: 'Accessories' }
    ]
  },
  {
    name: "Fashion",
    slug: "fashion",
    image:"https://plus.unsplash.com/premium_vector-1724163333366-dc150b75f069?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
    subcategories: [
      { key: 'mens', label: "Men's Wear" },
      { key: 'womens', label: "Women's Wear" },
      { key: 'kids', label: 'Kids Fashion' },
      { key: 'footwear', label: 'Footwear' }
    ]
  },
  {
    name: "Home & Furniture",
    slug: "furniture",
    image:"https://media.istockphoto.com/id/943910360/photo/posters-in-cozy-apartment-interior.jpg?s=612x612&w=0&k=20&c=QzNjsxCNMcFNxpn4E2ocPvSU8Ud2S3B_mHyo5L-HOLo=",
    subcategories: [
      { key: 'furniture', label: 'Furniture' },
      { key: 'decor', label: 'Home Decor' },
      { key: 'kitchen', label: 'Kitchen' },
      { key: 'lighting', label: 'Lighting' }
    ]
  },
  {
    name: "Appliances",
    slug: "appliances",
    image:"https://www.shutterstock.com/image-illustration/3d-variety-home-appliances-concept-600nw-2048419898.jpg",
    subcategories: [
      { key: 'tv', label: 'TVs' },
      { key: 'washing', label: 'Washing Machines' },
      { key: 'ac', label: 'Air Conditioners' },
      { key: 'refrigerator', label: 'Refrigerators' }
    ]
  },
  {
    name: "Beauty",
    slug: "beauty",
    image:"https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/8103728/183668_103785.png",
    subcategories: [
      { key: 'Eye Makeup', label: 'eye makeup' },
      { key: 'Face Makeup', label: 'face makeup' },
      { key: 'Lip Makeup', label: 'lip makeup' },
      { key: 'Hair Care', label: 'hair care' }
    ]
  },
 {
    name: "Food & Drinks",
    slug: "food",
    image:"https://5.imimg.com/data5/SELLER/Default/2023/4/298164566/AW/ES/GP/187617962/packaged-food-500x500.png",
    subcategories: [
      { key: 'Nuts and Dry fruits', label: 'nuts and dryfruits' },
      { key: 'Snacks Corner', label: 'snacks corner' },
      { key: 'Sweets Store', label: 'sweets store' },
      { key: 'Cold Drinks', label: 'cold drinks' }
    ]
  },

   {
    name: "Grocery",
    slug: "food",
    image:"https://cdn.prod.website-files.com/637f7c161a14232e2ea8473d/68273472635fcbdfa369f2e3_Untitled%20design%20(5)-compressed.jpg",
    subcategories: [
      { key: 'Nuts and Dry fruits', label: 'nuts and dryfruits' },
      { key: 'Snacks Corner', label: 'snacks corner' },
      { key: 'Sweets Store', label: 'sweets store' },
      { key: 'Cold Drinks', label: 'cold drinks' }
    ]
  },

  {
    name: "Stationary",
    slug: "stationary",
    image:"https://media.istockphoto.com/id/485725200/photo/school-and-office-accessories-on-wooden-background.jpg?s=612x612&w=0&k=20&c=PWgiIA-7_QDC_PXnEhwZqDLDDzrNMIxxJjBeD4h4oLM=",
    subcategories: [
      { key: 'Nuts and Dry fruits', label: 'nuts and dryfruits' },
      { key: 'Snacks Corner', label: 'snacks corner' },
      { key: 'Sweets Store', label: 'sweets store' },
      { key: 'Cold Drinks', label: 'cold drinks' }
    ]
  },
  {
    name: "Toys",
    slug: "toys",
    image:"https://t4.ftcdn.net/jpg/03/24/42/21/360_F_324422176_Lgn7NTeFyNaUKIDu0Ppls1u8zb8wsKS4.jpg",
    subcategories: [
      { key: 'Nuts and Dry fruits', label: 'nuts and dryfruits' },
      { key: 'Snacks Corner', label: 'snacks corner' },
      { key: 'Sweets Store', label: 'sweets store' },
      { key: 'Cold Drinks', label: 'cold drinks' }
    ]
  },

];

const categoryMenuItems = [
  {
    key: 'electronics',
    label: 'Electronics',
    children: [
      { key: 'mobiles', label: 'Mobiles' },
      { key: 'laptops', label: 'Laptops' },
      { key: 'cameras', label: 'Cameras' }
    ]
  },
  {
    key: 'fashion',
    label: 'Fashion',
    children: [
      { key: 'mens', label: "Men's Wear" },
      { key: 'womens', label: "Women's Wear" },
      { key: 'kids', label: 'Kids Fashion' }
    ]
  },
  {
    key: 'home',
    label: 'Home & Furniture',
    children: [
      { key: 'furniture', label: 'Furniture' },
      { key: 'decor', label: 'Home Decor' },
      { key: 'kitchen', label: 'Kitchen' }
    ]
  },
  {
    key: 'appliances',
    label: 'Appliances',
    children: [
      { key: 'tv', label: 'TVs' },
      { key: 'washing', label: 'Washing Machines' }
    ]
  }
];


  

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerRole, setRegisterRole] = useState("customer");

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [buyNowVisible, setBuyNowVisible] = useState(false);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    fetchProducts();
  }, []);

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
      const productList = data.success ? data.data : (Array.isArray(data) ? data : []);
      setProducts(productList);
      if (productList.length === 0) {
        message.info("No products available at the moment");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const openProductModal = (product, buyNow = false) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || "M");
    setSelectedColor(product.colors?.[0] || "Black");
    setSelectedQuantity(1);
    setProductModalVisible(true);
    setIsBuyNowFlow(buyNow);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize || !selectedColor) {
      message.warning("Please select size and color");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartId = `${selectedProduct._id}-${selectedSize}-${selectedColor}`;
    const idx = existingCart.findIndex((item) => item.cartId === cartId);

    if (idx !== -1) {
      existingCart[idx].quantity += selectedQuantity;
      message.success("Product quantity updated in cart");
    } else {
      existingCart.push({
        ...selectedProduct,
        selectedSize,
        selectedColor,
        quantity: selectedQuantity,
        cartId,
      });
      message.success("Product added to cart");
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setProductModalVisible(false);
  };

  const handleBuyNow = () => {
    if (!selectedProduct || !selectedSize || !selectedColor) {
      message.warning("Please select size and color");
      return;
    }
    setProductModalVisible(false);
    setBuyNowVisible(true);
    setIsBuyNowFlow(false);
  };

  const closeBuyNow = () => {
    setBuyNowVisible(false);
  };

  const getProductImage = (product) => {
    let imgSrc =
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image?.url ||
      product.image ||
      "https://dummyimage.com/200x200/e0e0e0/666666&text=No+Image";

    if (imgSrc && typeof imgSrc === "string" && !imgSrc.startsWith("http")) {
      const baseUrl = API_BASE.replace("/api", "");
      imgSrc = `${baseUrl}${imgSrc}`;
    }

    return imgSrc;
  };

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#001529",
          padding: "16px 32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ color: "white", margin: 0, fontSize: 20 }}>Admin Panel</h2>

          <Dropdown
            menu={{
              items: categoryMenuItems.map((cat) => ({
                key: cat.key,
                label: cat.label,
                children: cat.children?.map((sub) => ({
                  key: sub.key,
                  label: sub.label,
                  onClick: () => message.info(`Navigating to ${sub.label}`),
                })),
              })),
            }}
            trigger={["click"]}
          >
            <Button type="text" style={{ color: "white", fontWeight: 500 }} icon={<MenuOutlined />}>
              <Space>
                All
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
<Input.Search
      placeholder="Search for products, brands and more"
      allowClear
      enterButton="Search"
      size="middle"
      style={{ width: 370, borderRadius: 8, background: "#fff" }}
      onSearch={(value) => {
        
        message.info(`Search: ${value}`);
        // navigate(`/search?q=${encodeURIComponent(value)}`);
      }}
    />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Button type="primary" onClick={() => navigate("/login/customer")}>
            Login/Register
          </Button>
          <Button
             icon={<ShoppingCartOutlined />}
             onClick={() => navigate("/cart")}
             style={{ backgroundColor: "red", color: "white", borderColor: "red" }}>
               Cart
            </Button>

          <Button type="default" onClick={() => navigate("/login/vendor")}>
            Vendor Login
          </Button>
        </div>
      </div>

      {/* Banner */}
      <Carousel autoplay autoplaySpeed={5000} effect="fade" style={{ marginBottom: 30, marginTop:50,borderRadius: 8, overflow: "hidden" }}>
        {banners.map((url, idx) => (
          <div key={idx}>
            <img
              src={url}
              alt={`banner-${idx}`}
              style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.target.src = "https://dummyimage.com/1200x180/1890ff/ffffff&text=Banner";
              }}
            />
          </div>
        ))}
      </Carousel>

      {/* Categories */}
      <h2 style={{ marginTop: 30, marginBottom: 20 }}>Shop by Category</h2>
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          padding: "12px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {/* {categories.map((cat) => (
          <Dropdown
            key={cat.name}
            menu={{
              items: cat.subcategories.map((sub) => ({
                key: sub.key,
                label: sub.label,
                onClick: () => message.success(`Selected: ${sub.label} from ${cat.name}`),
              })),
            }}
            trigger={["click"]}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#333",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1890ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
            >
              {cat.name}
              <DownOutlined style={{ fontSize: 10 }} />
            </div>
          </Dropdown>
        ))} */}

{categories.map((cat) => (
  <Dropdown
    key={cat.name}
    menu={{
      items: cat.subcategories.map((sub) => ({
        key: sub.key,
        label: sub.label,
        onClick: () => message.success(`Selected: ${sub.label} from ${cat.name}`),
      })),
    }}
    trigger={["click"]}
  >
    <div
      style={{
        cursor: "pointer",
        textAlign: "center",
        width: 100,
        marginLeft:13
      }}
    >
      <img
        src={cat.image || "https://dummyimage.com/100x100/e0e0e0/000&text=No+Image"}
        alt={cat.name}
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          objectFit: "cover",
          marginBottom: 8,
        }}
      />
      <div style={{ fontSize: 14, fontWeight: 600 }}>{cat.name}</div>
    </div>
  </Dropdown>
))}



      </div>

      {/* Products */}
      <h2 style={{ marginTop: 40, marginBottom: 20 }}>Featured Products for B2B</h2>
      {loadingProducts ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "#888" }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#f9f9f9", borderRadius: 8 }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No products available</p>
          <p style={{ fontSize: 12, color: "#888" }}>Check back later for new products</p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((prod) => {
            const imgSrc = getProductImage(prod);
            const price = typeof prod.price === "number" ? prod.price : Number(prod.price) || 0;
            const stock = typeof prod.stock === "number" ? prod.stock : 0;
            const vendorName = prod.vendor?.name || prod.vendorName || "Unknown";

            return (
              <Col key={prod._id || prod.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ height: "100%" }}
                  cover={
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fafafa",
                        padding: 10,
                      }}
                    >
                      <img
                        alt={prod.name}
                        src={imgSrc}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://dummyimage.com/200x200/e0e0e0/666666&text=No+Image";
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      key="addtocart"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => openProductModal(prod, false)}
                      disabled={stock === 0}
                    >
                      {stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>,
                    <Button
                      key="buynow"
                      type="danger"
                      onClick={() => openProductModal(prod, true)}
                      disabled={stock === 0}
                    >
                      Buy Now
                    </Button>,
                  ]}
                >
                  <Meta
                    title={<div style={{ fontSize: 14, fontWeight: 600 }}>{prod.name}</div>}
                    description={
                      <div style={{ fontSize: 16, color: "#1890ff", fontWeight: 700 }}>
                        ₹{price.toLocaleString()}
                      </div>
                    }
                  />
                  <div style={{ marginTop: 12 }}>
                    <Tag color="blue">B2B</Tag>
                    {stock > 0 ? (
                      <Tag color="green">In stock ({stock})</Tag>
                    ) : (
                      <Tag color="red">Out of Stock</Tag>
                    )}
                  </div>
                  <p style={{ fontSize: 12, marginTop: 10, color: "#666" }}>
                    Vendor: <strong>{vendorName}</strong>
                  </p>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Product Modal */}
      <Modal
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
                  key="confirmBuy"
                  type="primary"
                  onClick={() => {
                    setProductModalVisible(false);
                    setBuyNowVisible(true);
                    setIsBuyNowFlow(false);
                  }}
                  disabled={selectedProduct?.stock < 1}
                >
                  Confirm Buy Now
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setProductModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="addToCart"
                  type="primary"
                  onClick={handleAddToCart}
                  disabled={selectedProduct?.stock < 1}
                >
                  Add to Cart
                </Button>,
              ]
        }
      >
        <img
          alt={selectedProduct?.name}
          src={getProductImage(selectedProduct || {})}
          style={{ width: "100%", marginBottom: 20, objectFit: "contain" }}
        />
        <div>
          <Text strong>Price:</Text> ₹{selectedProduct?.price}
        </div>
        <div style={{ marginTop: 16 }}>
          <Text strong>Size:</Text>{" "}
          <Select style={{ width: 150 }} value={selectedSize} onChange={setSelectedSize}>
            {(selectedProduct?.sizes || ["S", "M", "L"]).map((size) => (
              <Option key={size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ marginTop: 16 }}>
          <Text strong>Color:</Text>{" "}
          <Select style={{ width: 150 }} value={selectedColor} onChange={setSelectedColor}>
            {(selectedProduct?.colors || ["Black", "White"]).map((color) => (
              <Option key={color} value={color}>
                {color}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ marginTop: 16 }}>
          <Text strong>Quantity:</Text>{" "}
          <Select style={{ width: 150 }} value={selectedQuantity} onChange={setSelectedQuantity}>
            {[...Array(10).keys()].map((i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>

      {/* Buy Now Summary Modal */}
      <Modal
        title="Order Summary"
        open={buyNowVisible}
        onCancel={() => setBuyNowVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBuyNowVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => {
              message.success("Order placed successfully!");
              setBuyNowVisible(false);
            }}
          >
            Confirm Purchase
          </Button>,
        ]}
      >
        {selectedProduct && (
          <>
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
            <p>
              <strong>Price per item:</strong> ₹{selectedProduct.price}
            </p>
            <p>
              <strong>Total Price:</strong> ₹
              {(selectedProduct.price * selectedQuantity).toLocaleString()}
            </p>
          </>
        )}
      </Modal>
    </>
  );
}


// const { addToCart } = useCart();

const handleAddToCart = async (product, size, color, quantity) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        productId: product._id,
        size,
        color,
        quantity
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    // ✅ Update cart context
    addToCart({
      ...product,
      selectedSize: size,
      selectedColor: color,
      quantity,
      cartId: `${product._id}-${size}-${color}`
    });

    message.success(" Added to cart");

  } catch (error) {
    console.error(error);
    message.error(error.message || "Something went wrong");
  }
};


function getProductImage(product) {
  let imgSrc =
    product.images?.[0]?.url || product.images?.[0] || product.image?.url || product.image;
  if (imgSrc && typeof imgSrc === "string" && !imgSrc.startsWith("http")) {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(
      "/api",
      ""
    );
    imgSrc = `${baseUrl}${imgSrc}`;
  }
  return imgSrc || "https://dummyimage.com/200x200/e0e0e0/666666&text=No+Image";
}
