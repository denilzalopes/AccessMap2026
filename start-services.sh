#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting AccessMap Services${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting Docker Compose...${NC}\n"
docker-compose up --build

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Services are running!${NC}"
echo -e "${GREEN}========================================${NC}\n"
echo -e "${BLUE}Access Swagger UI at:${NC}"
echo -e "  Auth Service:         http://localhost:8080/swagger-ui.html"
echo -e "  User Service:         http://localhost:8081/swagger-ui.html"
echo -e "  Report Service:       http://localhost:8082/swagger-ui.html"
echo -e "  Map Service:          http://localhost:8083/swagger-ui.html"
echo -e "  Notification Service: http://localhost:8084/swagger-ui.html\n"
