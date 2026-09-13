import { Octokit } from "@octokit/rest";

export function createOctokit(token: string): Octokit {
  return new Octokit({ auth: token });
}

export async function fetchPRDetails(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
) {
  const [pr, commits, files, reviews] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number: prNumber }),
    octokit.pulls.listCommits({ owner, repo, pull_number: prNumber, per_page: 100 }),
    octokit.pulls.listFiles({ owner, repo, pull_number: prNumber, per_page: 100 }),
    octokit.pulls.listReviews({ owner, repo, pull_number: prNumber, per_page: 100 }),
  ]);

  const commitMessages = commits.data.map((c) => c.commit.message);
  const changedFiles = files.data.map((f) => f.filename);
  const linesAdded = files.data.reduce((s, f) => s + f.additions, 0);
  const linesRemoved = files.data.reduce((s, f) => s + f.deletions, 0);
  const reviewComments = reviews.data.length;

  const firstCommitDate = commits.data[0]?.commit.author?.date;
  const lastCommitDate = commits.data[commits.data.length - 1]?.commit.author?.date;
  let authoredDurationMinutes: number | undefined;
  if (firstCommitDate && lastCommitDate) {
    authoredDurationMinutes =
      (new Date(lastCommitDate).getTime() - new Date(firstCommitDate).getTime()) / 60000;
  }

  const requestedChanges = reviews.data.filter(
    (r) => r.state === "CHANGES_REQUESTED"
  ).length;

  return {
    pr: pr.data,
    commitMessages,
    changedFiles,
    linesAdded,
    linesRemoved,
    commitCount: commits.data.length,
    reviewComments,
    requestedChanges,
    authoredDurationMinutes,
    prBody: pr.data.body ?? "",
  };
}
