# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 依存をインストール (package.json + package-lock.json がある前提)
COPY package*.json ./
RUN npm ci

# アプリコードをコピー
COPY . .

# Next.js なら 3000、Vite なら 5173 などポートを合わせる
EXPOSE 3000

# Next.js の場合。Vite の場合は "npm run dev -- --host 0.0.0.0" 等に変更
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]