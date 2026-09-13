import { prisma } from "@/lib/db/prisma";
import { detectAiMarkers } from "@/lib/analyzer/ai-detection";

interface WebhookPRPayload {
  action: string;
  pull_request: {
    number: number;
    title: string;
    body: string | null;
    state: string;
    user: { login: string; avatar_url: string };
    created_at: string;
    merged_at: string | null;
    closed_at: string | null;
    additions: number;
    deletions: number;
    commits: number;
    changed_files: number;
    review_comments: number;
  };
  repository: {
    full_name: string;
    name: string;
  };
  installation?: { id: number };
}

export async function handlePullRequestEvent(payload: WebhookPRPayload) {
  const { action, pull_request: pr, repository } = payload;

  if (!["opened", "closed", "synchronize", "edited"].includes(action)) {
    return { status: "ignored", action };
  }

  const repo = await prisma.repository.findUnique({
    where: { fullName: repository.full_name },
    include: { org: true },
  });
  if (!repo) {
    return { status: "repo_not_found", fullName: repository.full_name };
  }

  let developer = await prisma.developer.findUnique({
    where: { orgId_githubLogin: { orgId: repo.orgId, githubLogin: pr.user.login } },
  });
  if (!developer) {
    developer = await prisma.developer.create({
      data: {
        orgId: repo.orgId,
        githubLogin: pr.user.login,
        displayName: pr.user.login,
        avatarUrl: pr.user.avatar_url,
      },
    });
  }

  const detection = detectAiMarkers({
    commitMessages: [],
    prBody: pr.body ?? "",
    changedFiles: [],
    linesAdded: pr.additions,
    commitCount: pr.commits,
  });

  const cycleTimeHours =
    pr.merged_at && pr.created_at
      ? (new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()) / 3600000
      : null;

  const prRecord = await prisma.pullRequest.upsert({
    where: { repoId_number: { repoId: repo.id, number: pr.number } },
    update: {
      title: pr.title,
      state: pr.state,
      mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
      closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
      isAiAssisted: detection.isAiAssisted,
      aiMarkers: detection.markers,
      linesAdded: pr.additions,
      linesRemoved: pr.deletions,
      commits: pr.commits,
    },
    create: {
      repoId: repo.id,
      developerId: developer.id,
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      state: pr.state,
      createdAt: new Date(pr.created_at),
      mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
      closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
      isAiAssisted: detection.isAiAssisted,
      aiMarkers: detection.markers,
      linesAdded: pr.additions,
      linesRemoved: pr.deletions,
      commits: pr.commits,
    },
  });

  await prisma.pRMetric.upsert({
    where: { prId: prRecord.id },
    update: {
      cycleTimeHours,
      reviewComments: pr.review_comments,
    },
    create: {
      prId: prRecord.id,
      cycleTimeHours,
      reviewComments: pr.review_comments,
    },
  });

  return {
    status: "processed",
    action,
    prNumber: pr.number,
    isAiAssisted: detection.isAiAssisted,
    markers: detection.markers,
  };
}
