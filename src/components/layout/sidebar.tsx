"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gauge,
  Users,
  GitBranch,
  TrendingUp,
  Calculator,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Executive Summary", icon: LayoutDashboard },
  { href: "/dashboard/speed-quality", label: "Speed vs Quality", icon: Gauge },
  { href: "/developers", label: "Per-Developer", icon: Users },
  { href: "/repos", label: "Per-Repository", icon: GitBranch },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/roi", label: "ROI Calculator", icon: Calculator },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Gauge className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight">
              Dev<span className="text-primary">Pulse</span>
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">AI Analytics</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground">DevPulse AI v0.2</p>
      </div>
    </aside>
  );
}
