import { prisma } from "@/lib/db/prisma";
import { detectAiMarkers } from "@/lib/analyzer/ai-detection";
import { createOctokit, fetchPRDetails } from "@/lib/github/client";

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

  const defaultOrg = await prisma.organization.findFirst();
  if (!defaultOrg) {
    return { status: "no_org", error: "No organization exists yet" };
  }

  let repo = await prisma.repository.findUnique({
    where: { fullName: repository.full_name },
    include: { org: true },
  });
  if (!repo) {
    repo = await prisma.repository.create({
      data: {
        orgId: defaultOrg.id,
        name: repository.name,
        fullName: repository.full_name,
      },
      include: { org: true },
    });
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

  let commitMessages: string[] = [];
  let changedFiles: string[] = [];
  let authoredDurationMinutes: number | undefined;
  let reviewComments = pr.review_comments;

  const userAccount = await prisma.account.findFirst({
    where: { provider: "github" },
    select: { access_token: true },
  });
  if (userAccount?.access_token) {
    try {
      const [owner, repoName] = repository.full_name.split("/");
      const octokit = createOctokit(userAccount.access_token);
      const details = await fetchPRDetails(octokit, owner, repoName, pr.number);
      commitMessages = details.commitMessages;
      changedFiles = details.changedFiles;
      authoredDurationMinutes = details.authoredDurationMinutes;
      reviewComments = details.reviewComments;
    } catch {
      // Fall back to payload data if API call fails
    }
  }

  const detection = detectAiMarkers({
    commitMessages,
    prBody: pr.body ?? "",
    changedFiles,
    linesAdded: pr.additions,
    commitCount: pr.commits,
    authoredDurationMinutes,
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
      reviewComments,
    },
    create: {
      prId: prRecord.id,
      cycleTimeHours,
      reviewComments,
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
