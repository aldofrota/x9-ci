import { Injectable } from '@nestjs/common';

interface PrStats {
  commits: number;
  additions: number;
  deletions: number;
  changedFiles: number;
  summary?: string;
}

@Injectable()
export class SlackService {
  async sendMessage(channel: string, message: string): Promise<void> {
    // Implementar integração com Slack API
    console.log(`Enviando mensagem para ${channel}: ${message}`);
  }

  async sendPrSummary(
    channel: string,
    summary: string,
    prUrl: string,
  ): Promise<void> {
    const message = `📝 *Resumo do Pull Request*\n\n${summary}\n\n🔗 ${prUrl}`;
    await this.sendMessage(channel, message);
  }

  async sendPrMergedNotification(
    pullRequest: any,
    stats: PrStats,
  ): Promise<void> {
    const message = this.buildPrMergedMessage(pullRequest, stats);
    await this.sendMessage('#general', message);
  }

  private buildPrMergedMessage(pullRequest: any, stats: PrStats): string {
    const approvedReviewers = pullRequest.reviewers
      .filter((r) => r.state === 'approved')
      .map((r) => `@${r.login}`)
      .join(', ');

    const changedFilesList = pullRequest.files
      .map((file) => {
        const codeowners = file.codeowners?.length
          ? ` (Codeowners: ${file.codeowners.join(', ')})`
          : '';
        return `  - ${file.filename}${codeowners}`;
      })
      .join('\n');

    let message = `✅ **PR Mergeado: [#${pullRequest.number} - ${pullRequest.title}](${pullRequest.url})**\n`;
    message += `👤 Autor: @${pullRequest.author}\n`;

    if (approvedReviewers) {
      message += `👥 Aprovado por: ${approvedReviewers}\n`;
    }

    message += `🛠️ **Arquivos modificados:**\n${changedFilesList}\n\n`;

    if (stats.summary) {
      message += `${stats.summary}\n`;
    }

    message += `📊 **Estatísticas:**\n`;
    message += `• Commits: ${stats.commits}\n`;
    message += `• Adições: +${stats.additions}\n`;
    message += `• Remoções: -${stats.deletions}\n`;
    message += `• Arquivos alterados: ${stats.changedFiles}\n`;

    if (pullRequest.mergedAt) {
      message += `\n🕐 Mergeado em: ${pullRequest.mergedAt.toLocaleString('pt-BR')}`;
    }

    return message;
  }
}
