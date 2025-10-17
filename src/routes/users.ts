import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { CreateUserRequest, LoginRequest, AuthResponse } from '../models/user';
import logger from '../utils/logger';

const router = express.Router();

// Helper - consistent response
function ok(res: Response, data: any, message?: string) {
  return res.json({ success: true, data, message });
}

// POST /users/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password }: CreateUserRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters and password at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Username already exists'
      });
    }

    const id = uuidv4();
    const passwordHash = await hashPassword(password);
    await db.createUser(id, username, passwordHash);

    const token = generateToken({ id, username, passwordHash, createdAt: new Date() });
    logger.info(`User ${username} registered successfully`);
    const response: AuthResponse = { token, user: { id, username } };
    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    logger.error('Error registering user', { error, username: req.body.username });
    next(error);
  }
});

// POST /users/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user);
    logger.info(`User ${username} logged in successfully`);
    const response: AuthResponse = { token, user: { id: user.id, username: user.username } };
    return ok(res, response);
  } catch (error) {
    logger.error('Error logging in user', { error, username: req.body.username });
    next(error);
  }
});

export default router;
