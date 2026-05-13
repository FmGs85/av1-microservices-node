# AV Microserviços com Node.js

AV prática SENAC — arquitetura de microserviços com Node.js, TypeScript, Fastify e Docker.

## Roteiro de branches
- `step/01-setup` — monorepo com npm workspaces
- `step/02-product-service` — primeiro microserviço (Fastify)
- `step/03-order-service` — segundo microserviço isolado
- `step/04-http-communication` — comunicação HTTP entre serviços
- `step/05-api-gateway` — gateway como ponto único de entrada
- `step/06-docker` — containerização com docker-compose

## Como executar

Cada branch representa uma etapa. Para ver o código de cada passo:

```bash
git checkout step/01-setup
git checkout step/02-product-service
# ... e assim por diante
```

A branch `main` contém o código final completo.