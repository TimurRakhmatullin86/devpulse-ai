import { prisma } from "@/lib/db/prisma";

export interface SummaryMetrics {
  totalPrs: number;
  aiPrs: number;
  aiUsagePct: number;
  avgCycleTimeAi: number | null;
  avgCycleTimeNoai: number | null;
  speedMultiplier: number | null;
  reworkRateAi: number | null;
  reworkRateNoai: number | null;
  bugRateAi: number | null;
  bugRateNoai: number | null;
  reviewLoadAi: number | null;
  reviewLoadNoai: number | null;
  netProductivityScore: number | null;
  roiEstimate: number | null;
}

export async function computeSummary(
  orgId: string,
  days: number = 30
): Promise<SummaryMetrics> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const prs = await prisma.pullRequest.findMany({
    where: {
      repo: { orgId },
      mergedAt: { gte: since },
    },
    include: { metric: true },
  });

  const aiPrs = prs.filter((pr) => pr.isAiAssisted);
  const noaiPrs = prs.filter((pr) => !pr.isAiAssisted);

  const avgCycle = (list: typeof prs) => {
    const withCycle = list
      .map((pr) => pr.metric?.cycleTimeHours)
      .filter((v): v is number => v != null);
    return withCycle.length ? withCycle.reduce((a, b) => a + b, 0) / withCycle.length : null;
  };

  const reworkRate = (list: typeof prs) => {
    if (!list.length) return null;
    const withRework = list.filter((pr) => (pr.metric?.reworkPrsCount ?? 0) > 0);
    return (withRework.length / list.length) * 100;
  };

  const bugRate = (list: typeof prs) => {
    if (!list.length) return null;
    const totalBugs = list.reduce((s, pr) => s + (pr.metric?.bugsWithin14d ?? 0), 0);
    return (totalBugs / list.length) * 100;
  };

  const reviewLoad = (list: typeof prs) => {
    const comments = list.map((pr) => pr.metric?.reviewComments ?? 0);
    return comments.length ? comments.reduce((a, b) => a + b, 0) / comments.length : null;
  };

  const avgAi = avgCycle(aiPrs);
  const avgNoai = avgCycle(noaiPrs);
  const speedMult = avgAi != null && avgNoai != null && avgAi > 0 ? avgNoai / avgAi : null;

  const reworkAi = reworkRate(aiPrs);
  const reworkNoai = reworkRate(noaiPrs);

  let netScore: number | null = null;
  if (speedMult != null && reworkAi != null && reworkNoai != null) {
    const speedGain = ((speedMult - 1) / 1) * 100;
    const qualityCost = reworkAi - (reworkNoai ?? 0);
    netScore = speedGain - qualityCost;
  }

  return {
    totalPrs: prs.length,
    aiPrs: aiPrs.length,
    aiUsagePct: prs.length ? (aiPrs.length / prs.length) * 100 : 0,
    avgCycleTimeAi: avgAi,
    avgCycleTimeNoai: avgNoai,
    speedMultiplier: speedMult,
    reworkRateAi: reworkAi,
    reworkRateNoai: reworkNoai,
    bugRateAi: bugRate(aiPrs),
    bugRateNoai: bugRate(noaiPrs),
    reviewLoadAi: reviewLoad(aiPrs),
    reviewLoadNoai: reviewLoad(noaiPrs),
    netProductivityScore: netScore,
    roiEstimate: null,
  };
}

export async function computeDeveloperMetrics(orgId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const devs = await prisma.developer.findMany({
    where: { orgId },
    include: {
      pullRequests: {
        where: { mergedAt: { gte: since } },
        include: { metric: true },
      },
    },
  });

  return devs.map((dev) => {
    const prs = dev.pullRequests;
    const aiPrs = prs.filter((pr) => pr.isAiAssisted);
    const noaiPrs = prs.filter((pr) => !pr.isAiAssisted);

    const avgCycle = (list: typeof prs) => {
      const vals = list
        .map((pr) => pr.metric?.cycleTimeHours)
        .filter((v): v is number => v != null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };

    return {
      id: dev.id,
      login: dev.githubLogin,
      displayName: dev.displayName ?? dev.githubLogin,
      avatarUrl: dev.avatarUrl,
      totalPrs: prs.length,
      aiPrs: aiPrs.length,
      aiUsagePct: prs.length ? (aiPrs.length / prs.length) * 100 : 0,
      avgCycleTimeAi: avgCycle(aiPrs),
      avgCycleTimeNoai: avgCycle(noaiPrs),
      reworkRate:
        prs.length > 0
          ? (prs.filter((pr) => (pr.metric?.reworkPrsCount ?? 0) > 0).length / prs.length) * 100
          : null,
    };
  });
}

export async function computeRepoMetrics(orgId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const repos = await prisma.repository.findMany({
    where: { orgId, isActive: true },
    include: {
      pullRequests: {
        where: { mergedAt: { gte: since } },
        include: { metric: true },
      },
    },
  });

  return repos.map((repo) => {
    const prs = repo.pullRequests;
    const aiPrs = prs.filter((pr) => pr.isAiAssisted);

    const avgCycle = (list: typeof prs) => {
      const vals = list
        .map((pr) => pr.metric?.cycleTimeHours)
        .filter((v): v is number => v != null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };

    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      totalPrs: prs.length,
      aiPrs: aiPrs.length,
      aiUsagePct: prs.length ? (aiPrs.length / prs.length) * 100 : 0,
      avgCycleTimeAi: avgCycle(aiPrs),
      avgCycleTimeNoai: avgCycle(prs.filter((pr) => !pr.isAiAssisted)),
      reworkRate:
        prs.length > 0
          ? (prs.filter((pr) => (pr.metric?.reworkPrsCount ?? 0) > 0).length / prs.length) * 100
          : null,
    };
  });
}

export async function computeWeeklyTrends(orgId: string, weeks: number = 12) {
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const snapshots = await prisma.weeklySnapshot.findMany({
    where: { orgId, weekStart: { gte: since } },
    orderBy: { weekStart: "asc" },
  });

  return snapshots.map((s) => ({
    weekStart: s.weekStart.toISOString().split("T")[0],
    totalPrs: s.totalPrs,
    aiPrs: s.aiPrs,
    aiUsagePct: s.aiUsagePct,
    avgCycleTimeAi: s.avgCycleTimeAi,
    avgCycleTimeNoai: s.avgCycleTimeNoai,
    reworkRateAi: s.reworkRateAi,
    reworkRateNoai: s.reworkRateNoai,
    roiScore: s.roiScore,
  }));
}
