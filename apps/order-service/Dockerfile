FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
RUN echo '{"compilerOptions":{"target":"ES2022","module":"commonjs","moduleResolution":"node","strict":true,"esModuleInterop":true,"skipLibCheck":true,"outDir":"dist","rootDir":"src"},"include":["src/**/*"]}' > tsconfig.json
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3002
CMD ["node", "dist/server.js"]