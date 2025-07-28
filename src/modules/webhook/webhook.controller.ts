import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PullRequestInfoUseCase } from '../github/pull-request-info.use-case';
import { WebhookGuard } from './webhook.guard';
import { WebhookDto } from './webhook.dto';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly pullRequestInfoUseCase: PullRequestInfoUseCase,
  ) {}

  @Post()
  @UseGuards(WebhookGuard)
  async handle(@Body() payload: WebhookDto) {
    const { pr, service } = payload;

    this.pullRequestInfoUseCase
      .execute({
        prNumber: pr,
        repo: service,
      })
      .catch((error) => {
        console.error('Erro no processamento do webhook:', error);
      });

    return {
      success: true,
      message: 'Webhook received and processing started',
    };
  }
}
