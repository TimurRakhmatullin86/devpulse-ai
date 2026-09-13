function generateDemoData() {
  const now = new Date();
  const teams = ['Backend', 'Frontend', 'Platform', 'Mobile', 'Data'];
  const tools = ['GitHub Copilot', 'Cursor', 'Claude Code', 'Cody'];

  const velocity = generateVelocityData(now, teams);
  const toolMetrics = generateToolMetrics(tools);
  const teamMetrics = generateTeamMetrics(teams, tools);
  const roi = generateROI(teams, tools);
  const trends = generateTrends(now);

  const totalDevs = teams.length * 6;
  const totalMonthlyCost = 19 * 18 + 20 * 8 + 100 * 4 + 9 * 2;
  const hoursSaved = 847;
  const roiPercent = Math.round(((hoursSaved * 75 - totalMonthlyCost) / totalMonthlyCost) * 100);

  return {
    summary: {
      totalDevelopers: totalDevs,
      aiAdoptionRate: 87,
      velocityDelta: 34,
      cyclTimeReduction: 41,
      avgAcceptanceRate: 31,
      hoursSavedPerMonth: hoursSaved,
      monthlyCost: totalMonthlyCost,
      monthlyROI: roiPercent,
      dollarsSaved: hoursSaved * 75,
      codeQualityDelta: 12,
      prThroughputDelta: 28,
      bugRateDelta: -18,
    },
    velocity,
    tools: toolMetrics,
    teams: teamMetrics,
    roi,
    trends,
  };
}

function generateVelocityData(now, teams) {
  const data = [];
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const isPostAdoption = i < 120;
    for (const team of teams) {
      const base = { Backend: 4.2, Frontend: 3.8, Platform: 2.5, Mobile: 3.1, Data: 2.8 }[team];
      const boost = isPostAdoption ? 1.35 : 1.0;
      const noise = 0.7 + Math.random() * 0.6;
      const dayOfWeek = date.getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.2 : 1.0;
      data.push({
        date: dateStr,
        team,
        prsPerDay: +(base * boost * noise * weekendFactor).toFixed(1),
        avgCycleTimeHours: +(24 * (isPostAdoption ? 0.65 : 1.0) * (0.8 + Math.random() * 0.4) * (3 + Math.random() * 5)).toFixed(1),
        linesChanged: Math.round(base * boost * noise * weekendFactor * 180),
      });
    }
  }
  return data;
}

function generateToolMetrics(tools) {
  return tools.map(tool => {
    const profiles = {
      'GitHub Copilot': { acceptance: 28, completions: 1420, timeSaved: 2.1, satisfaction: 7.2, activeUsers: 18, cost: 19 },
      'Cursor': { acceptance: 35, completions: 890, timeSaved: 2.8, satisfaction: 8.1, activeUsers: 8, cost: 20 },
      'Claude Code': { acceptance: 42, completions: 320, timeSaved: 4.2, satisfaction: 8.7, activeUsers: 4, cost: 100 },
      'Cody': { acceptance: 22, completions: 210, timeSaved: 1.4, satisfaction: 6.5, activeUsers: 2, cost: 9 },
    };
    const p = profiles[tool];
    return {
      name: tool,
      acceptanceRate: p.acceptance,
      dailyCompletions: p.completions,
      avgTimeSavedHoursPerDev: p.timeSaved,
      satisfactionScore: p.satisfaction,
      activeUsers: p.activeUsers,
      costPerUser: p.cost,
      costPerHourSaved: +(p.cost / (p.timeSaved * 22)).toFixed(2),
      weeklyTrend: Array.from({ length: 12 }, (_, i) => ({
        week: i + 1,
        acceptance: +(p.acceptance + (Math.random() - 0.3) * 5).toFixed(1),
        completions: Math.round(p.completions * (0.85 + i * 0.02 + Math.random() * 0.1)),
      })),
    };
  });
}

