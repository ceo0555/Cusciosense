# Alfanumrik SchoolOS

Full-stack starter for the School ERP + Adaptive LMS platform described by the product brief. The repo currently contains:

- `docs/architecture.md` – solution blueprint, DB schema, API surface, deployment steps.
- `frontend/` – Next.js 14 + Tailwind scaffold with role-aware dashboard pages and reusable UI components.
- `backend/` – NestJS 10 starter with Auth, Users, Schools, Classes, Homework modules wired to Prisma/PostgreSQL.

## Local Development

### Prerequisites
- Node.js 20+
- pnpm (recommended)
- Docker (for Postgres, Redis, MinIO) if you want full infra parity

### Backend
```bash
cd backend
cp .env.example .env
pnpm install
pnpm prisma migrate dev
pnpm start:dev
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:4000/api`. Update `NEXT_PUBLIC_API_URL` to match your API host.

## Deployment

- **Frontend**: Deploy to Vercel. Set `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.
- **Backend**: Deploy to Render or Railway. Set env vars from `.env.example`, run `pnpm prisma migrate deploy` before `pnpm start:prod`.

Refer to `docs/architecture.md` for detailed module responsibilities, API endpoints, and operational guidance.
