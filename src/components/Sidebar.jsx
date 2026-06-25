import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Send, LogOut, X, ArrowLeft, Users, Mail } from 'lucide-react';

export default function Sidebar({ connection, onLogout, chats = [], isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === '/bulk'
    ? 'bulk'
    : (location.pathname === '/unread' ? 'unread' : 'all');

  const userPhone = connection.user
    ? (typeof connection.user === 'object'
        ? (connection.user.id ? connection.user.id.split('@')[0] : '')
        : connection.user)
    : '';

  const userName = connection.user
    ? (typeof connection.user === 'object'
        ? (connection.user.name || 'WhatsApp Foydalanuvchisi')
        : 'WhatsApp Foydalanuvchisi')
    : 'WhatsApp Foydalanuvchisi';

  const unreadChatsCount = chats.filter(c => c.unreadCount > 0).length;

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <>
      {/* Dark overlay behind sidebar */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(2px)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Sidebar Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '300px',
        background: '#111b21',
        borderRight: '1px solid #222e35',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 201,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isOpen ? '4px 0 30px rgba(0,0,0,0.5)' : 'none'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: '#202c33',
          borderBottom: '1px solid #222e35'
        }}>
          {/* Back / Close Button */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aebac1',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#aebac1';
            }}
            title="Yopish"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
            <div style={{
              background: '#00a884',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MessageSquare size={18} style={{ color: '#0b141a' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'white', letterSpacing: '0.3px' }}>
              WA Messenger
            </span>
          </div>

          {/* X close button */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aebac1',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#aebac1';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid #222e35',
          background: '#111b21'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00a884, #007a61)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,168,132,0.3)'
          }}>
            <Users size={20} style={{ color: 'white' }} />
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#e9edef',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {userName}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#8696a0',
              marginTop: '0.1rem'
            }}>
              {userPhone ? `+${userPhone}` : 'Bog\'langan'}
            </div>
          </div>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#00a884',
            boxShadow: '0 0 6px rgba(0,168,132,0.6)',
            flexShrink: 0
          }} />
        </div>

        {/* Navigation Section Label */}
        <div style={{
          padding: '1rem 1.25rem 0.4rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#8696a0',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          Bo'limlar
        </div>

        {/* Navigation Items */}
        <div style={{ padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

          {/* Chatlar bo'limi */}
          <div style={{
            padding: '0.5rem 0.75rem 0.3rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#00a884',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            💬 Chatlar
          </div>

          <button
            onClick={() => handleNav('/all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeTab === 'all' ? 'rgba(0,168,132,0.15)' : 'transparent',
              color: activeTab === 'all' ? '#00a884' : '#aebac1',
              border: activeTab === 'all' ? '1px solid rgba(0,168,132,0.25)' : '1px solid transparent',
              fontWeight: activeTab === 'all' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'all') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#e9edef';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'all') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#aebac1';
              }
            }}
          >
            <MessageSquare size={18} />
            <span>Barcha chatlar</span>
          </button>

          <button
            onClick={() => handleNav('/unread')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeTab === 'unread' ? 'rgba(0,168,132,0.15)' : 'transparent',
              color: activeTab === 'unread' ? '#00a884' : '#aebac1',
              border: activeTab === 'unread' ? '1px solid rgba(0,168,132,0.25)' : '1px solid transparent',
              fontWeight: activeTab === 'unread' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'unread') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#e9edef';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'unread') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#aebac1';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <MessageSquare size={18} />
              <span>O'qilmaganlar</span>
            </div>
            {unreadChatsCount > 0 && (
              <span style={{
                background: '#00a884',
                color: '#0b141a',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '50%',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px'
              }}>
                {unreadChatsCount}
              </span>
            )}
          </button>

          {/* Xabarlar bo'limi divider */}
          <div style={{
            padding: '0.75rem 0.75rem 0.3rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#00a884',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: '0.25rem'
          }}>
            📤 Xabarlar
          </div>

          <button
            onClick={() => handleNav('/bulk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeTab === 'bulk' ? 'rgba(0,168,132,0.15)' : 'transparent',
              color: activeTab === 'bulk' ? '#00a884' : '#aebac1',
              border: activeTab === 'bulk' ? '1px solid rgba(0,168,132,0.25)' : '1px solid transparent',
              fontWeight: activeTab === 'bulk' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'bulk') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#e9edef';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'bulk') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#aebac1';
              }
            }}
          >
            <Send size={18} />
            <span>Ommaviy xabarnoma</span>
          </button>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Divider */}
        <div style={{ height: '1px', background: '#222e35', margin: '0 1.25rem' }} />

        {/* Logout button */}
        <div style={{ padding: '1rem 1.25rem' }}>
          <button
            onClick={handleLogoutClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#f15c6d',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.18)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
            }}
          >
            <LogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </div>
    </>
  );
}
