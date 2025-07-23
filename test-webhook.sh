#!/bin/bash

# Script para testar o webhook do GitHub
# Execute: ./test-webhook.sh

echo "Testando webhook do GitHub..."

# Gera uma assinatura de teste (em produção seria gerada pelo GitHub)
WEBHOOK_SECRET="your_webhook_secret_here"
PAYLOAD=$(cat test-webhook.json)
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)"

curl -X POST http://localhost:4000/github/webhook \
  -H "Content-Type: application/json" \
  -H "x-github-event: pull_request" \
  -H "x-hub-signature-256: $SIGNATURE" \
  -d @test-webhook.json

echo ""
echo "Webhook testado!" 