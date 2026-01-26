import React, { FC, memo } from "react";
import { Holding } from "../models/Portfolio";

interface HoldingsTableProps {
  data: Holding[];
}
export const HoldingsTable: FC<HoldingsTableProps> = memo(({ data }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4 overflow-x-auto">
    <h3 className="text-lg font-medium mb-2">Top Holdings</h3>
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-50">
          {["Ticker", "Name", "Qty", "Price", "P&L (%)"].map((col) => (
            <th
              key={col}
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((h) => (
          <tr key={h.ticker}>
            <td className="px-4 py-2 whitespace-nowrap">{h.ticker}</td>
            <td className="px-4 py-2 whitespace-nowrap">{h.name}</td>
            <td className="px-4 py-2 whitespace-nowrap text-right">{h.qty}</td>
            <td className="px-4 py-2 whitespace-nowrap text-right">
              {h.currentPrice}
            </td>
            <td
              className={`px-4 py-2 whitespace-nowrap text-right ${
                h.pnl >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {h.pnl}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));
