import { useState, useEffect, useRef } from "react";
import { Card, List, Input, Button, Avatar, Badge, Space, Empty, Spin, message as antMessage } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";

const API_BASE = 'http://localhost:4000/api';

export default function VendorChat() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Fetch all vendor chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/vendor/chats?status=active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log(' Chats:', data);

      if (data.success) {
        setChats(data.data || []);
        
        // Auto-select first chat if available
        if (data.data && data.data.length > 0 && !selectedChat) {
          setSelectedChat(data.data[0]);
        }
      }
    } catch (err) {
      console.error(' Fetch chats error:', err);
      antMessage.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch messages for selected chat
  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Chat messages:', data);

      if (data.success && data.data) {
        setMessages(data.data.messages || []);
        
        // Update chat in list to mark as read
        setChats(prev => prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, unreadCount: { ...chat.unreadCount, vendor: 0 } }
            : chat
        ));
      }
    } catch (err) {
      console.error(' Fetch messages error:', err);
      antMessage.error('Failed to load messages');
    }
  };

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/chats/${selectedChat._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message.trim()
        })
      });

      const data = await response.json();
      console.log(' Message sent:', data);

      if (data.success && data.data) {
        setMessages(data.data.messages || []);
        setMessage('');
        
        // Update last message in chat list
        setChats(prev => prev.map(chat =>
          chat._id === selectedChat._id
            ? { 
                ...chat, 
                lastMessage: data.data.lastMessage,
                updatedAt: new Date()
              }
            : chat
        ));
        
        antMessage.success('Message sent');
      }
    } catch (err) {
      console.error('Send message error:', err);
      antMessage.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  // ✅ Format time
  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}> Customer Chats</h2>

      <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 200px)' }}>
        {/* Chat List */}
        <Card 
          style={{ flex: 0.35, overflow: 'auto' }} 
          title={`Conversations (${chats.length})`}
          loading={loading}
        >
          {chats.length > 0 ? (
            <List
              dataSource={chats}
              renderItem={(chat) => (
                <List.Item
                  onClick={() => setSelectedChat(chat)}
                  style={{ 
                    cursor: 'pointer', 
                    background: selectedChat?._id === chat._id ? '#e6f7ff' : '#fff',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    border: selectedChat?._id === chat._id ? '2px solid #1890ff' : '1px solid #f0f0f0'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        count={chat.unreadCount?.vendor || 0} 
                        offset={[-5, 5]}
                      >
                        <Avatar 
                          src={chat.customer?.avatar} 
                          icon={<UserOutlined />}
                          style={{ backgroundColor: '#1890ff' }}
                        >
                          {chat.customer?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{chat.customer?.name || 'Customer'}</strong>
                        <span style={{ fontSize: 11, color: '#999' }}>
                          {formatDate(chat.updatedAt)}
                        </span>
                      </div>
                    }
                    description={
                      <div style={{ 
                        fontSize: 12, 
                        color: '#666',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: chat.unreadCount?.vendor > 0 ? 600 : 400
                      }}>
                        {chat.lastMessage?.senderRole === 'vendor' && 'You: '}
                        {chat.lastMessage?.text || 'No messages yet'}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No conversations yet" />
          )}
        </Card>

        {/* Chat Window */}
        <Card 
          style={{ flex: 0.65, display: 'flex', flexDirection: 'column' }}
          title={
            selectedChat ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar 
                  src={selectedChat.customer?.avatar}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {selectedChat.customer?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {selectedChat.customer?.name || 'Customer'}
                  </div>
                  {selectedChat.product && (
                    <div style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>
                      Product: {selectedChat.product.name}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              'Select a conversation'
            )
          }
          bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
        >
          {selectedChat ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Messages */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: 24,
                background: '#fafafa'
              }}>
                {messages.length > 0 ? (
                  <>
                    {messages.map((msg, index) => {
                      const isVendor = msg.senderRole === 'vendor';
                      return (
                        <div 
                          key={msg._id || index}
                          style={{ 
                            marginBottom: 16,
                            display: 'flex',
                            justifyContent: isVendor ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{
                            background: isVendor ? '#1890ff' : '#fff',
                            color: isVendor ? '#fff' : '#000',
                            padding: '10px 14px',
                            borderRadius: isVendor ? '12px 12px 0 12px' : '12px 12px 12px 0',
                            maxWidth: '70%',
                            wordWrap: 'break-word',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}>
                            <div style={{ marginBottom: 4 }}>{msg.text}</div>
                            <div style={{ 
                              fontSize: 10, 
                              opacity: 0.7,
                              textAlign: 'right'
                            }}>
                              {formatTime(msg.createdAt)}
                              {isVendor && msg.isRead && ' ✓✓'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <Empty description="No messages yet" />
                )}
              </div>

              {/* Input */}
              <div style={{ 
                padding: 16,
                borderTop: '1px solid #f0f0f0',
                background: '#fff'
              }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                    disabled={sendingMessage}
                    style={{ flex: 1 }}
                    size="large"
                  />
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    disabled={!message.trim()}
                    size="large"
                  >
                    Send
                  </Button>
                </Space.Compact>
              </div>
            </div>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Empty 
                description="Select a conversation to start chatting"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
