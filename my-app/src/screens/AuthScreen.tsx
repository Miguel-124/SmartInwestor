import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Alert,
  StyleSheet,
} from "react-native";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentSession,
} from "../api/auth";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Footer } from "../components/Footer";
import { globalStyles, colors, sizes } from "../styles/global";

const bgImage = require("../../assets/bg.jpg");
const TTL = 30 * 60 * 1000;

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    },
    []
  );

  useEffect(() => {
    (async () => {
      const session = await getCurrentSession();
      if (session) {
        setUser(session.user);
        scheduleLogout(session.timestamp);
      }
    })();
  }, []);

  const scheduleLogout = (loginTimestamp: number) => {
    const elapsed = Date.now() - loginTimestamp;
    const remaining = TTL - elapsed;
    if (remaining <= 0) {
      handleLogout();
    } else {
      logoutTimer.current = setTimeout(handleLogout, remaining);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setMode("login");
    Alert.alert(
      "Sesja wygasła",
      "Zostałeś wylogowany z powodu braku aktywności."
    );
  };

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      let loggedInUser;
      if (mode === "register") {
        if (!firstName || !lastName || !dob) {
          throw new Error("Wypełnij wszystkie pola rejestracji.");
        }
        if (password !== confirm) {
          throw new Error("Hasła muszą być takie same.");
        }
        loggedInUser = await registerUser({
          firstName,
          lastName,
          dateOfBirth: dob,
          email,
          password,
        });
        Alert.alert(
          "Rejestracja zakończona",
          `Witaj, ${loggedInUser.firstName}!`
        );
      } else {
        loggedInUser = await loginUser(email, password);
        Alert.alert(
          "Zalogowano",
          `Witaj z powrotem, ${loggedInUser.firstName}!`
        );
      }
      setUser(loggedInUser);
      scheduleLogout(Date.now());
      setFirstName("");
      setLastName("");
      setDob("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <Text style={[globalStyles.title, { marginBottom: 16 }]}>
          Witaj, {user.firstName} {user.lastName}!
        </Text>
        <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
          <Text style={globalStyles.buttonText}>Wyloguj</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground source={bgImage} style={globalStyles.background}>
      <View style={globalStyles.overlay} />

      <Header title="SmartInwestor" />

      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Card style={{ width: sizes.screenWidth > 600 ? 500 : "100%" }}>
          <Text style={globalStyles.title}>
            {mode === "login" ? "Logowanie" : "Rejestracja"}
          </Text>

          {mode === "register" && (
            <>
              <TextInput
                style={globalStyles.input}
                placeholder="Imię"
                placeholderTextColor={colors.placeholder}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={globalStyles.input}
                placeholder="Nazwisko"
                placeholderTextColor={colors.placeholder}
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={globalStyles.input}
                placeholder="Data urodzenia (YYYY-MM-DD)"
                placeholderTextColor={colors.placeholder}
                value={dob}
                onChangeText={setDob}
              />
            </>
          )}

          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Hasło"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {mode === "register" && (
            <TextInput
              style={globalStyles.input}
              placeholder="Potwierdź hasło"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={globalStyles.button}
            onPress={onSubmit}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading
                ? "Proszę czekać..."
                : mode === "login"
                ? "Zaloguj się"
                : "Zarejestruj się"}
            </Text>
          </TouchableOpacity>

          <Text
            style={globalStyles.switchText}
            onPress={() => {
              setError(null);
              setMode((m) => (m === "login" ? "register" : "login"));
            }}
          >
            {mode === "login"
              ? "Nie masz konta? Zarejestruj się"
              : "Masz już konto? Zaloguj się"}
          </Text>
        </Card>
      </KeyboardAvoidingView>

      <Footer />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
