import { Injectable } from '@nestjs/common';
import { PullRequestSummary } from '@/modules/github/github.types';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { SummaryResponse } from './ai.types';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;

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
    console.log('Resposta bruta do Gemini:', responseText);

    try {
      // Tenta extrair JSON da resposta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const parsed = JSON.parse(jsonString);

        // Valida se tem todas as chaves necessárias
        if (
          parsed.context &&
          parsed.changes &&
          parsed.impact &&
          parsed.attention
        ) {
          return parsed as SummaryResponse;
        }
      }

      // Se não conseguiu extrair JSON válido, gera um fallback
      console.warn(
        'Não foi possível extrair JSON válido da resposta do Gemini',
      );
      return this.generateFallbackSummary(responseText);
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      return this.generateFallbackSummary(responseText);
    }
  }

  private generateFallbackSummary(responseText: string): SummaryResponse {
    // Extrai informações relevantes do texto para criar um resumo estruturado
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
        // Coleta as próximas linhas até encontrar outro tópico ou fim
        const sectionLines: string[] = [];
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j];
          if (nextLine.trim() === '' || this.isNewSection(nextLine)) {
            break;
          }
          sectionLines.push(nextLine.trim());
        }
        return sectionLines.join(' ').trim() || null;
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
      Analise este pull request e gere um resumo conciso:

      Título: ${input.pullRequest.title}
      Descrição: ${input.pullRequest.body}
      Autor: ${input.pullRequest.author}
      Diffs: ${input.diff}

      IMPORTANTE: Você DEVE retornar APENAS um JSON válido, sem texto adicional antes ou depois.

      O JSON deve ter exatamente esta estrutura:
      {
        "context": "Contexto e problema abordado pelo PR",
        "changes": "Principais mudanças implementadas",
        "impact": "Impacto esperado das mudanças",
        "attention": "Pontos que merecem atenção especial"
      }

      Regras:
      - Retorne APENAS o JSON, sem explicações
      - Use aspas duplas para strings
      - Não inclua vírgulas extras
      - Mantenha o JSON válido e bem formatado
      - Seja conciso mas informativo em cada campo
      `;
  }
}
