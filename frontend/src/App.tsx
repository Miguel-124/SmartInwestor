import { useState, useEffect, useRef } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import logo from './assets/logo_SmartInwestor.jpeg';
import { ChatAdvisor } from './ChatAdvisor';
import { searchAssets } from './services/assets';
import type { Asset } from './services/assets';
import { getPriceForTicker } from './services/prices';

// --- INTERFEJSY ---
interface UserData {
  id: number;
  email: string;
  avatar_url?: string;
}

interface Portfolio {
  id: number;
  name: string;
  is_main?: boolean;
}

interface Position {
  symbol: string;
  quantity: string;
  total_cost: string;
  avg_price: string;
}

interface TransactionRow {
  id: number;
  symbol: string;
  side: string;
  quantity: string;
  price: string;
  executed_at: string;
  portfolios: { id: number; name: string }[];
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
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [portfolioDetail, setPortfolioDetail] = useState<{ name: string; positions: Position[] } | null>(null);
  const [portfolioTransactions, setPortfolioTransactions] = useState<TransactionRow[]>([]);
  const [portfolioDetailLoading, setPortfolioDetailLoading] = useState(false);

  // Stany formularza transakcji (jak w mobilce)
  const [txTicker, setTxTicker] = useState('');
  const [txShares, setTxShares] = useState('');
  const [txPrice, setTxPrice] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [txAssetType, setTxAssetType] = useState<'stock' | 'crypto'>('stock');
  const [txPortfolioIds, setTxPortfolioIds] = useState<number[]>([]);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txAssetSuggestions, setTxAssetSuggestions] = useState<Asset[]>([]);
  const [txSelectedAsset, setTxSelectedAsset] = useState<Asset | null>(null);
  const [txSearching, setTxSearching] = useState(false);
  const txSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- NOWE STANY DLA CZATU AI ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Analiza techniczna (EMA, RSI)
  const [taSymbol, setTaSymbol] = useState('BTC');
  const [taDays, setTaDays] = useState(30);
  const [taLoading, setTaLoading] = useState(false);
  const [taError, setTaError] = useState<string | null>(null);
  const [taData, setTaData] = useState<{
    times: number[];
    prices: number[];
    ema_fast: (number | null)[];
    ema_slow: (number | null)[];
    rsi: (number | null)[];
    signals: (string | null)[];
    symbol: string;
    ema_fast_period: number;
    ema_slow_period: number;
    rsi_period: number;
  } | null>(null);

  // Sentyment z internetu (nagłówki z wyszukiwarki)
  const [sentSymbol, setSentSymbol] = useState('BTC');
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState<string | null>(null);
  const [sentData, setSentData] = useState<{
    symbol: string;
    status: string;
    sentiment_score: number | null;
    sentiment_label: string | null;
    summary: string | null;
    message?: string;
    headlines_count?: number;
    positive_count?: number;
    negative_count?: number;
    neutral_count?: number;
    headlines?: { title: string; sentiment_score: number; sentiment_label: string; source?: string }[];
  } | null>(null);

  // Auto-scroll czatu
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Pobierz portfele po zalogowaniu
  useEffect(() => {
    if (user) fetchPortfolios();
  }, [user]);

  // Wyszukiwanie symboli (debounce 500 ms) – jak w mobilce
  useEffect(() => {
    const q = txTicker.trim();
    if (!q) {
      setTxAssetSuggestions([]);
      return;
    }
    if (txAssetType === 'stock' && q.length < 3) {
      setTxAssetSuggestions([]);
      return;
    }
    if (txSearchTimeoutRef.current) clearTimeout(txSearchTimeoutRef.current);
    txSearchTimeoutRef.current = setTimeout(async () => {
      setTxSearching(true);
      const results = await searchAssets(q, txAssetType);
      setTxAssetSuggestions(results);
      setTxSearching(false);
    }, 500);
    return () => {
      if (txSearchTimeoutRef.current) clearTimeout(txSearchTimeoutRef.current);
    };
  }, [txTicker, txAssetType]);

  const handleSelectAsset = async (asset: Asset) => {
    setTxSelectedAsset(asset);
    setTxTicker(asset.symbol.toUpperCase());
    setTxAssetSuggestions([]);
    const price = asset.current_price ?? await getPriceForTicker(asset.symbol, txAssetType);
    if (price != null) setTxPrice(price.toString());
  };

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
      setNewPortfolioName('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.name) {
        const msg = Array.isArray(err.response.data.name) ? err.response.data.name[0] : err.response.data.name;
        setError(msg);
        setTimeout(() => setError(null), 4000);
      }
    }
  };

  const openPortfolioDetail = async (id: number) => {
    setSelectedPortfolioId(id);
    setPortfolioDetailLoading(true);
    setPortfolioDetail(null);
    setPortfolioTransactions([]);
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [detailRes, txRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/portfolios/${id}/`, { headers }),
        axios.get(`http://127.0.0.1:8000/api/portfolios/${id}/transactions/`, { headers }),
      ]);
      setPortfolioDetail({ name: detailRes.data.name, positions: detailRes.data.positions || [] });
      setPortfolioTransactions(txRes.data || []);
    } catch (e) {
      console.error(e);
      setPortfolioDetail({ name: '?', positions: [] });
    } finally {
      setPortfolioDetailLoading(false);
    }
  };

  const deletePortfolio = async (id: number, isMain?: boolean) => {
    if (isMain) return;
    if (!window.confirm('Usunąć ten portfel? Transakcje w nim pozostaną w portfelu Main.')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/portfolios/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      fetchPortfolios();
      if (selectedPortfolioId === id) setSelectedPortfolioId(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        alert(err.response.data.detail);
      }
    }
  };

  const handleAddTransaction = async () => {
    setTxError(null);
    setTxSuccess(false);
    const quantity = parseFloat(txShares);
    const price = parseFloat(txPrice);
    if (!txTicker.trim() || !quantity || quantity <= 0 || !price || price < 0) {
      setTxError('Wypełnij symbol, ilość (> 0) i cenę.');
      return;
    }
    const executedAt = txDate ? new Date(txDate).toISOString() : new Date().toISOString();
    const body = {
      symbol: txTicker.trim().toUpperCase(),
      side: 'BUY' as const,
      quantity,
      price,
      fee: 0,
      executed_at: executedAt,
      asset_type: txAssetType,
      ...(txPortfolioIds.length > 0 && { portfolio_ids: txPortfolioIds }),
    };
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/transactions/',
        body,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setTxSuccess(true);
      setTxTicker('');
      setTxShares('');
      setTxPrice('');
      setTxDate(new Date().toISOString().slice(0, 16));
      setTxPortfolioIds([]);
      setTxSelectedAsset(null);
      setTxAssetSuggestions([]);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const d = err.response?.data;
        console.error('Transaction POST error', status, d);
        if (status === 401) {
          setTxError('Zaloguj się ponownie.');
          return;
        }
        if (d && typeof d === 'object') {
          const obj = d as Record<string, unknown>;
          const firstArr = (key: string) => Array.isArray(obj[key]) && (obj[key] as string[])[0];
          const msg =
            firstArr('quantity') ||
            firstArr('symbol') ||
            firstArr('price') ||
            firstArr('executed_at') ||
            firstArr('portfolio_ids') ||
            (typeof obj.detail === 'string' && obj.detail) ||
            (typeof obj.error === 'string' && obj.error);
          setTxError(msg || `Błąd ${status ?? ''}: ${JSON.stringify(d)}`);
        } else {
          setTxError(err.message || 'Błąd dodawania transakcji.');
        }
      } else {
        setTxError('Błąd dodawania transakcji.');
      }
    }
  };

  const togglePortfolioForTransaction = (id: number) => {
    setTxPortfolioIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const fetchIndicators = async () => {
    setTaError(null);
    setTaLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(
        'http://127.0.0.1:8000/api/prices/indicators',
        {
          params: { symbol: taSymbol.toUpperCase(), vs: 'usd', days: taDays },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTaData(res.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.detail) {
        setTaError(e.response.data.detail);
      } else {
        setTaError('Nie udało się pobrać wskaźników (np. symbol nieobsługiwany).');
      }
      setTaData(null);
    } finally {
      setTaLoading(false);
    }
  };

  const fetchSentiment = async () => {
    setSentError(null);
    setSentLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(
        'http://127.0.0.1:8000/api/prices/sentiment',
        {
          params: { symbol: sentSymbol.toUpperCase() },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSentData(res.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.detail) {
        setSentError(e.response.data.detail);
      } else if (axios.isAxiosError(e) && e.response?.data?.message) {
        setSentError(e.response.data.message);
      } else {
        setSentError('Nie udało się pobrać sentymentu.');
      }
      setSentData(null);
    } finally {
      setSentLoading(false);
    }
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
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {portfolios.map(p => (
              <li key={p.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => openPortfolioDetail(p.id)}>
                  {p.name}
                  {p.is_main && <span style={{ marginLeft: 8, fontSize: 11, color: '#00FFFF' }}>(Main – wszystkie transakcje)</span>}
                </span>
                {!p.is_main && (
                  <button type="button" onClick={() => deletePortfolio(p.id, p.is_main)} style={styles.secondaryBtn}>Usuń</button>
                )}
              </li>
            ))}
          </ul>
          <input
            value={newPortfolioName}
            onChange={e => setNewPortfolioName(e.target.value)}
            placeholder="Nazwa portfela (nie „Main”)"
            style={styles.input}
          />
          <button onClick={() => addPortfolio(newPortfolioName)} style={styles.primaryBtn}>+ Dodaj</button>
        </div>

        {selectedPortfolioId != null && (
          <div style={{ marginTop: 24, padding: 16, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ color: '#00FFFF', margin: 0 }}>
                {portfolioDetailLoading ? 'Ładowanie…' : portfolioDetail?.name ?? 'Portfel'}
              </h4>
              <button type="button" onClick={() => setSelectedPortfolioId(null)} style={styles.secondaryBtn}>Wróć</button>
            </div>
            {!portfolioDetailLoading && portfolioDetail && (
              <>
                <h5 style={{ color: '#ccc', marginTop: 12, marginBottom: 8 }}>Podsumowanie (aktywa)</h5>
                {portfolioDetail.positions.length === 0 ? (
                  <p style={{ color: '#888', fontSize: 14 }}>Brak pozycji.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
                    {portfolioDetail.positions.map((pos, i) => (
                      <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{pos.symbol}</span>
                        <span>ilość: {pos.quantity} · średnia: {pos.avg_price} · łącznie: {pos.total_cost}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <h5 style={{ color: '#ccc', marginTop: 12, marginBottom: 8 }}>Transakcje</h5>
                {portfolioTransactions.length === 0 ? (
                  <p style={{ color: '#888', fontSize: 14 }}>Brak transakcji.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {portfolioTransactions.map(tx => (
                      <li key={tx.id} style={{ padding: '8px 0', borderBottom: '1px solid #333', fontSize: 14 }}>
                        {tx.side} {tx.symbol} · {tx.quantity} × {tx.price} · {new Date(tx.executed_at).toLocaleString('pl-PL')}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}

        {/* --- DODAWANIE TRANSAKCJI (jak w mobilce: wyszukiwanie symboli, ceny z API, wybór portfela) --- */}
        <div style={{ marginTop: 30 }}>
          <h3>Dodaj transakcję</h3>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Typ aktywa:</span>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
              <input type="radio" checked={txAssetType === 'stock'} onChange={() => { setTxAssetType('stock'); setTxAssetSuggestions([]); setTxSelectedAsset(null); }} />
              Akcje/ETF
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              <input type="radio" checked={txAssetType === 'crypto'} onChange={() => { setTxAssetType('crypto'); setTxAssetSuggestions([]); setTxSelectedAsset(null); }} />
              Krypto
            </label>
          </div>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Symbol – wpisz kilka liter (akcje: min. 3)</span>
            {txSelectedAsset && <span style={{ marginLeft: 8, fontSize: 12, color: '#00ff88' }}>Wybrano: {txSelectedAsset.symbol.toUpperCase()}</span>}
            <input
              value={txTicker}
              onChange={e => { setTxTicker(e.target.value.toUpperCase()); setTxSelectedAsset(null); }}
              placeholder={txAssetType === 'crypto' ? 'np. BTC, ETH' : 'np. AAPL, TSLA'}
              style={styles.input}
            />
            {txSearching && <span style={{ position: 'absolute', right: 12, top: 32, fontSize: 12, color: '#00FFFF' }}>Szukam...</span>}
            {txAssetSuggestions.length > 0 && (
              <ul style={{ position: 'absolute', zIndex: 10, listStyle: 'none', margin: 0, padding: 0, backgroundColor: '#222', border: '1px solid #444', borderRadius: 8, maxHeight: 200, overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>
                {txAssetSuggestions.map(a => (
                  <li
                    key={a.id}
                    onClick={() => handleSelectAsset(a)}
                    style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #333' }}
                  >
                    {a.name} ({a.symbol.toUpperCase()}){a.current_price != null ? ` — ${a.current_price}` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <label style={{ flex: '1 1 120px' }}>
              <span style={{ fontSize: 12, color: '#888' }}>Ilość</span>
              <input
                type="number"
                step="any"
                value={txShares}
                onChange={e => setTxShares(e.target.value)}
                placeholder="Ilość"
                style={styles.input}
              />
            </label>
            <label style={{ flex: '1 1 120px' }}>
              <span style={{ fontSize: 12, color: '#888' }}>Cena (z API po wyborze symbolu)</span>
              <input
                type="number"
                step="any"
                value={txPrice}
                onChange={e => setTxPrice(e.target.value)}
                placeholder="Cena"
                style={styles.input}
              />
            </label>
            <div style={{ flex: '1 1 120px', paddingTop: 20 }}>
              <span style={{ fontSize: 12, color: '#888' }}>Kwota: </span>
              <span style={{ color: '#00FFFF' }}>
                {txShares && txPrice && !isNaN(parseFloat(txShares) * parseFloat(txPrice))
                  ? (parseFloat(txShares) * parseFloat(txPrice)).toFixed(2)
                  : '—'}
              </span>
            </div>
            <label style={{ flex: '1 1 180px' }}>
              <span style={{ fontSize: 12, color: '#888' }}>Data transakcji</span>
              <input
                type="datetime-local"
                value={txDate}
                onChange={e => setTxDate(e.target.value)}
                style={styles.input}
              />
            </label>
          </div>
          {portfolios.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#888' }}>Przypisz do portfeli (opcjonalnie; bez wyboru = ALL):</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {portfolios.map(p => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={txPortfolioIds.includes(p.id)}
                      onChange={() => togglePortfolioForTransaction(p.id)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          {txError && <p style={{ color: '#ff4444', fontSize: 14, marginBottom: 8 }}>{txError}</p>}
          {txSuccess && <p style={{ color: '#00ff88', fontSize: 14, marginBottom: 8 }}>Transakcja dodana.</p>}
          <button onClick={handleAddTransaction} style={styles.primaryBtn}>Dodaj transakcję</button>
        </div>

        {/* --- ANALIZA TECHNICZNA (EMA, RSI) --- */}
        <div style={{ marginTop: 30 }}>
          <h3>Analiza techniczna (EMA, RSI)</h3>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
            Wskaźniki: EMA (trend), RSI (wykupienie &gt;70, wyprzedanie &lt;30). Sygnały kupna/sprzedaży przy przecięciu EMA.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <input
              value={taSymbol}
              onChange={e => setTaSymbol(e.target.value.toUpperCase())}
              placeholder="Symbol (np. BTC, ETH)"
              style={{ ...styles.input, width: 120 }}
            />
            <select
              value={taDays}
              onChange={e => setTaDays(Number(e.target.value))}
              style={{ ...styles.input, width: 100 }}
            >
              <option value={1}>1 dzień</option>
              <option value={2}>2 dni</option>
              <option value={3}>3 dni</option>
              <option value={7}>7 dni</option>
              <option value={14}>14 dni</option>
              <option value={30}>30 dni</option>
              <option value={60}>60 dni</option>
              <option value={90}>90 dni</option>
            </select>
            <button onClick={fetchIndicators} disabled={taLoading} style={styles.primaryBtn}>
              {taLoading ? 'Pobieram…' : 'Pobierz wskaźniki'}
            </button>
          </div>
          {taError && <p style={{ color: '#ff4444', fontSize: 14, marginBottom: 8 }}>{taError}</p>}
          {taData && (
            <>
              <div style={{ marginBottom: 8, fontSize: 14, color: '#00FFFF' }}>
                {taData.symbol} · EMA({taData.ema_fast_period}/{taData.ema_slow_period}) · RSI({taData.rsi_period})
                {(() => {
                  const lastSignal = [...taData.signals].reverse().find(s => s === 'buy' || s === 'sell');
                  const lastRsi = [...taData.rsi].reverse().find(r => r != null);
                  return (
                    <span style={{ marginLeft: 12, color: '#ccc' }}>
                      Ostatni sygnał: {lastSignal === 'buy' ? 'Kupno' : lastSignal === 'sell' ? 'Sprzedaż' : '—'}
                      {lastRsi != null && (
                        <span style={{ marginLeft: 8 }}>
                          RSI: {lastRsi.toFixed(1)}
                          {lastRsi > 70 ? ' (wykupienie)' : lastRsi < 30 ? ' (wyprzedanie)' : ''}
                        </span>
                      )}
                    </span>
                  );
                })()}
              </div>
              <div style={{ width: '100%', maxWidth: 900, height: 280, marginBottom: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={taData.times.map((t, i) => ({
                      time: new Date(t).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
                      price: taData.prices[i],
                      ema_fast: taData.ema_fast[i] ?? undefined,
                      ema_slow: taData.ema_slow[i] ?? undefined,
                    }))}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" tick={{ fill: '#888', fontSize: 11 }} />
                    <YAxis yAxisId="price" tick={{ fill: '#888', fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} labelStyle={{ color: '#00FFFF' }} />
                    <Legend />
                    <Line yAxisId="price" type="monotone" dataKey="price" name="Cena" stroke="#00FFFF" dot={false} strokeWidth={2} />
                    <Line yAxisId="price" type="monotone" dataKey="ema_fast" name={`EMA ${taData.ema_fast_period}`} stroke="#00ff88" dot={false} strokeWidth={1.5} />
                    <Line yAxisId="price" type="monotone" dataKey="ema_slow" name={`EMA ${taData.ema_slow_period}`} stroke="#ffaa00" dot={false} strokeWidth={1.5} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ width: '100%', maxWidth: 900, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={taData.times.map((t, i) => ({
                      time: new Date(t).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
                      rsi: taData.rsi[i] ?? undefined,
                    }))}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  >
                    <ReferenceArea yAxisId="rsi" y1={70} y2={100} fill="#ff444420" strokeOpacity={0} />
                    <ReferenceArea yAxisId="rsi" y1={0} y2={30} fill="#44ff4420" strokeOpacity={0} />
                    <ReferenceLine yAxisId="rsi" y={70} stroke="#ff4444" strokeDasharray="3 3" />
                    <ReferenceLine yAxisId="rsi" y={30} stroke="#44ff44" strokeDasharray="3 3" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" tick={{ fill: '#888', fontSize: 11 }} />
                    <YAxis yAxisId="rsi" domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                    <Legend />
                    <Line yAxisId="rsi" type="monotone" dataKey="rsi" name="RSI" stroke="#00FFFF" dot={false} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* --- SENTYMENT Z INTERNETU --- */}
        <div style={{ marginTop: 30 }}>
          <h3>Sentyment z internetu</h3>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
            Analiza nagłówków z wyszukiwarki (Google News) – pozytywne / negatywne / neutralne.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <input
              value={sentSymbol}
              onChange={e => setSentSymbol(e.target.value.toUpperCase())}
              placeholder="Symbol (np. BTC, AAPL)"
              style={{ ...styles.input, width: 140 }}
            />
            <button onClick={fetchSentiment} disabled={sentLoading} style={styles.primaryBtn}>
              {sentLoading ? 'Pobieram…' : 'Pobierz sentyment'}
            </button>
          </div>
          {sentError && <p style={{ color: '#ff4444', fontSize: 14, marginBottom: 8 }}>{sentError}</p>}
          {sentData && sentData.status === 'ok' && (
            <div style={{ padding: 16, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 12, maxWidth: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ color: '#00FFFF', fontWeight: 'bold' }}>{sentData.symbol}</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  backgroundColor: sentData.sentiment_label === 'positive' ? '#1a472a' : sentData.sentiment_label === 'negative' ? '#4a1a1a' : '#333',
                  color: sentData.sentiment_label === 'positive' ? '#00ff88' : sentData.sentiment_label === 'negative' ? '#ff6666' : '#ccc',
                }}>
                  {sentData.sentiment_label === 'positive' ? 'Pozytywny' : sentData.sentiment_label === 'negative' ? 'Negatywny' : 'Neutralny'}
                </span>
                {sentData.sentiment_score != null && (
                  <span style={{ color: '#888', fontSize: 14 }}>Score: {sentData.sentiment_score.toFixed(2)} (-1 … 1)</span>
                )}
                {sentData.headlines_count != null && (
                  <span style={{ color: '#888', fontSize: 13 }}>
                    Pozytywne: {sentData.positive_count ?? 0} · Negatywne: {sentData.negative_count ?? 0} · Neutralne: {sentData.neutral_count ?? 0}
                  </span>
                )}
              </div>
              {sentData.summary && <p style={{ color: '#ccc', fontSize: 14, marginBottom: 12 }}>{sentData.summary}</p>}
              {sentData.headlines && sentData.headlines.length > 0 && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: 'pointer', color: '#00FFFF' }}>Nagłówki ({sentData.headlines.length})</summary>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
                    {sentData.headlines.slice(0, 15).map((h, i) => (
                      <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid #333', fontSize: 13 }}>
                        <span style={{
                          marginRight: 8,
                          color: h.sentiment_label === 'positive' ? '#00ff88' : h.sentiment_label === 'negative' ? '#ff6666' : '#888',
                        }}>
                          {h.sentiment_label === 'positive' ? '↑' : h.sentiment_label === 'negative' ? '↓' : '−'}
                        </span>
                        {h.title}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
          {sentData && sentData.status !== 'ok' && sentData.message != null && (
            <p style={{ color: '#f0ad4e', fontSize: 14 }}>{sentData.message}</p>
          )}
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
  primaryBtn: { padding: '8px 16px', backgroundColor: '#00FFFF', border: 'none', color: 'black', borderRadius: '5px', cursor: 'pointer', margin: '5px' },
  secondaryBtn: { padding: '8px 16px', backgroundColor: '#333', border: '1px solid #444', color: '#fff', borderRadius: '5px', cursor: 'pointer' },
  linkBtn: { background: 'none', border: 'none', color: '#00FAAF', textDecoration: 'underline', cursor: 'pointer', marginTop: '10px' },
  card: { padding: '15px', backgroundColor: '#222', border: '1px solid #333', marginBottom: '10px', borderRadius: '8px' },
  
  // Style Czatu
  chatWrapper: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 },
  chatFab: { width: '60px', height: '60px', borderRadius: '30px', backgroundColor: '#00FAFF', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,255,255,0.3)' },
  chatContainer: { position: 'absolute', bottom: '70px', right: '0', width: '320px', height: '450px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 25px rgba(0,0,0,0.5)', overflow: 'hidden' },
  chatHeader: { padding: '15px', backgroundColor: '#252525', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', color: '#00FFFF', fontWeight: 'bold' },
  chatMessages: { flex: 1, padding: '15px', overflowY: 'auto' },
  chatInputArea: { padding: '10px', borderTop: '1px solid #333', display: 'flex' },
  chatInput: { flex: 1, backgroundColor: '#333', border: 'none', color: '#fff', padding: '8px', borderRadius: '5px', marginRight: '5px' },
  sendBtn: { backgroundColor: '#00FFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' },
  closeBtn: { background: 'none', border: 'none', color: '#fafafa', fontSize: '20px', cursor: 'pointer' }
} as const;