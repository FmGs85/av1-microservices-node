# Stage 1: build - compila TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
RUN echo '{"compilerOptions":{"target":"ES2022","module":"commonjs","moduleResolution":"node","strict":true,"esModuleInterop":true,"skipLibCheck":true,"outDir":"dist","rootDir":"src"},"include":["src/**/*"]}' > tsconfig.json
RUN npm run build

# Stage 2: produção - apenas JS compilado + deps de produção
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]