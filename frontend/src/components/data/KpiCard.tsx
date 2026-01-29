import React from "react";
import { View, Text } from "react-native";

export default function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View
      style={{
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Text style={{ fontSize: 12, opacity: 0.7 }}>{label}</Text>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{value}</Text>
      {hint ? <Text style={{ fontSize: 12, opacity: 0.7 }}>{hint}</Text> : null}
    </View>
  );
}
