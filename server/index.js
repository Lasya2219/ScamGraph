import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scamRoutes from './src/routes/scamRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { verifyConnection } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', scamRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, async () => {
  console.log(`ScamGraph API Server running on http://localhost:${PORT}`);
  try {
    await verifyConnection();
  } catch (err) {
    console.warn('Server started, but database is not reachable yet.');
  }
});