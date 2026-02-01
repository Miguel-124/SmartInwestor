import React from "react";
import { View, Text } from "react-native";
import { useAdviceQuery } from "../features/portfolio/hooks/useAdviceQuery";
import RecommendationCard from "../features/advice/RecommendationCard";

import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/appCore/navigation"; // lub "../appCore/navigation"

export default function AdvicePage() {
  const route = useRoute<RouteProp<RootStackParamList, "Advice">>(); // analogicznie dla Metrics/Advice
  const id = route.params?.id ?? "demo";

  const { data } = useAdviceQuery(id);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>
        Rekomendacje alokacyjne
      </Text>
      {(data?.recommendations ?? []).map((r) => (
        <RecommendationCard key={r.id} type={r.type} message={r.message} />
      ))}
    </View>
  );
}
