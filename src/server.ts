import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { PORT } from './config/constants';

import animalsRoutes from './routes/animals.routes';
import ledgerRoutes from './routes/ledger.routes';
import breedingRoutes from './routes/breeding.routes';
import feedsRoutes from './routes/feeds.routes';
import healthRoutes from './routes/health.routes';
import salesRoutes from './routes/sales.routes';
import alertsRoutes from './routes/alerts.routes';
import reportsRoutes from './routes/reports.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Shamba Pro API is running 🐖' });
});

app.use('/api/animals', animalsRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/breeding', breedingRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/health-events', healthRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Shamba Pro API running on port ${PORT}`);
});

export default app;