import { StatusBar } from "expo-status-bar";
import React from "react";
import AuthScreen from "./src/screens/AuthScreen";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthScreen />
    </>
  );
}
