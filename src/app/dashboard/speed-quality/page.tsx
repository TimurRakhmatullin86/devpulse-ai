"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { CycleTimeChart } from "@/components/charts/cycle-time-chart";
import { StatCard } from "@/components/metrics/stat-card";
import { formatPercent, formatHours } from "@/lib/utils";

interface Summary {
  avgCycleTimeAi: number | null;
  avgCycleTimeNoai: number | null;
  reworkRateAi: number | null;
  reworkRateNoai: number | null;
  bugRateAi: number | null;
  bugRateNoai: number | null;
  reviewLoadAi: number | null;
  reviewLoadNoai: number | null;
}

export default function SpeedQualityPage() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/summary?period=30d")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData);
  }, []);

  const chartData = data
    ? [
        {
          label: "Last 30 days",
          aiCycleTime: data.avgCycleTimeAi,
          noaiCycleTime: data.avgCycleTimeNoai,
        },
      ]
    : [];

  return (
    <>
      <Header title="Speed vs Quality" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Cycle Time (AI)"
            value={formatHours(data?.avgCycleTimeAi ?? null)}
            delta="avg hours to merge"
            trend="neutral"
          />
          <StatCard
            label="Cycle Time (Non-AI)"
            value={formatHours(data?.avgCycleTimeNoai ?? null)}
            delta="avg hours to merge"
            trend="neutral"
          />
          <StatCard
            label="Rework Rate (AI)"
            value={formatPercent(data?.reworkRateAi ?? null)}
            delta="PRs needing fixes"
            trend={
              data && data.reworkRateAi != null && data.reworkRateNoai != null
                ? data.reworkRateAi > data.reworkRateNoai
                  ? "down"
                  : "up"
                : "neutral"
            }
          />
          <StatCard
            label="Rework Rate (Non-AI)"
            value={formatPercent(data?.reworkRateNoai ?? null)}
            delta="PRs needing fixes"
            trend="neutral"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CycleTimeChart data={chartData} />
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-1">Review Load</h3>
            <p className="text-xs text-muted-foreground mb-4">Average review comments per PR</p>
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>AI-assisted PRs</span>
                  <span className="font-mono">{data?.reviewLoadAi?.toFixed(1) ?? "—"}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(100, (data?.reviewLoadAi ?? 0) * 10)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Non-AI PRs</span>
                  <span className="font-mono">{data?.reviewLoadNoai?.toFixed(1) ?? "—"}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/50 rounded-full"
                    style={{ width: `${Math.min(100, (data?.reviewLoadNoai ?? 0) * 10)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {!data && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Connect repositories to see speed vs quality breakdown.</p>
          </div>
        )}
      </div>
    </>
  );
}
