#!/bin/bash
# ==========================================
# Cloud Cert Paths - Local Dev Runner
# ==========================================

API_DIR="api"
WEB_DIR="web"
API_PORT=7071
WEB_PORT=5009
SWA_PORT=4281

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Starting Azure Functions API on port ${API_PORT}...${NC}"
(cd "$API_DIR" && func start --port $API_PORT) &
FUNC_PID=$!

echo -e "${CYAN}🚀 Starting Blazor frontend on port ${WEB_PORT}...${NC}"
(cd "$WEB_DIR" && dotnet run) &
BLAZOR_PID=$!

sleep 10  # Wait for API and frontend to spin up

echo -e "${CYAN}🚀 Starting Static Web Apps Emulator on port ${SWA_PORT}...${NC}"
swa start "http://127.0.0.1:${WEB_PORT}" \
  --api-location "http://127.0.0.1:${API_PORT}" \
  --port ${SWA_PORT} \
  --verbose &
SWA_PID=$!

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo -e "  - Azure Functions: ${YELLOW}http://localhost:${API_PORT}/api/GetCerts${NC}"
echo -e "  - Blazor frontend: ${YELLOW}http://localhost:${WEB_PORT}${NC}"
echo -e "  - SWA Emulator:    ${YELLOW}http://localhost:${SWA_PORT}${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services, or run ./stop-all.sh${NC}"
echo ""

# Save process IDs for stop-all.sh
echo $FUNC_PID > .func_pid
echo $BLAZOR_PID > .blazor_pid
echo $SWA_PID > .swa_pid

# Trap cleanup when pressing Ctrl+C
trap 'echo -e "\n${RED}🛑 Stopping all services...${NC}"; kill $FUNC_PID $BLAZOR_PID $SWA_PID 2>/dev/null; rm -f .func_pid .blazor_pid .swa_pid; exit 0' SIGINT

wait
