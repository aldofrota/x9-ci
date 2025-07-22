import { Injectable } from '@nestjs/common';
import { PrRepository } from '../../domain/repositories/pr.repository';
import { PullRequest } from '../../domain/entities/pull-request.entity';

@Injectable()
export class PrRepositoryImpl implements PrRepository {
  private pullRequests: Map<string, PullRequest> = new Map();

  async findById(id: string): Promise<PullRequest | null> {
    return this.pullRequests.get(id) || null;
  }

  async findByRepository(
    owner: string,
    repository: string,
  ): Promise<PullRequest[]> {
    return Array.from(this.pullRequests.values()).filter(
      (pr) => pr.owner === owner && pr.repository === repository,
    );
  }

  async save(pullRequest: PullRequest): Promise<void> {
    this.pullRequests.set(pullRequest.id, pullRequest);
  }
}
