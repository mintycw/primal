#!/bin/bash

echo "🔄 Rebuilding and restarting compression server..."

# Navigate to the compression service directory
cd services/video-compression

echo "📦 Building new Docker image..."
docker build -f DockerFile.prod -t primal-compression:latest .

echo "🛑 Stopping existing container (if running)..."
docker stop primal-compression 2>/dev/null || true
docker rm primal-compression 2>/dev/null || true

echo "🚀 Starting new container..."
docker run -d \
  --name primal-compression \
  --restart unless-stopped \
  -p 3000:3000 \
  --gpus all \
  primal-compression:latest

echo "⏳ Waiting for container to start..."
sleep 5

echo "🔍 Checking container status..."
docker ps | grep primal-compression

echo "📋 Container logs:"
docker logs primal-compression --tail 10

echo "✅ Compression server rebuild complete!"
echo "🌐 Server should be available at: http://192.168.1.251:3000"
