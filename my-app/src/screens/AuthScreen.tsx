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
import {
  validateRegistration,
  RegistrationData,
} from "../utils/checkValidation";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Footer } from "../components/Footer";
import { globalStyles, colors, sizes } from "../styles/global";

const DateTimePicker =
  Platform.OS !== "web"
    ? require("@react-native-community/datetimepicker").default
    : null;

const bgImage = require("../../assets/bg.jpg");
const TTL = 30 * 60 * 1000;

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dobString, setDobString] = useState("");
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

  const scheduleLogout = (loginTs: number) => {
    const elapsed = Date.now() - loginTs;
    const remaining = TTL - elapsed;
    if (remaining <= 0) return handleLogout();
    logoutTimer.current = setTimeout(handleLogout, remaining);
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
      let birthDate: Date | null;
      if (Platform.OS === "web") {
        birthDate = dobString ? new Date(dobString) : null;
      } else {
        birthDate = dobDate;
      }

      if (mode === "register") {
        const msg = validateRegistration({
          firstName,
          lastName,
          email,
          password,
          confirm,
          dobDate: birthDate,
        } as RegistrationData);
        if (msg) throw new Error(msg);

        const newUser = await registerUser({
          firstName,
          lastName,
          dateOfBirth: birthDate!.toISOString().slice(0, 10),
          email,
          password,
        });
        setUser(newUser);
        Alert.alert("Rejestracja zakończona", `Witaj, ${newUser.firstName}!`);
      } else {
        const logged = await loginUser(email, password);
        setUser(logged);
        Alert.alert("Zalogowano", `Witaj z powrotem, ${logged.firstName}!`);
      }

      scheduleLogout(Date.now());
      setFirstName("");
      setLastName("");
      setDobDate(null);
      setDobString("");
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

              {Platform.OS === "web" ? (
                <View style={{ width: "100%", marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 4,
                      color: colors.text,
                    }}
                  >
                    Data urodzenia
                  </Text>
                  <View style={[globalStyles.input, { padding: 0 }]}>
                    <input
                      className="dobInput"
                      type="date"
                      value={dobString}
                      onChange={(e) => setDobString(e.target.value)}
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: 12,
                        fontSize: 16,
                        border: "none",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={[globalStyles.input, { justifyContent: "center" }]}
                    onPress={() => setShowDobPicker(true)}
                  >
                    <Text
                      style={{
                        color: dobDate ? colors.text : colors.placeholder,
                      }}
                    >
                      {dobDate
                        ? dobDate.toISOString().slice(0, 10)
                        : "Data urodzenia"}
                    </Text>
                  </TouchableOpacity>
                  {showDobPicker && DateTimePicker && (
                    <DateTimePicker
                      value={dobDate || new Date(2000, 0, 1)}
                      mode="date"
                      display="default"
                      onChange={(_e: any, d?: Date) => {
                        setShowDobPicker(false);
                        if (d) setDobDate(d);
                      }}
                    />
                  )}
                </>
              )}
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
