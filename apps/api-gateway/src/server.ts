import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';

const PRODUCT_SERVICE =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

const app = Fastify({ logger: true });

app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}));

app.register(httpProxy, {
  upstream: PRODUCT_SERVICE,
  prefix: '/products',
  rewritePrefix: '/products',
});

app.register(httpProxy, {
  upstream: ORDER_SERVICE,
  prefix: '/orders',
  rewritePrefix: '/orders',
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();