import React, { useState, useRef } from 'react';
import { Send, Ban, SendHorizonal, AlertCircle, Paperclip, X, FileText, Image as ImageIcon, Video, Loader2, CheckCircle2, Clock, Users } from 'lucide-react';

export default function MessageComposer({ selectedCount, onSend, onCancel, isSending, isConnected, progress, results }) {
  const [messageText, setMessageText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            dataUrl: reader.result,
            filename: file.name,
            type: file.type,
            size: (file.size / 1024).toFixed(1) + ' KB'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so the same file can be uploaded again if deleted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id) => {
    setMediaFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCount === 0 || isSending) return;
    if (!messageText.trim() && mediaFiles.length === 0) return;
    onSend(messageText, mediaFiles);
  };

  return (
    <div className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>
          <Send size={20} style={{ color: 'var(--accent-pink)' }} /> Xabar yuborish
        </h2>
        <button
          type="button"
          disabled={isSending || !isConnected}
          onClick={() => fileInputRef.current?.click()}
          className="btn"
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.85rem', 
            background: mediaFiles.length > 0 ? 'rgba(217, 70, 239, 0.2)' : 'rgba(255,255,255,0.05)',
            border: mediaFiles.length > 0 ? '1px solid var(--accent-pink)' : '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <Paperclip size={14} style={{ color: mediaFiles.length > 0 ? 'var(--accent-pink)' : 'white' }} />
          Fayl qo'shish {mediaFiles.length > 0 && `(${mediaFiles.length})`}
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        />
      </div>

      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Text Area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <textarea
            placeholder={mediaFiles.length > 0 ? "Fayllar uchun izoh kiritishingiz mumkin (ixtiyoriy)..." : "Yubormoqchi bo'lgan matningizni bu yerga yozing..."}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending || !isConnected}
            className="input-field"
            style={{ 
              flex: 1, 
              resize: 'none', 
              minHeight: '120px',
              padding: '1rem',
              lineHeight: '1.6'
            }}
          />
          <div style={{ 
            position: 'absolute', 
            bottom: '0.75rem', 
            right: '0.75rem', 
            fontSize: '0.8rem', 
            color: 'var(--text-secondary)' 
          }}>
            Karakterlar: {messageText.length}
          </div>
        </div>

        {/* Media Previews Grid */}
        {mediaFiles.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.75rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {mediaFiles.map((file) => (
              <div key={file.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                position: 'relative',
                minWidth: 0
              }}>
                {file.type.startsWith('image/') ? (
                  <div style={{ 
                    width: '100%', 
                    height: '50px', 
                    borderRadius: '6px', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#111'
                  }}>
                    <img src={file.dataUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '50px', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--accent-pink)'
                  }}>
                    {file.type.startsWith('video/') ? <Video size={20} /> : <FileText size={20} />}
                  </div>
                )}

                <div style={{ 
                  width: '100%', 
                  fontSize: '0.75rem', 
                  color: 'white', 
                  textAlign: 'center',
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {file.filename}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  {file.size}
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  disabled={isSending}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    padding: 0
                  }}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info panel */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.75rem', 
          background: 'rgba(217, 70, 239, 0.05)', 
          border: '1px solid rgba(217, 70, 239, 0.15)',
          borderRadius: '10px'
        }}>
          <AlertCircle size={18} style={{ color: 'var(--accent-pink)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {selectedCount === 0 ? (
              <span style={{ color: 'var(--error)' }}>Iltimos, chap tomondagi ro'yxatdan kamida bitta chatni belgilang.</span>
            ) : (
              <span>
                Xabar <strong style={{ color: 'white' }}>{selectedCount} ta</strong> tanlangan chatga navbatma-navbat yuboriladi. Har bir yuborish oralig'ida <strong style={{ color: 'var(--accent-pink)' }}>2.5 soniya</strong> to'xtalish bo'ladi.
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
          {isSending && progress ? (
            <>
              {/* Progress Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.6rem'
              }}>
                {/* Jami */}
                <div style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <Users size={13} style={{ color: 'var(--accent-purple)' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>JAMI</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                    {progress.total || selectedCount}
                  </div>
                </div>

                {/* Jo'natildi */}
                <div style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>JO'NATILDI</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                    {progress.current || 0}
                  </div>
                </div>

                {/* Qoldi */}
                <div style={{
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <Clock size={13} style={{ color: '#fbbf24' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>QOLDI</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                    {Math.max(0, (progress.total || selectedCount) - (progress.current || 0))}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress.total ? Math.round((progress.current / progress.total) * 100) : 0}%`,
                  background: 'linear-gradient(90deg, var(--accent-purple), var(--success))',
                  borderRadius: '99px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-purple)' }} />
                  Jo'natilmoqda...
                </span>
                <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                  {progress.total ? Math.round((progress.current / progress.total) * 100) : 0}%
                </span>
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-danger"
                style={{ padding: '0.85rem' }}
              >
                <Ban size={18} /> Jo'natishni to'xtatish
              </button>
            </>
          ) : isSending ? (
            /* Fallback loader if no progress data yet */
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-danger"
              style={{ padding: '0.85rem' }}
            >
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Jo'natishni to'xtatish
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isConnected || selectedCount === 0 || (!messageText.trim() && mediaFiles.length === 0)}
              style={{ flex: 1, padding: '0.9rem' }}
            >
              <SendHorizonal size={18} /> Jo'natishni boshlash
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
