# Shopping List REST API (Node.js + TypeScript)

A secure, persistent Shopping List REST API that allows users to register, login, and manage their personal shopping items with full CRUD operations.

## Requirements
- Node.js >= 14
- npm

## Install
```bash
npm install
```

## Run in development
```bash
npm run dev
```

## Build + Run
```bash
npm run build
npm start
```

Server runs on `http://localhost:3000` by default.

## Authentication
All item endpoints require authentication. You must first register and login to get a JWT token, then include it in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints (JSON request/response)

### User Management
- `POST /users/register` — Register a new user.
  - Body: `{ "username": "johndoe", "password": "securepassword" }`
  - Response: `201 Created` with JWT token and user info

- `POST /users/login` — Login user.
  - Body: `{ "username": "johndoe", "password": "securepassword" }`
  - Response: `200 OK` with JWT token and user info

### Shopping Items (Requires Authentication)
- `POST /items` — Create an item.
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "Milk", "quantity": "1L" }` or `{ "name": "Eggs", "quantity": 12 }`
  - Response: `201 Created` with created item

- `GET /items` — Get all user's items.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK` `{ "success": true, "data": [ ... ] }`

- `GET /items/:id` — Get single item by id.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK` with item or `404 Not Found`

- `PUT /items/:id` — Update item fields (name, quantity, purchased)
  - Headers: `Authorization: Bearer <token>`
  - Body example: `{ "name":"Milk", "quantity": "2L", "purchased": true }`
  - Response: `200 OK` with updated item or `404 Not Found`

- `DELETE /items/:id` — Delete an item
  - Headers: `Authorization: Bearer <token>`
  - Response: `204 No Content` on success or `404 Not Found`

## Response shape
All successful responses use the JSON envelope:
```json
{
  "success": true,
  "data": ...,
  "message": "optional human message"
}
```

Errors use:
```json
{
  "success": false,
  "error": "Description of error",
  "details": { /* optional */ }
}
```

## Notes
- Data is stored persistently in SQLite database. Items are user-specific.
- Authentication is required for all item operations.
- Use Postman, curl or any REST client to test the endpoints.
- Example curl to register:
```bash
curl -X POST http://localhost:3000/users/register -H "Content-Type: application/json" -d '{ "username":"johndoe", "password":"securepassword" }'
```
- Example curl to create an item (replace TOKEN with actual JWT):
```bash
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{ "name":"Bread", "quantity":"1 loaf" }'
```

## Files included
- `src/server.ts` — entry point with database initialization
- `src/models/item.ts` — Item type definition
- `src/models/user.ts` — User type definitions
- `src/routes/items.ts` — Express router implementing item CRUD with auth
- `src/routes/users.ts` — Express router for user registration and login
- `src/middleware/auth.ts` — JWT authentication middleware
- `src/middleware/errorHandler.ts` — error handling middleware
- `src/database/db.ts` — SQLite database connection and queries
- `src/utils/auth.ts` — JWT and password utilities
- `src/utils/logger.ts` — Winston logging setup

---

#
