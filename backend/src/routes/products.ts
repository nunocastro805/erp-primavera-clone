import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Product = { id: string; name: string; price: number; stock: number };
export const products: Product[] = [
  { id: uuidv4(), name: 'Parafuso M8', price: 0.5, stock: 1000 },
  { id: uuidv4(), name: 'Martelo', price: 12.99, stock: 50 },
];

// public: list products (also protected in this demo)
router.get('/', requireAuth, (req, res) => {
  res.json(products);
});

router.post('/', requireAuth, (req, res) => {
  const { name, price, stock } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const p: Product = { id: uuidv4(), name, price: Number(price) || 0, stock: Number(stock) || 0 };
  products.push(p);
  res.status(201).json(p);
});

router.get('/:id', requireAuth, (req, res) => {
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

router.put('/:id', requireAuth, (req, res) => {
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.name = req.body.name ?? p.name;
  p.price = req.body.price ?? p.price;
  p.stock = req.body.stock ?? p.stock;
  res.json(p);
});

router.delete('/:id', requireAuth, (req, res) => {
  const idx = products.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  products.splice(idx, 1);
  res.status(204).send();
});

export default router;
