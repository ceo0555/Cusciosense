# Alfanumrik SchoolOS – Solution Blueprint

## 1. System Architecture

- **Clients**: Web browsers (Next.js), companion mobile/webview (future), Razorpay checkout.
- **Edge & Delivery**: Vercel Edge Network for Next.js app, CDN for static assets, Resend/SES for emails, Firebase Cloud Messaging (or OneSignal) for push.
- **Backend Layer**: NestJS monorepo deployed on Render/Railway. Modular domain-driven structure (Auth, Users, Schools, Classes, Homework, Exams, Payments, Notifications).
- **Data & Storage**:
  - PostgreSQL (primary relational store).
  - Redis (session cache, rate limiting, job queue metadata).
  - S3-compatible object storage (student uploads, report PDFs).
  - ElasticSearch/OpenSearch (optional for global search).
- **Integrations**: Razorpay (subscriptions, school invoices), Email/SMS gateways, Google/Microsoft OAuth (optional SSO).
- **Observability**: OpenTelemetry traces, Prometheus metrics, Loki logs, Grafana dashboards.
- **CI/CD**: GitHub → Actions → Vercel (frontend) / Render Deploy Hooks (backend) with automated lint/test gates.

Data flow: Users authenticate via Next.js (NextAuth + backend). Backoffice queries NestJS GraphQL/REST. Homework assets go through pre-signed uploads → object store → metadata stored in Postgres. Notifications emitted via Nest event bus → email/in-app/push delivery micro-services.

## 2. DB Schema (Core Tables)

| Table | Key Columns | Notes / Relationships |
| --- | --- | --- |
| `users` | `id`, `email`, `phone`, `role`, `password_hash`, `locale` | Roles: SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT. |
| `schools` | `id`, `name`, `logo_url`, `subscription_plan_id`, `status` | `schools.admin_id` FK → `users.id`. |
| `school_members` | `id`, `school_id`, `user_id`, `role`, `metadata` | Enables multi-school membership and staff assignments. |
| `classrooms` | `id`, `school_id`, `grade`, `section`, `homeroom_teacher_id` | Each class belongs to a school. |
| `students` | `id`, `user_id`, `school_id`, `enrollment_no`, `guardian_contact` | Connects user identity with enrollment details. |
| `parents_students` | `parent_id`, `student_id`, `relationship` | Many-to-many parent-student. |
| `courses` | `id`, `classroom_id`, `subject`, `syllabus_url`, `teacher_id` | Adaptive LMS content anchor. |
| `course_modules` | `id`, `course_id`, `title`, `sequence`, `adaptive_rules JSONB` | Houses lessons/quizzes metadata. |
| `homework` | `id`, `course_id`, `assigned_by`, `due_at`, `instructions`, `attachments` | Attachments stored in S3, metadata JSONB. |
| `homework_submissions` | `id`, `homework_id`, `student_id`, `submitted_at`, `text`, `drawing_url`, `files JSONB`, `score`, `feedback` | Supports text/drawing/uploads. |
| `attendance` | `id`, `classroom_id`, `student_id`, `date`, `status`, `remarks` | Daily status. |
| `timetables` | `id`, `school_id`, `classroom_id`, `day`, `period`, `subject`, `teacher_id` | Weekly schedule. |
| `fees` | `id`, `school_id`, `student_id`, `invoice_no`, `amount`, `due_at`, `status`, `razorpay_order_id` | Linked to payments. |
| `payments` | `id`, `fee_id`, `razorpay_payment_id`, `status`, `paid_at`, `meta JSONB` | Webhook updates statuses. |
| `exams` | `id`, `school_id`, `term`, `start_at`, `end_at` | |
| `exam_schedules` | `id`, `exam_id`, `classroom_id`, `subject`, `date`, `max_marks` | |
| `grades` | `id`, `exam_schedule_id`, `student_id`, `marks_obtained`, `remarks` | Used for report cards. |
| `notifications` | `id`, `user_id`, `channel`, `title`, `body`, `data JSONB`, `read_at` | In-app feed & delivery log. |
| `subscriptions` | `id`, `school_id`, `plan`, `period_start`, `period_end`, `status` | Tied to payments for SchoolOS SaaS. |
| `audit_logs` | `id`, `actor_id`, `action`, `entity`, `entity_id`, `metadata`, `ip` | Compliance and troubleshooting. |

All tables include `created_at`, `updated_at`, soft-deletes where relevant. Use enums + check constraints for statuses.

## 3. API Surface (Representative)

### Auth & Users
- `POST /auth/register` – Super Admin onboarding or invite acceptance.
- `POST /auth/login` – Email/phone OTP or password.
- `POST /auth/refresh` – JWT refresh.
- `POST /auth/otp/send` – Trigger phone/email OTP.
- `GET /users/me` – Current profile.
- `PATCH /users/:id` – Update profile/role (RBAC guard).

### Schools & Classes
- `POST /schools` – Create school (Super Admin only).
- `GET /schools/:id` – Details incl. subscription.
- `POST /schools/:id/members` – Invite admin/staff.
- `GET /schools/:id/classes` – List classrooms.
- `POST /classes` – Create/update class & timetables.

### LMS & Homework
- `GET /courses?classroomId=...`
- `POST /courses` – Create course + modules.
- `POST /homework` – Assign homework with attachments.
- `GET /homework/:id`
- `POST /homework/:id/submit` – Student submission (multipart / JSON payload with pre-signed URLs).
- `PATCH /homework/submissions/:id` – Grade & feedback.

