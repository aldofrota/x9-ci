import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackService } from './slack.service';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [ConfigModule, forwardRef(() => GithubModule)],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
