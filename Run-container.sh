#!/bin/bash

# Define the container name
SERVICE_NAME="backend"

echo "🚀 Starting Deployment..."

# 1. Pull latest changes (if using a registry) or build locally
# --build ensures your recent code changes are actually compiled into the image
# docker compose up -d
docker-compose -f Application.yaml up -d

echo -n "⏳ Booting $SERVICE_NAME: ["

# 2. Progress Bar Loop
# We loop while the status is NOT 'healthy'
while true; do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' $SERVICE_NAME 2>/dev/null)
    STATE=$(docker inspect --format='{{.State.Status}}' $SERVICE_NAME 2>/dev/null)

    # If the container isn't even running anymore, something crashed
    if [ "$STATE" != "running" ]; then
        echo "] ❌ FAILED"
        echo "Error: Container crashed with state '$STATE'. Printing logs..."
        docker logs $SERVICE_NAME
        exit 1
    fi

    # If it reached healthy, we are done
    if [ "$STATUS" == "healthy" ]; then
        break
    fi

    # Otherwise, print a progress block and wait
    echo -n "■"
    sleep 3
done

echo "] 100% Ready!"
echo "✅ Deployment Successful. App is live on port 8082."