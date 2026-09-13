"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/metrics/stat-card";
import { RoiScore } from "@/components/metrics/roi-score";
import { AiDonutChart } from "@/components/charts/ai-donut-chart";
import { formatPercent, formatHours } from "@/lib/utils";

interface Summary {
  totalPrs: number;
  aiPrs: number;
  aiUsagePct: number;
  avgCycleTimeAi: number | null;
  avgCycleTimeNoai: number | null;
  speedMultiplier: number | null;
  reworkRateAi: number | null;
  reworkRateNoai: number | null;
  netProductivityScore: number | null;
}

export default function ExecutiveSummaryPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    fetch(`/api/summary?period=${period}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, [period]);

  return (
    <>
      <Header title="Executive Summary" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1.5 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {data ? (
          <>
            <RoiScore score={data.netProductivityScore} />

            <div className="grid grid-cols-4 gap-4">
              <StatCard
                label="AI Usage"
                value={formatPercent(data.aiUsagePct)}
                delta={`${data.aiPrs} of ${data.totalPrs} PRs`}
                trend="neutral"
              />
              <StatCard
                label="Speed Multiplier"
                value={data.speedMultiplier ? `${data.speedMultiplier.toFixed(1)}x` : "—"}
                delta="AI PRs vs non-AI"
                trend={data.speedMultiplier && data.speedMultiplier > 1 ? "up" : "neutral"}
              />
              <StatCard
                label="Rework Rate (AI)"
                value={formatPercent(data.reworkRateAi)}
                delta={`vs ${formatPercent(data.reworkRateNoai)} non-AI`}
                trend={
                  data.reworkRateAi != null && data.reworkRateNoai != null
                    ? data.reworkRateAi > data.reworkRateNoai
                      ? "down"
                      : "up"
                    : "neutral"
                }
              />
              <StatCard
                label="Cycle Time (AI)"
                value={formatHours(data.avgCycleTimeAi)}
                delta={`vs ${formatHours(data.avgCycleTimeNoai)} non-AI`}
                trend={
                  data.avgCycleTimeAi != null && data.avgCycleTimeNoai != null
                    ? data.avgCycleTimeAi < data.avgCycleTimeNoai
                      ? "up"
                      : "down"
                    : "neutral"
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AiDonutChart aiPct={data.aiUsagePct} />
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-semibold mb-3">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.speedMultiplier && data.speedMultiplier > 1
                    ? `AI-assisted PRs merge ${data.speedMultiplier.toFixed(1)}x faster than manual PRs. `
                    : ""}
                  {data.reworkRateAi != null && data.reworkRateNoai != null
                    ? data.reworkRateAi > data.reworkRateNoai
                      ? `However, AI PRs have ${(data.reworkRateAi - data.reworkRateNoai).toFixed(1)}% higher rework rate — monitor quality. `
                      : `AI PRs also show ${(data.reworkRateNoai - data.reworkRateAi).toFixed(1)}% lower rework rate — quality is holding. `
                    : ""}
                  {data.netProductivityScore != null
                    ? data.netProductivityScore > 0
                      ? `Net productivity score: +${data.netProductivityScore.toFixed(0)}%. AI is a net positive.`
                      : `Net productivity score: ${data.netProductivityScore.toFixed(0)}%. Speed gains are offset by quality costs.`
                    : ""}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No data yet</p>
            <p className="text-sm">
              Connect a GitHub repository in Settings to start collecting metrics.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
