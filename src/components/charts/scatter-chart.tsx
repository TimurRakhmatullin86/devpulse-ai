"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

interface ScatterDataPoint {
  name: string;
  aiUsagePct: number;
  reworkRate: number;
  totalPrs: number;
}

interface DevScatterChartProps {
  data: ScatterDataPoint[];
}

export function DevScatterChart({ data }: DevScatterChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-1">AI Usage vs Rework Rate</h3>
      <p className="text-xs text-muted-foreground mb-4">Each dot = one developer (size = PR count)</p>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="aiUsagePct"
            name="AI Usage %"
            tick={{ fontSize: 10 }}
            className="fill-muted-foreground"
            label={{ value: "AI Usage %", position: "bottom", fontSize: 11 }}
          />
          <YAxis
            dataKey="reworkRate"
            name="Rework Rate %"
            tick={{ fontSize: 10 }}
            className="fill-muted-foreground"
            label={{ value: "Rework %", angle: -90, position: "left", fontSize: 11 }}
          />
          <ZAxis dataKey="totalPrs" range={[40, 400]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [value.toFixed(1), name]}
          />
          <Scatter data={data} fill="hsl(var(--primary))" fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
