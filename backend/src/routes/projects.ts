import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import requireAuth from './auth_mw';

const router = Router();
type Project = { id: string; name: string; budget: number; deadline: string; expenses: number; status: 'active' | 'completed' };

const projects: Project[] = [
  { id: uuidv4(), name: 'Projeto A', budget: 10000, deadline: '2025-12-31', expenses: 2500, status: 'active' },
  { id: uuidv4(), name: 'Obra B', budget: 50000, deadline: '2026-06-30', expenses: 15000, status: 'active' },
];

router.get('/', requireAuth, (req, res) => {
  res.json(projects);
});

router.post('/', requireAuth, (req, res) => {
  const { name, budget, deadline } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const p: Project = { id: uuidv4(), name, budget: Number(budget) || 0, deadline: deadline || '', expenses: 0, status: 'active' };
  projects.push(p);
  res.status(201).json(p);
});

router.put('/:id/expense', requireAuth, (req, res) => {
  const p = projects.find(pr => pr.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  const { amount } = req.body;
  p.expenses += Number(amount) || 0;
  res.json(p);
});

export default router;