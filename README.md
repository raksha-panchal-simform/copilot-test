# copilot-test

User CRUD project with:
- Backend: Node.js + Express + TypeScript
- Frontend: Angular (standalone components)
- Containerization: Docker + Docker Compose

## Project Structure

- `src/` - backend API
- `frontend/` - Angular frontend
- `Dockerfile` - backend image
- `frontend/Dockerfile` - frontend image
- `docker-compose.yml` - runs backend and frontend together

## Prerequisites

- Node.js 20+
- npm 10+
- Docker and Docker Compose

## Run Locally (without Docker)

### 1. Start backend

```bash
npm install
npm run build
npm start
```

Backend runs at `http://localhost:3000`.

For development mode:

```bash
npm run dev
```

### 2. Start frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:4200`.

## Run with Docker Compose

From repository root:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000/api/users`

To stop:

```bash
docker compose down
```

## API Notes

Base path: `http://localhost:3000/api/users`

Typical endpoints:
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

For full details on the user authentication API (signup, login, error codes, and response format), see [AUTH_API.md](./AUTH_API.md).

## Build Backend for Production

```bash
npm run build
npm start
```

## License

ISC
