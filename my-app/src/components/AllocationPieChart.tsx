import React, { FC, memo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AllocationEntry } from "../models/Portfolio";

const COLORS = [
  "var(--color-marine)",
  "var(--color-purple)",
  "var(--color-accent)",
];
interface AllocationPieChartProps {
  data: AllocationEntry[];
}
export const AllocationPieChart: FC<AllocationPieChartProps> = memo(
  ({ data }) => (
    <div className="bg-white shadow-lg rounded-2xl p-4">
      <h3 className="text-lg font-medium mb-2">Asset Allocation</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
);
