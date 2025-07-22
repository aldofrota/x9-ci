import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { SummaryService } from './summary.service';

@Module({
  providers: [
    {
      provide: 'GEMINI_SUMMARY_SERVICE',
      useClass: GeminiService,
    },
    SummaryService,
  ],
  exports: ['GEMINI_SUMMARY_SERVICE', SummaryService],
})
export class AiModule {}
