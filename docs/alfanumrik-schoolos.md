# Alfanumrik SchoolOS – Architecture & Implementation Blueprint

## 1. System Architecture
- **Clients**: Responsive Next.js SaaS UI (desktop/tablet/mobile) + optional mobile wrapper. Role-aware layouts for Super Admin, School Admin, Teacher, Student, Parent.
- **Edge & CDN**: Vercel handles static asset CDN, ISR caching, image optimization, Route Handlers for lightweight needs (public catalog, marketing).
- **Frontend App**: Next.js 15 (App Router) with Tailwind, Shadcn UI, React Query, Zustand (session cache), and tRPC/REST client. Uses Next Auth for credential + OTP login, server components for dashboards, and Client Components for whiteboard/homework editors.
- **Backend**: NestJS monolith deployed on Render/Railway. Modules for Auth, Users/Roles, Schools, Classes, Homework, LMS, ERP, Payments, Notifications. Uses Passport strategies (email/password, OTP, JWT), BullMQ for async jobs, and class-validator pipes for DTOs.
- **Database**: PostgreSQL (primary) + Prisma ORM. Schemas partitioned by school_id for multi-tenancy. Triggers maintain audit logs. Timescale or native partitions for attendance/log data if scale grows.
- **Storage & Files**: S3-compatible bucket (e.g., AWS S3, Cloudflare R2) for homework uploads, report cards, media. Signed URLs exposed through backend.
- **Cache & Queues**: Redis for session cache, rate limiting, BullMQ queues (notifications, report generation, Razorpay webhook processing).
- **Payments**: Razorpay subscription integration for school billing + one-time fees. Webhook worker validates and writes to `payments` + `subscriptions`.
- **Notifications**: Email (Resend/SES) + in-app center via WebSocket (Nest + Redis pub/sub). Notification preferences stored per user.
- **Observability**: OpenTelemetry tracing, Winston logging streamed to Logtail, Health checks via `/health`.
- **Deployment Flow**: 
  1. Push to GitHub → CI (lint/test) → Build Next.js & NestJS images. 
  2. Vercel deploy for frontend, Docker image to Render/Railway for backend.
  3. Prisma migrations executed via automated job before backend release.

## 2. Database Schema (Core Tables)

| Table | Key Columns | Purpose / Relations |
| --- | --- | --- |
| users | `id PK`, `email`, `phone`, `password_hash`, `status`, `last_login_at` | Base identity record. FK to `roles`. |
| roles | `id PK`, `name` (`super_admin`, `school_admin`, `teacher`, `student`, `parent`), `permissions JSONB` | Role catalog. |
| user_roles | `user_id FK`, `role_id FK`, `school_id FK nullable` | Allows multi-role assignments per school. |
| schools | `id PK`, `name`, `code`, `address`, `subscription_plan`, `razorpay_customer_id` | Tenant metadata. |
| school_settings | `school_id PK`, `branding JSONB`, `grading_policy JSONB`, `attendance_cutoff` | Customization knobs. |
| staff | `id PK`, `user_id FK`, `school_id FK`, `designation`, `doj`, `status` | Teacher/Admin profile data. |
| students | `id PK`, `user_id FK`, `school_id FK`, `admission_no`, `dob`, `current_class_id FK` | Student profile. |
| parents | `id PK`, `user_id FK`, `student_id FK`, `relation` | Parent linkage. |
| classes | `id PK`, `school_id FK`, `name`, `section`, `academic_year`, `homeroom_teacher_id FK` | Class/timetable anchor. |
| enrolments | `id PK`, `student_id FK`, `class_id FK`, `status`, `joined_on` | Student membership. |
| admissions | `id PK`, `school_id FK`, `student_id FK nullable`, `stage`, `submitted_on`, `metadata JSONB` | Leads to admissions. |
| attendance | `id PK`, `class_id FK`, `student_id FK`, `date`, `status`, `recorded_by FK` | Daily attendance logs. |
| timetable_slots | `id PK`, `class_id FK`, `weekday`, `start_time`, `end_time`, `subject`, `teacher_id FK` | Weekly schedule. |
| courses | `id PK`, `class_id FK`, `title`, `description`, `status` | LMS course per class. |
| course_modules | `id PK`, `course_id FK`, `title`, `order`, `release_at` | Organized curriculum. |
| lessons | `id PK`, `module_id FK`, `content_richtext`, `attachments JSONB` | Lesson units. |
| homework | `id PK`, `class_id FK`, `teacher_id FK`, `title`, `instructions`, `due_at`, `allow_draw`, `allow_upload` | Homework brief. |
| homework_submissions | `id PK`, `homework_id FK`, `student_id FK`, `content_richtext`, `drawing_url`, `attachments JSONB`, `grade`, `feedback` | Student submissions. |
| quizzes | `id PK`, `course_id FK`, `title`, `due_at`, `grading_schema JSONB` | Adaptive quizzes. |
| quiz_questions | `id PK`, `quiz_id FK`, `question_type`, `prompt`, `options JSONB`, `answer_key` | Question bank. |
| quiz_attempts | `id PK`, `quiz_id FK`, `student_id FK`, `score`, `responses JSONB`, `started_at`, `completed_at` | Attempt log. |
| exams | `id PK`, `school_id FK`, `title`, `term`, `schedule JSONB` | Term exams. |
| exam_results | `id PK`, `exam_id FK`, `student_id FK`, `subject`, `marks_obtained`, `grade` | Report card data. |
| report_cards | `id PK`, `student_id FK`, `exam_id FK`, `pdf_url`, `generated_by FK`, `generated_at` | Stored PDFs. |
| fees | `id PK`, `school_id FK`, `student_id FK`, `description`, `amount`, `due_date`, `status` | Fee assignments. |
| payments | `id PK`, `school_id FK`, `fee_id FK nullable`, `razorpay_payment_id`, `amount`, `currency`, `status`, `meta JSONB` | Razorpay reconciled. |
| subscriptions | `id PK`, `school_id FK`, `plan`, `renewal_date`, `razorpay_subscription_id`, `status` | School billing. |
| notifications | `id PK`, `user_id FK`, `type`, `title`, `body`, `channel`, `read_at`, `payload JSONB` | In-app/email tracking. |
| audit_logs | `id PK`, `actor_id FK`, `entity`, `entity_id`, `action`, `payload JSONB`, `created_at` | Compliance trail. |

