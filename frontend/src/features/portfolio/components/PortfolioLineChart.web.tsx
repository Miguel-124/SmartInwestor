import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PortfolioLineChart({
  data,
}: {
  data: { t: string; v: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="t" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="v" stroke="#6366f1" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
