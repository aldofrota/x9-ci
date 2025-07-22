# X9-CI - Sistema de Notificações de Pull Requests

Sistema automatizado para processar webhooks do GitHub e enviar notificações detalhadas para o Slack quando PRs são mergeados na main.

## 🚀 Funcionalidades

- **Processamento de Webhooks**: Recebe webhooks do GitHub para eventos de pull request
- **Validação Inteligente**: Processa apenas PRs fechados que foram mergeados na main
- **Extração de Dados**: Busca informações detalhadas via GitHub API:
  - Arquivos modificados
  - Codeowners dos arquivos
  - Reviews e aprovadores
  - Estatísticas de commits
- **Análise com IA**: Gera resumos automáticos baseados nos arquivos modificados
- **Notificações Slack**: Envia mensagens formatadas com todas as informações relevantes

## 📋 Estrutura da Mensagem

```
✅ PR Mergeado: [#123 - Ajusta login com token JWT](link)
👤 Autor: @aldofrota
👥 Aprovado por: @ana-dev, @carlos-back
🛠️ Arquivos modificados:
  - src/auth/login.ts (Codeowners: @auth-team)
  - src/config/env.ts (Codeowners: @infra)

🧠 Resumo IA:
- Adicionado middleware `helmet` para segurança
- Corrigido bug no token expirado
- Pode impactar login de parceiros externos

⚠️ Atenção:
- Middleware pode gerar conflito com header `Content-Security-Policy`
- Verificar testes de login externo

📊 Estatísticas:
• Commits: 5
• Adições: +150
• Remoções: -25
• Arquivos alterados: 8

🕐 Mergeado em: 22/07/2025 15:21:59
```

## 🏗️ Arquitetura

### Camadas da Aplicação

- **Domain**: Entidades e interfaces de negócio
- **Application**: Casos de uso da aplicação
- **Infrastructure**: Implementações concretas (GitHub API, Slack, etc.)
- **Interfaces**: Controllers HTTP

### Módulos Principais

- **GithubModule**: Processamento de webhooks e integração com GitHub API
- **SlackModule**: Envio de notificações para o Slack
- **AiModule**: Geração de resumos inteligentes

## 🔧 Configuração

### Variáveis de Ambiente

```env
# GitHub
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_TOKEN=your_github_token

# Slack
SLACK_TOKEN=your_slack_token
SLACK_CHANNEL=#general
```

### Webhook do GitHub

Configure o webhook no seu repositório:

- **URL**: `https://seu-dominio.com/github/webhook`
- **Content Type**: `application/json`
- **Events**: `Pull requests`

## 🧪 Testando

### Teste Local

1. Inicie o servidor:

```bash
npm run start:dev
```

2. Teste com o payload de exemplo:

```bash
./test-webhook.sh
```

### Payload de Teste

O arquivo `test-webhook.json` contém um exemplo completo do payload do webhook.

## 📦 Instalação

```bash
npm install
npm run build
npm run start:dev
```

## 🔍 Análise de Escalabilidade e Manutenibilidade

### Pontos Fortes

1. **Separação de Responsabilidades**: Cada serviço tem uma responsabilidade específica
2. **Injeção de Dependência**: Facilita testes e manutenção
3. **Tipagem Forte**: TypeScript garante integridade dos dados
4. **Modularidade**: Módulos independentes facilitam evolução

### Melhorias Sugeridas

1. **Cache de Codeowners**: Implementar cache para evitar consultas repetidas ao GitHub
2. **Retry Logic**: Adicionar retry para chamadas à API do GitHub
3. **Logging Estruturado**: Implementar logging mais robusto
4. **Métricas**: Adicionar métricas de performance e uso
5. **Testes Unitários**: Implementar testes para todos os serviços
6. **Configuração Dinâmica**: Permitir configuração de codeowners por repositório

### Próximos Passos

1. Implementar integração real com Slack API
2. Adicionar autenticação e validação de webhooks
3. Implementar cache para otimizar performance
4. Criar dashboard para monitoramento
5. Adicionar suporte a múltiplos repositórios
