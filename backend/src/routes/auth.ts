import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// demo user (in a real app use DB)
const demoUser = {
  id: '1',
  username: 'admin',
  // password is 'password' hashed
  passwordHash: bcrypt.hashSync('password', 8),
  name: 'Administrador'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (username !== demoUser.username || !bcrypt.compareSync(password, demoUser.passwordHash)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = jwt.sign({ sub: demoUser.id, username: demoUser.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ accessToken: token, user: { id: demoUser.id, name: demoUser.name, username: demoUser.username } });
});

export default router;