**ER principles**: soft deletes via `deleted_at`, all tenant data includes `school_id`, indexes on (`school_id`, `class_id`), composite unique for `timetable_slots`, `attendance` (student/date).

## 3. API Endpoint Map (REST, versioned under `/api/v1`)

| Method & Path | Description | Auth |
| --- | --- | --- |
| `POST /auth/login` | Email/password login → JWT + refresh | Public |
| `POST /auth/login/otp` | OTP request + verification | Public |
| `POST /auth/refresh` | Refresh JWT pair | Auth |
| `POST /auth/logout` | Revoke refresh token | Auth |
| `GET /users/me` | Current profile + roles | Auth |
| `PATCH /users/me` | Update profile, preferences | Auth |
| `POST /schools` | Create school (Super Admin) | Super Admin |
| `GET /schools/:id` | School details + settings | Role: school scope |
| `PATCH /schools/:id/settings` | Branding, grading policies | School Admin |
| `POST /schools/:id/staff` | Invite teacher/admin | School Admin |
| `GET /classes` | List classes for school | Teacher/Admin |
| `POST /classes` | Create class & timetable seeds | School Admin |
| `GET /classes/:id/timetable` | Class timetable | Teacher/Student |
| `POST /attendance` | Bulk mark attendance | Teacher |
| `GET /attendance?classId=&date=` | View attendance | Teacher/Admin |
| `POST /courses` | Create LMS course | Teacher |
| `GET /courses/:id` | Course detail with modules/lessons | Enrolled users |
| `POST /homework` | Publish homework (allows draw/upload toggles) | Teacher |
| `GET /homework?classId=` | Homework list | Student/Parent |
| `POST /homework/:id/submissions` | Student submission (rich text/draw/upload) | Student |
| `PATCH /homework/submissions/:id` | Teacher grading & feedback | Teacher |
| `POST /quizzes` | Create quiz with adaptive settings | Teacher |
| `POST /quizzes/:id/attempts` | Start attempt | Student |
| `PATCH /quizzes/attempts/:id` | Submit attempt/responses | Student |
| `POST /exams` | Schedule exams | School Admin |
| `POST /exam-results/import` | Bulk grade upload CSV | Teacher/Admin |
| `GET /students/:id/report-cards` | Fetch generated PDFs | Parent/Student |
| `POST /fees` | Assign fees to student/class | School Admin |
| `POST /payments/razorpay/webhook` | Webhook sink (verifies signature) | Razorpay |
| `GET /payments/history` | Payment & subscription logs | Admin |
| `GET /notifications` | In-app notification center | Auth |
| `POST /notifications` | Queue custom notification | Admin |
| `GET /health` | Readiness/liveness | Public |

Pagination via `?page=` `?limit=`, filtering with query params, all protected routes enforce tenant scope via `school_id`.

## 4. Next.js Frontend Structure

```
apps/web/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx (marketing)
│  ├─ (auth)/
│  │   ├─ login/page.tsx
│  │   └─ otp/page.tsx
│  ├─ (dashboard)/
│  │   ├─ layout.tsx (role-aware shell)
│  │   ├─ schools/[schoolId]/page.tsx
│  │   ├─ classes/[classId]/
│  │   │   ├─ page.tsx
│  │   │   ├─ attendance/page.tsx
│  │   │   └─ homework/page.tsx
│  │   ├─ lms/courses/[courseId]/page.tsx
│  │   └─ finance/fees/page.tsx
├─ components/
│  ├─ ui/ (button, card, modal, tabs)
│  ├─ layout/Sidebar.tsx
│  ├─ charts/AttendanceTrend.tsx
│  ├─ homework/HomeworkEditor.tsx
│  └─ notifications/NotificationBell.tsx
├─ lib/
│  ├─ api-client.ts (REST client via ky/axios)
│  ├─ auth.ts (NextAuth config)
│  ├─ permissions.ts (role guard helpers)
│  └─ zod-schemas.ts
├─ hooks/ (useRole, useSchool, useRealtimeNotifications)
├─ store/ (Zustand slices for session, UI state)
├─ styles/globals.css
└─ types/index.ts
```

