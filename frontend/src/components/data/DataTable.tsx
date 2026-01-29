import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  keyExtractor: (row: T, index: number) => string;
  onRowPress?: (row: T) => void;
  emptyMessage?: string;
};

export default function DataTable<T extends object>({
  rows,
  columns,
  keyExtractor,
  onRowPress,
  emptyMessage = "Brak danych",
}: Props<T>) {
  if (!rows?.length) {
    return <Text style={{ opacity: 0.6 }}>{emptyMessage}</Text>;
  }
  return (
    <FlatList
      data={rows}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <View style={{ flexDirection: "row", paddingVertical: 8 }}>
          {columns.map((c) => (
            <View key={String(c.key)} style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>{c.header}</Text>
            </View>
          ))}
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onRowPress?.(item)}>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              borderTopWidth: 1,
              borderColor: "#eee",
            }}
          >
            {columns.map((c) => (
              <View key={String(c.key)} style={{ flex: 1 }}>
                {c.render ? c.render(item) : <Text>{String(item[c.key])}</Text>}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
