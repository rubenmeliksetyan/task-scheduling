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

You can run everything with Docker, or run services locally in dev mode.

### Option A — Docker (recommended)
- Build and start all services (MySQL, backend, frontend):
  - `docker compose up -d --build`
- URLs:
  - Backend API: `http://localhost:3000` (prefix `/api`)
  - Frontend UI: `http://localhost:5174`
- Seed demo data (admin + users + sample tasks):
  - `docker exec ts_backend node dist/seed.js`
- Notes:
  - MySQL is internal (no host port exposed). Use `docker exec -it ts_mysql mysql -uroot -proot` to connect, or expose a host port by editing `docker-compose.yml`.

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

### Option B — Local dev (no Docker)

Backend
1. Copy env: `cp backend/.env.example backend/.env`
2. Edit DB credentials in `backend/.env`.
3. Install deps: `cd backend && npm i`
4. Start dev: `npm run start:dev` (default port `3000`)
5. Seed data (optional): `npm run seed`

Frontend
1. Install deps: `cd frontend && npm i`
2. Start dev server: `npm run dev` (default port `5173`)
3. Vite dev server proxies `/api/*` to `http://localhost:3000`.

Login with the admin credentials above, then manage tasks and users.

## Realtime notifications
- Socket.IO gateway at namespace `/events` with JWT handshake.
- Frontend connects via `/events` and listens for `task.created` and `task.updated`.

## Notes
- TypeORM `synchronize` is enabled via `.env` for local dev; disable in prod.
- To expose MySQL to the host, add a `ports:` mapping under the `mysql` service (e.g. `"3311:3306"`).

## License
MIT
