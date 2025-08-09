#!/bin/sh
set -e

# domyślne wartości, jeśli env puste
: "${DB_HOST:=db}"
: "${DB_PORT:=5432}"

echo "Waiting for DB… host=$DB_HOST port=$DB_PORT"
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Applying migrations…"
python manage.py makemigrations --noinput || true
python manage.py migrate --noinput

echo "Starting server…"
exec "$@"