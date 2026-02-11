import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export const ChatAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        'http://127.0.0.1:8000/ai/chat/', 
        { query: userMsg.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Błąd połączenia z doradcą.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={chatStyles.wrapper}>
      {isOpen && (
        <div style={chatStyles.container}>
          <div style={chatStyles.header}>
            <span>SmartInwestor AI</span>
            <button onClick={() => setIsOpen(false)} style={chatStyles.closeBtn}>×</button>
          </div>
          <div style={chatStyles.messageArea}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', marginBottom: '10px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '10px',
                  borderRadius: '12px',
                  backgroundColor: m.role === 'user' ? '#00FFFF' : '#333',
                  color: m.role === 'user' ? '#000' : '#fff',
                  maxWidth: '85%',
                  fontSize: '14px'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div style={{ color: '#00FFFF', fontSize: '12px' }}>AI analizuje dane...</div>}
            <div ref={scrollRef} />
          </div>
          <div style={chatStyles.inputArea}>
            <input 
              style={chatStyles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Zapytaj o portfel..."
            />
            <button onClick={handleSend} style={chatStyles.sendBtn}>➤</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} style={chatStyles.fab}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

const chatStyles = {
  wrapper: { position: 'fixed' as const, bottom: '30px', right: '30px', zIndex: 9999 },
  fab: { width: '60px', height: '60px', borderRadius: '30px', backgroundColor: '#00FFFF', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,255,255,0.4)' },
  container: { position: 'absolute' as const, bottom: '80px', right: '0', width: '350px', height: '500px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '15px', display: 'flex', flexDirection: 'column' as const, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' },
  header: { padding: '15px', backgroundColor: '#252525', display: 'flex', justifyContent: 'space-between', color: '#00FFFF', fontWeight: 'bold' as const, borderBottom: '1px solid #333' },
  messageArea: { flex: 1, padding: '15px', overflowY: 'auto' as const },
  inputArea: { padding: '10px', borderTop: '1px solid #333', display: 'flex', gap: '5px' },
  input: { flex: 1, backgroundColor: '#333', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px' },
  sendBtn: { backgroundColor: '#00FFFF', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer' },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }
};