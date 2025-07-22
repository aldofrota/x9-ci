# 🤖 X9-CI - Resumidor de Pull Requests com IA

Sistema automatizado para gerar resumos inteligentes de Pull Requests usando IA (Gemini) e enviar notificações para o Slack.

## 📋 Descrição

O X9-CI é uma aplicação NestJS que:

- Recebe webhooks do GitHub quando PRs são criados/atualizados
- Gera resumos inteligentes usando Google Gemini AI
- Envia notificações formatadas para canais do Slack
- Segue arquitetura hexagonal/clean architecture

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```bash
src/
├── application/           # Casos de uso e DTOs
│   ├── use-cases/
│   │   └── summarize-pr.use-case.ts
│   └── dtos/
│       └── summarize-pr.dto.ts
├── domain/              # Regras de negócio e entidades
│   ├── entities/
│   │   └── pull-request.entity.ts
│   ├── repositories/
│   │   └── pr.repository.ts
│   └── services/
│       └── gemini-summary.service.ts
├── infrastructure/       # Implementações concretas
│   ├── github/
│   │   ├── github.controller.ts
│   │   ├── github.service.ts
│   │   └── github.module.ts
│   ├── slack/
│   │   ├── slack.service.ts
│   │   └── slack.module.ts
│   ├── ai/
│   │   ├── gemini.service.ts
│   │   └── ai.module.ts
│   ├── persistence/
│   │   └── pr.repository.impl.ts
│   └── config/
│       └── env.config.ts
├── interfaces/          # Controllers HTTP
│   └── http/
│       └── webhook.controller.ts
├── main.ts
└── app.module.ts
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Conta no GitHub com webhook configurado
- Token do Slack
- API Key do Google Gemini

### 1. Clone o repositório

```bash
git clone <repository-url>
cd x9-ci
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# GitHub
GITHUB_WEBHOOK_SECRET=seu_webhook_secret
GITHUB_TOKEN=seu_github_token

# Slack
SLACK_TOKEN=xoxb-seu_slack_token
SLACK_CHANNEL=#canal-destino

# Google Gemini
GEMINI_API_KEY=sua_gemini_api_key
GEMINI_MODEL=gemini-pro
```

### 4. Execute a aplicação

```bash
# Desenvolvimento
yarn start:dev

# Produção
yarn start:prod
```

## 🔧 Configuração

### GitHub Webhook

1. Vá para seu repositório no GitHub
2. Settings → Webhooks → Add webhook
3. URL: `https://seu-dominio.com/github/webhook`
4. Content type: `application/json`
5. Events: `Pull requests`
6. Secret: Use o mesmo valor de `GITHUB_WEBHOOK_SECRET`

### Slack

1. Crie um app no Slack
2. Adicione a permissão `chat:write`
3. Instale o app no workspace
4. Copie o token para `SLACK_TOKEN`

### Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma API key
3. Configure no `.env`

## 📡 Endpoints

### Webhook GitHub

```curl
POST /github/webhook
```

Recebe eventos do GitHub (PRs criados/atualizados)

### Resumo Manual

```curl
POST /webhook/summarize-pr
Content-Type: application/json

{
  "prId": "123",
  "repository": "meu-repo",
  "owner": "meu-usuario"
}
```

## 🧪 Testes

```bash
# Testes unitários
yarn test

# Testes e2e
yarn test:e2e

# Cobertura
yarn test:cov
```

## 📦 Scripts Disponíveis

```bash
yarn start:dev      # Desenvolvimento com hot reload
yarn start:debug    # Debug mode
yarn start:prod     # Produção
yarn test           # Testes unitários
yarn test:e2e       # Testes end-to-end
yarn test:cov       # Testes com cobertura
yarn lint           # Linting
yarn lint:fix       # Linting com auto-fix
```

## 🔄 Fluxo de Funcionamento

1. **GitHub Webhook**: PR é criado/atualizado
2. **GitHub Service**: Processa o evento e extrai dados do PR
3. **SummarizePrUseCase**: Orquestra a geração do resumo
4. **Gemini Service**: Gera resumo usando IA
5. **Slack Service**: Envia notificação formatada
6. **Persistence**: Opcionalmente salva histórico

## 🛠️ Tecnologias

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **IA**: Google Gemini
- **Integrações**: GitHub API, Slack API
- **Arquitetura**: Clean Architecture/Hexagonal

## 📝 Licença

MIT

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
