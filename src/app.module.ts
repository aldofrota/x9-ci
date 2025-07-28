import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './modules/github/github.module';
import { SlackModule } from './modules/slack/slack.module';
import { AiModule } from './modules/ai/ai.module';
import {
  githubConfig,
  slackConfig,
  geminiConfig,
  webhook,
} from './config/env.config';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [githubConfig, slackConfig, geminiConfig, webhook],
      isGlobal: true,
    }),
    GithubModule,
    SlackModule,
    AiModule,
    WebhookModule,
  ],
})
export class AppModule {}
