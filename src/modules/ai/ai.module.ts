import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Module({
  providers: [
    {
      provide: 'GEMINI_SERVICE',
      useClass: GeminiService,
    },
  ],
  exports: ['GEMINI_SERVICE'],
})
export class AiModule {}
