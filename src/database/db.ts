import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class Database {
  private db: sqlite3.Database;

  constructor(filename: string = ':memory:') {
    this.db = new sqlite3.Database(filename);
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create users table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(err);
        });

        // Create items table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            quantity TEXT,
            purchased BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // User queries
  async createUser(id: string, username: string, passwordHash: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
        [id, username, passwordHash],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getUserByUsername(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Item queries
  async createItem(id: string, name: string, quantity: string | null, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO items (id, name, quantity, user_id) VALUES (?, ?, ?, ?)',
        [id, name, quantity, userId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getItemsByUserId(userId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getItemByIdAndUserId(id: string, userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM items WHERE id = ? AND user_id = ?',
        [id, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async updateItem(id: string, userId: string, updates: any): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(updates.quantity);
    }
    if (updates.purchased !== undefined) {
      fields.push('purchased = ?');
      values.push(updates.purchased);
    }
    fields.push('updated_at = CURRENT_TIMESTAMP');

    values.push(id, userId);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE items SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
        values,
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Item not found'));
          else resolve();
        }
      );
    });
  }

  async deleteItem(id: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM items WHERE id = ? AND user_id = ?',
        [id, userId],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Item not found'));
          else resolve();
        }
      );
    });
  }
}

// Export a singleton instance
export const db = new Database('./shopping-list.db');
