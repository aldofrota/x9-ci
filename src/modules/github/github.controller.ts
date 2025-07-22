import { Controller, Post, Body } from '@nestjs/common';
import { PullRequestInfoUseCase } from './pull-request-info.use-case';
import { GithubWebhookPayload } from './github.types';

@Controller('github')
export class GithubController {
  constructor(
    private readonly pullRequestInfoUseCase: PullRequestInfoUseCase,
  ) {}

  @Post('webhook')
  async handleWebhook(@Body() payload: GithubWebhookPayload) {
    const isMergedToMain =
      payload.action === 'closed' &&
      payload.pull_request.merged === true &&
      payload.pull_request.base.ref === 'main';

    if (!isMergedToMain) return;

    const { owner, repo } = this.extractRepoFullName(payload.pull_request.url);
    const prNumber = payload.number;

    return this.pullRequestInfoUseCase.execute({
      prNumber,
      owner,
      repo,
    });
  }

  private extractRepoFullName(pullRequestUrl: string): {
    owner: string;
    repo: string;
  } {
    const match = pullRequestUrl.match(/repos\/([^/]+\/[^/]+)\/pulls\/\d+/);
    if (!match) {
      throw new Error('Repositório não pôde ser extraído da URL do PR.');
    }
    const [owner, repo] = match[1].split('/');
    return { owner, repo };
  }
}
