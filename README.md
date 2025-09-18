# Task Scheduling & Notification Platform

Monorepo containing a NestJS REST API and a Vue 3 + TypeScript admin UI.

- Backend: `backend/` (NestJS + TypeORM + MySQL, JWT auth)
- Frontend: `frontend/` (Vite + Vue 3 + Pinia + Vue Router)

## Features
- Tasks CRUD with search by title/description, status filter, assignee filter
- Users list with availability toggle
- Basic JWT auth (email/password login)
- Seed data: admin + demo users + sample tasks

## Quickstart

Prereqs: Node 18+, MySQL 8+ (or compatible). Network access is required to install dependencies.

### Backend
1. Copy env: `cp backend/.env.example backend/.env`
2. Edit DB credentials in `backend/.env`.
3. Install deps: `cd backend && npm i`
4. Start dev: `npm run start:dev` (default port `3000`)
5. Seed data (optional): `npm run seed`

Auth:
- Login via `POST /api/auth/login` with `{ email, password }`.
- Default admin: `admin@example.com` / `changeme` (from `.env` seed vars).

API routes:
- `GET /api/tasks?q=&status=&assigneeId=` — List/search tasks
- `POST /api/tasks` — Create task
- `PATCH /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task
- `GET /api/users` — List users
- `PATCH /api/users/:id/toggle-availability` — Toggle availability

### Frontend
1. Install deps: `cd frontend && npm i`
2. Start dev server: `npm run dev` (default port `5173`)
3. Frontend proxies `/api/*` to `http://localhost:3000`.

Login with the admin credentials above, then manage tasks and users.

## Docker (Optional)
- Provided `docker-compose.yml` runs MySQL + backend.
- Build and start:
  - `docker compose up -d --build`
  - Backend: http://localhost:3000, MySQL: localhost:3306
- Seed (from a shell inside backend):
  - `docker compose exec backend node dist/seed.js`
    - If `dist/seed.js` is not built yet, rebuild: `docker compose up -d --build`
- Frontend is not containerized here; run locally with Vite.

## Notes
- TypeORM `synchronize` is enabled via `.env` for local dev; disable in prod.
- Notifications/websockets are not implemented in this baseline (bonus item).

## License
MIT
