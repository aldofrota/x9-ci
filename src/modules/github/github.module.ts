import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubApiService } from './github-api.service';
import { SlackModule } from '../slack/slack.module';
import { AiModule } from '../ai/ai.module';
import { PullRequestInfoUseCase } from './pull-request-info.use-case';

@Module({
  imports: [SlackModule, AiModule],
  controllers: [GithubController],
  providers: [GithubApiService, PullRequestInfoUseCase],
  exports: [GithubApiService],
})
export class GithubModule {}
