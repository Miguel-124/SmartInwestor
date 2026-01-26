import React, { FC, memo } from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
}
export const SummaryCard: FC<SummaryCardProps> = memo(
  ({ title, value, change }) => {
    const trendClass = change >= 0 ? "text-green-500" : "text-red-500";
    return (
      <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-semibold mt-1">{value}</span>
        <span className={`text-sm ${trendClass}`}>{change}%</span>
      </div>
    );
  }
);
