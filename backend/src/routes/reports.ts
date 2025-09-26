import { Router } from 'express';
import requireAuth from './auth_mw';

const router = Router();

router.get('/summary', requireAuth, (req, res) => {
  // In real app, query DB for summary
  res.json({
    totalProducts: 5,
    totalInvoices: 3,
    totalTransactions: 4,
    totalRevenue: 2500,
  });
});

router.get('/chart-data', requireAuth, (req, res) => {
  // Mock data for charts
  const revenues = 2500;
  const expenses = 800;
  const profits = revenues - expenses;
  res.json({
    revenues,
    expenses,
    profits,
    statistics: [
      { name: 'Produtos', value: 5 },
      { name: 'Faturas', value: 3 },
      { name: 'Transações', value: 4 },
    ],
  });
});

export default router;