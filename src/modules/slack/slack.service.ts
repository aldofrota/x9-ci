import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PullRequestSummary } from '@/modules/github/github.types';
import { SummaryResponse } from '@/modules/ai/ai.types';

@Injectable()
export class SlackService {
  private readonly token: string;
  private readonly defaultChannel: string;

  constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get<string>('slack.token') || '';
    this.defaultChannel =
      this.configService.get<string>('slack.channel') || '#general';
  }

  async sendMessage(channel: string, message: string): Promise<void> {
    try {
      console.log('📤 Enviando mensagem para o Slack...');

      const response = await axios.post(
        'https://slack.com/api/chat.postMessage',
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
        console.log('✅ Mensagem enviada com sucesso para o Slack');
      } else {
        console.error(
          '❌ Erro ao enviar mensagem para o Slack:',
          response.data.error,
        );
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem para o Slack:', error);
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
    const approvedReviewers = input.reviews
      .filter((r) => r.state === 'approved')
      .map((r) => `@${r.login}`)
      .join(', ');

    const changedFilesList = input.files
      .map((file) => {
        const codeowners = file.codeowners?.length
          ? ` (*Codeowners: ${file.codeowners.join(', ')}*)`
          : '';
        return ` • ${file.filename}${codeowners}`;
      })
      .join('\n');

    let message = `✅ *PR Mergeado: <${pr.url}|${pr.url.split('/').pop()} - ${pr.title}>*\n`;
    message += `👤 *Autor:* <@${pr.author}>\n`;

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
    message += ` • *Commits:* ${pr.commits}\n`;
    message += ` • *Adições:* +${pr.additions}\n`;
    message += ` • *Remoções:* -${pr.deletions}\n`;
    message += ` • *Arquivos alterados:* ${pr.changedFiles}\n`;

    if (pr.mergedAt) {
      message += `\n🕐 *Mergeado em:* _${new Date(pr.mergedAt).toLocaleString('pt-BR')}_`;
    }

    return message;
  }
}
