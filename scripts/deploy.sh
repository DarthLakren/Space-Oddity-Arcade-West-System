#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-us-east-2}"
PROJECT_SLUG="space-oddity-arcade-west-system"
BUCKET="${1:-${BUCKET_NAME:-${PROJECT_SLUG}-$(date +%s)-$RANDOM}}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/web"

if ! command -v aws >/dev/null 2>&1; then
  echo "ERROR: AWS CLI no está instalado o no está en PATH." >&2; exit 1
fi
if [[ ! -f "$WEB_DIR/index.html" ]]; then
  echo "ERROR: No se encontró web/index.html." >&2; exit 1
fi

echo "Región: $REGION"
echo "Bucket: $BUCKET"
echo "Creando bucket S3..."
if [[ "$REGION" == "us-east-1" ]]; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION"
else
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
    --create-bucket-configuration "LocationConstraint=$REGION"
fi

echo "Configurando alojamiento de sitio estático..."
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
  'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false'

aws s3api put-bucket-website --bucket "$BUCKET" \
  --website-configuration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'

cat > /tmp/space-oddity-bucket-policy.json <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadForWebsiteFiles",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET/*"
  }]
}
POLICY
aws s3api put-bucket-policy --bucket "$BUCKET" \
  --policy file:///tmp/space-oddity-bucket-policy.json

echo "Subiendo archivos del juego..."
aws s3 sync "$WEB_DIR/" "s3://$BUCKET/" --delete \
  --cache-control "no-cache" --region "$REGION"

WEBSITE_URL="http://$BUCKET.s3-website-$REGION.amazonaws.com"
printf "\nDESPLIEGUE COMPLETADO\nBucket: %s\nURL: %s\n" "$BUCKET" "$WEBSITE_URL"
echo "$BUCKET" > "$ROOT_DIR/.bucket-name"
