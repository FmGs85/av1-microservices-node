# AV Microserviços com Node.js

![Node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4-000000?logo=fastify&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

Projeto da AV Prática da disciplina de Microserviços do curso de Análise e Desenvolvimento de Sistemas (SENAC RJ). Implementação de uma arquitetura de microserviços com Node.js, TypeScript, Fastify e Docker.

## Arquitetura

Cliente
│
▼ :3000
[ API Gateway ]
├── /products/* ──► :3001 [ Product Service ]
└── /orders/*   ──► :3002 [ Order Service ]
│
└──► :3001 [ Product Service ]

O cliente faz todas as requisições para o **API Gateway** (porta 3000). O gateway roteia para o serviço correto. O **Order Service** consulta o **Product Service** internamente ao criar pedidos para enriquecer o pedido com nome do produto e total calculado.

## Stack

- **Node.js 20+** — runtime JavaScript
- **TypeScript** — tipagem estática e contratos claros entre serviços
- **Fastify** — framework HTTP de alta performance
- **@fastify/http-proxy** — plugin para proxy reverso no gateway
- **npm Workspaces** — gerenciamento de monorepo
- **Docker + Docker Compose** — containerização e orquestração

## Estrutura do projeto

av1-microservices-node/
├── apps/
│   ├── product-service/      # Serviço de catálogo de produtos (porta 3001)
│   │   ├── src/server.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── order-service/        # Serviço de pedidos (porta 3002)
│   │   ├── src/server.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api-gateway/          # Ponto único de entrada (porta 3000)
│       ├── src/server.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml        # Orquestração dos containers
├── package.json              # Configuração do monorepo
├── tsconfig.json             # Configuração base do TypeScript
└── README.md

## Pré-requisitos

- **Node.js 20+**
- **npm 10+**
- **Docker Desktop** (apenas para execução via Docker)
- **Git**

## Como executar

Existem duas formas de executar o projeto: modo desenvolvimento (cada serviço rodando localmente) ou via Docker (tudo containerizado).

### Opção 1 — Modo Desenvolvimento

Útil para desenvolvimento e debug, com hot-reload ao salvar arquivos.

**1. Clone o repositório:**

```bash
git clone https://github.com/FmGs85/av1-microservices-node.git
cd av1-microservices-node
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Execute os serviços em terminais separados:**

Terminal 1 — Product Service:
```bash
npm run product
```

Terminal 2 — Order Service:
```bash
npm run order
```

Terminal 3 — API Gateway:
```bash
npm run gateway
```

### Opção 2 — Via Docker (recomendado)

Com Docker, todo o sistema sobe com um único comando.

**1. Certifique-se de que o Docker Desktop está em execução.**

**2. Suba todos os serviços:**

```bash
docker-compose up --build
```

A primeira execução demora alguns minutos para baixar a imagem do Node e construir os 3 containers. Execuções subsequentes são quase instantâneas.

**3. Para parar e remover os containers:**

```bash
docker-compose down
```

## Testando a API

Após subir os serviços (em qualquer das opções), use Postman, Insomnia, curl ou a extensão REST Client do VS Code para testar.

### Endpoints disponíveis via Gateway (porta 3000)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Verificação de saúde do gateway |
| GET | `/products` | Lista todos os produtos |
| GET | `/products/:id` | Busca produto por ID |
| GET | `/orders` | Lista todos os pedidos |
| POST | `/orders` | Cria um novo pedido |

### Exemplos de teste com curl (Windows PowerShell)

**Health check do gateway:**
```powershell
curl.exe http://localhost:3000/health
```

**Listar produtos:**
```powershell
curl.exe http://localhost:3000/products
```

**Criar pedido:**
```powershell
curl.exe -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d "{\"productId\": 1, \"quantity\": 2}"
```

**Resposta esperada:**
```json
{
  "id": 1,
  "productId": 1,
  "productName": "Notebook Pro",
  "quantity": 2,
  "total": 7000,
  "createdAt": "2026-05-19T19:00:00.000Z"
}
```

### Acesso direto aos serviços (sem gateway)

Também é possível acessar cada serviço diretamente, útil para testes isolados:

- Product Service: `http://localhost:3001`
- Order Service: `http://localhost:3002`

## Tratamento de erros

O sistema implementa tratamento de erro em múltiplas camadas:

| Status | Cenário |
|--------|---------|
| **200** | Operação bem-sucedida |
| **201** | Pedido criado com sucesso |
| **404** | Produto não encontrado |
| **503** | Product Service indisponível (Order Service não consegue criar pedidos) |

## Roteiro de branches

O desenvolvimento foi feito de forma incremental, com cada etapa em uma branch separada:

| Branch | Conteúdo |
|--------|----------|
| `step/01-setup` | Estrutura inicial do monorepo com npm workspaces |
| `step/02-product-service` | Primeiro microserviço com Fastify e rotas REST |
| `step/03-order-service` | Segundo microserviço independente na porta 3002 |
| `step/04-http-communication` | Comunicação HTTP síncrona entre serviços |
| `step/05-api-gateway` | API Gateway como ponto único de entrada |
| `step/06-docker` | Containerização com Docker e Docker Compose |
| `main` | Código final consolidado |

Para visualizar uma etapa específica:

```bash
git checkout step/02-product-service
```

## Decisões de arquitetura

**Por que monorepo com npm workspaces?**
Permite gerenciar todos os serviços em um único repositório com `npm install` centralizado, versionamento unificado e possibilidade de compartilhar código entre serviços, mantendo cada serviço isolado em sua própria pasta com `package.json` próprio.

**Por que comunicação HTTP síncrona?**
Simples de implementar e entender, com resposta imediata. O trade-off é o acoplamento entre serviços: se o Product Service cair, o Order Service responde com 503. Em sistemas com maior necessidade de resiliência, comunicação assíncrona (com filas como RabbitMQ) seria mais apropriada.

**Por que API Gateway?**
Ponto único de entrada para o cliente, ocultando a topologia interna do sistema. Permite centralizar autenticação, SSL, rate limiting e logging em um único ponto. Os serviços internos podem mudar de porta ou endereço sem impacto no cliente.

**Por que multi-stage build no Dockerfile?**
O primeiro stage instala dependências de desenvolvimento (TypeScript, tsx) necessárias para compilar o código. O stage final copia apenas o JavaScript compilado e instala somente dependências de produção, resultando em imagens menores e mais seguras.

## Autor

- **Fábio Melo** — [@FmGs85](https://github.com/FmGs85)

## Disciplina

Microserviços com Node.js — Análise e Desenvolvimento de Sistemas — SENAC RJ