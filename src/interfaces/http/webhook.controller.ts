import { Controller, Post, Body } from '@nestjs/common';
import { SummarizePrUseCase } from '../../application/use-cases/summarize-pr.use-case';
import { SummarizePrDto } from '../../application/dtos/summarize-pr.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly summarizePrUseCase: SummarizePrUseCase) {}

  @Post('summarize-pr')
  async summarizePr(@Body() dto: SummarizePrDto): Promise<{ summary: string }> {
    const summary = await this.summarizePrUseCase.execute(dto);
    return { summary };
  }
}
