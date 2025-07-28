export interface PullRequestInfoInput {
  prNumber: number;
  repo: string;
}

export interface PullRequest {
  url: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  mergedAt: string;
  state: string;
  commits: number;
  additions: number;
  deletions: number;
  changedFiles: number;
  repoName: string;
  repoUrl: string;
}

export interface PullRequestFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  codeowners: string[];
}

export interface PullRequestReview {
  login: string;
  state: string;
}

export interface PullRequestSummary {
  pullRequest: PullRequest;
  files: PullRequestFile[];
  diff: string;
  reviews: PullRequestReview[];
}
