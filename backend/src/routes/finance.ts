import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Transaction = { id: string; description: string; amount: number; type: 'income' | 'expense'; date: string };

export const transactions: Transaction[] = [
  { id: uuidv4(), description: 'Venda de produtos', amount: 1500, type: 'income', date: new Date().toISOString() },
  { id: uuidv4(), description: 'Compra de materiais', amount: 800, type: 'expense', date: new Date().toISOString() },
];

router.get('/transactions', requireAuth, (req, res) => res.json(transactions));

router.post('/transactions', requireAuth, (req, res) => {
  const { description, amount, type } = req.body;
  if (!description || !amount || !type) return res.status(400).json({ error: 'description, amount, type required' });
  const t: Transaction = { id: uuidv4(), description, amount: Number(amount), type, date: new Date().toISOString() };
  transactions.push(t);
  res.status(201).json(t);
});

router.get('/balance', requireAuth, (req, res) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  res.json({ balance: income - expense, income, expense });
});

router.get('/statements', requireAuth, (req, res) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = income - expense;
  res.json({
    balanceSheet: {
      assets: { cash: income - expense },
      liabilities: { loans: 0 },
      equity: { retainedEarnings: profit }
    },
    incomeStatement: {
      revenues: income,
      expenses: expense,
      netProfit: profit
    }
  });
});

export default router;
