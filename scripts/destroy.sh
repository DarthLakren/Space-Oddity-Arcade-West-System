#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUCKET="${1:-}"
if [[ -z "$BUCKET" && -f "$ROOT_DIR/.bucket-name" ]]; then BUCKET="$(cat "$ROOT_DIR/.bucket-name")"; fi
if [[ -z "$BUCKET" ]]; then echo "Uso: ./scripts/destroy.sh NOMBRE_BUCKET"; exit 1; fi
echo "ATENCIÓN: se eliminarán TODOS los objetos y el bucket: $BUCKET"
read -r -p "Escribe DELETE para confirmar: " CONFIRM
[[ "$CONFIRM" == "DELETE" ]] || { echo "Cancelado."; exit 0; }
aws s3 rm "s3://$BUCKET" --recursive
aws s3api delete-bucket --bucket "$BUCKET" --region "${AWS_REGION:-us-east-2}"
rm -f "$ROOT_DIR/.bucket-name"
echo "Bucket eliminado."
