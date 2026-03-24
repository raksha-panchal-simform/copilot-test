# Project Guidelines

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript (strict mode)
- **Backend**: Express.js REST API
- **Frontend**: Angular (standalone components)

## Code Style

- Use TypeScript strict mode — no `any` types unless explicitly justified
- Prefer `const` over `let`; never use `var`
- Use named exports over default exports
- Use async/await over raw Promises or callbacks
- Use arrow functions for callbacks; named functions for top-level declarations

## Architecture

- `src/` — Backend (Node.js + Express)
  - `src/api/` — Route handlers, request/response types, and service layer
  - `src/server.ts` — Express server entry point
- `frontend/` — Angular frontend app
  - `frontend/src/app/components/` — Angular UI components
  - `frontend/src/app/services/` — HTTP services consuming the API
  - `frontend/src/app/models/` — Shared TypeScript interfaces

## API Response Structure

All API responses must follow this consistent structure:

### Success Response

```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": []
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

### Response Type Definitions

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: Pagination;
}

interface ApiError {
  code: string;
  message: string;
  details?: string[];
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
```

## Conventions

- Use `camelCase` for variables/functions, `PascalCase` for types/interfaces/components
- Prefix interfaces with descriptive names, not `I` (e.g., `UserProfile`, not `IUserProfile`)
- All API handlers must return the standard `ApiResponse<T>` structure
- Handle errors with try/catch and return proper error responses — never let unhandled errors leak
- Use HTTP status codes correctly (200, 201, 400, 404, 500)
