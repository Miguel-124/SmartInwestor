import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import { globalStyles, colors, sizes } from "../styles/global";

const bgImage = require("../../assets/bg.jpg");

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // const tabs = [
  //   { label: "Dashboard", onPress: () => {} },
  //   { label: "Portfel", onPress: () => {} },
  //   { label: "Analiza", onPress: () => {} },
  // ];

  return (
    <ImageBackground source={bgImage} style={globalStyles.background}>
      <View style={globalStyles.overlay} />

      <Header title="SmartInwestor" isLoggedIn={false} />

      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Card style={{ width: sizes.screenWidth > 600 ? 500 : "100%" }}>
          <Text style={globalStyles.title}>
            {mode === "login" ? "Logowanie" : "Rejestracja"}
          </Text>

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

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              /* tutaj logika logowania irejestracji */
            }}
          >
            <Text style={globalStyles.buttonText}>
              {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
            </Text>
          </TouchableOpacity>

          <Text
            style={globalStyles.switchText}
            onPress={() => setMode(mode === "login" ? "register" : "login")}
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
