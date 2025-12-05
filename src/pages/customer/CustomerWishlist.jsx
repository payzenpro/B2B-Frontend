import { useEffect, useState } from "react";
import { Card, List, Button, message, Tag } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function CustomerWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/customer/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setItems(data.data || []);
    } catch (err) {
      message.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/customer/wishlist/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      message.success("Removed from wishlist");
      setItems(items.filter((p) => p._id !== productId));
    } catch (err) {
      message.error(err.message || "Failed to update wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <Card
      title={
        <>
          <HeartFilled style={{ color: "red", marginRight: 8 }} />
          My Wishlist
        </>
      }
      loading={loading}
    >
      <List
        dataSource={items}
        locale={{ emptyText: "No items in wishlist" }}
        renderItem={(prod) => (
          <List.Item
            actions={[
              <Button
                size="small"
                type="link"
                onClick={() => navigate(`/product/${prod._id}`)}
              >
                View
              </Button>,
              <Button
                size="small"
                danger
                onClick={() => removeFromWishlist(prod._id)}
              >
                Remove
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              }
              title={prod.name}
              description={
                <>
                  <div>₹{(prod.price || 0).toLocaleString()}</div>
                  <Tag color="blue">{prod.category}</Tag>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
