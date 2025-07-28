import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { GithubModule } from '../github/github.module';
import { SlackModule } from '../slack/slack.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [GithubModule, SlackModule, AiModule],
  controllers: [WebhookController],
  providers: [ConfigService],
  exports: [],
})
export class WebhookModule {}
