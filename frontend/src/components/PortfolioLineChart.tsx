import React, { FC, memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HistoryPoint } from "../models/Portfolio";

interface PortfolioLineChartProps {
  data: HistoryPoint[];
}
export const PortfolioLineChart: FC<PortfolioLineChartProps> = memo(
  ({ data }) => (
    <div className="bg-white shadow-lg rounded-2xl p-4">
      <h3 className="text-lg font-medium mb-2">Portfolio Value</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-marine)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
);
