import { Injectable } from '@nestjs/common';
import { PullRequestSummary } from '@/modules/github/github.types';

@Injectable()
export class GeminiService {
  async generateSummary(input: PullRequestSummary): Promise<string> {
    const prompt = this.buildPrompt(input);

    console.log('prompt', prompt);

    return `Resumo do PR #${input.pullRequest.url}: ${input.pullRequest.title}`;
  }

  private buildPrompt(input: PullRequestSummary): string {
    return `
      Analise este pull request e gere um resumo conciso:
      
      Título: ${input.pullRequest.title}
      Descrição: ${input.pullRequest.body}
      Autor: ${input.pullRequest.author}
      Diffs: ${input.diff}

      Eu quero que você retorne um resumo do PR em markdown, com as seguintes informações:

      Resumo de tudo que foi alterado e o impacto que isso pode ter e pontos de atenção num formato json.
    `;
  }
}
