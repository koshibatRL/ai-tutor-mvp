import React, { useState } from 'react';

const ChatUI = ({ hint }) => {
  const [messages, setMessages] = useState([{ role: 'system', content: hint }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, newMessage] })
    });
    const data = await response.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    setInput('');
  };

  return (
    <div className="chat-pane">
      <div className="message-history">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatUI;