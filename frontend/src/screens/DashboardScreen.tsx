import React from "react";
import { View } from "react-native";
import AppShell from "../components/layout/AppShell";
import KpiCard from "../components/data/KpiCard";
import AllocationPieChart from "../features/portfolio/components/AllocationPieChart.web";
import PortfolioLineChart from "../features/portfolio/components/PortfolioLineChart.web";

export default function DashboardPage() {
  // Placeholder dane – do podmiany na query
  const pie = [
    { label: "Akcje", value: 55 },
    { label: "Obligacje", value: 25 },
    { label: "Gotówka", value: 20 },
  ];
  const line = Array.from({ length: 30 }, (_, i) => ({
    t: `D${i + 1}`,
    v: 100 + i * 2 + Math.sin(i) * 5,
  }));

  return (
    <AppShell>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <KpiCard label="Wartość portfela" value="123 456 PLN" />
          <KpiCard label="Dzienny P/L" value="+1 234 PLN" />
          <KpiCard label="YTD" value="+12.4%" />
        </View>
        {/* Wykresy (web): */}
        {/* @ts-ignore – komponent .web.tsx jest tylko w web-buildzie */}
        <AllocationPieChart data={pie} />
        {/* @ts-ignore */}
        <PortfolioLineChart data={line} />
      </View>
    </AppShell>
  );
}
