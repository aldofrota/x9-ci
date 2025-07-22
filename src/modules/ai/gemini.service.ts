import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  async generateSummary(pullRequest: any): Promise<string> {
    // Implementar integração com Gemini API
    const prompt = this.buildPrompt(pullRequest);

    console.log('prompt', prompt);

    // Aqui seria feita a chamada para a API do Gemini
    // Por enquanto retornando um resumo mock
    return `Resumo do PR #${pullRequest.id}: ${pullRequest.title}`;
  }

  private buildPrompt(pullRequest: any): string {
    return `
      Analise este pull request e gere um resumo conciso:
      
      Título: ${pullRequest.title}
      Descrição: ${pullRequest.description}
      Autor: ${pullRequest.author}
      Arquivos modificados: ${pullRequest.files.length}
      Commits: ${pullRequest.commits.length}
    `;
  }
}
