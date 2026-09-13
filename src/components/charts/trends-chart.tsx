"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendsChartProps {
  data: Array<{
    weekStart: string;
    aiUsagePct?: number;
    avgCycleTimeAi?: number | null;
    avgCycleTimeNoai?: number | null;
    reworkRateAi?: number | null;
    reworkRateNoai?: number | null;
    roiScore?: number | null;
  }>;
  metric: "usage" | "cycleTime" | "rework" | "roi";
}

const configs: Record<string, { lines: Array<{ key: string; name: string; color: string; dashed?: boolean }>; yLabel: string }> = {
  usage: {
    lines: [{ key: "aiUsagePct", name: "AI Usage %", color: "hsl(var(--primary))" }],
    yLabel: "%",
  },
  cycleTime: {
    lines: [
      { key: "avgCycleTimeAi", name: "AI-assisted", color: "hsl(var(--primary))" },
      { key: "avgCycleTimeNoai", name: "Non-AI", color: "hsl(var(--muted-foreground))", dashed: true },
    ],
    yLabel: "hours",
  },
  rework: {
    lines: [
      { key: "reworkRateAi", name: "AI rework", color: "#ef4444" },
      { key: "reworkRateNoai", name: "Non-AI rework", color: "hsl(var(--muted-foreground))", dashed: true },
    ],
    yLabel: "%",
  },
  roi: {
    lines: [{ key: "roiScore", name: "Net Productivity Score", color: "#22c55e" }],
    yLabel: "score",
  },
};

export function TrendsChart({ data, metric }: TrendsChartProps) {
  const config = configs[metric];
  const formatted = data.map((d) => ({
    ...d,
    week: d.weekStart.slice(5),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="week" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
        <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {config.lines.map((line) => (
          <Line
            key={line.key}
            dataKey={line.key}
            name={line.name}
            stroke={line.color}
            strokeDasharray={line.dashed ? "5 5" : undefined}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
