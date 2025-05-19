# backend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

# ✅ dockerize 설치
ADD https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz /tmp/
RUN tar -C /usr/local/bin -xzvf /tmp/dockerize-linux-amd64-v0.6.1.tar.gz

# ✅ 엔트리포인트 스크립트 복사
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

# ✅ 실행 명령 변경
ENTRYPOINT ["docker-entrypoint.sh"]
