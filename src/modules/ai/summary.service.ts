import { Injectable } from '@nestjs/common';

@Injectable()
export class SummaryService {
  async generateSummary(pullRequest: any): Promise<string> {
    const changes = this.analyzeChanges(pullRequest.files);
    const impact = this.assessImpact(pullRequest.files);
    const warnings = this.generateWarnings(pullRequest.files);

    let summary = '';

    if (changes.length > 0) {
      summary += `🧠 **Resumo IA:**\n`;
      summary += changes.join('\n');
      summary += '\n\n';
    }

    if (impact.length > 0) {
      summary += `⚠️ **Atenção:**\n`;
      summary += impact.join('\n');
      summary += '\n\n';
    }

    if (warnings.length > 0) {
      summary += `🚨 **Avisos:**\n`;
      summary += warnings.join('\n');
    }

    return summary;
  }

  private analyzeChanges(files: any[]): string[] {
    const changes: string[] = [];

    files.forEach((file) => {
      if (file.filename.includes('auth/') || file.filename.includes('login')) {
        changes.push('- Modificações no sistema de autenticação');
      }

      if (file.filename.includes('config/') || file.filename.includes('env')) {
        changes.push('- Alterações em configurações do sistema');
      }

      if (
        file.filename.includes('middleware') ||
        file.filename.includes('helmet')
      ) {
        changes.push('- Adicionado middleware de segurança');
      }

      if (file.filename.includes('token') || file.filename.includes('jwt')) {
        changes.push('- Modificações no sistema de tokens');
      }

      if (file.filename.includes('test')) {
        changes.push('- Atualizações em testes');
      }
    });

    return changes;
  }

  private assessImpact(files: any[]): string[] {
    const impacts: string[] = [];

    files.forEach((file) => {
      if (file.filename.includes('auth/') || file.filename.includes('login')) {
        impacts.push('- Pode impactar login de parceiros externos');
      }

      if (
        file.filename.includes('middleware') ||
        file.filename.includes('helmet')
      ) {
        impacts.push(
          '- Middleware pode gerar conflito com header Content-Security-Policy',
        );
      }

      if (file.filename.includes('config/') || file.filename.includes('env')) {
        impacts.push('- Verificar compatibilidade com diferentes ambientes');
      }
    });

    return impacts;
  }

  private generateWarnings(files: any[]): string[] {
    const warnings: string[] = [];

    files.forEach((file) => {
      if (file.filename.includes('auth/') || file.filename.includes('login')) {
        warnings.push('- Verificar testes de login externo');
      }

      if (file.filename.includes('middleware')) {
        warnings.push('- Testar em diferentes navegadores');
      }

      if (file.filename.includes('config/') || file.filename.includes('env')) {
        warnings.push('- Validar variáveis de ambiente');
      }
    });

    return warnings;
  }
}
