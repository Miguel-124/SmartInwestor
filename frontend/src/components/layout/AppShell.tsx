import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const nav = useNavigation<any>();
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.brand}>SmartInwestor</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
            <Text>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate("Settings")}>
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  brand: { fontSize: 18, fontWeight: "700" },
  content: { flex: 1, padding: 16 },
});
