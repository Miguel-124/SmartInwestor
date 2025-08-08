#!/usr/bin/env bash
set -e

echo "Stopping containers…"
docker compose down

echo "Building and starting…"
docker compose up --build