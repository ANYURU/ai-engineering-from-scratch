#!/bin/sh
name=${1:-miles-plain}
limit=${2:-100}
checks=${3:-6}
strikes=0
while docker ps -q --filter "name=^${name}$" | grep -q .; do
  errors=$(docker logs --since 60s "$name" 2>&1 | grep -c "503 Service Unavailable")
  if [ "$errors" -gt "$limit" ]; then
    strikes=$((strikes + 1))
  else
    strikes=0
  fi
  if [ "$strikes" -ge "$checks" ]; then
    echo "$(date -u +%FT%TZ) $name: more than $limit errors from the rollout engine in each of $checks checks, last $errors in 60 s, stopping the run"
    docker stop "$name"
    exit 1
  fi
  sleep 30
done
echo "$(date -u +%FT%TZ) $name: the run ended"
