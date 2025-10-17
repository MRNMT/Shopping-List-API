# TODO: Enhance Shopping List API with Persistence, Auth, Logging, and Tests

## 1. Install New Dependencies
- [x] Add database: sqlite3
- [x] Add logging: winston
- [x] Add auth: jsonwebtoken, bcryptjs
- [x] Add testing: jest, supertest, @types/jest, @types/supertest
- [x] Update package.json scripts for test

## 2. Set Up Database
- [x] Create src/database/db.ts for SQLite connection
- [x] Create database schema: users table (id, username, password_hash, created_at)
- [x] Create items table (id, name, quantity, purchased, created_at, updated_at, user_id)
- [x] Add migration script or init function

## 3. Create User Model and Auth Utilities
- [x] Create src/models/user.ts interface
- [x] Create src/utils/auth.ts for JWT generation, validation, password hashing

## 4. Add Logging Setup
- [x] Create src/utils/logger.ts using Winston
- [x] Update errorHandler to use logger

## 5. Update Item Model
- [x] Add userId to Item interface

## 6. Create Auth Middleware
- [x] Create src/middleware/auth.ts for JWT verification

## 7. Update Items Routes
- [x] Modify src/routes/items.ts to use DB queries instead of in-memory array
- [x] Add auth middleware to protect all item routes
- [x] Update CRUD operations to work with DB and user-specific items

## 8. Create User Routes
- [x] Create src/routes/users.ts for register and login endpoints
- [x] Integrate with auth utilities

## 9. Add Unit Tests
- [ ] Create tests for models (item, user)
- [ ] Create tests for routes (items, users)
- [ ] Create tests for middleware (auth, errorHandler)
- [ ] Create tests for utils (auth, logger)

## 10. Update Server.ts
- [x] Integrate database connection
- [x] Add logging setup
- [x] Add user routes
- [x] Ensure auth middleware is applied where needed

## 11. Update README
- [x] Document new features: auth, persistence
- [x] Update endpoints (add user routes)
- [x] Add setup for database
- [x] Update examples with auth tokens

## 12. Test Full Application
- [ ] Run all tests
- [ ] Manual testing of endpoints with auth
- [ ] Verify data persistence across restarts
