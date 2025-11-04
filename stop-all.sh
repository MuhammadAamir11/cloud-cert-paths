#!/bin/bash
# ==========================================
# Cloud Cert Paths - Stop All Services
# ==========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping all local services...${NC}"

for pidfile in .func_pid .blazor_pid .swa_pid; do
  if [ -f "$pidfile" ]; then
    PID=$(cat "$pidfile")
    if ps -p "$PID" > /dev/null 2>&1; then
      echo -e "${RED}Killing process $PID from $pidfile${NC}"
      kill "$PID" 2>/dev/null
    fi
    rm -f "$pidfile"
  fi
done

# Double-check for hanging processes
echo -e "${YELLOW}Cleaning any stray processes on ports 7071, 5009, 4281...${NC}"
for port in 7071 5009 4281; do
  PID=$(lsof -t -i:$port 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo -e "${RED}Force-killing process on port $port (PID: $PID)${NC}"
    kill -9 "$PID" 2>/dev/null
  fi
done

echo -e "${GREEN}✅ All services stopped cleanly.${NC}"
