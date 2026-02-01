import React, { useMemo } from "react";
import { View, Text, TextInput } from "react-native";
import { usePortfolioQuery } from "../features/portfolio/hooks/usePortfolioQuery";
import HoldingsTable from "../features/portfolio/components/HoldingsTable";
import { usePortfolioUI } from "../features/portfolio/store";

import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/appCore/navigation"; // lub "../appCore/navigation"

export default function PortfolioScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Portfolio">>(); // analogicznie dla Metrics/Advice
  const portfolioId = route.params?.id ?? "demo";

  const { data: portfolio } = usePortfolioQuery(portfolioId);
  const { filters, setFilter, reset } = usePortfolioUI();

  const rows = useMemo(() => {
    const src = portfolio?.positions ?? [];
    return src.filter((p) => {
      const s = filters.search.trim().toLowerCase();
      const byText =
        !s ||
        p.symbol.toLowerCase().includes(s) ||
        p.name.toLowerCase().includes(s);
      const bySector =
        !filters.sector ||
        (p.sector ?? "").toLowerCase() === filters.sector.toLowerCase();
      const w = p.weight * 100;
      const byMin = filters.minWeight == null || w >= filters.minWeight;
      const byMax = filters.maxWeight == null || w <= filters.maxWeight;
      return byText && bySector && byMin && byMax;
    });
  }, [portfolio, filters]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>Portfel</Text>

      {/* Pasek filtrów */}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TextInput
          placeholder="Szukaj (ticker/nazwa)"
          value={filters.search}
          onChangeText={(t) => setFilter("search", t)}
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 8,
            borderRadius: 10,
            minWidth: 220,
          }}
        />
        <TextInput
          placeholder="Min %"
          value={filters.minWeight?.toString() ?? ""}
          onChangeText={(t) => setFilter("minWeight", t ? Number(t) : null)}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 8,
            borderRadius: 10,
            width: 90,
          }}
        />
        <TextInput
          placeholder="Max %"
          value={filters.maxWeight?.toString() ?? ""}
          onChangeText={(t) => setFilter("maxWeight", t ? Number(t) : null)}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 8,
            borderRadius: 10,
            width: 90,
          }}
        />
        <Text onPress={reset} style={{ marginLeft: 8, color: "#2563eb" }}>
          Wyczyść
        </Text>
      </View>
      {/* Fallback – szybki render listy, żeby sprawdzić dane */}
      {(rows ?? []).length === 0 ? (
        <Text style={{ opacity: 0.6, marginTop: 16 }}>
          Brak pozycji po zastosowaniu filtrów.
        </Text>
      ) : (
        <View
          style={{
            marginTop: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 12,
          }}
        >
          {(rows ?? []).map((r) => (
            <View
              key={r.id}
              style={{
                flexDirection: "row",
                padding: 8,
                borderBottomWidth: 1,
                borderColor: "#f3f4f6",
              }}
            >
              <Text style={{ width: 100, fontWeight: "600" }}>{r.symbol}</Text>
              <Text style={{ flex: 1 }}>{r.name}</Text>
              <Text style={{ width: 80, textAlign: "right" }}>{r.qty}</Text>
              <Text style={{ width: 120, textAlign: "right" }}>
                {new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  maximumFractionDigits: 0,
                }).format(r.value)}
              </Text>
              <Text style={{ width: 80, textAlign: "right" }}>
                {(r.weight * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      )}

      <HoldingsTable rows={rows as any} />
    </View>
  );
}
