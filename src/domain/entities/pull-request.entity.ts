export class PullRequest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly author: string,
    public readonly repository: string,
    public readonly owner: string,
    public readonly files: string[],
    public readonly commits: Commit[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: Date;
} 