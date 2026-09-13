import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ label, value, delta, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
      {delta && (
        <p
          className={cn("text-xs mt-1 font-medium", {
            "text-emerald-500": trend === "up",
            "text-red-500": trend === "down",
            "text-muted-foreground": trend === "neutral",
          })}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "·"} {delta}
        </p>
      )}
    </div>
  );
}
