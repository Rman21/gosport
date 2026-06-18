#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="${SPORTIL_PGDATA:-$ROOT_DIR/.local/postgres-data}"
LOG_FILE="$ROOT_DIR/.local/postgres.log"
PORT="${SPORTIL_PGPORT:-5432}"
DB_NAME="${SPORTIL_PGDATABASE:-sportil}"
DB_USER="${SPORTIL_PGUSER:-sportil}"

find_pg_bin() {
  if [[ -n "${PG_BIN:-}" && -x "$PG_BIN/postgres" ]]; then
    printf '%s\n' "$PG_BIN"
    return
  fi

  if command -v postgres >/dev/null 2>&1; then
    dirname "$(command -v postgres)"
    return
  fi

  if command -v brew >/dev/null 2>&1; then
    for formula in postgresql@17 postgresql@16 postgresql; do
      if brew --prefix "$formula" >/dev/null 2>&1; then
        printf '%s/bin\n' "$(brew --prefix "$formula")"
        return
      fi
    done
  fi

  echo "PostgreSQL binaries were not found. Install with: brew install postgresql@17" >&2
  exit 1
}

PG_BIN="$(find_pg_bin)"
mkdir -p "$ROOT_DIR/.local"

case "${1:-start}" in
  start)
    if [[ ! -d "$DATA_DIR/base" ]]; then
      "$PG_BIN/initdb" -D "$DATA_DIR" -U "$DB_USER" --auth=trust --encoding=UTF8 --locale=C
    fi

    if "$PG_BIN/pg_ctl" -D "$DATA_DIR" status >/dev/null 2>&1; then
      echo "PostgreSQL already running on port $PORT"
    else
      "$PG_BIN/pg_ctl" -D "$DATA_DIR" -l "$LOG_FILE" -o "-p $PORT" start
    fi

    "$PG_BIN/createdb" -h localhost -p "$PORT" -U "$DB_USER" "$DB_NAME" >/dev/null 2>&1 || true
    echo "DATABASE_URL=postgresql://$DB_USER:$DB_USER@localhost:$PORT/$DB_NAME"
    ;;
  stop)
    "$PG_BIN/pg_ctl" -D "$DATA_DIR" stop -m fast
    ;;
  status)
    "$PG_BIN/pg_ctl" -D "$DATA_DIR" status
    ;;
  *)
    echo "Usage: $0 {start|stop|status}" >&2
    exit 2
    ;;
esac
