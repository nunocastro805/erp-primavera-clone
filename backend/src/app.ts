import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, name: 'ERP Primavera Clone API' }));
app.use('/api', routes);

// simple error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

export default app;
