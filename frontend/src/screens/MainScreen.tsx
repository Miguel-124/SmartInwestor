import React, { FC, useMemo } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";

// layout / shared (u Ciebie to SĄ named exports)
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { SummaryCard } from "../components/data/SummaryCard";

// WYKRESY – wariant „features + .web.tsx”
import AllocationPieChart from "../features/portfolio/components/AllocationPieChart.web";
import PortfolioLineChart from "../features/portfolio/components/PortfolioLineChart.web";
// Jeśli jednak trzymasz je w src/components/, zmień powyższe na:
// import AllocationPieChart from "../components/AllocationPieChart";
// import PortfolioLineChart from "../components/PortfolioLineChart";

// typ + hooki z feature’ów
import type { Portfolio } from "../models/Portfolio";
import { usePortfolioQuery } from "../features/portfolio/hooks/usePortfolioQuery";
import { useMetricsQuery } from "../features/portfolio/hooks/useMetricsQuery";

const MainScreen: FC = () => {
  // TODO: pobierz z nawigacji / stanu; na start stałe „demo”
  const portfolioId = "demo";

  const {
    data: portfolio,
    isLoading: pLoading,
    error: pError,
  } = usePortfolioQuery(portfolioId);

  const {
    data: metrics,
    isLoading: mLoading,
    error: mError,
  } = useMetricsQuery(portfolioId);

  const loading = pLoading || mLoading;
  const error = pError || mError;

  // KPI
  const totalValue = portfolio?.totalValue ?? 0;
  const dayPnl = portfolio?.dayPnl ?? 0;
  const ytdPnl = portfolio?.ytdPnl ?? 0;

  // wykres linii (equity curve)
  const lineData = metrics?.equityCurve ?? [];

  // wykres koła (alokacja sektor/klasa)
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    (portfolio?.positions ?? []).forEach((pos) => {
      const key = pos.sector ?? "Inne";
      map.set(key, (map.get(key) ?? 0) + pos.weight * 100);
    });
    return Array.from(map, ([label, value]) => ({ label, value }));
  }, [portfolio]);

  // tabela (jeśli podłączysz HoldingsTable)
  type Row = NonNullable<Portfolio["positions"]>[number];
  const rows: Row[] = portfolio?.positions ?? [];

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: portfolio?.currency ?? "PLN",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Przegląd portfela" />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {loading && (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, opacity: 0.7 }}>
              Ładowanie danych…
            </Text>
          </View>
        )}

        {error && (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ef4444",
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#ef4444", fontWeight: "600" }}>
              Błąd pobierania danych
            </Text>
            <Text style={{ opacity: 0.8 }}>
              {String((error as Error)?.message ?? "Spróbuj ponownie.")}
            </Text>
          </View>
        )}

        {!loading && !error && (
          <>
            {/* KPI */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <SummaryCard
                title="Wartość portfela"
                value={fmtCurrency(totalValue)}
                change={0}
              />
              <SummaryCard
                title="Dzienny P/L"
                value={fmtCurrency(dayPnl)}
                change={0}
              />
              <SummaryCard
                title="YTD"
                value={`${ytdPnl.toFixed(2)}%`}
                change={0}
              />
            </View>

            {/* Alokacja (donut) */}
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                Struktura alokacji
              </Text>
              <AllocationPieChart data={pieData} />
            </View>

            {/* Krzywa portfela */}
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                Krzywa wartości portfela
              </Text>
              <PortfolioLineChart data={lineData} />
            </View>

            {/* (opcjonalnie) tabela pozycji */}
            {/* <HoldingsTable rows={rows} /> */}
          </>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

export default MainScreen;
