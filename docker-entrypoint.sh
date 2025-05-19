#!/bin/sh

echo "⏳ DB 서버가 준비될 때까지 대기합니다..."
dockerize -wait tcp://mysql:3306 -timeout 20s

echo "✅ DB 서버 감지 완료, Node 서버 시작!"
node dist/index.js
