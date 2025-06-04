#!/bin/bash

echo "🧪 Testing large file upload to compression server..."

# Create a test file of about 10MB
echo "📁 Creating 10MB test file..."
dd if=/dev/zero of=test-large.bin bs=1024 count=10240 2>/dev/null

echo "📤 Testing upload to compression server..."
curl -v -X POST \
  -F "video=@test-large.bin" \
  -H "Content-Type: multipart/form-data" \
  http://192.168.1.251:3000/compress \
  --max-time 60

echo ""
echo "🧹 Cleaning up test file..."
rm -f test-large.bin

echo "✅ Test complete!"
