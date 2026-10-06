#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script de validação executável do contêiner Docker (Feature 0007)
# ==============================================================================

IMAGE_TAG="cult-thalyson:test"
CONTAINER_NAME="cult-test-instance-$$"
TEST_PORT="8888"

echo "==> [1/5] Compilando imagem Docker ($IMAGE_TAG)..."
docker build -t "$IMAGE_TAG" .

echo "==> [2/5] Inspecionando tamanho e metadados da imagem..."
IMAGE_SIZE_BYTES=$(docker inspect -f '{{ .Size }}' "$IMAGE_TAG")
IMAGE_SIZE_MB=$((IMAGE_SIZE_BYTES / 1024 / 1024))
echo "    Tamanho da imagem final: ${IMAGE_SIZE_MB}MB"

if [ "$IMAGE_SIZE_MB" -gt 60 ]; then
  echo "    AVISO: Imagem maior que 60MB (${IMAGE_SIZE_MB}MB)"
else
  echo "    ✓ Imagem ultra-leve (< 60MB)"
fi

echo "==> [3/5] Iniciando contêiner temporário na porta $TEST_PORT..."
docker run -d --rm \
  --name "$CONTAINER_NAME" \
  -p "${TEST_PORT}:8080" \
  "$IMAGE_TAG"

cleanup() {
  echo "==> Encerrando contêiner de teste..."
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
}
trap cleanup EXIT

echo "    Aguardando contêiner inicializar..."
for i in {1..30}; do
  if curl -s -f "http://localhost:${TEST_PORT}/healthz" >/dev/null 2>&1; then
    echo "    ✓ Contêiner pronto e respondendo em http://localhost:${TEST_PORT}!"
    break
  fi
  sleep 0.5
done

echo "==> [4/5] Executando gates de critérios de aceite (ACs)..."

# AC-2 / AC-5: Healthcheck 200 OK
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${TEST_PORT}/healthz")
if [ "$HEALTH_STATUS" = "200" ]; then
  echo "    ✓ AC-5 (Healthcheck): /healthz retornou 200 OK"
else
  echo "    ✗ FALHA AC-5: /healthz retornou $HEALTH_STATUS"
  exit 1
fi

# AC-3: Home 200 OK e contém identificação do portal
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${TEST_PORT}/")
HOME_CONTENT=$(curl -s "http://localhost:${TEST_PORT}/")
if [ "$HOME_STATUS" = "200" ] && echo "$HOME_CONTENT" | grep -q "CULT"; then
  echo "    ✓ AC-3 (Roteamento Home): / retornou 200 OK com HTML válido"
else
  echo "    ✗ FALHA AC-3: / retornou $HOME_STATUS ou conteúdo inválido"
  exit 1
fi

# AC-3: Subpágina por categoria /patrimonio/as-14-procissoes-do-cirio-de-nazare/
ENSAIO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${TEST_PORT}/patrimonio/as-14-procissoes-do-cirio-de-nazare/")
if [ "$ENSAIO_STATUS" = "200" ]; then
  echo "    ✓ AC-3 (Subpágina por categoria): /patrimonio/.../ retornou 200 OK"
else
  echo "    ✗ FALHA AC-3: /patrimonio/.../ retornou $ENSAIO_STATUS"
  exit 1
fi

# AC-4: Redirecionamento sem barra não deve conter porta interna :8080
REDIRECT_HEADER=$(curl -sI "http://localhost:${TEST_PORT}/patrimonio/as-14-procissoes-do-cirio-de-nazare" | grep -i "^location:" || true)
if echo "$REDIRECT_HEADER" | grep -q ":8080"; then
  echo "    ✗ FALHA AC-4: Redirecionamento contém porta interna 8080: $REDIRECT_HEADER"
  exit 1
else
  echo "    ✓ AC-4 (Sem porta no redirect): Redirecionamento limpo sem :8080 ($REDIRECT_HEADER)"
fi

# AC-3: Página inexistente retorna 404
NOT_FOUND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${TEST_PORT}/rota-inexistente")
if [ "$NOT_FOUND_STATUS" = "404" ]; then
  echo "    ✓ AC-3 (Página 404): /rota-inexistente retornou 404 Not Found"
else
  echo "    ✗ FALHA AC-3: Rota inexistente retornou $NOT_FOUND_STATUS (esperado 404)"
  exit 1
fi

# AC-4 / AC-5: Cabeçalhos de segurança e cache
HEADERS=$(curl -sI "http://localhost:${TEST_PORT}/")
if echo "$HEADERS" | grep -iq "X-Content-Type-Options: nosniff"; then
  echo "    ✓ AC-5 (Segurança): X-Content-Type-Options: nosniff presente"
else
  echo "    ✗ FALHA AC-5: Cabeçalho X-Content-Type-Options ausente"
  exit 1
fi

if echo "$HEADERS" | grep -iq "X-Frame-Options: SAMEORIGIN"; then
  echo "    ✓ AC-5 (Segurança): X-Frame-Options: SAMEORIGIN presente"
else
  echo "    ✗ FALHA AC-5: Cabeçalho X-Frame-Options ausente"
  exit 1
fi

# AC-4: Cache de assets estáticos
ASSET_HEADERS=$(curl -sI "http://localhost:${TEST_PORT}/favicon.svg")
if echo "$ASSET_HEADERS" | grep -iq "Cache-Control"; then
  echo "    ✓ AC-4 (Performance): Cache-Control configurado para assets estáticos"
else
  echo "    ✗ FALHA AC-4: Cache-Control ausente em /favicon.svg"
  exit 1
fi

echo "==> [5/5] Todos os gates executáveis passaram com sucesso!"
echo "🎉 A imagem Docker está validada e pronta para exportação e deploy!"
