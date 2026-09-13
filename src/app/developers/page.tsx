"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { DevScatterChart } from "@/components/charts/scatter-chart";
import { formatPercent, formatHours } from "@/lib/utils";

interface DevMetric {
  id: string;
  login: string;
  displayName: string;
  avatarUrl: string | null;
  totalPrs: number;
  aiPrs: number;
  aiUsagePct: number;
  avgCycleTimeAi: number | null;
  avgCycleTimeNoai: number | null;
  reworkRate: number | null;
}

export default function DevelopersPage() {
  const [devs, setDevs] = useState<DevMetric[]>([]);

  useEffect(() => {
    fetch("/api/developers?period=30d")
      .then((r) => (r.ok ? r.json() : []))
      .then(setDevs);
  }, []);

  const scatterData = devs
    .filter((d) => d.totalPrs > 0)
    .map((d) => ({
      name: d.displayName,
      aiUsagePct: d.aiUsagePct,
      reworkRate: d.reworkRate ?? 0,
      totalPrs: d.totalPrs,
    }));

  return (
    <>
      <Header title="Per-Developer Breakdown" />
      <div className="p-6 space-y-6">
        {scatterData.length > 0 && <DevScatterChart data={scatterData} />}

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Developer
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  PRs
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  AI Usage
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cycle (AI)
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cycle (No AI)
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rework
                </th>
              </tr>
            </thead>
            <tbody>
              {devs.map((dev) => (
                <tr key={dev.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {dev.avatarUrl && (
                        <img src={dev.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium">{dev.displayName}</div>
                        <div className="text-xs text-muted-foreground">@{dev.login}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 font-mono">{dev.totalPrs}</td>
                  <td className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${dev.aiUsagePct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{formatPercent(dev.aiUsagePct)}</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-xs">
                    {formatHours(dev.avgCycleTimeAi)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-xs">
                    {formatHours(dev.avgCycleTimeNoai)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-xs">
                    {formatPercent(dev.reworkRate)}
                  </td>
                </tr>
              ))}
              {devs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No developer data yet. Connect repositories to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