**Example dashboard page snippet**

```tsx
// apps/web/app/(dashboard)/classes/[classId]/attendance/page.tsx
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { getAttendance } from "@/lib/api-client";

export default async function AttendancePage({ params }: { params: { classId: string } }) {
  const data = await getAttendance({ classId: params.classId, date: new Date().toISOString() });
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Daily attendance overview</p>
        <h1 className="text-2xl font-semibold">Attendance</h1>
      </header>
      <AttendanceTable records={data.records} />
    </section>
  );
}
```

Key UI capabilities:
- Homework editor includes rich text (`@tiptap`), drawing canvas (`react-sketch-canvas`), file upload component with dropzone + S3 signed URLs.
- Adaptive LMS uses progress widgets (bar, donut) and timeline components for modules.
- Role-based layouts: `_middleware` or Route Handlers enforce session + redirect.

## 5. NestJS Backend Starter

```
apps/api/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ config/
│  │   └─ configuration.ts
│  ├─ common/
│  │   ├─ guards/
│  │   ├─ decorators/
│  │   └─ filters/
│  ├─ modules/
│  │   ├─ auth/
│  │   │   ├─ auth.module.ts
│  │   │   ├─ auth.controller.ts
│  │   │   ├─ auth.service.ts
│  │   │   └─ strategies/ (local, otp, jwt)
│  │   ├─ users/
│  │   │   ├─ users.module.ts
│  │   │   ├─ users.controller.ts
│  │   │   └─ users.service.ts
│  │   ├─ schools/
│  │   │   ├─ schools.module.ts
│  │   │   ├─ schools.controller.ts
│  │   │   └─ schools.service.ts
│  │   ├─ classes/
│  │   │   ├─ classes.module.ts
│  │   │   ├─ classes.controller.ts
│  │   │   └─ classes.service.ts
│  │   └─ homework/
│  │       ├─ homework.module.ts
│  │       ├─ homework.controller.ts
│  │       └─ homework.service.ts
│  ├─ prisma/
│  │   ├─ prisma.service.ts
│  │   └─ prisma.module.ts
│  └─ queues/
│      └─ notifications.processor.ts
├─ prisma/schema.prisma
├─ package.json
└─ tsconfig.json
```

**Example Auth module wiring**

```ts
// apps/api/src/modules/auth/auth.module.ts
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, OtpService],
})
export class AuthModule {}
```

DTOs live beside controllers (`dto/`). Services use Prisma for data access. Apply guards like `RolesGuard` + custom decorator `@SchoolScoped()` to inject `school_id`. Homework module integrates with S3 service + notifications queue to alert parents.

## 6. Local Development & Deployment

**Prerequisites**
- Node.js 20+, pnpm 8+
- PostgreSQL 15+
- Redis 7+
- AWS CLI (or equivalent) configured for S3 bucket
- Razorpay keys, email provider keys

**Environment variables (excerpt)**

```
NEXT_PUBLIC_API_BASE_URL=
DATABASE_URL=postgresql://user:pass@localhost:5432/alfanumrik
REDIS_URL=redis://localhost:6379
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
S3_BUCKET=
S3_REGION=
EMAIL_PROVIDER_API_KEY=
```

**Setup steps**
1. `pnpm install` at repo root (workspaces for `apps/web`, `apps/api`).
2. Copy `.env.example` → `.env` for both apps.
3. Run PostgreSQL & Redis via Docker Compose (`docker compose up db redis`).
4. `pnpm prisma:migrate` to apply schema.
5. Start backend: `pnpm --filter api start:dev`.
6. Start frontend: `pnpm --filter web dev -p 3000`.
7. Access `http://localhost:3000`, login using seeded Super Admin.

**Testing**
- Backend: `pnpm --filter api test`, e2e via `pnpm --filter api test:e2e`.
- Frontend: `pnpm --filter web test` (Vitest/RTL), `pnpm --filter web lint`.

**Deployment**
- **Frontend (Vercel)**: connect repo, set env vars, configure build command `pnpm --filter web build`. Use ISR for dashboards (`revalidate` tagging) and Edge Middleware for auth gating.
- **Backend (Render/Railway)**: build Docker image (`docker build -t schoolos-api .`), or use Render native deploy with `pnpm install && pnpm --filter api build`. Run migrations via release command `pnpm prisma migrate deploy`.
- **Database**: Managed Postgres (Neon/Render). Ensure connection pooling (PgBouncer) for serverless clients.
- **Automation**: GitHub Actions pipeline (lint → test → build). Use environment protection for production, with migration job preceding API deploy.

This blueprint delivers the artifacts needed to start implementing Alfanumrik SchoolOS across architecture, schema, API layers, frontend layout, backend modules, and operational playbooks.
