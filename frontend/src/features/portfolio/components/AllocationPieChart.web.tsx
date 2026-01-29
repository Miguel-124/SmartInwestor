import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export type Slice = { label: string; value: number; color?: string };

export default function AllocationPieChart({ data }: { data: Slice[] }) {
  const palette = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#0ea5e9",
    "#84cc16",
    "#f43f5e",
  ];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" outerRadius={110}>
          {data.map((_, i) => (
            <Cell key={i} fill={data[i].color ?? palette[i % palette.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
