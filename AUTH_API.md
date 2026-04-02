# Auth & User API Documentation

## Introduction

This document covers the **User** and **Auth** REST API endpoints for a Node.js + Express + TypeScript application.

**Who is this for?**  
Developers integrating with this API — including beginners. No prior experience with this codebase is required. Every endpoint is explained step by step, with real examples you can copy and paste.

**What you'll find here:**
- How to sign up a new user
- How to log in (planned endpoint — details below)
- How errors are returned and what they mean
- The standard response format used across all endpoints

---

## Base URL

All endpoints are relative to the following base URL:

```
http://localhost:3000
```

**Example:** The signup endpoint is at `http://localhost:3000/api/users`

> Make sure the server is running locally before sending requests.

---

## Signup API

### `POST /api/users`

Creates a new user account.

---

### Request Body

Send a JSON object with the following fields:

| Field   | Type   | Required | Description           |
|---------|--------|----------|-----------------------|
| `name`  | string | ✅ Yes   | Full name of the user |
| `email` | string | ✅ Yes   | User's email address  |
| `age`   | number | ❌ No    | Age of the user       |

**Validation rules:**
- `name` — must be provided and must be a string
- `email` — must be provided and must be a string
- `age` — optional; if included, it must be a number

---

### Example Request

**Using `curl`:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 28
  }'
```

**Using a JSON body (without `age`):**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

---

### Success Response — `201 Created`

The user was created. The server returns the full user object.

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 28,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "User created successfully"
}
```

**Field notes:**
- `id` — a UUID generated automatically by the server; you cannot set this yourself
- `createdAt` / `updatedAt` — timestamps in ISO 8601 format, also set by the server

---

### Error Responses

#### Validation Error — `400 Bad Request`

Returned when a required field is missing or has the wrong type.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      "name is required and must be a string",
      "email is required and must be a string"
    ]
  }
}
```

The `details` array lists every field that failed validation. Fix each one and retry.

#### Server Error — `500 Internal Server Error`

Returned when something unexpected goes wrong on the server side.

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to create user"
  }
}
```

If you see this, check the server logs for more information. This is not caused by your request body.

---

## Login API

### `POST /api/auth/login`

> ⚠️ **Planned endpoint — not yet implemented.**  
> This endpoint is planned and not yet available. The shape below reflects the intended design. Do not use it in production until it has been released.

---

Authenticates an existing user and returns a token for future requests.

---

### Request Body

| Field      | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `email`    | string | ✅ Yes   | Registered email address |
| `password` | string | ✅ Yes   | Account password         |

---

### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "your-password-here"
  }'
```

---

### Success Response — `200 OK`

Returns a JWT token and basic user information.

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  },
  "message": "Login successful"
}
```

Save the `token` value. You will include it in the `Authorization` header for authenticated requests.

---

### Error Responses

| Scenario           | HTTP Status | `error.code`          | `error.message`             |
|--------------------|-------------|-----------------------|-----------------------------|
| Missing fields     | 400         | `VALIDATION_ERROR`    | `Invalid request body`      |
| Wrong credentials  | 401         | `INVALID_CREDENTIALS` | `Invalid email or password` |
| Unexpected failure | 500         | `INTERNAL_ERROR`      | `Failed to authenticate`    |

**Example — Invalid credentials (`401`):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**Example — Missing fields (`400`):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      "email is required and must be a string",
      "password is required and must be a string"
    ]
  }
}
```

---

## Error Handling

Every error response follows the same structure. The `error` object always contains a `code` and a `message`. Some errors also include a `details` array with specifics.

**Standard error response shape:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": ["Optional list", "of specific problems"]
  }
}
```

**Error codes reference:**

| Code                  | HTTP Status | When it happens                                   |
|-----------------------|-------------|---------------------------------------------------|
| `VALIDATION_ERROR`    | 400         | A required field is missing or has the wrong type |
| `INVALID_CREDENTIALS` | 401         | The email or password is incorrect                |
| `USER_NOT_FOUND`      | 404         | No user exists with the given ID                  |
| `INTERNAL_ERROR`      | 500         | An unexpected server-side error occurred          |

**Tips for handling errors in your code:**
- Always check the `success` field first — if it is `false`, read `error.code` to understand what went wrong
- Use `error.details` (when present) to show field-level feedback to users
- Treat `500` errors as server problems, not user input problems

---

## Response Format

Every API response is wrapped in an `ApiResponse<T>` object. This makes it easy to handle both success and error cases consistently.

### Response Fields

| Field        | Type              | Always present? | Description                                                       |
|--------------|-------------------|-----------------|-------------------------------------------------------------------|
| `success`    | `boolean`         | ✅ Always       | `true` if the request succeeded, `false` if it failed            |
| `data`       | `T` (varies)      | ❌ On success   | The returned payload; shape depends on the endpoint              |
| `message`    | `string`          | ❌ Sometimes    | A human-readable summary of what happened                        |
| `error`      | `ApiError`        | ❌ On failure   | Present only when `success` is `false`; describes what went wrong |
| `pagination` | `Pagination`      | ❌ On lists     | Present only on endpoints that return paginated lists            |

### Generic Shape

```json
{
  "success": true,
  "data": { },
  "message": "Optional status message",
  "error": null,
  "pagination": null
}
```

### `ApiError` Shape

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request body",
  "details": [
    "name is required and must be a string"
  ]
}
```

### `Pagination` Shape

```json
{
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "totalItems": 98
}
```

> `pagination` only appears on endpoints that return a list of items. Single-resource endpoints (like signup) do not include it.

### When each field appears

- **`data`** — included on successful responses that return a resource (e.g., a created user or a login token)
- **`message`** — included on most successful responses as a short confirmation; may be absent on some error responses
- **`error`** — only included when `success` is `false`; never present alongside a valid `data` payload
- **`pagination`** — only included on list endpoints (none in this document yet)

---

## Quick Start

Follow these steps to go from zero to a working session with the API.

### Step 1 — Sign Up

Create your user account by sending a `POST` request to `/api/users`.

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 28
  }'
```

**Expected result:** A `201 Created` response with your new user object, including a server-generated `id`. Save this `id` — you may need it for future requests.

---

### Step 2 — Log In

> ⚠️ **This step requires the Login endpoint to be available.** It is currently planned but not yet implemented. Once released, use the request below.

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "your-password-here"
  }'
```

**Expected result:** A `200 OK` response containing a `token` string in the `data` field.

---

### Step 3 — Use the Token

Once you have the token from Step 2, include it in the `Authorization` header for any authenticated endpoint:

```bash
curl -X GET http://localhost:3000/api/some-protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Replace the token value with the one returned from your login response. Authenticated endpoints are not yet documented — this is a forward-looking note for when they become available.

---

*Last updated: July 2025 · Built with Node.js, Express, TypeScript*
