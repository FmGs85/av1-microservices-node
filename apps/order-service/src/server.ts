import Fastify from 'fastify';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  total: number;
  createdAt: string;
}

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

const orders: Order[] = [];
let nextId = 1;

const app = Fastify({ logger: true });

app.get('/orders', async () => {
  return orders;
});

app.post<{ Body: { productId: number; quantity: number } }>(
  '/orders',
  async (req, reply) => {
    const { productId, quantity } = req.body;

    try {
      const response = await fetch(
        `${PRODUCT_SERVICE_URL}/products/${productId}`
      );

      if (!response.ok) {
        return reply
          .status(404)
          .send({ error: 'Produto não encontrado no Product Service' });
      }

      const product = (await response.json()) as Product;

      const order: Order = {
        id: nextId++,
        productId,
        productName: product.name,
        quantity,
        total: product.price * quantity,
        createdAt: new Date().toISOString(),
      };

      orders.push(order);
      return reply.status(201).send(order);
    } catch (err) {
      app.log.error(err);
      return reply
        .status(503)
        .send({ error: 'Product Service indisponível' });
    }
  }
);

const start = async () => {
  try {
    await app.listen({ port: 3002, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();