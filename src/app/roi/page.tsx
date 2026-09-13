"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/metrics/stat-card";

export default function RoiCalculatorPage() {
  const [devCount, setDevCount] = useState(20);
  const [avgSalary, setAvgSalary] = useState(150000);
  const [aiToolCostPerDev, setAiToolCostPerDev] = useState(25);
  const [adoptionPct, setAdoptionPct] = useState(80);
  const [speedGainPct, setSpeedGainPct] = useState(30);
  const [reworkIncreasePct, setReworkIncreasePct] = useState(8);

  const hourlyRate = avgSalary / (52 * 40);
  const aiUsers = Math.round(devCount * (adoptionPct / 100));
  const monthlyCost = aiUsers * aiToolCostPerDev;
  const annualCost = monthlyCost * 12;

  const hoursPerDevPerWeek = 40;
  const codingHoursPct = 0.5;
  const hoursSavedPerWeek = aiUsers * hoursPerDevPerWeek * codingHoursPct * (speedGainPct / 100);
  const reworkHoursPerWeek = hoursSavedPerWeek * (reworkIncreasePct / 100);
  const netHoursSavedPerWeek = hoursSavedPerWeek - reworkHoursPerWeek;
  const netHoursSavedPerMonth = netHoursSavedPerWeek * 4.33;
  const monthlySavings = netHoursSavedPerMonth * hourlyRate;
  const annualSavings = monthlySavings * 12;
  const annualROI = annualCost > 0 ? ((annualSavings - annualCost) / annualCost) * 100 : 0;
  const netAnnual = annualSavings - annualCost;

  return (
    <>
      <Header title="ROI Calculator" />
      <div className="p-6 space-y-6">
        <p className="text-sm text-muted-foreground max-w-2xl">
          Estimate the dollar impact of AI coding tools on your team. Adjust the inputs
          below to match your organization.
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-5 space-y-5">
            <h3 className="text-sm font-semibold">Inputs</h3>

            <label className="block">
              <span className="text-xs text-muted-foreground">Number of developers</span>
              <input
                type="number"
                value={devCount}
                onChange={(e) => setDevCount(+e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
              />
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground">Average annual salary ($)</span>
              <input
                type="number"
                value={avgSalary}
                onChange={(e) => setAvgSalary(+e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
              />
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground">AI tool cost per developer ($/month)</span>
              <input
                type="number"
                value={aiToolCostPerDev}
                onChange={(e) => setAiToolCostPerDev(+e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
              />
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground">AI adoption rate (%)</span>
              <input
                type="range"
                min={0}
                max={100}
                value={adoptionPct}
                onChange={(e) => setAdoptionPct(+e.target.value)}
                className="w-full mt-1"
              />
              <span className="text-xs font-mono">{adoptionPct}%</span>
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground">Speed gain from AI (%)</span>
              <input
                type="range"
                min={0}
                max={80}
                value={speedGainPct}
                onChange={(e) => setSpeedGainPct(+e.target.value)}
                className="w-full mt-1"
              />
              <span className="text-xs font-mono">{speedGainPct}%</span>
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground">Rework increase from AI (%)</span>
              <input
                type="range"
                min={0}
                max={50}
                value={reworkIncreasePct}
                onChange={(e) => setReworkIncreasePct(+e.target.value)}
                className="w-full mt-1"
              />
              <span className="text-xs font-mono">{reworkIncreasePct}%</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Annual ROI"
                value={`${annualROI > 0 ? "+" : ""}${annualROI.toFixed(0)}%`}
                trend={annualROI > 0 ? "up" : "down"}
              />
              <StatCard
                label="Net Annual Impact"
                value={`$${Math.abs(netAnnual).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                delta={netAnnual > 0 ? "savings" : "cost"}
                trend={netAnnual > 0 ? "up" : "down"}
              />
              <StatCard
                label="Annual Tool Cost"
                value={`$${annualCost.toLocaleString()}`}
                delta={`${aiUsers} seats × $${aiToolCostPerDev}/mo`}
                trend="neutral"
              />
              <StatCard
                label="Hours Saved / Month"
                value={netHoursSavedPerMonth.toFixed(0)}
                delta={`${hoursSavedPerWeek.toFixed(0)}/wk gross − ${reworkHoursPerWeek.toFixed(0)} rework`}
                trend="up"
              />
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold mb-3">Methodology</h3>
              <div className="text-xs text-muted-foreground space-y-2 font-mono">
                <p>hourly_rate = salary / (52 × 40) = ${hourlyRate.toFixed(2)}</p>
                <p>coding_hours = 50% of working time</p>
                <p>gross_saved = {aiUsers} devs × {hoursPerDevPerWeek}h × 50% × {speedGainPct}% = {hoursSavedPerWeek.toFixed(1)}h/wk</p>
                <p>rework_cost = {hoursSavedPerWeek.toFixed(1)} × {reworkIncreasePct}% = {reworkHoursPerWeek.toFixed(1)}h/wk</p>
                <p>net_saved = {netHoursSavedPerWeek.toFixed(1)}h/wk = {netHoursSavedPerMonth.toFixed(0)}h/mo</p>
                <p>value = {netHoursSavedPerMonth.toFixed(0)} × ${hourlyRate.toFixed(2)} = ${monthlySavings.toFixed(0)}/mo</p>
                <p>ROI = (${annualSavings.toFixed(0)} − ${annualCost}) / ${annualCost} = {annualROI.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
