import React, { FC, useMemo } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { SummaryCard } from "../components/data/SummaryCard";
import { PortfolioLineChart } from "../features/portfolio/components/PortfolioLineChart";
import { AllocationPieChart } from "../features/portfolio/components/AllocationPieChart";
import { HoldingsTable } from "../features/portfolio/components/HoldingsTable";
//import { CorrelationHeatmap } from "../components/CorrelationHeatmap";
//import { Recommendations } from "../components/Recommendations";
import { portfolioModel } from "../models/Portfolio";

const MainScreen: FC = () => {
  const {
    totalValue,
    dailyChange,
    ytdChange,
    history,
    allocation,
    holdings,
    correlations,
    recommendations,
  } = portfolioModel;
  const formattedTotal = useMemo(
    () => `$${totalValue.toLocaleString()}`,
    [totalValue],
  );
  const dailyValue = useMemo(
    () => `$${((totalValue * dailyChange) / 100).toFixed(2)}`,
    [totalValue, dailyChange],
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title={"Portfolio"} />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            title="Total Value"
            value={formattedTotal}
            change={ytdChange}
          />
          <SummaryCard
            title="Daily Change"
            value={dailyValue}
            change={dailyChange}
          />
          <SummaryCard
            title="YTD Change"
            value={`${ytdChange}%`}
            change={ytdChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <PortfolioLineChart data={history} />
          <AllocationPieChart data={allocation} />
          {/* <CorrelationHeatmap data={correlations} /> */}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <HoldingsTable data={holdings} />
          {/* <Recommendations items={recommendations} /> */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainScreen;
