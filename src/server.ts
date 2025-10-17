import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items';
import usersRouter from './routes/users';
import { errorHandler, notFound } from './middleware/errorHandler';
import { db } from './database/db';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, data: { message: 'Shopping List API', version: '2.0.0' } });
});

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// 404 handler for unknown routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await db.init();
    logger.info('Database initialized successfully');

    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize database', { error });
    process.exit(1);
  }
}

startServer();
