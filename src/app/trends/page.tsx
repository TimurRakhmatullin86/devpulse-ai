"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { TrendsChart } from "@/components/charts/trends-chart";

interface WeeklyData {
  weekStart: string;
  aiUsagePct: number;
  avgCycleTimeAi: number | null;
  avgCycleTimeNoai: number | null;
  reworkRateAi: number | null;
  reworkRateNoai: number | null;
  roiScore: number | null;
}

export default function TrendsPage() {
  const [data, setData] = useState<WeeklyData[]>([]);
  const [period, setPeriod] = useState("90d");

  useEffect(() => {
    fetch(`/api/metrics?period=${period}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setData);
  }, [period]);

  return (
    <>
      <Header title="Weekly Trends" />
      <div className="p-6 space-y-6">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-card border border-border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="180d">Last 6 months</option>
        </select>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-1">AI Adoption</h3>
            <p className="text-xs text-muted-foreground mb-3">% of PRs with AI markers</p>
            <TrendsChart data={data} metric="usage" />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-1">Cycle Time: AI vs Non-AI</h3>
            <p className="text-xs text-muted-foreground mb-3">Average hours to merge</p>
            <TrendsChart data={data} metric="cycleTime" />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-1">Rework Rate</h3>
            <p className="text-xs text-muted-foreground mb-3">% of PRs requiring fixes within 14 days</p>
            <TrendsChart data={data} metric="rework" />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-1">Net Productivity Score</h3>
            <p className="text-xs text-muted-foreground mb-3">Speed gain minus quality cost</p>
            <TrendsChart data={data} metric="roi" />
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No trend data yet. Metrics are computed weekly after data collection starts.</p>
          </div>
        )}
      </div>
    </>
  );
}
