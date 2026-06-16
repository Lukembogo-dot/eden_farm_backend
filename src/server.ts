import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import animalsRouter from './routes/animals';
import ledgerRouter from './routes/ledger';
import feedsRouter from './routes/feeds';
import salesRouter from './routes/sales';
import healthRouter from './routes/health';
import alertsRouter from './routes/alerts';
import statsRouter from './routes/stats';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/animals', animalsRouter);
app.use('/api/ledger', ledgerRouter);
app.use('/api/feeds', feedsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/health-events', healthRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/stats', statsRouter);

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Shamba Pro API is running 🐖' });
});

// ── Error handler (must be last) ──
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Shamba Pro API running on port ${PORT}`);
});

export default app;