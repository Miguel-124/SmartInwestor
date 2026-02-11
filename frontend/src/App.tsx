import { useState, useEffect, useRef } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import logo from './assets/logo_SmartInwestor.jpeg';
import { ChatAdvisor } from './ChatAdvisor';

// --- INTERFEJSY ---
interface UserData {
  id: number;
  email: string;
  avatar_url?: string;
}

interface Portfolio {
  id: number;
  name: string;
}

interface AuthResponse {
  access:  string;
  refresh: string;
  user:    UserData;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

type Mode = 'login' | 'register';

export default function App() {
  const [mode, setMode] = useState<Mode>('login');
  const [user, setUser] = useState<UserData | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Stany Portfela
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  // --- NOWE STANY DLA CZATU AI ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll czatu
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuccess = (data: AuthResponse) => {
    const { access, refresh, user: u } = data;
    setUser(u);
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  };

  // --- LOGIKA CZATU AI ---
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        'http://127.0.0.1:8000/api/ai/chat/', 
        { query: userMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage: Message = { role: 'ai', content: res.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Błąd połączenia z doradcą AI.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- ISTNIEJĄCE FUNKCJE (Auth/Portfolio) ---
  const handleRegister = async () => {
    setError(null);
    try {
      const res = await axios.post<AuthResponse>('http://127.0.0.1:8000/api/auth/register/', { email, password });
      handleSuccess(res.data);
    } catch { setError('Błąd rejestracji'); }
  };

  const handleLogin = async () => {
    setError(null);
    try {
      const res = await axios.post<AuthResponse>('http://127.0.0.1:8000/api/auth/login/', { email, password });
      handleSuccess(res.data);
    } catch { setError('Nieprawidłowy email lub hasło'); }
  };

  const handleGoogle = async (resp: CredentialResponse) => {
    const id_token = resp.credential;
    if (!id_token) return;
    try {
      const res = await axios.post<AuthResponse>('http://127.0.0.1:8000/api/auth/google/', { id_token });
      handleSuccess(res.data);
    } catch { setError('Logowanie przez Google nie powiodło się'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setMessages([]);
  };

  const fetchPortfolios = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/portfolios/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setPortfolios(res.data);
    } catch (err) { console.error(err); }
  };

  const addPortfolio = async (name: string) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/portfolios/", { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      fetchPortfolios();
    } catch (err) { console.error(err); }
  };

  // --- RENDEROWANIE ---

  // Widok po zalogowaniu
  if (user) {
    return (
      <div style={{ padding: 20, backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
        <img src={logo} alt="SmartInwestor Logo" style={{ width: 100, borderRadius: '10px' }} />
        <h2>Panel Inwestora: {user.email}</h2>
        
        <button onClick={handleLogout} style={styles.secondaryBtn}>Wyloguj</button>

        <div style={{ marginTop: 30 }}>
          <h3>Twoje Portfele</h3>
          <button onClick={fetchPortfolios} style={styles.primaryBtn}>Odśwież dane</button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {portfolios.map(p => (
              <li key={p.id} style={styles.card}>{p.name}</li>
            ))}
          </ul>
          <input
            value={newPortfolioName}
            onChange={e => setNewPortfolioName(e.target.value)}
            placeholder="Nazwa portfela"
            style={styles.input}
          />
          <button onClick={() => addPortfolio(newPortfolioName)} style={styles.primaryBtn}>+ Dodaj</button>
        </div>

        {/* --- KOMPONENT CZATU AI (BĄBELEK) --- */}
        <div style={styles.chatWrapper}>
          {isChatOpen && (
            <div style={styles.chatContainer}>
              <div style={styles.chatHeader}>
                <span>SmartAdvisor AI</span>
                <button onClick={() => setIsChatOpen(false)} style={styles.closeBtn}>×</button>
              </div>
              <div style={styles.chatMessages}>
                {messages.length === 0 && <p style={{fontSize: '12px', color: '#888'}}>Zadaj pytanie dotyczące Twoich inwestycji...</p>}
                {messages.map((m, i) => (
                  <div key={i} style={{ 
                    textAlign: m.role === 'user' ? 'right' : 'left',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: m.role === 'user' ? '#00FFFF' : '#333',
                      color: m.role === 'user' ? '#000' : '#fff',
                      fontSize: '14px',
                      maxWidth: '80%'
                    }}>
                      {m.content}
                    </span>
                  </div>
                ))}
                {isAiLoading && <p style={{fontSize: '12px', color: '#00FFFF'}}>AI analizuje Twój portfel...</p>}
                <div ref={chatEndRef} />
              </div>
              <div style={styles.chatInputArea}>
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="W co zainwestować?"
                  style={styles.chatInput}
                />
                <button onClick={handleSendMessage} style={styles.sendBtn}>➤</button>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)} 
            style={styles.chatFab}
          >
            {isChatOpen ? '✕' : '💬'}
            <ChatAdvisor />
          </button>
        </div>
      </div>
    );
  }

  // Widok logowania (niezmieniony styl)
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <div style={{ padding: 40, maxWidth: 400, margin: 'auto', textAlign: 'center', backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
        <img src={logo} alt="SmartInwestor Logo" style={{ width: 120, marginBottom: 20, borderRadius: '15px' }} />
        <h2 style={{color: '#00FFFF'}}>{mode === 'login' ? 'Logowanie' : 'Rejestracja'}</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Hasło" value={password} onChange={e => setPasswordInput(e.target.value)} style={styles.input} />
        <button onClick={mode === 'login' ? handleLogin : handleRegister} style={styles.mainBtn}>
          {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
        </button>
        <div style={{ margin: '20px 0' }}>— lub —</div>
        <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Błąd Google')} />
        {error && <p style={{ color: '#ff4444', marginTop: 16 }}>{error}</p>}
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={styles.linkBtn}>
          {mode === 'login' ? 'Stwórz konto' : 'Masz już konto? Zaloguj'}
        </button>
      </div>
    </GoogleOAuthProvider>
  );
}

// --- STYLE ---
const styles = {
  input: { width: '100%', padding: '12px', marginBottom: '10px', backgroundColor: '#222', border: '1px solid #444', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' },
  mainBtn: { width: '100%', padding: '12px', backgroundColor: '#00FFFF', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' },
  primaryBtn: { padding: '8px 16px', backgroundColor: '#00FFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' },
  secondaryBtn: { padding: '8px 16px', backgroundColor: '#333', border: '1px solid #444', color: '#fff', borderRadius: '5px', cursor: 'pointer' },
  linkBtn: { background: 'none', border: 'none', color: '#00FFFF', textDecoration: 'underline', cursor: 'pointer', marginTop: '10px' },
  card: { padding: '15px', backgroundColor: '#222', border: '1px solid #333', marginBottom: '10px', borderRadius: '8px' },
  
  // Style Czatu
  chatWrapper: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 },
  chatFab: { width: '60px', height: '60px', borderRadius: '30px', backgroundColor: '#00FFFF', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,255,255,0.3)' },
  chatContainer: { position: 'absolute', bottom: '70px', right: '0', width: '320px', height: '450px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 25px rgba(0,0,0,0.5)', overflow: 'hidden' },
  chatHeader: { padding: '15px', backgroundColor: '#252525', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', color: '#00FFFF', fontWeight: 'bold' },
  chatMessages: { flex: 1, padding: '15px', overflowY: 'auto' },
  chatInputArea: { padding: '10px', borderTop: '1px solid #333', display: 'flex' },
  chatInput: { flex: 1, backgroundColor: '#333', border: 'none', color: '#fff', padding: '8px', borderRadius: '5px', marginRight: '5px' },
  sendBtn: { backgroundColor: '#00FFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }
} as const;