import React from 'react';
import ChatSelector from './ChatSelector';
import MessageComposer from './MessageComposer';

export default function BulkChatPanel({ 
  chats, 
  selectedChats, 
  setSelectedChats, 
  handleSend, 
  handleCancel, 
  isSending, 
  isConnected,
  progress,
  results,
  logs
}) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
      gap: '2rem',
      alignItems: 'start'
    }}>
      {/* Left Column: Chat Selector */}
      <div style={{ gridColumn: 'span 1' }}>
        <ChatSelector 
          chats={chats} 
          selectedChats={selectedChats} 
          onSelectionChange={setSelectedChats} 
        />
      </div>

      {/* Right Column: Editor */}
      <div style={{ gridColumn: 'span 1' }}>
        <MessageComposer 
          selectedCount={selectedChats.length} 
          onSend={handleSend} 
          onCancel={handleCancel}
          isSending={isSending}
          isConnected={isConnected}
          progress={progress}
          results={results}
        />
      </div>
    </div>
  );
}
