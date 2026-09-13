import { cn } from "@/lib/utils";

interface RoiScoreProps {
  score: number | null;
  label?: string;
}

export function RoiScore({ score, label = "AI ROI Score" }: RoiScoreProps) {
  const display = score != null ? `${score > 0 ? "+" : ""}${score.toFixed(0)}%` : "—";
  const isPositive = score != null && score > 0;
  const isNegative = score != null && score < 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {label}
      </p>
      <p
        className={cn("text-5xl font-bold font-mono tracking-tighter", {
          "text-emerald-500": isPositive,
          "text-red-500": isNegative,
          "text-muted-foreground": score == null,
        })}
      >
        {display}
      </p>
      {score != null && (
        <p className="text-sm text-muted-foreground mt-2">
          {isPositive
            ? "AI is a net positive for your team"
            : "AI tools cost more than they save — review usage patterns"}
        </p>
      )}
    </div>
  );
}
