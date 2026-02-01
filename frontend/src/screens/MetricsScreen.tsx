import React from "react";
import { View, Text } from "react-native";
import { useMetricsQuery } from "../features/portfolio/hooks/useMetricsQuery";
import { useCorrQuery } from "../features/portfolio/hooks/useCorrQuery";
import CorrelationHeatmap from "../features/metrics/CorrelationHeatmap.web";
import PortfolioLineChart from "../features/portfolio/components/PortfolioLineChart.web";

import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/appCore/navigation"; // lub "../appCore/navigation"

export default function MetricsPage() {
  const route = useRoute<RouteProp<RootStackParamList, "Metrics">>(); // analogicznie dla Metrics/Advice
  const id = route.params?.id ?? "demo";

  const { data: m } = useMetricsQuery(id);
  const { data: c } = useCorrQuery(id);

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>Wskaźniki</Text>
      <View
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Equity curve</Text>
        {/* <PortfolioLineChart data={m?.equityCurve ?? []} /> */}
        <View
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Krzywa portfela
          </Text>
          <View style={{ height: 300 }}>
            <PortfolioLineChart data={m?.equityCurve ?? []} />
          </View>
        </View>
      </View>
      <View
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>
          Macierz korelacji
        </Text>
        <CorrelationHeatmap
          labels={c?.labels ?? ["A", "B", "C"]}
          matrix={
            c?.matrix ?? [
              [1, 0.3, -0.2],
              [0.3, 1, 0.1],
              [-0.2, 0.1, 1],
            ]
          }
        />
      </View>
    </View>
  );
}
