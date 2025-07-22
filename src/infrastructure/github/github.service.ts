import { Injectable } from '@nestjs/common';
import { PullRequest } from '../../domain/entities/pull-request.entity';

@Injectable()
export class GithubService {
  async handleWebhook(payload: any, event: string): Promise<void> {
    if (event === 'pull_request') {
      await this.handlePullRequestEvent(payload);
    }
  }

  private async handlePullRequestEvent(payload: any): Promise<void> {
    const pullRequest = this.mapToPullRequest(payload.pull_request);
    // Implementar lógica de processamento do PR =>
  }

  private mapToPullRequest(prData: any): PullRequest {
    return new PullRequest(
      prData.id.toString(),
      prData.title,
      prData.body || '',
      prData.user.login,
      prData.base.repo.name,
      prData.base.repo.owner.login,
      [], // files serão carregados separadamente
      [], // commits serão carregados separadamente
      new Date(prData.created_at),
      new Date(prData.updated_at),
    );
  }
}
