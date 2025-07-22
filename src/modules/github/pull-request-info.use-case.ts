import { Injectable } from '@nestjs/common';
import { PullRequestInfoInput } from './github.types';
import { GithubApiService } from './github-api.service';
import { GeminiService } from '@/modules/ai/gemini.service';
import { SlackService } from '@/modules/slack/slack.service';

@Injectable()
export class PullRequestInfoUseCase {
  constructor(
    private readonly githubApiService: GithubApiService,
    private readonly geminiService: GeminiService,
    private readonly slackService: SlackService,
  ) {}

  async execute(payload: PullRequestInfoInput): Promise<void> {
    await this.handlePullRequestInfo(payload);
  }

  private async handlePullRequestInfo(
    payload: PullRequestInfoInput,
  ): Promise<void> {
    const { prNumber, owner, repo } = payload;

    console.log('🔍 Buscando informações do PR...');

    const prInfos = await this.githubApiService.getPullRequestSummary(
      'ResultadosDigitais',
      'rdsc-megasac-api',
      926,
    );

    const summary = await this.geminiService.generateSummary(prInfos);

    await this.slackService.sendPrMergedNotification(prInfos, summary);

    console.log('✅ Notificação enviada para o Slack');
  }
}
