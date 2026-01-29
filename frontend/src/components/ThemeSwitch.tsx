import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@/theme";

export function ThemeSwitch() {
  const { mode, setMode } = useTheme();
  const next = mode === "dark" ? "light" : "dark";

  return (
    <Pressable
      onPress={() => setMode(next)}
      accessibilityRole="button"
      accessibilityLabel={`Przełącz motyw, teraz: ${mode}`}
      className="px-3 py-2 rounded-xl"
    >
      <Text>{mode === "dark" ? "🌙 dark" : "🔆 light"}</Text>
    </Pressable>
  );
}
