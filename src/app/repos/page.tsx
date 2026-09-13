"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { formatPercent, formatHours } from "@/lib/utils";

interface RepoMetric {
  id: string;
  name: string;
  fullName: string;
  totalPrs: number;
  aiPrs: number;
  aiUsagePct: number;
  avgCycleTimeAi: number | null;
  avgCycleTimeNoai: number | null;
  reworkRate: number | null;
}

export default function ReposPage() {
  const [repos, setRepos] = useState<RepoMetric[]>([]);

  useEffect(() => {
    fetch("/api/repos?period=30d")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRepos);
  }, []);

  return (
    <>
      <Header title="Per-Repository Breakdown" />
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Repository
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
              {repos.map((repo) => (
                <tr key={repo.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{repo.name}</div>
                    <div className="text-xs text-muted-foreground">{repo.fullName}</div>
                  </td>
                  <td className="text-right px-4 py-3 font-mono">{repo.totalPrs}</td>
                  <td className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${repo.aiUsagePct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{formatPercent(repo.aiUsagePct)}</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-xs">
                    {formatHours(repo.avgCycleTimeAi)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-xs">
                    {formatHours(repo.avgCycleTimeNoai)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-xs">
                    {formatPercent(repo.reworkRate)}
                  </td>
                </tr>
              ))}
              {repos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No repository data yet.
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
