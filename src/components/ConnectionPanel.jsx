import React from 'react';
import { QrCode, Wifi, WifiOff, Loader2, LogOut, CheckCircle2 } from 'lucide-react';

export default function ConnectionPanel({ status, qr, user, onLogout, onRequestTakeover }) {
  return (
    <div className={`glass-card ${status === 'SCAN_QR' ? 'pulse-card' : ''} fade-in`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>
          {status === 'CONNECTED' ? (
            <>
              <Wifi style={{ color: 'var(--success)' }} /> Bog'lanish holati: <span style={{ color: 'var(--success)' }}>Ulangan</span>
            </>
          ) : status === 'CONNECTING' ? (
            <>
              <Loader2 className="spin" style={{ color: 'var(--accent-purple)' }} /> Bog'lanish holati: <span style={{ color: 'var(--accent-purple)' }}>Ulanmoqda...</span>
            </>
          ) : status === 'SCAN_QR' ? (
            <>
              <QrCode style={{ color: 'var(--accent-pink)' }} /> Bog'lanish holati: <span style={{ color: 'var(--accent-pink)' }}>QR Skanerlash</span>
            </>
          ) : status === 'CONNECTED_OTHER_DEVICE' ? (
            <>
              <WifiOff style={{ color: '#ef4444' }} /> Bog'lanish holati: <span style={{ color: '#ef4444' }}>Band (Boshqa qurilma)</span>
            </>
          ) : (
            <>
              <WifiOff style={{ color: 'var(--text-secondary)' }} /> Bog'lanish holati: <span style={{ color: 'var(--text-secondary)' }}>Ulanmagan</span>
            </>
          )}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        {status === 'CONNECTING' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <Loader2 className="spin" size={48} style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>WhatsApp serverlari bilan aloqa o'rnatilmoqda. Iltimos, kuting...</p>
          </div>
        )}

        {status === 'SCAN_QR' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2.5rem', 
            alignItems: 'center', 
            width: '100%',
            padding: '1rem 0'
          }}>
            {/* Left side: Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ color: 'var(--accent-pink)', fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>WhatsApp Web ulanish ko'rsatmalari</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                Ommaviy xabarlar jo'natish xizmatini ishga tushirish uchun telefoningizdagi WhatsApp ilovasi orqali QR kodni skanerlang:
              </p>
              <ol style={{ 
                fontSize: '0.95rem', 
                color: 'var(--text-secondary)', 
                paddingLeft: '1.2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.8rem',
                margin: '0.5rem 0 0 0'
              }}>
                <li>Telefoningizda <b style={{ color: 'white' }}>WhatsApp</b> dasturini oching.</li>
                <li>Menyu (Settings) &gt; <b style={{ color: 'white' }}>Qurilmalarni bog'lash</b> (Linked Devices) bo'limiga kiring.</li>
                <li><b style={{ color: 'white' }}>Qurilmani bog'lash</b> (Link a Device) tugmasini bosing.</li>
                <li>Kamerani ushbu ekrandagi QR kodga qarating.</li>
              </ol>
            </div>

            {/* Right side: QR Code Card */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {qr ? (
                <div style={{ 
                  background: 'white', 
                  padding: '1.25rem', 
                  borderRadius: '20px', 
                  boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid var(--accent-pink)',
                  position: 'relative'
                }}>
                  <img src={qr} alt="WhatsApp QR Code" style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }} />
                </div>
              ) : (
                <div style={{ 
                  width: '260px', 
                  height: '260px', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem'
                }}>
                  <Loader2 className="spin" size={36} style={{ color: 'var(--accent-pink)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>QR kod yuklanmoqda...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'CONNECTED' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--success)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 600 }}>Tizimga muvaffaqiyatli kirildi</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Foydalanuvchi ID: <span style={{ color: 'var(--success)' }}>{user?.id ? user.id.split(':')[0] : 'Nomalum'}</span>
                </p>
              </div>
            </div>
            <button className="btn btn-danger" onClick={onLogout} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              <LogOut size={16} /> Chiqish
            </button>
          </div>
        )}

        {status === 'DISCONNECTED' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <Loader2 className="spin" size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Ulanish kutilmoqda. Aloqa tiklanmoqda...</p>
          </div>
        )}

        {status === 'CONNECTED_OTHER_DEVICE' && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2.5rem 1.5rem', 
            background: 'rgba(239, 68, 68, 0.08)', 
            borderRadius: '16px', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            width: '100%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <WifiOff size={48} style={{ color: '#ef4444', marginBottom: '1.2rem' }} />
            <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Boshqa qurilma ulangan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
              WhatsApp hozirda boshqa brauzer yoki kompyuter orqali faol bog'langan. Ushbu qurilma panelga kirishi uchun avvalgi qurilmadagi ulanish uzilishi kerak.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={onRequestTakeover} 
              style={{ 
                padding: '0.8rem 1.6rem', 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Ulanishni bu yerga o‘tkazish (Takeover)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
