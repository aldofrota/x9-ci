import { PullRequest } from '../entities/pull-request.entity';

export interface PrRepository {
  findById(id: string): Promise<PullRequest | null>;
  findByRepository(owner: string, repository: string): Promise<PullRequest[]>;
  save(pullRequest: PullRequest): Promise<void>;
}
