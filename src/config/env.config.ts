import { registerAs } from '@nestjs/config';

export const webhook = registerAs('webhook', () => ({
  secret: process.env.WEBHOOK_SECRET,
  summary: process.env.GEMINI_ENABLED || true,
}));

export const githubConfig = registerAs('github', () => ({
  token: process.env.GITHUB_TOKEN,
}));

export const slackConfig = registerAs('slack', () => ({
  token: process.env.SLACK_TOKEN,
  channel: process.env.SLACK_CHANNEL,
}));

export const geminiConfig = registerAs('gemini', () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
}));
