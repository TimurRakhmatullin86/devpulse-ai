"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AiDonutChartProps {
  aiPct: number;
}

export function AiDonutChart({ aiPct }: AiDonutChartProps) {
  const data = [
    { name: "AI-assisted", value: aiPct },
    { name: "Manual", value: 100 - aiPct },
  ];
  const colors = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-1">PR Distribution</h3>
      <p className="text-xs text-muted-foreground mb-4">AI-assisted vs manual PRs</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [value.toFixed(1) + "%", ""]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" /> AI ({aiPct.toFixed(0)}%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-muted" /> Manual ({(100 - aiPct).toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}
