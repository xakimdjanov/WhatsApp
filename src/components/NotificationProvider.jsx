import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const NotificationContext = createContext(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const confirmAction = useCallback(({ title, message, onConfirm, onCancel }) => {
    setModal({
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setModal(null);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setModal(null);
      }
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, confirmAction }}>
      {children}
      
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = 'var(--accent-purple)';
          if (toast.type === 'success') {
            Icon = CheckCircle;
            iconColor = 'var(--success)';
          } else if (toast.type === 'error') {
            Icon = XCircle;
            iconColor = 'var(--error)';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            iconColor = 'var(--warning)';
          }

          return (
            <div key={toast.id} className={`toast-item toast-${toast.type}`}>
              <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {modal && (
        <div className="modal-overlay" onClick={modal.onCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
              {modal.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {modal.message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={modal.onCancel} 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.6rem' }}
              >
                Bekor qilish
              </button>
              <button 
                onClick={modal.onConfirm} 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.6rem' }}
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