function generateTeamMetrics(teams, tools) {
  return teams.map(team => {
    const sizes = { Backend: 8, Frontend: 6, Platform: 4, Mobile: 5, Data: 3 };
    const size = sizes[team] || 5;
    const adoptionRates = { Backend: 92, Frontend: 88, Platform: 95, Mobile: 78, Data: 72 };
    const velocityDeltas = { Backend: 38, Frontend: 32, Platform: 42, Mobile: 28, Data: 25 };
    return {
      name: team,
      size,
      aiAdoptionRate: adoptionRates[team],
      velocityDelta: velocityDeltas[team],
      topTool: team === 'Platform' ? 'Claude Code' : team === 'Data' ? 'Cursor' : 'GitHub Copilot',
      primaryTools: tools.slice(0, 2 + Math.floor(Math.random() * 2)),
      avgAcceptanceRate: 25 + Math.round(Math.random() * 15),
      cycleTimeReduction: 30 + Math.round(Math.random() * 20),
      hoursSaved: Math.round(size * (1.5 + Math.random() * 2.5) * 22),
    };
  });
}

function generateROI(teams, tools) {
  const toolCosts = {
    'GitHub Copilot': { seats: 18, perSeat: 19 },
    'Cursor': { seats: 8, perSeat: 20 },
    'Claude Code': { seats: 4, perSeat: 100 },
    'Cody': { seats: 2, perSeat: 9 },
  };

  const byTool = tools.map(tool => {
    const tc = toolCosts[tool];
    const monthlyCost = tc.seats * tc.perSeat;
    const hoursSaved = tc.seats * (tool === 'Claude Code' ? 4.2 : tool === 'Cursor' ? 2.8 : tool === 'Cody' ? 1.4 : 2.1) * 22;
    const dollarsSaved = hoursSaved * 75;
    return {
      tool,
      seats: tc.seats,
      monthlyCost,
      hoursSavedPerMonth: Math.round(hoursSaved),
      dollarsSavedPerMonth: Math.round(dollarsSaved),
      roi: Math.round(((dollarsSaved - monthlyCost) / monthlyCost) * 100),
    };
  });

  const totalCost = byTool.reduce((s, t) => s + t.monthlyCost, 0);
  const totalSaved = byTool.reduce((s, t) => s + t.dollarsSavedPerMonth, 0);

  const monthly = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - 5 + i);
    const ramp = 0.6 + i * 0.08;
    return {
      month: month.toISOString().slice(0, 7),
      cost: Math.round(totalCost * (0.7 + i * 0.06)),
      saved: Math.round(totalSaved * ramp),
      roi: Math.round(((totalSaved * ramp - totalCost * (0.7 + i * 0.06)) / (totalCost * (0.7 + i * 0.06))) * 100),
    };
  });

  return {
    byTool,
    total: {
      monthlyCost: totalCost,
      dollarsSavedPerMonth: Math.round(totalSaved),
      netSavings: Math.round(totalSaved - totalCost),
      roi: Math.round(((totalSaved - totalCost) / totalCost) * 100),
      paybackPeriodDays: 0,
    },
    monthly,
  };
}

function generateTrends(now) {
  const weeks = 24;
  const adoption = Array.from({ length: weeks }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (weeks - i) * 7);
    return {
      week: date.toISOString().split('T')[0],
      rate: Math.min(95, 40 + i * 2.5 + (Math.random() - 0.5) * 3),
    };
  });

  const velocity = Array.from({ length: weeks }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (weeks - i) * 7);
    return {
      week: date.toISOString().split('T')[0],
      prsPerDevPerWeek: +(3.2 + i * 0.12 + (Math.random() - 0.5) * 0.5).toFixed(1),
      baselinePrsPerDevPerWeek: +(3.2 + (Math.random() - 0.5) * 0.3).toFixed(1),
    };
  });

  const quality = Array.from({ length: weeks }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (weeks - i) * 7);
    return {
      week: date.toISOString().split('T')[0],
      bugRate: +(2.8 - i * 0.05 + (Math.random() - 0.5) * 0.3).toFixed(2),
      testCoverage: +(62 + i * 0.6 + (Math.random() - 0.5) * 1).toFixed(1),
    };
  });

  return { adoption, velocity, quality };
}

module.exports = { generateDemoData };
