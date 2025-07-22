import { registerAs } from '@nestjs/config';

export const githubConfig = registerAs('github', () => ({
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  token: process.env.GITHUB_TOKEN,
}));

export const slackConfig = registerAs('slack', () => ({
  token: process.env.SLACK_TOKEN,
  channel: process.env.SLACK_CHANNEL,
}));

export const geminiConfig = registerAs('gemini', () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-pro',
}));
