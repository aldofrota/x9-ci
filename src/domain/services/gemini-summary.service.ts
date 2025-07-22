import { PullRequest } from '../entities/pull-request.entity';

export interface GeminiSummaryService {
  generateSummary(pullRequest: PullRequest): Promise<string>;
}
