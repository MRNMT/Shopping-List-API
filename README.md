# Shopping List REST API

A simple Shopping List REST API built with Node.js and TypeScript. Uses in-memory storage (array of objects) for managing shopping items.

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

## Endpoints

### Shopping Items
- `POST /items` — Create a new item.
  - Body: `{ "name": "Milk", "quantity": "1L", "purchased": false }`
  - Response: `201 Created` with created item
  - Validation: `name` is required, `quantity` and `purchased` are optional

- `GET /items` — Get all items.
  - Response: `200 OK` with array of items

- `GET /items/:id` — Get single item by ID.
  - Response: `200 OK` with item or `404 Not Found`

- `PUT /items/:id` — Update item fields (name, quantity, purchased)
  - Body example: `{ "name":"Milk", "quantity": "2L", "purchased": true }`
  - Response: `200 OK` with updated item or `404 Not Found`

- `DELETE /items/:id` — Delete an item
  - Response: `204 No Content` on success or `404 Not Found`

## Response Examples

### Success Response
```json
{
  "id": "uuid-here",
  "name": "Milk",
  "quantity": "1L",
  "purchased": false
}
```

### Error Response
```json
{
  "error": "Validation error",
  "details": {
    "name": "Name is required and must be a non-empty string"
  }
}
```

## Testing with Postman
1. Create a new request
2. Set method to POST
3. URL: `http://localhost:3000/items`
4. Headers: `Content-Type: application/json`
5. Body: raw JSON with item data
6. Send request

## Notes
- Data is stored in memory and will be lost when the server restarts
- Use Postman, curl or any REST client to test the endpoints
- Example curl:
```bash
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d '{"name": "Bread", "quantity": "1 loaf"}'
```