### Attendance & Exams
- `POST /attendance/mark`
- `GET /attendance?classroomId=...&date=...`
- `POST /exams` – Create exam term.
- `POST /exams/:id/schedules`
- `POST /grades/import` – Bulk grade upload CSV.
- `GET /report-cards/:studentId?examId=...` – Returns PDF URL.

### Fees & Payments
- `POST /fees` – Generate invoice rows.
- `GET /fees/:id`
- `POST /payments/create-order` – Razorpay order creation.
- `POST /payments/webhook` – Webhook handler.

### Notifications
- `GET /notifications`
- `POST /notifications/broadcast` – School admin announcements.

### Admin SaaS
- `GET /subscriptions`
- `POST /subscriptions/:schoolId/activate`

Transport: REST + GraphQL (for aggregated front-end queries). All endpoints behind Nest Guards with CASL-based policies. File uploads via `/storage/sign` for S3 presigned URLs.

## 4. Next.js Frontend Structure

```
frontend/
├─ app/
│  ├─ layout.tsx               # Shell with Sidebar + Topbar
│  ├─ page.tsx                 # Dashboard landing (role-aware)
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ (school)/
│  │  ├─ schools/[id]/page.tsx
│  │  ├─ classes/[id]/page.tsx
│  │  └─ fees/[id]/page.tsx
│  ├─ (lms)/
│  │  ├─ courses/[id]/page.tsx
│  │  └─ homework/[id]/page.tsx
│  ├─ api/
│  │  └─ auth/[...nextauth]/route.ts
│  └─ globals.css
├─ components/
│  ├─ layouts/
│  │  ├─ DashboardShell.tsx
│  │  └─ RoleSwitch.tsx
│  ├─ charts/AttendanceTrend.tsx
│  ├─ forms/HomeworkForm.tsx
│  ├─ homework/HomeworkSubmissionViewer.tsx
│  ├─ navigation/Sidebar.tsx
│  ├─ tables/FeesTable.tsx
│  └─ ui/ (Button, Card, Badge...)
├─ lib/
│  ├─ api-client.ts
│  ├─ auth.ts
│  └─ rbac.ts
├─ store/ (Zustand or Redux Toolkit slices)
├─ styles/ (Tailwind, theme tokens)
└─ tests/ (Playwright / Jest react-testing)
```

Example component responsibilities:
- `DashboardShell` – role-aware layout, fetches notifications.
- `HomeworkForm` – text editor + drawing canvas (Fabric.js) + file upload to pre-signed URL.
- `HomeworkSubmissionViewer` – switch between text/drawing/files tabs.
- `AttendanceTrend` – chart of weekly attendance via `@tanstack/react-query`.

## 5. NestJS Backend Starter Plan

```
backend/
├─ src/
│  ├─ app.module.ts
│  ├─ config/ (env validation, config service)
│  ├─ common/
│  │  ├─ guards/roles.guard.ts
│  │  ├─ decorators/current-user.decorator.ts
│  │  ├─ interceptors/
│  │  └─ dto/pagination.dto.ts
│  ├─ auth/
│  │  ├─ auth.module.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  └─ strategies/jwt.strategy.ts
│  ├─ users/
│  │  ├─ users.module.ts
│  │  ├─ users.controller.ts
│  │  └─ users.service.ts
│  ├─ schools/
│  ├─ classes/
│  ├─ homework/
│  └─ prisma/ or orm/ (Prisma or TypeORM setup)
├─ prisma/schema.prisma (if Prisma)
├─ package.json
└─ test/
```

Each module exports DTOs + controllers + services. Use `@nestjs/config`, `@nestjs/throttler`, `@nestjs/passport`. Background jobs handled via BullMQ module for notifications/report generation.

## 6. Local Run & Deployment

### Requirements
- Node.js 20+, pnpm.
- Docker (for Postgres/Redis/minio).
- Environment files: `frontend/.env.local`, `backend/.env`.

### Local Steps
1. `docker compose up -d postgres redis minio`.
2. Backend:
   - `cd backend`
   - `cp .env.example .env` (set DB URLs, JWT secrets, Razorpay keys sandbox).
   - `pnpm install`
   - `pnpm prisma migrate dev`
   - `pnpm start:dev`
3. Frontend:
   - `cd frontend`
   - `cp .env.example .env.local` (set `NEXT_PUBLIC_API_URL`, NextAuth secrets).
   - `pnpm install`
   - `pnpm dev`
4. Access via `http://localhost:3000`. Swagger at `http://localhost:4000/api/docs`.

### Deployment
- **Frontend (Vercel)**: Connect repo → set environment variables → enable Preview + Production deployments → use `pnpm build`.
- **Backend (Render/Railway)**:
  - Provision Postgres + Redis services.
  - Configure deploy hooks to run `pnpm install`, `pnpm prisma migrate deploy`, `pnpm start:prod`.
  - Set web service autoscaling, background worker for Bull queues.
- **Storage**: Use AWS S3 or Cloudflare R2 with lifecycle policies.
- **Domains**: `app.alfanumrik.com` (frontend) → Vercel; `api.alfanumrik.com` (backend) behind Cloudflare. Point Razorpay webhooks to `https://api…/payments/webhook`.
- **Observability**: Use Render metrics + Axiom/Datadog for logs, uptime monitors (BetterStack).

This blueprint guides implementation of School ERP + Adaptive LMS in a scalable, multi-tenant SaaS form factor.
