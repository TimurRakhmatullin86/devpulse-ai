import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.pRMetric.deleteMany();
  await prisma.pullRequest.deleteMany();
  await prisma.weeklySnapshot.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.repository.deleteMany();

  const org = await prisma.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: { id: "demo-org", name: "Acme Corp" },
  });

  const repoNames = ["acme-api", "acme-web", "acme-mobile", "acme-infra"];
  const repos: Record<string, string> = {};
  for (const name of repoNames) {
    const repo = await prisma.repository.upsert({
      where: { fullName: `acme-corp/${name}` },
      update: {},
      create: { orgId: org.id, name, fullName: `acme-corp/${name}` },
    });
    repos[name] = repo.id;
  }

  const devNames = [
    { login: "alice", name: "Alice Chen" },
    { login: "bob", name: "Bob Smith" },
    { login: "carol", name: "Carol Davis" },
    { login: "dave", name: "Dave Kim" },
    { login: "eve", name: "Eve Johnson" },
    { login: "frank", name: "Frank Lee" },
    { login: "grace", name: "Grace Park" },
    { login: "hank", name: "Hank Wilson" },
  ];
  const devs: Record<string, string> = {};
  for (const d of devNames) {
    const dev = await prisma.developer.upsert({
      where: { orgId_githubLogin: { orgId: org.id, githubLogin: d.login } },
      update: {},
      create: {
        orgId: org.id,
        githubLogin: d.login,
        displayName: d.name,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${d.login}`,
      },
    });
    devs[d.login] = dev.id;
  }

  const now = new Date();
  let prNum = 1;

  for (let daysAgo = 120; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const prsPerDay = 2 + Math.floor(Math.random() * 4);
    for (let j = 0; j < prsPerDay; j++) {
      const devList = Object.entries(devs);
      const [login, devId] = devList[Math.floor(Math.random() * devList.length)];
      const repoList = Object.entries(repos);
      const [repoName, repoId] = repoList[Math.floor(Math.random() * repoList.length)];

      const isAi = Math.random() < (daysAgo < 60 ? 0.7 : 0.3);
      const linesAdded = 20 + Math.floor(Math.random() * 300);
      const cycleHours = isAi
        ? 4 + Math.random() * 20
        : 8 + Math.random() * 40;
      const mergedAt = new Date(date);
      mergedAt.setHours(mergedAt.getHours() + cycleHours);

      const markers: string[] = [];
      if (isAi) {
        if (Math.random() < 0.5) markers.push("co-author: Co-Authored-By: copilot");
        if (Math.random() < 0.3) markers.push("pr-body: generated with.*claude");
        if (Math.random() < 0.2) markers.push("ai-config: CLAUDE.md");
      }

      const pr = await prisma.pullRequest.upsert({
        where: { repoId_number: { repoId, number: prNum } },
        update: {},
        create: {
          repoId,
          developerId: devId,
          number: prNum,
          title: `${isAi ? "[AI] " : ""}${repoName} update #${prNum}`,
          author: login,
          state: "closed",
          createdAt: date,
          mergedAt,
          isAiAssisted: isAi,
          aiMarkers: markers,
          linesAdded,
          linesRemoved: Math.floor(linesAdded * 0.3),
          commits: 1 + Math.floor(Math.random() * 5),
        },
      });

      const hasRework = Math.random() < (isAi ? 0.15 : 0.08);
      const hasBug = Math.random() < (isAi ? 0.06 : 0.03);

      await prisma.pRMetric.upsert({
        where: { prId: pr.id },
        update: {},
        create: {
          prId: pr.id,
          cycleTimeHours: cycleHours,
          reviewComments: Math.floor(Math.random() * 6),
          forcePushes: Math.floor(Math.random() * 2),
          reworkPrsCount: hasRework ? 1 : 0,
          bugsWithin14d: hasBug ? 1 : 0,
          codeChurn: hasRework ? Math.floor(linesAdded * 0.4) : 0,
        },
      });

      prNum++;
    }
  }

  // Weekly snapshots
  for (let weeksAgo = 17; weeksAgo >= 0; weeksAgo--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weeksAgo * 7);
    weekStart.setHours(0, 0, 0, 0);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diff);

    const aiUsage = Math.min(85, 30 + (17 - weeksAgo) * 3.2 + (Math.random() - 0.5) * 4);

    await prisma.weeklySnapshot.upsert({
      where: { orgId_weekStart: { orgId: org.id, weekStart } },
      update: {},
      create: {
        orgId: org.id,
        weekStart,
        totalPrs: 15 + Math.floor(Math.random() * 10),
        aiPrs: Math.round((15 + Math.floor(Math.random() * 10)) * aiUsage / 100),
        aiUsagePct: +aiUsage.toFixed(1),
        avgCycleTimeAi: +(8 + Math.random() * 10).toFixed(1),
        avgCycleTimeNoai: +(16 + Math.random() * 14).toFixed(1),
        reworkRateAi: +(10 + Math.random() * 8).toFixed(1),
        reworkRateNoai: +(6 + Math.random() * 5).toFixed(1),
        roiScore: +(15 + (17 - weeksAgo) * 0.8 + (Math.random() - 0.5) * 5).toFixed(1),
      },
    });
  }

  console.log(`Seeded: 1 org, ${repoNames.length} repos, ${devNames.length} devs, ${prNum - 1} PRs, 18 weekly snapshots`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
