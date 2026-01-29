import React from "react";
import { View, Text } from "react-native";
import AppShell from "../components/layout/AppShell";
import DataTable, { Column } from "../components/data/DataTable";

export default function PortfolioPage() {
  type Row = {
    symbol: string;
    name: string;
    qty: number;
    value: number;
    weight: number;
  };
  const rows: Row[] = [
    { symbol: "AAPL", name: "Apple", qty: 10, value: 1500, weight: 0.2 },
    { symbol: "MSFT", name: "Microsoft", qty: 5, value: 1000, weight: 0.13 },
  ];
  const columns: Column<Row>[] = [
    { key: "symbol", header: "Ticker" },
    { key: "name", header: "Nazwa" },
    { key: "qty", header: "Ilość" },
    { key: "value", header: "Wartość" },
    {
      key: "weight",
      header: "Udział",
      render: (r) => <Text>{(r.weight * 100).toFixed(1)}%</Text>,
    },
  ];

  return (
    <AppShell>
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Pozycje</Text>
        <DataTable<Row>
          rows={rows}
          columns={columns}
          keyExtractor={(r, i) => r.symbol + i}
        />
      </View>
    </AppShell>
  );
}
