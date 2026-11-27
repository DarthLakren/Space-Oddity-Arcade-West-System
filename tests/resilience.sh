#!/usr/bin/env bash
set -euo pipefail
URL="${1:-}"
if [[ -z "$URL" ]]; then echo "Uso: ./tests/resilience.sh http://bucket.s3-website-us-east-2.amazonaws.com"; exit 1; fi
echo "[1/2] Comprobando que la página principal responde..."
CODE="$(curl -s -o /dev/null -w '%{http_code}' "$URL/")"
[[ "$CODE" == "200" ]] || { echo "FALLO: página principal devolvió HTTP $CODE"; exit 1; }
echo "OK: página principal HTTP 200"
echo "[2/2] Comprobando respuesta ante un recurso inexistente..."
MISSING_CODE="$(curl -s -o /dev/null -w '%{http_code}' "$URL/recurso-que-no-existe.png")"
echo "Respuesta para recurso inexistente: HTTP $MISSING_CODE"
[[ "$MISSING_CODE" == "404" ]] && echo "OK: el recurso inexistente no se reporta como disponible."
echo "Pruebas básicas terminadas."
