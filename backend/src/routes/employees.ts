import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Employee = { id: string; name: string; email: string; phone: string; salary: number; position: string };

const employees: Employee[] = [
  { id: uuidv4(), name: 'João Funcionário', email: 'joao@empresa.com', phone: '123456789', salary: 1500, position: 'Vendedor' },
  { id: uuidv4(), name: 'Maria Gestora', email: 'maria@empresa.com', phone: '987654321', salary: 2000, position: 'Gerente' },
];

router.get('/', requireAuth, (req, res) => {
  res.json(employees);
});

router.post('/', requireAuth, (req, res) => {
  const { name, email, phone, salary, position } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const e: Employee = { id: uuidv4(), name, email: email || '', phone: phone || '', salary: Number(salary) || 0, position: position || '' };
  employees.push(e);
  res.status(201).json(e);
});

export default router;