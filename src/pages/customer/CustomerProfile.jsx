
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showOrdersList, setShowOrdersList] = useState(false);
  const [showAddressesList, setShowAddressesList] = useState(false);
  const [showWishlistList, setShowWishlistList] = useState(false);
  const [showCartList, setShowCartList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    async function loadAll() {
      try {
       
        const pRes = await fetch("http://localhost:4000/api/profile", { headers });
        if (!pRes.ok) throw new Error(`Profile API: ${pRes.status}`);
        const pData = await pRes.json();
        setProfile(pData.profile);

      
        const oRes = await fetch("http://localhost:4000/api/orders/my", { headers });
        if (oRes.ok) {
          const oData = await oRes.json();
          console.log(" ORDERS DATA:", oData);
          setOrders(oData.data || []);
        }
        try {
         const aRes = await fetch("http://localhost:4000/api/address", { headers });

            const aData = await aRes.json();
            console.log(" ADDRESSES DATA:", aData);
            setAddresses(aData.addresses || []);
          }
         catch (addrErr) {
          console.warn("Addresses API not available");
        }
        try {
          const wRes = await fetch("http://localhost:4000/api/wishlist", { headers });
          if (wRes.ok) {
            const wData = await wRes.json();
            console.log(" WISHLIST DATA:", wData);
            setWishlist(wData.items || []);
          }
        } catch (wishErr) {
          console.warn("Wishlist API not available");
        }

        try {
          const cRes = await fetch("http://localhost:4000/api/cart", { headers });
          if (cRes.ok) {
            const cData = await cRes.json();
            console.log(" CART DATA:", cData);
            setCart(cData.items || []);
          }
        } catch (cartErr) {
          console.warn("Cart API not available");
        }
      } catch (err) {
        console.error("Critical error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loader} />
        <p style={styles.loadingText}>Loading your profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={styles.errorContainer}>
        <h2>Profile Load Failed</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const stats = {
    addresses: addresses.length,
    wishlist: wishlist.length,
    cart: cart.reduce((acc, item) => acc + (item.quantity || 1), 0),
    orders: orders.length,
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Profile Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{profile?.name || "User"}</h2>
            <p style={{ margin: "4px 0", color: "#666" }}>{profile?.email}</p>
            <p style={{ margin: 0, color: "#888" }}>
              Mobile: {profile?.phone || "Not added"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsRow}>
          {[
            {
              label: "Total Orders",
              value: stats.orders,
              icon: "📦",
              color: "#667eea",
              onClick: () => setShowOrdersList(true),
            },
            {
              label: "Wishlist",
              value: stats.wishlist,
              icon: "❤️",
              color: "#f5576c",
              onClick: () => setShowWishlistList(true),
            },
            {
              label: "Cart Items",
              value: stats.cart,
              icon: "🛒",
              color: "#4facfe",
              onClick: () => setShowCartList(true),
            },
            {
              label: "Addresses",
              value: stats.addresses,
              icon: "🏠",
              color: "#43e97b",
              onClick: () => setShowAddressesList(true),
            },
          ].map((stat, idx) => (
            <div key={idx} style={styles.statBox} onClick={stat.onClick}>
              <div style={{ ...styles.statIcon, background: stat.color }}>
                {stat.icon}
              </div>
              <div style={{ ...styles.statValue, color: stat.color }}>
                {stat.value}
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ========== ORDERS SECTION ========== */}
        <section style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>My Orders ({orders.length})</h3>
            <button
              style={styles.linkBtn}
              onClick={() => setShowOrdersList(!showOrdersList)}
            >
              {showOrdersList ? "Hide orders" : "View all orders"}
            </button>
          </div>

          {orders.length === 0 ? (
            <p style={styles.emptyText}>No orders found.</p>
          ) : (
            <div style={styles.listGrid}>
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} style={styles.cardSmall}>
                  <p style={styles.cardTitleSmall}>
                    Order #{order._id?.slice(-8)}
                  </p>
                  <p style={styles.cardText}>Total: ₹{order.total || 0}</p>
                  <p style={styles.cardText}>Status: {order.status}</p>
                  <p style={styles.cardTextSmall}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Full Orders List */}
        {showOrdersList && orders.length > 0 && (
          <section style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>All Orders</h3>
              <button
                style={styles.linkBtn}
                onClick={() => setShowOrdersList(false)}
              >
                Close ✕
              </button>
            </div>
            <ul style={styles.fullList}>
              {orders.map((order) => (
                <li key={order._id} style={styles.listItem}>
                  <div style={styles.listItemMain}>
                    <strong>Order #{order._id}</strong> | ₹{order.total} |{" "}
                    {order.status}
                  </div>
                  <div style={styles.listItemSub}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

      
        <section style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>
              Saved Addresses ({addresses.length})
            </h3>
            <button
              style={styles.linkBtn}
              onClick={() => setShowAddressesList(!showAddressesList)}
            >
              {showAddressesList ? "Hide addresses" : "View all addresses"}
            </button>
          </div>

          {addresses.length === 0 ? (
            <p style={styles.emptyText}>No addresses saved yet.</p>
          ) : (
            <div style={styles.listGrid}>
              {addresses.slice(0, 2).map((addr) => (
                <div key={addr._id} style={styles.cardSmall}>
                  <p style={styles.cardTitleSmall}>
                    {addr.label || "Address"}
                  </p>
                  <p style={styles.cardText}>{addr.street}</p>
                  <p style={styles.cardText}>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p style={styles.cardTextSmall}>Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {showAddressesList && addresses.length > 0 && (
          <section style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>All Addresses</h3>
              <button
                style={styles.linkBtn}
                onClick={() => setShowAddressesList(false)}
              >
                Close ✕
              </button>
            </div>
            <ul style={styles.fullList}>
              {addresses.map((addr) => (
                <li key={addr._id} style={styles.listItem}>
                  <div style={styles.listItemMain}>
                    <strong>{addr.label || "Address"}</strong>
                  </div>
                  <div style={styles.listItemSub}>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </div>
                  <div style={styles.listItemSub}>Phone: {addr.phone}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Wishlist ({wishlist.length})</h3>
            <button
              style={styles.linkBtn}
              onClick={() => setShowWishlistList(!showWishlistList)}
            >
              {showWishlistList ? "Hide wishlist" : "View all wishlist"}
            </button>
          </div>

          {wishlist.length === 0 ? (
            <p style={styles.emptyText}>Your wishlist is empty.</p>
          ) : (
            <div style={styles.listGrid}>
              {wishlist.slice(0, 3).map((item) => (
                <div key={item._id} style={styles.cardSmall}>
                  <p style={styles.cardTitleSmall}>{item.name}</p>
                  <p style={styles.cardText}>₹{item.price}</p>
                  {item.description && (
                    <p style={styles.cardTextSmall}>
                      {item.description.slice(0, 50)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {showWishlistList && wishlist.length > 0 && (
          <section style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>All Wishlist Items</h3>
              <button
                style={styles.linkBtn}
                onClick={() => setShowWishlistList(false)}
              >
                Close ✕
              </button>
            </div>
            <ul style={styles.fullList}>
              {wishlist.map((item) => (
                <li key={item._id} style={styles.listItem}>
                  <div style={styles.listItemMain}>
                    <strong>{item.name}</strong> | ₹{item.price}
                  </div>
                  {item.description && (
                    <div style={styles.listItemSub}>{item.description}</div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Cart ({stats.cart} items)</h3>
            <button
              style={styles.linkBtn}
              onClick={() => setShowCartList(!showCartList)}
            >
              {showCartList ? "Hide cart" : "View all cart items"}
            </button>
          </div>

          {cart.length === 0 ? (
            <p style={styles.emptyText}>Your cart is empty.</p>
          ) : (
            <div style={styles.listGrid}>
              {cart.slice(0, 3).map((item) => (
                <div key={item._id || item.productId} style={styles.cardSmall}>
                  <p style={styles.cardTitleSmall}>{item.name}</p>
                  <p style={styles.cardText}>Qty: {item.quantity || 1}</p>
                  <p style={styles.cardText}>₹{item.price}</p>
                  <p style={styles.cardTextSmall}>
                    Total: ₹{(item.price || 0) * (item.quantity || 1)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

    
        {showCartList && cart.length > 0 && (
          <section style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>All Cart Items</h3>
              <button
                style={styles.linkBtn}
                onClick={() => setShowCartList(false)}
              >
                Close ✕
              </button>
            </div>
            <ul style={styles.fullList}>
              {cart.map((item) => (
                <li key={item._id || item.productId} style={styles.listItem}>
                  <div style={styles.listItemMain}>
                    <strong>{item.name}</strong> | Qty: {item.quantity || 1} |
                    ₹{item.price}
                  </div>
                  <div style={styles.listItemSub}>
                    Subtotal: ₹{(item.price || 0) * (item.quantity || 1)}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#f0f2f5",
    paddingBottom: 40,
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    padding: 20,
  },


  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 28,
    fontWeight: 700,
  },

 
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    background: "#f0f2f5",
  },
  loader: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "4px solid #eee",
    borderTopColor: "#667eea",
    animation: "spin 1s linear infinite",
  },
  loadingText: { marginTop: 12, color: "#555", fontSize: 16 },


  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    margin: "0 auto 10px",
    color: "#fff",
  },
  statValue: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
  statLabel: {
    fontSize: 13,
    color: "#777",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },


  sectionBox: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: 600, margin: 0 },
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#667eea",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  listGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  cardSmall: {
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    padding: 12,
    background: "#fafafa",
  },
  cardTitleSmall: { fontSize: 15, fontWeight: 600, margin: "0 0 4px 0" },
  cardText: { fontSize: 13, color: "#555", margin: "0 0 2px 0" },
  cardTextSmall: { fontSize: 12, color: "#888", margin: 0 },

 
  fullList: { listStyle: "none", padding: 0, margin: 0 },
  listItem: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #e8e8e8",
    background: "#fafafa",
  },
  listItemMain: { fontSize: 15, fontWeight: 500, marginBottom: 4 },
  listItemSub: { fontSize: 13, color: "#666", marginBottom: 2 },

  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    padding: 20,
  },
};
