import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

interface UserData {
  id: number;
  email: string;
  username: string;
  avatar_url: string;
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const id_token = credentialResponse.credential;

    if (!id_token) {
      console.error("No ID token received");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
        id_token,
      });

      const { access, refresh, user } = res.data;
      setUser(user);

      // opcjonalnie: zapisz tokeny do localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      console.log("Zalogowano pomyślnie", user);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <div style={{ padding: 40 }}>
        <h2>Google Login Test</h2>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Google login failed")}
        />
        {user && (
          <div style={{ marginTop: 20 }}>
            <p>Zalogowano jako: <strong>{user.email}</strong></p>
            <img src={user.avatar_url} alt="avatar" width="100" />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;