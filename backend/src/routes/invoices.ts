import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';
import { transactions } from './finance';
import { products } from './products';

const router = Router();
type Invoice = { id: string; type: 'invoice' | 'credit_note' | 'debit_note' | 'receipt'; customer: string; total: number; items: any[]; createdAt: string };
const invoices: Invoice[] = [];

router.get('/', requireAuth, (req, res) => res.json(invoices));

router.post('/', requireAuth, (req, res) => {
  const { type = 'invoice', customer, items } = req.body;
  if (!customer || !items) return res.status(400).json({ error: 'customer and items required' });
  const total = items.reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
  const inv: Invoice = { id: uuidv4(), type, customer, items, total, createdAt: new Date().toISOString() };
  invoices.push(inv);
  // Automatic recording: add income transaction for invoices
  if (type === 'invoice') {
    transactions.push({ id: uuidv4(), description: `Fatura para ${customer}`, amount: total, type: 'income', date: new Date().toISOString() });
    // Reduce stock
    items.forEach((item: any) => {
      const prod = products.find(p => p.name === item.description);
      if (prod) {
        prod.stock -= item.qty;
      }
    });
  }
  res.status(201).json(inv);
});

export default router;
