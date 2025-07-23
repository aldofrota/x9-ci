import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PullRequest, PullRequestSummary } from '@/modules/github/github.types';
import { SummaryResponse } from '@/modules/ai/ai.types';

@Injectable()
export class SlackService {
  private readonly token: string;
  private readonly defaultChannel: string;
  private readonly logger = new Logger(SlackService.name, {
    timestamp: true,
  });
  private readonly url = 'https://slack.com/api/chat.postMessage';

  constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get<string>('slack.token') || '';
    this.defaultChannel =
      this.configService.get<string>('slack.channel') || '#general';
  }

  async sendMessage(channel: string, message: string): Promise<void> {
    try {
      const response = await axios.post(
        this.url,
        {
          channel,
          text: message,
          unfurl_links: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.ok) {
        this.logger.log('✅ Mensagem enviada com sucesso para o Slack');
      }
    } catch (error) {
      throw error;
    }
  }

  async sendPrMergedNotification(
    pullRequestSummary: PullRequestSummary,
    summary: SummaryResponse,
  ): Promise<void> {
    const message = this.buildMessage(pullRequestSummary, summary);
    await this.sendMessage(this.defaultChannel, message);
  }

  private buildMessage(
    input: PullRequestSummary,
    summary: SummaryResponse,
  ): string {
    const pr = input.pullRequest;
    console.log(input.reviews);
    const approvedReviewers = input.reviews
      .filter((r) => r.state === 'APPROVED')
      .map((r) => this.getUserProfileLink(r.login))
      .join(', ');

    const changedFilesList = input.files
      .map((file) => {
        const codeowners = file.codeowners?.length
          ? ` (*Codeowners: ${file.codeowners.join(', ')}*)`
          : '';
        return ` • \`${file.filename}\`${codeowners}`;
      })
      .join('\n');

    let message = `📋 *PR: <${pr.url}|${pr.url.split('/').pop()} - ${pr.title}>*\n`;
    message += `👀 *Status:* ${this.getStatus(pr)}\n`;
    message += `👤 *Autor:* ${this.getUserProfileLink(pr.author)}\n`;
    message += `🗂️ *Repositório:* <${pr.repoUrl}|${pr.repoName}>\n`;

    if (approvedReviewers) {
      message += `👥 *Aprovado por:* ${approvedReviewers}\n`;
    }

    message += `🛠️ *Arquivos modificados:*\n${changedFilesList}\n\n`;

    if (summary) {
      message += `🧠 *Resumo:*\n`;
      message += ` • *Contexto:* ${summary.context}\n`;
      message += ` • *Mudanças:* ${summary.changes}\n`;
      message += ` • *Impacto:* ${summary.impact}\n`;
      message += ` • *Pontos de Atenção:* ${summary.attention}\n\n`;
    }

    message += `📊 *Estatísticas:*\n`;
    message += ` • *Commits:* _${pr.commits}_\n`;
    message += ` • *Adições:* _+${pr.additions}_\n`;
    message += ` • *Remoções:* _-${pr.deletions}_\n`;
    message += ` • *Arquivos alterados:* _${pr.changedFiles}_\n`;

    if (pr.mergedAt) {
      message += `\n🕐 *Mergeado em:* _${new Date(pr.mergedAt).toLocaleString('pt-BR')}_`;
    }

    return message;
  }

  private getUserProfileLink(username: string): string {
    return `<https://github.com/${username}|${username}>`;
  }

  private getStatus(pr: PullRequest): string {
    if (pr.mergedAt) {
      return 'Mergeado 🫦';
    }

    if (pr.state === 'open') {
      return 'Aberto 🫰';
    } else if (pr.state === 'closed') {
      return 'Fechado 😶‍🌫️';
    }

    return 'Em revisão 🫀';
  }
}
