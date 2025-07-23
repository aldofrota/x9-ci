import { Module, forwardRef } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubApiService } from './github-api.service';
import { SlackModule } from '../slack/slack.module';
import { AiModule } from '../ai/ai.module';
import { PullRequestInfoUseCase } from './pull-request-info.use-case';

@Module({
  imports: [forwardRef(() => SlackModule), AiModule],
  controllers: [GithubController],
  providers: [GithubApiService, PullRequestInfoUseCase],
  exports: [GithubApiService, PullRequestInfoUseCase],
})
export class GithubModule {}
