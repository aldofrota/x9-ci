export interface GithubWebhookPayload {
  action: string;
  number: number;
  pull_request: {
    url: string;
    merged: boolean;
    base: {
      ref: string;
    };
  };
}

export interface PullRequestInfoInput {
  prNumber: number;
  owner: string;
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
