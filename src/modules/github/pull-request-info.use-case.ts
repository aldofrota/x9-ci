import { Injectable } from '@nestjs/common';
import { PullRequestInfoInput } from './github.types';
import { GithubApiService } from './github-api.service';
import { GeminiService } from '@/modules/ai/gemini.service';
import { SlackService } from '@/modules/slack/slack.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PullRequestInfoUseCase {
  constructor(
    private readonly githubApiService: GithubApiService,
    private readonly geminiService: GeminiService,
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
  ) {}

  async execute(payload: PullRequestInfoInput): Promise<void> {
    await this.handlePullRequestInfo(payload);
  }

  private async handlePullRequestInfo(
    payload: PullRequestInfoInput,
  ): Promise<void> {
    const { prNumber, repo } = payload;

    const summary = this.configService.get<boolean>('webhook.summary');

    const prInfos = await this.githubApiService.getPullRequestSummary(
      repo,
      prNumber,
    );

    if (summary) {
      const summary = await this.geminiService.generateSummary(prInfos);
      await this.slackService.sendPrMergedNotification(prInfos, summary);
    } else {
      await this.slackService.sendPrMergedNotification(prInfos, null);
    }
  }
}
