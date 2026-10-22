#!/bin/sh
name=${1:-miles-plain}
limit=${2:-100}
while docker ps -q --filter "name=^${name}$" | grep -q .; do
  errors=$(docker logs --since 60s "$name" 2>&1 | grep -c "503 Service Unavailable")
  if [ "$errors" -gt "$limit" ]; then
    echo "$(date -u +%FT%TZ) $name: $errors errors from the rollout engine in 60 s, stopping the run"
    docker stop "$name"
    exit 1
  fi
  sleep 30
done
echo "$(date -u +%FT%TZ) $name: the run ended"
