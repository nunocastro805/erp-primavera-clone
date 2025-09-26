import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';
import { transactions } from './finance';
import { products } from './products';

const router = Router();
type PurchaseOrder = { id: string; supplier: string; total: number; items: any[]; status: 'pending' | 'received'; createdAt: string };

const purchaseOrders: PurchaseOrder[] = [];

router.get('/', requireAuth, (req, res) => res.json(purchaseOrders));

router.post('/', requireAuth, (req, res) => {
  const { supplier, items } = req.body;
  if (!supplier || !items) return res.status(400).json({ error: 'supplier and items required' });
  const total = items.reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
  const po: PurchaseOrder = { id: uuidv4(), supplier, items, total, status: 'pending', createdAt: new Date().toISOString() };
  purchaseOrders.push(po);
  res.status(201).json(po);
});

router.put('/:id/receive', requireAuth, (req, res) => {
  const po = purchaseOrders.find(p => p.id === req.params.id);
  if (!po) return res.status(404).json({ error: 'not found' });
  if (po.status === 'received') return res.status(400).json({ error: 'already received' });
  po.status = 'received';
  // Increase stock
  po.items.forEach((item: any) => {
    const prod = products.find(p => p.name === item.description);
    if (prod) {
      prod.stock += item.qty;
    }
  });
  // Add expense transaction
  transactions.push({ id: uuidv4(), description: `Encomenda de ${po.supplier}`, amount: po.total, type: 'expense', date: new Date().toISOString() });
  res.json(po);
});

export default router;