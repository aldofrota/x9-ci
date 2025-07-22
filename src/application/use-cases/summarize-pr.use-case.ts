import { Injectable } from '@nestjs/common';
import { SummarizePrDto } from '../dtos/summarize-pr.dto';
import { PrRepository } from '../../domain/repositories/pr.repository';
import { GeminiSummaryService } from '../../domain/services/gemini-summary.service';

@Injectable()
export class SummarizePrUseCase {
  constructor(
    private readonly prRepository: PrRepository,
    private readonly geminiSummaryService: GeminiSummaryService,
  ) {}

  async execute(dto: SummarizePrDto): Promise<string> {
    const pullRequest = await this.prRepository.findById(dto.prId);

    if (!pullRequest) {
      throw new Error('Pull request não encontrado');
    }

    const summary =
      await this.geminiSummaryService.generateSummary(pullRequest);

    return summary;
  }
}
