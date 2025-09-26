import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Customer = { id: string; name: string; email: string; phone: string; address: string };

const customers: Customer[] = [
  { id: uuidv4(), name: 'João Silva', email: 'joao@example.com', phone: '123456789', address: 'Rua A, 123' },
  { id: uuidv4(), name: 'Maria Santos', email: 'maria@example.com', phone: '987654321', address: 'Rua B, 456' },
];

router.get('/', requireAuth, (req, res) => {
  res.json(customers);
});

router.post('/', requireAuth, (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const c: Customer = { id: uuidv4(), name, email: email || '', phone: phone || '', address: address || '' };
  customers.push(c);
  res.status(201).json(c);
});

export default router;