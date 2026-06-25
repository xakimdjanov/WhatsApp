import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Menu, Lock, LogIn, LogOut } from 'lucide-react';
import ConnectionPanel from './components/ConnectionPanel';
import Sidebar from './components/Sidebar';
import BulkChatPanel from './components/BulkChatPanel';
import DirectChatPanel from './components/DirectChatPanel';
import { useNotification } from './components/NotificationProvider';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const { showToast, confirmAction } = useNotification();
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [connection, setConnection] = useState({ status: 'DISCONNECTED', qr: null, user: null });
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(null);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState([]);
  
  // Direct Chat States
  const [directChats, setDirectChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [newChatNumber, setNewChatNumber] = useState('');
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const socketRef = useRef(null);
  const selectedChatRef = useRef(selectedChat);
  const location = useLocation();

  // Sync selected chat reference and fetch messages
  useEffect(() => {
    selectedChatRef.current = selectedChat;
    if (selectedChat && socketRef.current) {
      socketRef.current.emit('mark-chat-read', { jid: selectedChat.id });
      socketRef.current.emit('get-chat-messages', selectedChat.id);
    } else {
      setDirectMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    // Connect to Backend Socket Server
    const socket = io(BACKEND_URL, {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');
      if (token) {
        socket.emit('authenticate', token);
      }
      socket.emit('get-status');
    });

    socket.on('session-token', (newToken) => {
      console.log('Received session token from server:', newToken);
      localStorage.setItem('admin_token', newToken);
      setToken(newToken);
      socket.emit('authenticate', newToken);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('connection-status', (data) => {
      setConnection(data);
      if (data.status === 'CONNECTED') {
        socket.emit('get-chats');
        socket.emit('get-individual-chats');
      } else {
        setChats([]);
        setSelectedChats([]);
        setDirectChats([]);
        setSelectedChat(null);
      }
    });

    socket.on('chats', (data) => {
      setChats(data);
    });

    // Direct Chat Sockets
    socket.on('individual-chats', (data) => {
      setDirectChats(data);
    });

    socket.on('chat-messages', (data) => {
      if (selectedChatRef.current && data.jid === selectedChatRef.current.id) {
        setDirectMessages(data.messages || []);
      }
    });

    socket.on('new-message', (data) => {
      if (selectedChatRef.current && data.jid === selectedChatRef.current.id) {
        setDirectMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
      socket.emit('get-individual-chats');
    });

    socket.on('reply-error', (data) => {
      showToast(`Xabar yuborishda xatolik yuz berdi: ${data.error || 'Noma\'lum xatolik'}`, 'error');
    });

    // Bulk Message Sockets
    socket.on('queue-started', (data) => {
      setIsSending(true);
      setResults([]);
      setProgress({
        current: 0,
        total: data.total,
        status: 'STARTING'
      });
      const timestamp = new Date().toLocaleTimeString();
      setLogs([`[${timestamp}] Xabar jo'natish navbati boshlandi (Jami: ${data.total} ta chat)...`]);
    });

    socket.on('queue-progress', (data) => {
      setProgress(data);
      if (data.status === 'COMPLETED' || data.status === 'CANCELLED') {
        setIsSending(false);
      }

      if (data.recipient) {
        setResults(prev => {
          if (prev.some(r => r.name === data.recipient)) return prev;
          return [...prev, {
            name: data.recipient,
            status: data.status,
            time: new Date().toLocaleTimeString()
          }];
        });
      }
      
      if (data.log) {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${data.log}`]);
      }
    });

    socket.on('queue-error', (errorMsg) => {
      setIsSending(false);
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] ✗ Xatolik yuz berdi: ${errorMsg}`]);
      showToast(`Xatolik: ${errorMsg}`, 'error');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [token]);

  const handleLogout = () => {
    confirmAction({
      title: "WhatsAppni uzish",
      message: "WhatsApp ulanish seansini tugatib, o‘chirishni tasdiqlaysizmi?",
      onConfirm: () => {
        socketRef.current?.emit('logout');
      }
    });
  };

  const handleWebsiteLogout = () => {
    confirmAction({
      title: "Saytdan chiqish",
      message: "Ushbu qurilmadan panel seansini yopmoqchimisiz? (WhatsApp ulanishi uzilmaydi)",
      onConfirm: () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        showToast('Tizimdan muvaffaqiyatli chiqildi.', 'success');
      }
    });
  };

  const handleSend = (messageText, mediaFiles) => {
    if (selectedChats.length === 0) return;
    socketRef.current?.emit('send-bulk-messages', {
      message: messageText,
      recipients: selectedChats,
      mediaFiles: mediaFiles
    });
  };

  const handleCancel = () => {
    confirmAction({
      title: "Yuborishni to'xtatish",
      message: "Jo'natish navbatini to'xtatmoqchimisiz?",
      onConfirm: () => {
        socketRef.current?.emit('cancel-bulk-messages');
      }
    });
  };

  const handleSendReply = (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedChat || !socketRef.current) return;

    socketRef.current.emit('send-chat-reply', {
      jid: selectedChat.id,
      text: replyText.trim()
    });

    setReplyText('');
  };

  const handleDeleteChat = (jid) => {
    if (socketRef.current) {
      socketRef.current.emit('delete-chat', { jid });
    }
  };

  const handleDeleteMessage = (jid, msgId, fromMe) => {
    if (socketRef.current) {
      socketRef.current.emit('delete-message', { jid, msgId, fromMe });
    }
  };

  const handleEditMessage = (jid, msgId, fromMe, newText) => {
    if (socketRef.current) {
      socketRef.current.emit('edit-message', { jid, msgId, fromMe, newText });
    }
  };

  const handleCreateNewChat = (phoneNumber, callback) => {
    if (socketRef.current) {
      socketRef.current.emit('create-new-chat', { phoneNumber }, callback);
    }
  };

  const isConnected = connection.status === 'CONNECTED';

  if (isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        {/* Sidebar Drawer */}
        <Sidebar
          connection={connection}
          onLogout={handleLogout}
          onWebsiteLogout={handleWebsiteLogout}
          chats={directChats}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Top Navigation Bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#202c33',
          borderBottom: '1px solid #222e35',
          padding: '0 1.5rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {/* Menu Icon Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aebac1',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#aebac1';
            }}
            title="Menyu"
          >
            <Menu size={22} />
          </button>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: '#00a884',
              padding: '0.3rem',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={16} style={{ color: '#0b141a' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>WA Messenger</span>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
          <Routes>
            <Route path="/bulk" element={
              <BulkChatPanel
                chats={chats}
                selectedChats={selectedChats}
                setSelectedChats={setSelectedChats}
                handleSend={handleSend}
                handleCancel={handleCancel}
                isSending={isSending}
                isConnected={isConnected}
                progress={progress}
                results={results}
                logs={logs}
              />
            } />
            <Route path="/all" element={
              <DirectChatPanel
                chats={directChats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                messages={directMessages}
                replyText={replyText}
                setReplyText={setReplyText}
                handleSendReply={handleSendReply}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterMode="all"
                newChatNumber={newChatNumber}
                setNewChatNumber={setNewChatNumber}
                showNewChatInput={showNewChatInput}
                setShowNewChatInput={setShowNewChatInput}
                handleDeleteChat={handleDeleteChat}
                handleDeleteMessage={handleDeleteMessage}
                handleEditMessage={handleEditMessage}
                handleCreateNewChat={handleCreateNewChat}
              />
            } />
            <Route path="/unread" element={
              <DirectChatPanel
                chats={directChats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                messages={directMessages}
                replyText={replyText}
                setReplyText={setReplyText}
                handleSendReply={handleSendReply}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterMode="unread"
                newChatNumber={newChatNumber}
                setNewChatNumber={setNewChatNumber}
                showNewChatInput={showNewChatInput}
                setShowNewChatInput={setShowNewChatInput}
                handleDeleteChat={handleDeleteChat}
                handleDeleteMessage={handleDeleteMessage}
                handleEditMessage={handleEditMessage}
                handleCreateNewChat={handleCreateNewChat}
              />
            } />
            <Route path="*" element={<Navigate to="/bulk" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 168, 132, 0.3)'
          }}>
            <MessageSquare size={28} style={{ color: 'white' }} />
          </div>
          <h1>WhatsApp Bulk Messenger</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>Xavfsiz ulanish</span>
          </div>
          {token && (
            <button
              onClick={handleWebsiteLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#aebac1',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <LogOut size={14} />
              <span>Chiqish</span>
            </button>
          )}
        </div>
      </header>

      {/* Connection Panel */}
      <ConnectionPanel 
        status={connection.status} 
        qr={connection.qr} 
        user={connection.user} 
        onLogout={handleLogout} 
        onRequestTakeover={() => socketRef.current?.emit('request-takeover')}
      />
    </div>
  );
}
