import { Injectable } from '@nestjs/common';
import { PullRequest } from '../../domain/entities/pull-request.entity';
import { GeminiSummaryService } from '../../domain/services/gemini-summary.service';

@Injectable()
export class GeminiService implements GeminiSummaryService {
  async generateSummary(pullRequest: PullRequest): Promise<string> {
    // Implementar integração com Gemini API
    const prompt = this.buildPrompt(pullRequest);
    
    // Aqui seria feita a chamada para a API do Gemini
    // Por enquanto retornando um resumo mock
    return `Resumo do PR #${pullRequest.id}: ${pullRequest.title}`;
  }

  private buildPrompt(pullRequest: PullRequest): string {
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