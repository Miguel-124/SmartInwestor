import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import logo from 'assets/images/logo_SmartInwestor.jpeg';

interface UserData {
  id: number;
  email: string;
  avatar_url?: string;
}

interface AuthResponse {
  access:  string;
  refresh: string;
  user:    UserData;
}

type Mode = 'login' | 'register';

export default function App() {
  const [mode, setMode] = useState<Mode>('login');
  const [user, setUser] = useState<UserData | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // wspólna funkcja do ustawiania usera i tokenów
  const handleSuccess = (data: AuthResponse) => {
    const { access, refresh, user: u } = data;
    setUser(u);
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  };

  // 1) Rejestracja e-mail
  const handleRegister = async () => {
    setError(null);
    try {
      const res = await axios.post<AuthResponse>(
        'http://127.0.0.1:8000/api/auth/register/',
        { email, password }
      );
      handleSuccess(res.data);
    } catch {
      setError('Błąd rejestracji');
    }
  };

  // 2) Logowanie e-mail
  const handleLogin = async () => {
    setError(null);
    try {
      const res = await axios.post<AuthResponse>(
        'http://127.0.0.1:8000/api/auth/login/',
        { email, password }
      );
      handleSuccess(res.data);
    } catch {
      setError('Nieprawidłowy email lub hasło');
    }
  };

  // 3) Google OAuth login (i rejestracja)
  const handleGoogle = async (resp: CredentialResponse) => {
    const id_token = resp.credential;
    if (!id_token) {
      setError('Brak tokenu Google');
      return;
    }
    setError(null);
    try {
      const res = await axios.post<AuthResponse>(
        'http://127.0.0.1:8000/api/auth/google/',
        { id_token }
      );
      handleSuccess(res.data);
    } catch {
      setError('Logowanie przez Google nie powiodło się');
    }
  };

  // Po zalogowaniu/rejestracji – pokazujemy dane
  if (user) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
        <img src={logo} alt="SmartInwestor Logo" style={{ width: 120, marginBottom: 20 }} />
        <h2>Zalogowany jako:</h2>
        <p><strong>{user.email}</strong></p>
        {user.avatar_url && (
          <img src={user.avatar_url} alt="avatar" width={100} />
        )}
      </div>
    );
  }

  // UI formularza
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <div style={{ padding: 40, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
        <img src={logo} alt="SmartInwestor Logo" style={{ width: 120, marginBottom: 20 }} />
        <h2>{mode === 'login' ? 'Logowanie' : 'Rejestracja'}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />

        <button
          onClick={mode === 'login' ? handleLogin : handleRegister}
          style={{ width: '100%', padding: 10 }}
        >
          {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
        </button>

        <p style={{ textAlign: 'center', margin: '16px 0' }}>— lub —</p>

        <GoogleLogin
          onSuccess={handleGoogle}
          onError={() => setError('Logowanie przez Google błędne')}
        />

        {error && (
          <p style={{ color: 'red', marginTop: 16 }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: 20 }}>
          {mode === 'login' ? 'Nie masz konta? ' : 'Masz już konto? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
            style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mode === 'login' ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
