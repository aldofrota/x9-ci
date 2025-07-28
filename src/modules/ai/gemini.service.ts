import { Injectable, Logger } from '@nestjs/common';
import { PullRequestSummary } from '@/modules/github/github.types';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { SummaryResponse } from './ai.types';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;
  private readonly logger = new Logger(GeminiService.name, {
    timestamp: true,
  });
  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenAI({
      apiKey: this.configService.get<string>('gemini.apiKey'),
    });
  }

  async generateSummary(input: PullRequestSummary): Promise<SummaryResponse> {
    const prompt = this.buildPrompt(input);

    const response = await this.genAI.models.generateContent({
      model: this.configService.get<string>('gemini.model'),
      contents: prompt,
    });

    const responseText = response.text;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const parsed = JSON.parse(jsonString);

        if (
          parsed.context &&
          parsed.changes &&
          parsed.impact &&
          parsed.attention
        ) {
          return parsed as SummaryResponse;
        }
      }

      this.logger.warn(
        'Não foi possível extrair JSON válido da resposta do Gemini',
      );
      return this.generateFallbackSummary(responseText);
    } catch (error) {
      this.logger.error('Erro ao fazer parse do JSON: ' + error.message);
      return this.generateFallbackSummary(responseText);
    }
  }

  private generateFallbackSummary(responseText: string): SummaryResponse {
    const lines = responseText.split('\n').filter((line) => line.trim());

    return {
      context:
        this.extractSection(lines, 'contexto', 'problema') ||
        'Contexto não identificado',
      changes:
        this.extractSection(lines, 'mudanças', 'alterações', 'changes') ||
        'Mudanças não identificadas',
      impact:
        this.extractSection(lines, 'impacto', 'impact') ||
        'Impacto não identificado',
      attention:
        this.extractSection(lines, 'atenção', 'attention', 'pontos') ||
        'Pontos de atenção não identificados',
    };
  }

  private extractSection(
    lines: string[],
    ...keywords: string[]
  ): string | null {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (keywords.some((keyword) => line.includes(keyword))) {
        const sectionLines: string[] = [];
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();

          if (nextLine === '') continue;

          if (this.isNewSection(nextLine)) break;

          sectionLines.push(nextLine);
        }
        return sectionLines.join('\n').trim() || null;
      }
    }
    return null;
  }

  private isNewSection(line: string): boolean {
    const sectionKeywords = [
      'contexto',
      'problema',
      'mudanças',
      'alterações',
      'impacto',
      'atenção',
      'pontos',
    ];
    const lowerLine = line.toLowerCase();
    return sectionKeywords.some((keyword) => lowerLine.includes(keyword));
  }

  private buildPrompt(input: PullRequestSummary): string {
    return `
      Analise o pull request abaixo e gere um resumo **conciso**.
      
      Título: ${input.pullRequest.title}
      Descrição: ${input.pullRequest.body}
      Autor: ${input.pullRequest.author}
      Diffs: ${input.diff}
      
      Responda **APENAS** com um JSON **válido**, **sem texto antes ou depois**.
      
      Use **exatamente** esta estrutura:
      {
        "context": "Contexto e problema abordado pelo PR",
        "changes": "Principais mudanças implementadas",
        "impact": "Impacto esperado das mudanças com base no contexto e diffs",
        "attention": "Pontos que merecem atenção especial"
      }
      
      Regras obrigatórias:
      - Apenas JSON puro, sem explicações.
      - Use aspas duplas para todas as strings.
      - Não adicione vírgulas extras.
      - Mantenha o JSON **válido** e **minimamente formatado**.
      - Seja **objetivo** e **claro** em cada campo.
      `.trim();
  }
}
