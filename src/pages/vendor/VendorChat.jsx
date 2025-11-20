import { useState } from "react";
import { Card, List, Input, Button, Avatar, Badge, Space, Empty } from "antd";
import { SendOutlined, PhoneOutlined, MoreOutlined } from "@ant-design/icons";

export default function VendorChat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { _id: 1, sender: 'Rajesh Kumar', content: 'When will the order be delivered?', time: '10:30 AM', role: 'customer' },
    { _id: 2, sender: 'You', content: 'It will be delivered within 2 days', time: '10:35 AM', role: 'vendor' },
    { _id: 3, sender: 'Rajesh Kumar', content: 'Thank you!', time: '10:40 AM', role: 'customer' }
  ]);

  const chats = [
    { _id: 1, name: 'Rajesh Kumar', lastMessage: 'Thank you!', unread: 0, online: true },
    { _id: 2, name: 'Priya Singh', lastMessage: 'When can I return?', unread: 2, online: true },
    { _id: 3, name: 'Amit Patel', lastMessage: 'Product quality issue', unread: 1, online: false },
    { _id: 4, name: 'Neha Sharma', lastMessage: 'Can you provide discount?', unread: 0, online: true }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { _id: messages.length + 1, sender: 'You', content: message, time: new Date().toLocaleTimeString(), role: 'vendor' }]);
      setMessage('');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>💬 Chat</h2>

      <div style={{ display: 'flex', gap: 16, minHeight: 600 }}>
        {/* Chat List */}
        <Card style={{ flex: 0.3, minHeight: 600 }} title="Conversations">
          <List
            dataSource={chats}
            renderItem={(item) => (
              <List.Item
                onClick={() => setSelectedChat(item)}
                style={{ cursor: 'pointer', background: selectedChat?._id === item._id ? '#f0f0f0' : '#fff', padding: 8, borderRadius: 4, marginBottom: 8 }}
              >
                <List.Item.Meta
                  avatar={<Badge dot color={item.online ? 'green' : 'gray'} offset={[-5, 5]}><Avatar>{item.name.charAt(0)}</Avatar></Badge>}
                  title={item.name}
                  description={<div style={{ fontSize: 12, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.lastMessage}</div>}
                />
                {item.unread > 0 && <Badge count={item.unread} />}
              </List.Item>
            )}
          />
        </Card>

        {/* Chat Window */}
        <Card style={{ flex: 0.7, minHeight: 600 }} title={selectedChat ? `Chat with ${selectedChat.name}` : 'Select a conversation'}>
          {selectedChat ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
                {messages.map((msg) => (
                  <div key={msg._id} style={{ marginBottom: 12, display: 'flex', justifyContent: msg.role === 'vendor' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      background: msg.role === 'vendor' ? '#1890ff' : '#e6e6e6',
                      color: msg.role === 'vendor' ? '#fff' : '#000',
                      padding: '8px 12px',
                      borderRadius: 8,
                      maxWidth: '60%',
                      wordWrap: 'break-word'
                    }}>
                      <div>{msg.content}</div>
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Space style={{ width: '100%' }}>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onPressEnter={handleSendMessage}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>Send</Button>
              </Space>
            </div>
          ) : (
            <Empty description="Select a conversation to start" />
          )}
        </Card>
      </div>
    </div>
  );
}
