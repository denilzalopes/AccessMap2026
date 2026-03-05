#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Building all AccessMap Microservices${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Array of services
services=("auth-service" "user-service" "report-service" "map-service" "notification-service")

# Build each service
for service in "${services[@]}"; do
    echo -e "${BLUE}Building $service...${NC}"
    cd "backend-microservices/$service"
    
    if mvn clean install -q; then
        echo -e "${GREEN}✓ $service built successfully${NC}\n"
    else
        echo -e "${RED}✗ Failed to build $service${NC}"
        exit 1
    fi
    
    cd ../..
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All services built successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"
echo -e "${BLUE}Next step: Run 'docker-compose up --build'${NC}"
