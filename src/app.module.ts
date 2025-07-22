import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './modules/github/github.module';
import { SlackModule } from './modules/slack/slack.module';
import { AiModule } from './modules/ai/ai.module';
import { githubConfig, slackConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [githubConfig, slackConfig],
      isGlobal: true,
    }),
    GithubModule,
    SlackModule,
    AiModule,
  ],
})
export class AppModule {}
