import React, { useState, useMemo, useEffect } from 'react';
import { Search, Users, User, CheckSquare, Square, Filter, Plus } from 'lucide-react';

export default function ChatSelector({ chats, selectedChats, onSelectionChange }) {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'manual'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, individual, group
  const [manualInput, setManualInput] = useState('');

  const chatJids = useMemo(() => chats.map(c => c.id), [chats]);

  // Sync manual input value from selected chats when changed elsewhere (like after sending completes)
  useEffect(() => {
    const currentManualNumbers = selectedChats
      .filter(id => !chatJids.includes(id) && (id.endsWith('@s.whatsapp.net') || id.endsWith('@lid')))
      .map(id => id.split('@')[0]);

    const parsedLines = manualInput
      .split(/[\n,;]+/)
      .map(n => n.trim().replace(/\+/g, '').replace(/\D/g, ''))
      .filter(n => n.length >= 7);

    const match = currentManualNumbers.length === parsedLines.length && 
                  currentManualNumbers.every((v, i) => v === parsedLines[i]);

    if (!match && activeTab !== 'manual') {
      setManualInput(currentManualNumbers.join('\n'));
    }
  }, [selectedChats, chatJids, activeTab]);

  // Filter list based on search term and selected tab
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            chat.id.includes(searchTerm);
      const matchesFilter = filterType === 'all' || 
                            (filterType === 'individual' && !chat.isGroup) || 
                            (filterType === 'group' && chat.isGroup);
      return matchesSearch && matchesFilter;
    });
  }, [chats, searchTerm, filterType]);

  const isAllSelected = useMemo(() => {
    if (filteredChats.length === 0) return false;
    return filteredChats.every(chat => selectedChats.includes(chat.id));
  }, [filteredChats, selectedChats]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = filteredChats.map(c => c.id);
      onSelectionChange(selectedChats.filter(id => !filteredIds.includes(id)));
    } else {
      const newSelected = [...selectedChats];
      filteredChats.forEach(chat => {
        if (!newSelected.includes(chat.id)) {
          newSelected.push(chat.id);
        }
      });
      onSelectionChange(newSelected);
    }
  };

  const toggleChat = (jid) => {
    if (selectedChats.includes(jid)) {
      onSelectionChange(selectedChats.filter(id => id !== jid));
    } else {
      onSelectionChange([...selectedChats, jid]);
    }
  };

  const handleManualInputChange = (value) => {
    setManualInput(value);
    const lines = value.split(/[\n,;]+/);
    const parsedJids = [];
    for (let line of lines) {
      let num = line.trim().replace(/\+/g, '').replace(/\D/g, '');
      if (num.length >= 7) {
        if (num.startsWith('8') && num.length === 11) {
          num = '7' + num.slice(1);
        }
        const jid = `${num}@s.whatsapp.net`;
        if (!parsedJids.includes(jid)) {
          parsedJids.push(jid);
        }
      }
    }
    // Retain normal selected chats and add the manual ones
    const normalSelected = selectedChats.filter(id => chatJids.includes(id));
    onSelectionChange([...normalSelected, ...parsedJids]);
  };

  const manualCount = useMemo(() => {
    return selectedChats.filter(id => !chatJids.includes(id) && (id.endsWith('@s.whatsapp.net') || id.endsWith('@lid'))).length;
  }, [selectedChats, chatJids]);

  return (
    <div className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '580px' }}>
      {/* Header and Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
          <Users size={20} style={{ color: 'var(--accent-purple)', marginRight: '0.5rem' }} /> 
          Qabul qiluvchilar
        </h2>
        <span style={{ 
          fontSize: '0.8rem', 
          background: 'rgba(139, 92, 246, 0.2)', 
          color: 'var(--accent-purple)', 
          padding: '0.2rem 0.6rem', 
          borderRadius: '20px',
        }}>
          Tanlandi: {selectedChats.length} ta
        </span>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', paddingBottom: '0.25rem' }}>
        <button 
          onClick={() => setActiveTab('chats')}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'chats' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'chats' ? 'white' : 'var(--text-secondary)',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Users size={16} /> Mavjud Chatlar ({chats.length})
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'manual' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'manual' ? 'white' : 'var(--text-secondary)',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={16} /> Qo'lda kiritish ({manualCount})
        </button>
      </div>

      {activeTab === 'chats' ? (
        <>
          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Qidirish (ism yoki raqam)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '0.9rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-secondary)' 
            }} />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('all')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
            >
              Hammasi
            </button>
            <button 
              className={`btn ${filterType === 'individual' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('individual')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
            >
              <User size={14} /> Shaxsiy
            </button>
            <button 
              className={`btn ${filterType === 'group' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('group')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
            >
              <Users size={14} /> Guruhlar
            </button>
          </div>

          {/* Selection Control Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingBottom: '0.75rem', 
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '0.5rem'
          }}>
            <label className="custom-checkbox" style={{ fontSize: '0.9rem' }}>
              <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} disabled={filteredChats.length === 0} />
              <span className="checkmark"></span>
              <span>Süzgichdagilarni belgilash ({filteredChats.length})</span>
            </label>
          </div>

          {/* Chats List Container */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingRight: '4px' }}>
            {filteredChats.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 0' }}>
                Hech qanday chat topilmadi
              </div>
            ) : (
              filteredChats.map(chat => {
                const isSelected = selectedChats.includes(chat.id);
                return (
                  <div 
                    key={chat.id} 
                    onClick={() => toggleChat(chat.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'rgba(139, 92, 246, 0.25)' : 'transparent'}`,
                      transition: 'all 0.15s ease'
                    }}
                    className="chat-item"
                  >
                    <div style={{ marginRight: '0.75rem', display: 'flex', alignItems: 'center' }}>
                      <label className="custom-checkbox" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => toggleChat(chat.id)} 
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      background: chat.isGroup ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem',
                      color: chat.isGroup ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                    }}>
                      {chat.isGroup ? <Users size={18} /> : <User size={18} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: 500, 
                        color: 'white', 
                        textOverflow: 'ellipsis', 
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {chat.name}
                      </h4>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-secondary)',
                        textOverflow: 'ellipsis', 
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {chat.id.split('@')[0]}
                      </p>
                    </div>

                    <div style={{ marginLeft: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        background: chat.isGroup ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)', 
                        color: chat.isGroup ? 'var(--accent-cyan)' : 'var(--accent-purple)', 
                        padding: '0.1rem 0.4rem', 
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
                        {chat.isGroup ? 'GURUH' : 'SHAXSIY'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
            Raqamlarni xalqaro formatda kiriting (masalan, <code>998901234567</code>). Har bir raqamni vergul yoki yangi qatordan yozing:
          </p>
          <textarea
            className="input-field"
            placeholder="998901234567&#10;998907654321&#10;998931112233"
            value={manualInput}
            onChange={(e) => handleManualInputChange(e.target.value)}
            style={{ 
              flex: 1, 
              fontFamily: 'monospace', 
              resize: 'none', 
              padding: '0.75rem',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              minHeight: '220px'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span>Tahlil qilingan raqamlar:</span>
            <strong style={{ color: 'var(--success)' }}>{manualCount} ta</strong>
          </div>
        </div>
      )}
    </div>
  );
}
