import { Router } from 'express';
import requireAuth from './auth_mw';

const router = Router();
type Account = { id: string; code: string; name: string; class: string; type: 'asset' | 'liability' | 'income' | 'expense' };

const accounts: Account[] = [
  { id: '1', code: '11', name: 'Caixa', class: '1', type: 'asset' },
  { id: '2', code: '12', name: 'Bancos', class: '1', type: 'asset' },
  { id: '3', code: '21', name: 'Clientes', class: '2', type: 'asset' },
  { id: '4', code: '22', name: 'Fornecedores', class: '2', type: 'liability' },
  { id: '5', code: '61', name: 'Compras', class: '6', type: 'expense' },
  { id: '6', code: '62', name: 'Salários', class: '6', type: 'expense' },
  { id: '7', code: '71', name: 'Vendas', class: '7', type: 'income' },
];

router.get('/', requireAuth, (req, res) => {
  res.json(accounts);
});

export default router;