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
