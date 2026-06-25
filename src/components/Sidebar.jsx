import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Send, LogOut, X, Users, Mail } from 'lucide-react';

export default function Sidebar({ connection, onLogout, onWebsiteLogout, chats = [], isOpen, onClose }) {
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
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #222e35',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#00a884',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 168, 132, 0.3)'
            }}>
              <MessageSquare size={18} style={{ color: '#0b141a' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', lineHeight: 1.2 }}>WA Control</span>
              <span style={{ fontSize: '0.75rem', color: '#00a884', fontWeight: 500 }}>Onlayn</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8696a0',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info (if connected) */}
        {connection.status === 'CONNECTED' && (
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(0, 168, 132, 0.04)',
            borderBottom: '1px solid #222e35'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#8696a0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Ulanish
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e9edef' }}>
              {userName}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8696a0', marginTop: '0.1rem' }}>
              +{userPhone}
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Ommaviy xabarnoma */}
          <button
            onClick={() => handleNav('/bulk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeTab === 'bulk' ? 'rgba(0, 168, 132, 0.1)' : 'transparent',
              color: activeTab === 'bulk' ? '#00a884' : '#aebac1',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'bulk') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'white';
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

          {/* Barcha chatlar */}
          <button
            onClick={() => handleNav('/all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeTab === 'all' ? 'rgba(0, 168, 132, 0.1)' : 'transparent',
              color: activeTab === 'all' ? '#00a884' : '#aebac1',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'all') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'all') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#aebac1';
              }
            }}
          >
            <Users size={18} />
            <span>Barcha chatlar</span>
          </button>

          {/* O'qilmagan chatlar */}
          <button
            onClick={() => handleNav('/unread')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeTab === 'unread' ? 'rgba(0, 168, 132, 0.1)' : 'transparent',
              color: activeTab === 'unread' ? '#00a884' : '#aebac1',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (activeTab !== 'unread') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'white';
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
              <Mail size={18} />
              <span>O'qilmagan chatlar</span>
            </div>
            {unreadChatsCount > 0 && (
              <span style={{
                background: '#00a884',
                color: '#0b141a',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.15rem 0.4rem',
                borderRadius: '10px',
                minWidth: '20px',
                textAlign: 'center'
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

        {/* Logout buttons */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Website Logout */}
          <button
            onClick={() => { onClose(); onWebsiteLogout(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#aebac1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <LogOut size={18} />
            <span>Saytdan chiqish</span>
          </button>

          {/* WhatsApp Disconnect */}
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
            <span>WhatsAppni uzish</span>
          </button>
        </div>
      </div>
    </>
  );
}
