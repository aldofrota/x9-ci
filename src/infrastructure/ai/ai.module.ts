import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiSummaryService } from '../../domain/services/gemini-summary.service';

@Module({
  providers: [
    {
      provide: GeminiSummaryService,
      useClass: GeminiService,
    },
  ],
  exports: [GeminiSummaryService],
})
export class AiModule {}
