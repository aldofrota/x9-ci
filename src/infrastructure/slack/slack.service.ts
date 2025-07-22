import { Injectable } from '@nestjs/common';

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
}
