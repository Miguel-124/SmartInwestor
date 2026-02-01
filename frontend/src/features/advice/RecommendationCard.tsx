import React from "react";
import { View, Text } from "react-native";

export default function RecommendationCard({
  type,
  message,
}: {
  type: string;
  message: string;
}) {
  const color =
    type === "Risk" ? "#ef4444" : type === "Rebalance" ? "#2563eb" : "#059669";
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Text style={{ fontWeight: "700", color }}>{type}</Text>
      <Text>{message}</Text>
    </View>
  );
}
