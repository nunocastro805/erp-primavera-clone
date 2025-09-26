import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Supplier = { id: string; name: string; email: string; phone: string; address: string };

const suppliers: Supplier[] = [
  { id: uuidv4(), name: 'Fornecedor A', email: 'fornecedorA@example.com', phone: '111111111', address: 'Rua X, 100' },
  { id: uuidv4(), name: 'Fornecedor B', email: 'fornecedorB@example.com', phone: '222222222', address: 'Rua Y, 200' },
];

router.get('/', requireAuth, (req, res) => {
  res.json(suppliers);
});

router.post('/', requireAuth, (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const s: Supplier = { id: uuidv4(), name, email: email || '', phone: phone || '', address: address || '' };
  suppliers.push(s);
  res.status(201).json(s);
});

export default router;