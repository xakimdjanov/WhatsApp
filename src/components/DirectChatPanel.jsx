import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Send, User, MessageSquare, Trash2, Pencil,
  Check, X, ArrowLeft, Plus, Phone, MoreVertical,
  ChevronLeft, Clock, CheckCheck, MessageCircle
} from 'lucide-react';
import { useNotification } from './NotificationProvider';

export default function DirectChatPanel({
  chats = [],
  selectedChat = null,
  setSelectedChat,
  messages = [],
  replyText = '',
  setReplyText,
  handleSendReply,
  searchQuery = '',
  setSearchQuery,
  filterMode = 'all',
  newChatNumber = '',
  setNewChatNumber,
  showNewChatInput = false,
  setShowNewChatInput,
  handleDeleteChat,
  handleDeleteMessage,
  handleEditMessage,
  handleCreateNewChat
}) {
  const { showToast, confirmAction } = useNotification();
  const messagesEndRef = useRef(null);

  // 'list' | 'chat'
  const [view, setView] = useState('list');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // When selectedChat changes externally, switch view
  useEffect(() => {
    if (selectedChat) {
      setView('chat');
    }
  }, [selectedChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (view === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, view]);

  // Filter chats
  const filteredChats = chats.filter(chat => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.id.includes(searchQuery);
    if (filterMode === 'unread') return matchesSearch && chat.unreadCount > 0;
    return matchesSearch;
  });

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setView('chat');
  };

  const handleBack = () => {
    setView('list');
    setSelectedChat(null);
  };

  // ─── LIST VIEW ────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 56px - 4rem)',
        background: '#111b21',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #222e35'
      }}>

        {/* List Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: '#202c33',
          borderBottom: '1px solid #222e35',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <MessageCircle size={20} style={{ color: '#00a884', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e9edef', flex: 1 }}>
            {filterMode === 'unread' ? "O'qilmagan chatlar" : 'Barcha chatlar'}
          </span>
          <span style={{
            background: 'rgba(0,168,132,0.15)',
            color: '#00a884',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            border: '1px solid rgba(0,168,132,0.25)'
          }}>
            {filteredChats.length} ta
          </span>
        </div>

        {/* Search */}
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #222e35' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8696a0'
            }} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                background: '#2a3942',
                border: 'none',
                borderRadius: '8px',
                color: '#e9edef',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* New Chat Button / Form */}
        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #222e35' }}>
          {!showNewChatInput ? (
            <button
              onClick={() => setShowNewChatInput(true)}
              style={{
                background: 'rgba(0,168,132,0.1)',
                color: '#00a884',
                border: '1px dashed rgba(0,168,132,0.35)',
                padding: '0.55rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,168,132,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,168,132,0.1)'}
            >
              <Plus size={16} />
              Yangi suhbat boshlash
            </button>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                const cleaned = newChatNumber.replace(/\D/g, '');
                if (cleaned.length < 9) {
                  showToast("Telefon raqami noto'g'ri!", 'warning');
                  return;
                }
                handleCreateNewChat(newChatNumber, response => {
                  if (response && response.success) {
                    handleSelectChat(response.chat);
                    setNewChatNumber('');
                    setShowNewChatInput(false);
                  } else {
                    showToast(response ? response.error : 'Xatolik yuz berdi', 'error');
                  }
                });
              }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="text"
                placeholder="998901234567"
                value={newChatNumber}
                onChange={e => setNewChatNumber(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  background: '#2a3942',
                  border: '1px solid rgba(0,168,132,0.3)',
                  borderRadius: '8px',
                  color: '#e9edef',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button type="submit" style={{
                background: '#00a884', border: 'none', borderRadius: '8px',
                color: '#0b141a', padding: '0.5rem 0.75rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center'
              }}>
                <Check size={16} />
              </button>
              <button type="button" onClick={() => setShowNewChatInput(false)} style={{
                background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '8px',
                color: '#f15c6d', padding: '0.5rem 0.75rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center'
              }}>
                <X size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChats.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: '0.75rem',
              color: '#8696a0', padding: '2rem'
            }}>
              <MessageCircle size={40} style={{ opacity: 0.4 }} />
              <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                {filterMode === 'unread' ? "O'qilmagan chatlar yo'q" : 'Chatlar topilmadi'}
              </span>
            </div>
          ) : filteredChats.map(chat => {
            const formattedJid = chat.id.replace('@s.whatsapp.net', '').replace('@lid', '');
            return (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                style={{
                  padding: '0.9rem 1.25rem',
                  borderBottom: '1px solid #1a2128',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'background 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#202c33'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Avatar */}
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00a884, #007a61)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, boxShadow: '0 2px 8px rgba(0,168,132,0.2)'
                }}>
                  <User size={20} style={{ color: 'white' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: chat.unreadCount > 0 ? 700 : 500,
                    color: '#e9edef',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {chat.name}
                  </div>
                  <div style={{
                    fontSize: '0.78rem', color: '#8696a0', marginTop: '0.15rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    <CheckCheck size={13} style={{ flexShrink: 0, color: '#00a884' }} />
                    {chat.lastMessage || `+${formattedJid}`}
                  </div>
                </div>

                {/* Right side: badge + delete */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                  {chat.unreadCount > 0 && (
                    <span style={{
                      background: '#00a884', color: '#0b141a',
                      fontSize: '0.7rem', fontWeight: 700, borderRadius: '50%',
                      minWidth: '20px', height: '20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px'
                    }}>
                      {chat.unreadCount}
                    </span>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      confirmAction({
                        title: "Suhbatni o'chirish",
                        message: "Bu suhbatni o'chirmoqchimisiz?",
                        onConfirm: () => {
                          handleDeleteChat(chat.id);
                          if (selectedChat && selectedChat.id === chat.id) {
                            setSelectedChat(null);
                          }
                        }
                      });
                    }}
                    style={{
                      background: 'transparent', border: 'none',
                      color: 'rgba(239,68,68,0.5)', cursor: 'pointer',
                      padding: '0.2rem', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#f15c6d';
                      e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(239,68,68,0.5)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                    title="O'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── CHAT VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 56px - 4rem)',
      background: '#0b141a',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #222e35'
    }}>

      {/* Chat Header */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: '#202c33',
        borderBottom: '1px solid #222e35',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            background: 'transparent', border: 'none', color: '#aebac1',
            cursor: 'pointer', padding: '0.4rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', flexShrink: 0
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#aebac1';
          }}
          title="Ro'yxatga qaytish"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Avatar */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00a884, #007a61)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <User size={18} style={{ color: 'white' }} />
        </div>

        {/* Name & Phone */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontWeight: 600, fontSize: '0.95rem', color: '#e9edef',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {selectedChat?.name || 'Ism yo\'q'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8696a0', marginTop: '0.05rem' }}>
            +{selectedChat?.id?.replace('@s.whatsapp.net', '').replace('@lid', '')}
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{
            background: 'transparent', border: 'none', color: '#aebac1',
            cursor: 'pointer', padding: '0.4rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = '#aebac1'}
          >
            <Phone size={18} />
          </button>
          <button style={{
            background: 'transparent', border: 'none', color: '#aebac1',
            cursor: 'pointer', padding: '0.4rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = '#aebac1'}
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: '#0b141a'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', flex: 1, gap: '0.75rem',
            color: '#8696a0', opacity: 0.7
          }}>
            <MessageSquare size={44} style={{ opacity: 0.3 }} />
            <span style={{ fontSize: '0.9rem' }}>Xabarlar yo'q</span>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.fromMe;
            const isEditing = editingMessageId === msg.id;
            const isHovered = hoveredMessageId === msg.id;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredMessageId(msg.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Action buttons on hover */}
                {isHovered && !isEditing && (
                  <div style={{
                    display: 'flex',
                    gap: '0.25rem',
                    marginBottom: '0.25rem',
                    alignSelf: isMe ? 'flex-end' : 'flex-start'
                  }}>
                    {isMe && (
                      <button
                        onClick={() => {
                          setEditingMessageId(msg.id);
                          setEditValue(msg.text);
                        }}
                        style={{
                          background: '#2a3942', border: 'none', borderRadius: '4px',
                          color: '#aebac1', cursor: 'pointer', padding: '3px 7px',
                          display: 'flex', alignItems: 'center', gap: '0.25rem',
                          fontSize: '0.73rem', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#3b4a54'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2a3942'}
                        title="Tahrirlash"
                      >
                        <Pencil size={11} /> Tahrir
                      </button>
                    )}
                    <button
                      onClick={() => {
                        confirmAction({
                          title: "Xabarni o'chirish",
                          message: isMe
                            ? "Barcha uchun o'chirishni xohlaysizmi?"
                            : "Bu xabarni o'chirmoqchimisiz?",
                          onConfirm: () => handleDeleteMessage(selectedChat.id, msg.id, msg.fromMe)
                        });
                      }}
                      style={{
                        background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '4px',
                        color: '#f15c6d', cursor: 'pointer', padding: '3px 7px',
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        fontSize: '0.73rem', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                      title="O'chirish"
                    >
                      <Trash2 size={11} /> O'chir
                    </button>
                  </div>
                )}

                {/* Bubble */}
                <div style={{
                  background: isMe ? '#005c4b' : '#202c33',
                  color: '#e9edef',
                  padding: isEditing ? '0.5rem 0.6rem' : '0.55rem 0.85rem',
                  borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  wordBreak: 'break-word',
                  maxWidth: '70%',
                  minWidth: isEditing ? '220px' : 'auto'
                }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        style={{
                          width: '100%', background: '#2a3942',
                          border: '1px solid rgba(0,168,132,0.4)',
                          borderRadius: '6px', color: 'white',
                          padding: '0.4rem 0.5rem', fontSize: '0.85rem',
                          outline: 'none', resize: 'none', minHeight: '50px',
                          fontFamily: 'inherit', boxSizing: 'border-box'
                        }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => { setEditingMessageId(null); setEditValue(''); }}
                          style={{
                            background: 'rgba(239,68,68,0.2)', border: 'none',
                            borderRadius: '6px', color: '#f15c6d',
                            padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.25rem'
                          }}
                        >
                          <X size={12} /> Bekor
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!editValue.trim()) return;
                            handleEditMessage(selectedChat.id, msg.id, msg.fromMe, editValue.trim());
                            setEditingMessageId(null);
                            setEditValue('');
                          }}
                          style={{
                            background: '#00a884', border: 'none',
                            borderRadius: '6px', color: '#0b141a',
                            padding: '4px 10px', fontSize: '0.75rem',
                            fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.25rem'
                          }}
                        >
                          <Check size={12} /> Saqlash
                        </button>
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Timestamp */}
                <div style={{
                  fontSize: '0.65rem',
                  color: '#8696a0',
                  marginTop: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}>
                  <Clock size={9} />
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form
        onSubmit={handleSendReply}
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid #222e35',
          background: '#202c33',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder="Xabarni yozing..."
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            background: '#2a3942',
            border: 'none',
            borderRadius: '24px',
            color: '#e9edef',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!replyText.trim()}
          style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: replyText.trim() ? '#00a884' : '#2a3942',
            border: 'none', cursor: replyText.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s ease',
            color: replyText.trim() ? '#0b141a' : '#8696a0'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
