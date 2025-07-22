import { Controller, Post, Body, Headers } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post('webhook')
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-github-event') event: string,
  ) {
    return this.githubService.handleWebhook(payload, event);
  }
} 