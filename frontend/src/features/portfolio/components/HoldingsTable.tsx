import React from "react";
import { Text } from "react-native";
import DataTable, { Column } from "../../../components/data/DataTable";
import type { Portfolio } from "../../../models/Portfolio";
export default function HoldingsTable({
  rows,
}: {
  rows: NonNullable<Portfolio["positions"]>;
}) {
  type Row = NonNullable<Portfolio["positions"]>[number];
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
    <DataTable<Row>
      rows={rows}
      columns={columns}
      keyExtractor={(r) => r.id}
      emptyMessage="Brak pozycji"
    />
  );
}
