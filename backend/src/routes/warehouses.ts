import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Warehouse = { id: string; name: string; location: string };

const warehouses: Warehouse[] = [
  { id: uuidv4(), name: 'Armazém Principal', location: 'Lisboa' },
  { id: uuidv4(), name: 'Armazém Secundário', location: 'Porto' },
];

router.get('/', requireAuth, (req, res) => {
  res.json(warehouses);
});

router.post('/', requireAuth, (req, res) => {
  const { name, location } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const w: Warehouse = { id: uuidv4(), name, location: location || '' };
  warehouses.push(w);
  res.status(201).json(w);
});

export default router;