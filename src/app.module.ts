import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './infrastructure/github/github.module';
import { SlackModule } from './infrastructure/slack/slack.module';
import { AiModule } from './infrastructure/ai/ai.module';
import { WebhookController } from './interfaces/http/webhook.controller';
import { SummarizePrUseCase } from './application/use-cases/summarize-pr.use-case';
import { PrRepositoryImpl } from './infrastructure/persistence/pr.repository.impl';
import { PrRepository } from './domain/repositories/pr.repository';
import { githubConfig, slackConfig, geminiConfig } from './infrastructure/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [githubConfig, slackConfig, geminiConfig],
      isGlobal: true,
    }),
    GithubModule,
    SlackModule,
    AiModule,
  ],
  controllers: [WebhookController],
  providers: [
    SummarizePrUseCase,
    {
      provide: PrRepository,
      useClass: PrRepositoryImpl,
    },
  ],
})
export class AppModule {}
