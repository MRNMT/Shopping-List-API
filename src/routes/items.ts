import express, { Request, Response, NextFunction } from 'express';
import { Item } from '../models/item';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db';
import { authenticateToken } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Helper - consistent response
function ok(res: Response, data: any, message?: string) {
  return res.json({ success: true, data, message });
}

// Validation
function validateItemInput(body: any) {
  const errors: Record<string,string> = {};
  if (!body || typeof body !== 'object') {
    errors.body = 'Request body must be a JSON object';
    return errors;
  }
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.name = 'Name is required and must be a non-empty string';
  }
  if (body.quantity !== undefined && typeof body.quantity !== 'string' && typeof body.quantity !== 'number') {
    errors.quantity = 'Quantity must be a string or number if provided';
  }
  if (body.purchased !== undefined && typeof body.purchased !== 'boolean') {
    errors.purchased = 'Purchased must be a boolean if provided';
  }
  return errors;
}

// GET /items
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const items = await db.getItemsByUserId(userId);
    logger.info(`User ${userId} retrieved ${items.length} items`);
    return ok(res, items);
  } catch (error) {
    logger.error('Error retrieving items', { error, userId: req.user!.userId });
    next(error);
  }
});

// POST /items
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const errors = validateItemInput(body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: 'Validation error', details: errors });
    }

    const userId = req.user!.userId;
    const id = uuidv4();
    await db.createItem(id, body.name.trim(), body.quantity, userId);

    const newItem = await db.getItemByIdAndUserId(id, userId);
    logger.info(`User ${userId} created item ${id}`);
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    logger.error('Error creating item', { error, userId: req.user!.userId });
    next(error);
  }
});

// GET /items/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.user!.userId;
    const item = await db.getItemByIdAndUserId(id, userId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    logger.info(`User ${userId} retrieved item ${id}`);
    return ok(res, item);
  } catch (error) {
    logger.error('Error retrieving item', { error, userId: req.user!.userId, itemId: req.params.id });
    next(error);
  }
});

// PUT /items/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.user!.userId;
    const body = req.body;

    // Check if item exists and belongs to user
    const existing = await db.getItemByIdAndUserId(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const errors = validateItemInput(body);
    // It's okay for updates to omit some fields; only validate present fields.
    // Remove `name` error if name not present in body.
    if (!('name' in body)) delete errors.name;
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: 'Validation error', details: errors });
    }

    const updates: any = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.quantity !== undefined) updates.quantity = body.quantity;
    if (body.purchased !== undefined) updates.purchased = Boolean(body.purchased);

    await db.updateItem(id, userId, updates);
    const updated = await db.getItemByIdAndUserId(id, userId);
    logger.info(`User ${userId} updated item ${id}`);
    return res.json({ success: true, data: updated });
  } catch (error) {
    logger.error('Error updating item', { error, userId: req.user!.userId, itemId: req.params.id });
    next(error);
  }
});

// DELETE /items/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.user!.userId;

    // Check if item exists and belongs to user
    const item = await db.getItemByIdAndUserId(id, userId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    await db.deleteItem(id, userId);
    logger.info(`User ${userId} deleted item ${id}`);
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting item', { error, userId: req.user!.userId, itemId: req.params.id });
    next(error);
  }
});

export default router;
