import React, { FC, memo } from "react";
import { Recommendation } from "../portfolio/hooks/useAdviceQuery";

interface RecommendationsProps {
  items: Recommendation[];
}
export const Recommendations: FC<RecommendationsProps> = memo(({ items }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4">
    <h3 className="text-lg font-medium mb-2">Recommendations</h3>
    <ul className="list-disc list-inside space-y-1">
      {items.map((r) => (
        <li
          key={r.id}
          className={r.type === "Risk" ? "text-red-600" : "text-purple-700"}
        >
          {r.text}
        </li>
      ))}
    </ul>
  </div>
));
