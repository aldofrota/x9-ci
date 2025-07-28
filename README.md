# X9-CI - Sistema de Notificações Inteligentes de Pull Requests

Sistema automatizado para processar webhooks do GitHub e enviar notificações detalhadas para o Slack quando PRs são mergeados na main, com análise inteligente usando Google Gemini AI.

## 🚀 Funcionalidades

- **Processamento de Webhooks**: Recebe webhooks do GitHub para eventos de pull request
- **Autenticação Segura**: Validação de token via header Authorization para garantir segurança
- **Processamento Assíncrono**: Retorna resposta imediata e processa em background
- **Validação Inteligente**: Processa apenas PRs fechados que foram mergeados na main
- **Extração de Dados**: Busca informações detalhadas via GitHub API:
  - Arquivos modificados e seus codeowners
  - Reviews e aprovadores
  - Estatísticas de commits, adições e remoções
  - Diffs das mudanças
- **Análise com IA (Gemini)**: Gera resumos automáticos estruturados baseados no contexto do PR
- **Notificações Slack**: Envia mensagens formatadas com todas as informações relevantes
- **Logging Estruturado**: Sistema de logs robusto para monitoramento e debug

## 📋 Estrutura da Mensagem

```
✅ PR Mergeado: [#123 - Ajusta login com token JWT](link)
👤 Autor: @aldofrota
🗂️ Repositório: rdsc-megasac-api
👥 Aprovado por: @ana-dev, @carlos-back
🛠️ Arquivos modificados:
  • `src/auth/login.ts` (*Codeowners: @auth-team*)
  • `src/config/env.ts` (*Codeowners: @infra*)

🧠 Resumo:
 • Contexto: Problema de performance na geração de relatórios Excel
 • Mudanças: Implementação de cache inteligente e otimizações no ReportExcelService
 • Impacto: Redução de 60-80% no tempo de resposta
 • Pontos de Atenção: Aumento no consumo de memória, validação pós-deploy necessária

📊 Estatísticas:
 • Commits: _5_
 • Adições: _+150_
 • Remoções: _-25_
 • Arquivos alterados: _8_

🕐 Mergeado em: _22/07/2025 15:21:59_
```

## 🏗️ Arquitetura

### Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações escaláveis
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Google Gemini AI**: Análise inteligente de pull requests
- **GitHub API**: Integração para extração de dados
- **Slack API**: Envio de notificações
- **Axios**: Cliente HTTP para APIs externas

### Módulos Principais

- **WebhookModule**: Recepção e validação de webhooks com autenticação
- **GithubModule**: Processamento de webhooks e integração com GitHub API
- **SlackModule**: Envio de notificações para o Slack
- **AiModule**: Geração de resumos inteligentes com Gemini
- **ConfigModule**: Gerenciamento de configurações

### Estrutura de Código

```
src/
├── modules/
│   ├── webhook/
│   │   ├── webhook.controller.ts
│   │   ├── webhook.guard.ts
│   │   ├── webhook.dto.ts
│   │   └── webhook.module.ts
│   ├── github/
│   │   ├── github-api.service.ts
│   │   ├── github.module.ts
│   │   ├── github.types.ts
│   │   └── pull-request-info.use-case.ts
│   ├── slack/
│   │   ├── slack.service.ts
│   │   ├── slack.module.ts
│   │   └── slack.types.ts
│   └── ai/
│       ├── gemini.service.ts
│       ├── ai.module.ts
│       └── ai.types.ts
├── config/
│   └── env.config.ts
└── main.ts
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Webhook Security
WEBHOOK_SECRET=your_webhook_secret_here

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here

# Slack Configuration
SLACK_TOKEN=your_slack_bot_token_here
SLACK_CHANNEL=#general

# Gemini AI Configuration
GEMINI_ENABLED=false
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### Webhook do GitHub

Configure o webhook no seu repositório:

- **URL**: `https://seu-dominio.com/webhook`
- **Content Type**: `application/json`
- **Events**: `Pull requests`
- **Secret**: Configure o mesmo valor de `WEBHOOK_SECRET`

