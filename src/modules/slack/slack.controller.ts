import { Controller, Post, Body } from '@nestjs/common';
import { SlackPayload } from './slack.types';
import { PullRequestInfoUseCase } from '@/modules/github/pull-request-info.use-case';

interface PullRequestInfo {
  owner: string;
  repo: string;
  prNumber: number;
}

@Controller('slack')
export class SlackController {
  constructor(
    private readonly pullRequestInfoUseCase: PullRequestInfoUseCase,
  ) {}

  @Post('review')
  async handle(@Body() payload: SlackPayload) {
    const { text } = payload;
    const { owner, repo, prNumber } = this.extractPullRequestInfo(text);

    return this.pullRequestInfoUseCase.execute({
      prNumber,
      owner,
      repo,
      summary: true,
    });
  }

  private extractPullRequestInfo(pullRequestUrl: string): PullRequestInfo {
    const match = pullRequestUrl.match(
      /github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/,
    );

    if (!match) {
      throw new Error('Informações do PR não puderam ser extraídas da URL.');
    }

    const [owner, repo] = match[1].split('/');
    const prNumber = parseInt(match[2], 10);

    if (!prNumber || isNaN(prNumber)) {
      throw new Error('Número do PR inválido.');
    }

    return { owner, repo, prNumber };
  }
}
