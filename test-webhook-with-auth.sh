#!/bin/bash

# Script para testar o webhook com autenticação
# Substitua YOUR_WEBHOOK_SECRET pelo valor real do seu WEBHOOK_SECRET

WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
BASE_URL="http://localhost:3000"

echo "🧪 Testando Webhook com Autenticação"
echo "=================================="

# Teste 1: Sem autenticação (deve falhar)
echo ""
echo "1️⃣ Teste sem autenticação (deve retornar 401):"
curl -X POST "$BASE_URL/webhook" \
  -H "Content-Type: application/json" \
  -d '{"pr": 123, "service": "test-repo"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "2️⃣ Teste com autenticação inválida (deve retornar 401):"
curl -X POST "$BASE_URL/webhook" \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"pr": 123, "service": "test-repo"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "3️⃣ Teste com autenticação válida (deve retornar 200):"
curl -X POST "$BASE_URL/webhook" \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"pr": 123, "service": "test-repo"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Testes concluídos!"
echo ""
echo "💡 Dica: Configure o WEBHOOK_SECRET no arquivo .env antes de executar os testes" 