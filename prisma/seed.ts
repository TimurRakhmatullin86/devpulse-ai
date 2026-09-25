import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Deterministic PRNG (Mulberry32) — makes seed data reproducible across runs
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

function randInt(min: number, max: number) {
  return min + Math.floor(rand() * (max - min + 1));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pickWeighted<T>(arr: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

// ---------------------------------------------------------------------------
// Constants & types
// ---------------------------------------------------------------------------

const DEMO_ORG_ID = "demo-org";
const DEMO_USER_ID = "demo-user";
const DEMO_EMAIL = "demo@devpulse.dev";
const TOTAL_DAYS = 90;
const NOW = new Date("2026-09-23T12:00:00Z");

interface DevProfile {
  login: string;
  displayName: string;
  aiUsageMin: number;
  aiUsageMax: number;
  avgCycleAi: number; // mean cycle hours for AI PRs
  avgCycleNoAi: number; // mean cycle hours for non-AI PRs
  reworkProbAi: number;
  reworkProbNoAi: number;
  category: string;
  repos: string[]; // preferred repos (fullNames)
}

interface RepoSpec {
  name: string;
  fullName: string;
  stack: string;
}

// ---------------------------------------------------------------------------
// Repo definitions
// ---------------------------------------------------------------------------

const REPOS: RepoSpec[] = [
  { name: "web-app", fullName: "acme/web-app", stack: "react" },
  { name: "api-server", fullName: "acme/api-server", stack: "go" },
  { name: "ml-pipeline", fullName: "acme/ml-pipeline", stack: "python" },
  { name: "infra", fullName: "acme/infra", stack: "terraform" },
];

// ---------------------------------------------------------------------------
// Developer profiles
// ---------------------------------------------------------------------------

const DEVS: DevProfile[] = [
  // AI power users (70-90%)
  {
    login: "alex-chen",
    displayName: "Alex Chen",
    aiUsageMin: 0.72,
    aiUsageMax: 0.92,
    avgCycleAi: 3.8,
    avgCycleNoAi: 9.5,
    reworkProbAi: 0.16,
    reworkProbNoAi: 0.07,
    category: "power",
    repos: ["acme/web-app", "acme/api-server"],
  },
  {
    login: "priya-sharma",
    displayName: "Priya Sharma",
    aiUsageMin: 0.68,
    aiUsageMax: 0.88,
    avgCycleAi: 4.2,
    avgCycleNoAi: 10.0,
    reworkProbAi: 0.14,
    reworkProbNoAi: 0.06,
    category: "power",
    repos: ["acme/ml-pipeline", "acme/api-server"],
  },
  // Moderate users (30-60%)
  {
    login: "jordan-lee",
    displayName: "Jordan Lee",
    aiUsageMin: 0.35,
    aiUsageMax: 0.58,
    avgCycleAi: 4.8,
    avgCycleNoAi: 8.5,
    reworkProbAi: 0.1,
    reworkProbNoAi: 0.08,
    category: "moderate",
    repos: ["acme/web-app", "acme/api-server"],
  },
  {
    login: "maria-garcia",
    displayName: "Maria Garcia",
    aiUsageMin: 0.3,
    aiUsageMax: 0.55,
    avgCycleAi: 5.0,
    avgCycleNoAi: 9.0,
    reworkProbAi: 0.11,
    reworkProbNoAi: 0.07,
    category: "moderate",
    repos: ["acme/api-server", "acme/ml-pipeline"],
  },
  {
    login: "sam-okafor",
    displayName: "Sam Okafor",
    aiUsageMin: 0.4,
    aiUsageMax: 0.6,
    avgCycleAi: 4.5,
    avgCycleNoAi: 8.0,
    reworkProbAi: 0.12,
    reworkProbNoAi: 0.09,
    category: "moderate",
    repos: ["acme/infra", "acme/api-server"],
  },
  // Traditional devs (5-15%)
  {
    login: "yuki-tanaka",
    displayName: "Yuki Tanaka",
    aiUsageMin: 0.05,
    aiUsageMax: 0.14,
    avgCycleAi: 6.0,
    avgCycleNoAi: 8.2,
    reworkProbAi: 0.08,
    reworkProbNoAi: 0.07,
    category: "traditional",
    repos: ["acme/api-server", "acme/infra"],
  },
  {
    login: "carlos-ruiz",
    displayName: "Carlos Ruiz",
    aiUsageMin: 0.06,
    aiUsageMax: 0.15,
    avgCycleAi: 5.5,
    avgCycleNoAi: 9.0,
    reworkProbAi: 0.09,
    reworkProbNoAi: 0.08,
    category: "traditional",
    repos: ["acme/web-app", "acme/ml-pipeline"],
  },
  // AI skeptic (0%)
  {
    login: "diana-wolf",
    displayName: "Diana Wolf",
    aiUsageMin: 0,
    aiUsageMax: 0,
    avgCycleAi: 8.0,
    avgCycleNoAi: 7.8,
    reworkProbAi: 0.06,
    reworkProbNoAi: 0.06,
    category: "skeptic",
    repos: ["acme/api-server", "acme/infra"],
  },
];

// ---------------------------------------------------------------------------
// PR title templates by repo
// ---------------------------------------------------------------------------

const PR_TITLES: Record<string, string[]> = {
  "acme/web-app": [
    "Fix payment retry logic on checkout page",
    "Add CSV export for analytics dashboard",
    "Refactor form validation to use Zod schemas",
    "Update header navigation for mobile",
    "Fix SSR hydration mismatch in user profile",
    "Add dark mode toggle to settings",
    "Optimize bundle size by lazy-loading charts",
    "Fix accessibility issues in modal dialogs",
    "Add end-to-end tests for onboarding flow",
    "Migrate from styled-components to Tailwind",
    "Fix race condition in search autocomplete",
    "Add skeleton loaders for dashboard widgets",
    "Update error boundary with retry button",
    "Implement infinite scroll on activity feed",
    "Fix date picker timezone handling",
    "Add keyboard shortcuts for power users",
    "Refactor Redux slice to use RTK Query",
    "Fix memory leak in WebSocket connection",
    "Add A/B test wrapper component",
    "Update Storybook stories for design system",
    "Fix flaky Cypress test on login flow",
    "Add breadcrumb navigation component",
    "Improve table sorting performance",
    "Fix image lazy loading on slow connections",
    "Add drag-and-drop to kanban board",
  ],
  "acme/api-server": [
    "Fix rate limiter race condition under load",
    "Add pagination to list endpoints",
    "Implement webhook retry with exponential backoff",
    "Update OpenAPI spec for v2 endpoints",
    "Fix N+1 query in organization members",
    "Add health check endpoint with DB status",
    "Migrate user auth to JWT with refresh tokens",
    "Fix connection pool exhaustion on spikes",
    "Add request validation middleware",
    "Implement soft delete for audit trail",
    "Fix goroutine leak in background worker",
    "Add structured logging with correlation IDs",
    "Optimize bulk insert for import endpoint",
    "Fix timezone handling in cron scheduler",
    "Add circuit breaker for external API calls",
    "Implement API versioning strategy",
    "Fix deadlock in concurrent transaction",
    "Add Prometheus metrics for SLO tracking",
    "Refactor error handling to use error codes",
    "Fix graceful shutdown signal handling",
    "Add rate limiting per API key",
    "Implement idempotency keys for payments",
    "Fix SQL injection in search filter",
    "Add gRPC endpoint for internal services",
    "Update database migration for new schema",
  ],
  "acme/ml-pipeline": [
    "Fix feature drift detection false positives",
    "Add model versioning to experiment tracker",
    "Update training pipeline for new GPU instances",
    "Fix data leakage in cross-validation split",
    "Add A/B test analysis for recommendation model",
    "Implement incremental training for daily updates",
    "Fix memory OOM on large batch inference",
    "Add monitoring dashboard for model performance",
    "Update feature store with real-time features",
    "Fix data pipeline retry on S3 timeout",
    "Add hyperparameter sweep with Optuna",
    "Implement model serving with batched requests",
    "Fix label encoding for categorical features",
    "Add data quality checks to ingestion pipeline",
    "Update embedding model to latest version",
    "Fix tokenizer compatibility with new corpus",
    "Add bias detection metrics to eval suite",
    "Implement canary deployment for model updates",
    "Fix Spark job partitioning for skewed data",
    "Add cost tracking for training runs",
    "Update preprocessing for multilingual support",
    "Fix wandb logging for distributed training",
    "Add model card generation for compliance",
    "Implement shadow scoring pipeline",
    "Fix numpy deprecation warnings in feature eng",
  ],
  "acme/infra": [
    "Update CI pipeline to use cached layers",
    "Fix Terraform state lock on concurrent applies",
    "Add auto-scaling policy for API servers",
    "Migrate secrets from env vars to Vault",
    "Fix DNS propagation delay in blue-green deploy",
    "Add cost alerting for cloud spend anomalies",
    "Update Kubernetes manifests for node pool change",
    "Fix certificate renewal automation",
    "Add Datadog monitoring for new services",
    "Implement disaster recovery runbook as code",
    "Fix log aggregation pipeline dropping events",
    "Add network policy for service mesh",
    "Update Terraform provider versions",
    "Fix Docker image vulnerability scanning",
    "Add staging environment parity check",
    "Implement GitOps with ArgoCD for deploys",
    "Fix backup verification cron job",
    "Add cost tags for team-level attribution",
    "Update load balancer health check config",
    "Fix permission boundary for new IAM roles",
    "Add PagerDuty integration for alerts",
    "Implement canary analysis with Flagger",
    "Fix resource quota for namespace isolation",
    "Add compliance audit trail for SOC2",
    "Update CDN cache invalidation strategy",
  ],
};

// ---------------------------------------------------------------------------
// AI detection markers
// ---------------------------------------------------------------------------

function generateAiMarkers(): string[] {
  const markers: string[] = [];
  const r = rand();
  if (r < 0.35) {
    markers.push("co-author: Co-Authored-By: GitHub Copilot <copilot@github.com>");
  } else if (r < 0.6) {
    markers.push("co-author: Co-Authored-By: Claude <claude@anthropic.com>");
  } else if (r < 0.75) {
    markers.push("pr-body: Generated with Claude Code");
    if (rand() < 0.4) markers.push("ai-config: CLAUDE.md");
  } else if (r < 0.85) {
    markers.push("co-author: Co-Authored-By: Cursor AI <cursor@cursor.sh>");
  } else {
    markers.push("commit-pattern: bulk-generated");
    if (rand() < 0.3) markers.push("pr-body: assisted by ai");
  }
  return markers;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgoDate(daysAgo: number, hourOffset = 0): Date {
  const d = new Date(NOW);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(9 + hourOffset, randInt(0, 59), randInt(0, 59), 0);
  return d;
}

function gaussRand(mean: number, stddev: number): number {
  // Box-Muller transform
  const u1 = rand();
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2);
  return Math.max(0.5, mean + z * stddev);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday
  d.setDate(d.getDate() + diff);
  return d;
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("Cleaning existing data...");

  // Clean in dependency order
  await prisma.pRMetric.deleteMany();
  await prisma.pullRequest.deleteMany();
  await prisma.weeklySnapshot.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  // Don't delete orgs/users yet, upsert them

  // -----------------------------------------------------------------------
  // Organization
  // -----------------------------------------------------------------------
  console.log("Creating organization...");
  const org = await prisma.organization.upsert({
    where: { id: DEMO_ORG_ID },
    update: { name: "Acme Corp" },
    create: { id: DEMO_ORG_ID, name: "Acme Corp" },
  });

  // -----------------------------------------------------------------------
  // Demo user
  // -----------------------------------------------------------------------
  console.log("Creating demo user...");
  const demoUser = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: { name: "Demo User", email: DEMO_EMAIL },
    create: {
      id: DEMO_USER_ID,
      name: "Demo User",
      email: DEMO_EMAIL,
      image: "https://api.dicebear.com/7.x/initials/svg?seed=DU",
    },
  });

  await prisma.organizationMember.create({
    data: {
      userId: demoUser.id,
      orgId: org.id,
      role: "admin",
    },
  });

  // -----------------------------------------------------------------------
  // Repositories
  // -----------------------------------------------------------------------
  console.log("Creating repositories...");
  const repoMap: Record<string, string> = {};
  for (const r of REPOS) {
    const repo = await prisma.repository.upsert({
      where: { fullName: r.fullName },
      update: {},
      create: {
        orgId: org.id,
        name: r.name,
        fullName: r.fullName,
        isActive: true,
      },
    });
    repoMap[r.fullName] = repo.id;
  }

  // -----------------------------------------------------------------------
  // Developers
  // -----------------------------------------------------------------------
  console.log("Creating developers...");
  const devMap: Record<string, string> = {};
  for (const d of DEVS) {
    const dev = await prisma.developer.upsert({
      where: { orgId_githubLogin: { orgId: org.id, githubLogin: d.login } },
      update: {},
      create: {
        orgId: org.id,
        githubLogin: d.login,
        displayName: d.displayName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${d.login}`,
      },
    });
    devMap[d.login] = dev.id;
  }

  // -----------------------------------------------------------------------
  // Pull Requests + Metrics
  // -----------------------------------------------------------------------
  console.log("Generating pull requests...");

  // Track titles used per repo to avoid duplicates
  const usedTitles: Record<string, Set<string>> = {};
  for (const r of REPOS) usedTitles[r.fullName] = new Set();

  // PR number counter per repo
  const prCounters: Record<string, number> = {};
  for (const r of REPOS) prCounters[r.fullName] = 1;

  // Collect all PRs for batch insert
  const allPrs: Array<{
    repoId: string;
    developerId: string;
    number: number;
    title: string;
    author: string;
    state: string;
    createdAt: Date;
    mergedAt: Date | null;
    closedAt: Date | null;
    isAiAssisted: boolean;
    aiMarkers: string[];
    linesAdded: number;
    linesRemoved: number;
    commits: number;
  }> = [];

  for (let daysAgo = TOTAL_DAYS; daysAgo >= 0; daysAgo--) {
    const baseDate = daysAgoDate(daysAgo);
    // Skip weekends
    if (baseDate.getDay() === 0 || baseDate.getDay() === 6) continue;

    // AI adoption grows over time: early = 15%, late = 38% base
    const weekProgress = (TOTAL_DAYS - daysAgo) / TOTAL_DAYS;

    // 3-5 PRs per day on average
    const prsToday = randInt(2, 6);

    for (let j = 0; j < prsToday; j++) {
      // Pick a developer
      const dev = pick(DEVS);
      // Pick a repo (weighted toward developer's preferred repos)
      const repoFullName = rand() < 0.75
        ? pick(dev.repos)
        : pick(REPOS).fullName;

      const repoId = repoMap[repoFullName];
      const devId = devMap[dev.login];

      // Determine AI usage for this dev at this time
      const aiRate = dev.aiUsageMin + (dev.aiUsageMax - dev.aiUsageMin) * weekProgress;
      const isAi = rand() < aiRate;

      // Cycle time with gaussian variance
      const baseCycle = isAi ? dev.avgCycleAi : dev.avgCycleNoAi;
      const cycleHours = gaussRand(baseCycle, baseCycle * 0.35);

      // Lines changed — AI PRs tend to be slightly larger
      const linesAdded = isAi
        ? randInt(30, 400)
        : randInt(15, 280);
      const linesRemoved = Math.floor(linesAdded * (0.15 + rand() * 0.35));

      // Pick a title
      const titlePool = PR_TITLES[repoFullName];
      let title: string;
      const available = titlePool.filter((t) => !usedTitles[repoFullName].has(t));
      if (available.length > 0) {
        title = pick(available);
        usedTitles[repoFullName].add(title);
      } else {
        // Titles exhausted — generate a variant
        title = `${pick(titlePool)} (iteration ${randInt(2, 9)})`;
      }

      // AI markers
      const markers = isAi ? generateAiMarkers() : [];

      // Merge time
      const createdAt = new Date(baseDate);
      createdAt.setHours(createdAt.getHours() + randInt(0, 3));
      const mergedAt = new Date(createdAt);
      mergedAt.setMinutes(mergedAt.getMinutes() + Math.round(cycleHours * 60));

      // A few PRs are still open or closed without merge
      let state = "closed";
      let finalMergedAt: Date | null = mergedAt;
      let closedAt: Date | null = mergedAt;
      if (daysAgo < 3 && rand() < 0.2) {
        state = "open";
        finalMergedAt = null;
        closedAt = null;
      } else if (rand() < 0.03) {
        // Closed without merge (abandoned)
        state = "closed";
        finalMergedAt = null;
      }

      const prNumber = prCounters[repoFullName]++;

      allPrs.push({
        repoId,
        developerId: devId,
        number: prNumber,
        title,
        author: dev.login,
        state,
        createdAt,
        mergedAt: finalMergedAt,
        closedAt,
        isAiAssisted: isAi,
        aiMarkers: markers,
        linesAdded,
        linesRemoved,
        commits: isAi ? randInt(1, 4) : randInt(1, 7),
      });
    }
  }

  console.log(`  Creating ${allPrs.length} pull requests...`);

  // Batch insert PRs (Prisma createMany does not return IDs, so we insert
  // and then query back)
  await prisma.pullRequest.createMany({ data: allPrs });

  // Retrieve all PRs to build metrics
  const insertedPrs = await prisma.pullRequest.findMany({
    where: { repo: { orgId: org.id } },
    orderBy: { createdAt: "asc" },
  });

  console.log(`  Creating ${insertedPrs.length} PR metrics...`);

  // Build metrics with batch insert
  const metrics = insertedPrs.map((pr) => {
    const dev = DEVS.find((d) => d.login === pr.author)!;
    const cycleHours = pr.mergedAt
      ? (pr.mergedAt.getTime() - pr.createdAt.getTime()) / (1000 * 60 * 60)
      : null;

    const reworkProb = pr.isAiAssisted ? dev.reworkProbAi : dev.reworkProbNoAi;
    const hasRework = rand() < reworkProb;
    const bugProb = pr.isAiAssisted ? 0.055 : 0.03;
    const hasBug = rand() < bugProb;

    // AI PRs get more review comments on average (reviewers scrutinize more)
    const reviewComments = pr.isAiAssisted
      ? randInt(1, 8)
      : randInt(0, 5);

    return {
      prId: pr.id,
      cycleTimeHours: cycleHours ? +cycleHours.toFixed(2) : null,
      reviewComments,
      forcePushes: randInt(0, pr.isAiAssisted ? 1 : 2),
      reworkPrsCount: hasRework ? randInt(1, 2) : 0,
      bugsWithin14d: hasBug ? 1 : 0,
      codeChurn: hasRework ? Math.floor(pr.linesAdded * (0.25 + rand() * 0.3)) : 0,
    };
  });

  await prisma.pRMetric.createMany({ data: metrics });

  // -----------------------------------------------------------------------
  // Weekly Snapshots (12 weeks)
  // -----------------------------------------------------------------------
  console.log("Computing weekly snapshots...");

  // Group PRs by week
  const weekBuckets: Record<string, typeof insertedPrs> = {};
  for (const pr of insertedPrs) {
    const ws = getWeekStart(pr.createdAt);
    const key = ws.toISOString();
    if (!weekBuckets[key]) weekBuckets[key] = [];
    weekBuckets[key].push(pr);
  }

  // Map PR id -> metric for quick lookup
  const metricByPrId: Record<string, (typeof metrics)[0]> = {};
  for (const m of metrics) metricByPrId[m.prId] = m;

  // Sort weeks and take last 12
  const sortedWeeks = Object.keys(weekBuckets).sort();
  const last12Weeks = sortedWeeks.slice(-12);

  const snapshots = last12Weeks.map((weekKey, idx) => {
    const prs = weekBuckets[weekKey];
    const weekStart = new Date(weekKey);

    const aiPrs = prs.filter((p) => p.isAiAssisted);
    const nonAiPrs = prs.filter((p) => !p.isAiAssisted);

    const totalPrs = prs.length;
    const aiCount = aiPrs.length;
    const aiUsagePct = totalPrs > 0 ? +((aiCount / totalPrs) * 100).toFixed(1) : 0;

    // Average cycle times
    const aiCycleTimes = aiPrs
      .map((p) => metricByPrId[p.id]?.cycleTimeHours)
      .filter((v): v is number => v != null);
    const nonAiCycleTimes = nonAiPrs
      .map((p) => metricByPrId[p.id]?.cycleTimeHours)
      .filter((v): v is number => v != null);

    const avgCycleTimeAi =
      aiCycleTimes.length > 0
        ? +(aiCycleTimes.reduce((a, b) => a + b, 0) / aiCycleTimes.length).toFixed(1)
        : null;
    const avgCycleTimeNoai =
      nonAiCycleTimes.length > 0
        ? +(nonAiCycleTimes.reduce((a, b) => a + b, 0) / nonAiCycleTimes.length).toFixed(1)
        : null;

    // Rework rates
    const aiRework = aiPrs.filter((p) => (metricByPrId[p.id]?.reworkPrsCount ?? 0) > 0).length;
    const nonAiRework = nonAiPrs.filter(
      (p) => (metricByPrId[p.id]?.reworkPrsCount ?? 0) > 0
    ).length;

    const reworkRateAi =
      aiCount > 0 ? +((aiRework / aiCount) * 100).toFixed(1) : null;
    const reworkRateNoai =
      nonAiPrs.length > 0
        ? +((nonAiRework / nonAiPrs.length) * 100).toFixed(1)
        : null;

    // Bug rates
    const aiBugs = aiPrs.filter((p) => (metricByPrId[p.id]?.bugsWithin14d ?? 0) > 0).length;
    const nonAiBugs = nonAiPrs.filter(
      (p) => (metricByPrId[p.id]?.bugsWithin14d ?? 0) > 0
    ).length;

    const bugRateAi =
      aiCount > 0 ? +((aiBugs / aiCount) * 100).toFixed(1) : null;
    const bugRateNoai =
      nonAiPrs.length > 0
        ? +((nonAiBugs / nonAiPrs.length) * 100).toFixed(1)
        : null;

    // ROI score: speed gain minus quality cost, normalized
    // Positive = net positive. Realistic range: +10 to +20
    const speedMultiplier =
      avgCycleTimeAi && avgCycleTimeNoai
        ? avgCycleTimeNoai / avgCycleTimeAi
        : 1;
    const reworkPenalty =
      reworkRateAi != null && reworkRateNoai != null
        ? Math.max(0, reworkRateAi - reworkRateNoai)
        : 0;
    const roiScore = +((speedMultiplier - 1) * 20 - reworkPenalty * 0.5 + 8 + idx * 0.5).toFixed(
      1
    );

    return {
      orgId: org.id,
      weekStart,
      totalPrs,
      aiPrs: aiCount,
      aiUsagePct,
      avgCycleTimeAi,
      avgCycleTimeNoai,
      reworkRateAi,
      reworkRateNoai,
      bugRateAi,
      bugRateNoai,
      roiScore: Math.min(25, Math.max(8, roiScore)),
    };
  });

  await prisma.weeklySnapshot.createMany({ data: snapshots });

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------
  const aiPrCount = allPrs.filter((p) => p.isAiAssisted).length;
  const reworkCount = metrics.filter((m) => m.reworkPrsCount > 0).length;

  console.log("\n=== Seed Complete ===");
  console.log(`Organization: ${org.name}`);
  console.log(`Demo user:    ${DEMO_EMAIL}`);
  console.log(`Repositories: ${REPOS.length}`);
  console.log(`Developers:   ${DEVS.length}`);
  console.log(`Pull requests: ${allPrs.length} (${aiPrCount} AI-assisted)`);
  console.log(`PR metrics:   ${metrics.length}`);
  console.log(`  - with rework: ${reworkCount}`);
  console.log(`  - with bugs: ${metrics.filter((m) => m.bugsWithin14d > 0).length}`);
  console.log(`Weekly snapshots: ${snapshots.length}`);
  console.log(
    `AI usage trend: ${snapshots[0]?.aiUsagePct ?? 0}% -> ${snapshots[snapshots.length - 1]?.aiUsagePct ?? 0}%`
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