## 🔐 Autenticação

O sistema utiliza autenticação via token no header `Authorization`. O token deve corresponder ao valor configurado em `WEBHOOK_SECRET`.

### Exemplo de Requisição

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Authorization: Bearer your_webhook_secret_here" \
  -H "Content-Type: application/json" \
  -d '{
    "pr": 123,
    "service": "rdsc-megasac-api"
  }'
```

## 🧪 Testando

### Teste Local

1. Configure as variáveis de ambiente:

```bash
cp env.example .env
# Edite o arquivo .env com suas credenciais
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
npm run start:dev
```

4. Teste com o payload de exemplo:

```bash
# Teste sem autenticação (deve falhar)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"pr": 123, "service": "test-repo"}'

# Teste com autenticação (deve funcionar)
curl -X POST http://localhost:3000/webhook \
  -H "Authorization: Bearer your_webhook_secret_here" \
  -H "Content-Type: application/json" \
  -d '{"pr": 123, "service": "test-repo"}'
```

### Payload de Teste

O arquivo `test-webhook.json` contém um exemplo completo do payload do webhook do GitHub.

## 📦 Instalação e Deploy

### Desenvolvimento

```bash
git clone <repository>
cd x9-ci
npm install
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

## 🔍 Análise de Escalabilidade e Manutenibilidade

### Pontos Fortes

1. **Separação de Responsabilidades**: Cada módulo tem uma responsabilidade específica
2. **Injeção de Dependência**: Facilita testes e manutenção
3. **Tipagem Forte**: TypeScript garante integridade dos dados
4. **Modularidade**: Módulos independentes facilitam evolução
5. **Logging Estruturado**: Sistema de logs com timestamps para monitoramento
6. **Tratamento de Erros Robusto**: Fallbacks inteligentes para respostas da IA
7. **Configuração Centralizada**: Gerenciamento de configurações via ConfigService
8. **Autenticação Segura**: Validação de token para proteger endpoints
9. **Processamento Assíncrono**: Resposta imediata com processamento em background

### Melhorias Implementadas

1. **Integração com Gemini AI**: Análise inteligente de pull requests
2. **Validação de JSON**: Sistema robusto para garantir respostas válidas da IA
3. **Fallback Inteligente**: Extração de informações mesmo com respostas mal formatadas
4. **Logging Melhorado**: Logs estruturados com timestamps
5. **Tipos Compartilhados**: Interfaces reutilizáveis entre módulos
6. **WebhookGuard**: Validação de autenticação para endpoints de webhook
7. **Processamento Assíncrono**: Melhora a responsividade da API

### Melhorias Sugeridas

1. **Cache de Codeowners**: Implementar cache para evitar consultas repetidas ao GitHub
2. **Retry Logic**: Adicionar retry para chamadas à API do GitHub
3. **Métricas**: Adicionar métricas de performance e uso
4. **Testes Unitários**: Implementar testes para todos os serviços
5. **Configuração Dinâmica**: Permitir configuração de codeowners por repositório
6. **Rate Limiting**: Implementar controle de taxa para APIs externas
7. **Health Checks**: Endpoints para monitoramento de saúde da aplicação
8. **Queue System**: Implementar fila para processamento de webhooks
9. **Monitoring**: Adicionar alertas e dashboards de monitoramento

### Próximos Passos

1. Implementar testes unitários e de integração
2. Adicionar sistema de filas para processamento assíncrono
3. Implementar cache para otimizar performance
4. Criar dashboard para monitoramento
5. Adicionar suporte a múltiplos repositórios
6. Implementar métricas e alertas
7. Adicionar configuração de templates de mensagem
8. Implementar rate limiting e throttling

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
