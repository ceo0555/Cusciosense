# Alfanumrik SchoolOS

Alfanumrik SchoolOS is a full-stack School ERP + Adaptive LMS platform for Super Admins, School Admins, Teachers, Students, and Parents. The solution combines operational workflows (admissions, attendance, fees, staff) with classroom experiences (courses, homework, exams, report cards) and subscription management.

---

## 1. System Architecture

| Layer | Responsibilities | Tech/Services |
| --- | --- | --- |
| Client (Next.js) | Responsive SaaS UI, role-scoped dashboards, homework canvas (write/draw/upload), in-app notifications, Razorpay checkout. | Next.js 14 (App Router), Tailwind, React Query/SWR, Zustand/Context, TipTap/Canvas, UploadThing/S3 SDK. |
| API Gateway (NestJS) | Auth, RBAC guard, request validation, file uploads, notification triggers. | NestJS, Passport (JWT + OTP), class-validator, Multer/S3, BullMQ queue producer. |
| Domain Services | Auth, User, School, Class, Homework, LMS, Exams, Finance, Notifications. Each module owns DTOs, repositories, Prisma/TypeORM models, event emitters. | NestJS modules, CQRS/EventEmitter, Prisma ORM (PostgreSQL). |
| Data & Storage | Primary relational data, document storage, cache, queues. | PostgreSQL (managed), S3/Cloudflare R2 for uploads, Redis for cache/session/rate-limit, BullMQ workers for async jobs. |
| Workers & Integrations | Notification fan-out, report PDF generation, Razorpay webhooks, scheduled jobs (timetable reminders). | NestJS worker app, Puppeteer/Playwright for PDF, BullMQ consumers, cron service. |
| Observability & Delivery | Logging, metrics, CI/CD. | Pino + Logflare, OpenTelemetry, Sentry, GitHub Actions → Vercel (frontend) & Render/Railway (backend). |

**Data flow**
1. User authenticates via email/phone OTP → `auth/login` returns JWT + refresh.
2. Next.js fetches data via REST (or GraphQL gateway, optional) using JWT in cookies/headers.
3. Domain modules persist to PostgreSQL via Prisma transactions; file uploads go to S3 with signed URLs.
4. Events (e.g., homework submitted, payment succeeded) enqueue BullMQ jobs → workers send email/in-app notifications via SES/SendGrid and push updates through WebSocket gateway.
5. Razorpay subscription webhooks call secure backend endpoints to activate or suspend school plans.

**Deployment topology**
- Frontend: Vercel project with env secrets, ISR for marketing pages, edge middleware for auth.
- Backend: Render/Railway auto-deploy from `main`, containers expose HTTPS via managed load balancer.
- Database: Managed PostgreSQL (Neon/Supabase/Railway) with PITR and read replicas for analytics.
- Storage: S3 bucket (per region) + IAM user with limited permissions.
- Redis/BullMQ: Upstash/Redis Cloud.

---

## 2. Database Schema (tables & relations)

| Table | Key Columns | Relationships |
| --- | --- | --- |
| `users` | `id (uuid)`, `email`, `phone`, `password_hash`, `status`, `last_login_at` | `users.role_id → roles.id`; unique email/phone per school scope. |
| `roles` | `id`, `name`, `permissions jsonb` | Seeded (`super_admin`, `school_admin`, `teacher`, `student`, `parent`). |
| `schools` | `id`, `name`, `logo_url`, `subscription_status`, `razorpay_customer_id` | `schools.owner_id → users.id`. |
| `school_members` | `id`, `school_id`, `user_id`, `role`, `meta jsonb` | Many-to-many between users and schools; holds staff info. |
| `students` | `id`, `user_id`, `school_id`, `admission_no`, `dob`, `guardian_contact` | `students.parent_id → parents.id`; soft delete to preserve history. |
| `parents` | `id`, `user_id`, `school_id`, `address`, `primary_phone` | Linked to `students` via `student_guardians` pivot (in case of multiple guardians). |
| `classes` | `id`, `school_id`, `name`, `grade_level`, `section` | `classes.class_teacher_id → teachers.id`. |
| `enrollments` | `id`, `student_id`, `class_id`, `academic_year`, `status` | Unique (student, class, academic_year). |
| `courses` | `id`, `class_id`, `subject`, `syllabus jsonb`, `visibility` | `courses.teacher_id → teachers.id`. |
| `lessons` | `id`, `course_id`, `title`, `content_richtext`, `attachments[]` | Ordered via `position`. |
| `homework` | `id`, `course_id`, `assigned_by`, `title`, `instructions`, `due_at`, `allow_draw`, `allow_file_upload` | `homework.course_id → courses.id`. |
| `homework_submissions` | `id`, `homework_id`, `student_id`, `answer_html`, `drawing_svg`, `files jsonb`, `score`, `feedback` | `homework_submissions.graded_by → teachers.id`. |
| `attendance_sessions` | `id`, `class_id`, `date`, `session_type`, `taken_by` | |
| `attendance_records` | `id`, `attendance_session_id`, `student_id`, `status`, `reason` | |
| `exams` | `id`, `school_id`, `name`, `term`, `grading_schema jsonb` | |
| `exam_schedules` | `id`, `exam_id`, `course_id`, `exam_date`, `max_score` | |
| `grade_entries` | `id`, `exam_schedule_id`, `student_id`, `score`, `remarks` | |
| `report_cards` | `id`, `student_id`, `exam_id`, `pdf_url`, `generated_by`, `generated_at` | |
| `fee_structures` | `id`, `school_id`, `name`, `amount`, `frequency`, `meta jsonb` | |
| `fee_invoices` | `id`, `student_id`, `fee_structure_id`, `due_date`, `status`, `razorpay_order_id` | |
| `payments` | `id`, `invoice_id`, `razorpay_payment_id`, `amount`, `status`, `receipt_url` | |
| `admissions` | `id`, `school_id`, `student_name`, `stage`, `applied_on`, `notes` | |
| `notifications` | `id`, `user_id`, `type`, `title`, `body`, `data jsonb`, `read_at`, `channel` | |
| `in_app_messages` | `id`, `conversation_id`, `sender_id`, `body`, `attachments` | Optional chat/announcement module. |

**Indexes & constraints**
- B-tree indexes on foreign keys and frequent filters (`school_id`, `class_id`, `due_at`).
- `homework_submissions` unique (`homework_id`, `student_id`) to avoid duplicate submissions.
- Partial index on `notifications` for unread queries (`WHERE read_at IS NULL`).
- PostgreSQL row-level security (RLS) per school and per-user scopes for multi-tenant safety.

---

## 3. API Endpoints (REST-first, NestJS controllers)

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/auth/login` | Email/phone login (password or OTP) → JWT, refresh | All |
| POST | `/auth/refresh` | Refresh tokens | All |
| POST | `/auth/verify-otp` | OTP verification | All |
| POST | `/schools` | Create school & subscription | Super Admin |
| GET | `/schools` | List schools with filters | Super Admin |
| GET | `/schools/:schoolId/dashboard` | KPIs, counts, alerts | Super/School Admin |
| POST | `/schools/:schoolId/staff` | Invite/add staff member | School Admin |
| GET/PUT | `/schools/:schoolId/settings` | Branding, subscription, policies | School Admin |
| POST | `/schools/:schoolId/classes` | Create class/section | School Admin |
| GET | `/schools/:schoolId/classes/:id` | Class detail (roster, timetable) | Admin/Teacher |
| POST | `/classes/:classId/courses` | Create subject course | Teacher/Admin |
| GET | `/courses/:courseId/lessons` | List lessons | Teacher/Student |
| POST | `/courses/:courseId/homework` | Publish homework | Teacher |
| GET | `/homework/:homeworkId` | Homework detail with assets | Teacher/Student |
| POST | `/homework/:homeworkId/submissions` | Submit homework | Student |
| PATCH | `/homework/:homeworkId/submissions/:id` | Grade submission | Teacher |
| POST | `/classes/:classId/attendance` | Take attendance | Teacher |
| GET | `/students/:studentId/attendance` | Attendance history | Teacher/Parent |
| POST | `/exams` | Create exam & schedule | Admin |
| POST | `/exams/:examId/grades` | Bulk grade upload | Teacher |
| GET | `/students/:studentId/report-cards` | List report cards (with signed download link) | Admin/Teacher/Parent |
| POST | `/fees/structures` | Define fee plan | Admin |
| POST | `/fees/invoices` | Generate invoices | Admin |
| POST | `/payments/razorpay/webhook` | Razorpay webhook (signature verified) | Razorpay |
| POST | `/notifications` | Send manual notification | Admin |
| GET | `/notifications` | List in-app notifications | All authenticated |
| WS | `/ws/notifications` | Real-time updates via WebSocket | All authenticated |

_Note:_ All endpoints behind global `JwtAuthGuard` + `RolesGuard`. Multi-tenant safety enforced through request-scoped `schoolId` header/context.

---

## 4. Next.js Frontend Structure & Example

```
frontend/
├─ package.json
├─ next.config.js
├─ tailwind.config.ts
├─ postcss.config.js
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  ├─ (auth)/
│  │  │  └─ login/page.tsx
│  │  ├─ (onboarding)/
│  │  │  └─ create-school/page.tsx
│  │  ├─ (dashboard)/
│  │  │  ├─ schools/page.tsx
│  │  │  ├─ classes/[classId]/page.tsx
│  │  │  ├─ homework/[homeworkId]/page.tsx
│  │  │  └─ students/[studentId]/report-cards/page.tsx
│  │  └─ api/
│  │     └─ auth/[...nextauth]/route.ts
│  ├─ components/
│  │  ├─ layout/Sidebar.tsx
│  │  ├─ layout/Topbar.tsx
│  │  ├─ ui/DataCard.tsx
│  │  ├─ homework/HomeworkCanvas.tsx
│  │  └─ notifications/NotificationBell.tsx
│  ├─ lib/
│  │  ├─ api-client.ts
│  │  ├─ auth.ts
│  │  └─ permissions.ts
│  ├─ hooks/
│  │  ├─ useCurrentSchool.ts
│  │  └─ useRealtimeNotifications.ts
│  └─ store/
│     └─ ui-store.ts
└─ public/
   └─ brand/
```

**Example dashboard page**

```tsx
// src/app/(dashboard)/schools/page.tsx
import { DataCard } from '@/components/ui/DataCard';
import { api } from '@/lib/api-client';

export default async function SchoolsDashboard() {
  const data = await api('/schools/current/dashboard');

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <DataCard label="Active Students" value={data.students.active} trend={data.students.trend} />
      <DataCard label="Homework Due" value={data.homework.pending} />
      <DataCard label="Outstanding Fees" value={`₹${data.finance.due}`} />
    </section>
  );
}
```

**Homework canvas component**
- Built with TipTap + Fabric.js/Canvas.
- Allows typing, drawing (SVG path capture), file upload (images/PDF) via UploadThing or S3 signed URL.
- Submits multipart payload to `/homework/:id/submissions`.

State/data layer: React Query (SSR-friendly) with `api` helper injecting JWT via cookies; `middleware.ts` enforces auth, redirects to `/login` if missing token or insufficient role.

---

## 5. NestJS Backend Starter (Auth, User, School, Class, Homework)

```
backend/
├─ package.json
├─ tsconfig.json
├─ nest-cli.json
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ config/
│  │  └─ configuration.ts
│  ├─ common/
│  │  ├─ guards/roles.guard.ts
│  │  ├─ decorators/current-user.decorator.ts
│  │  └─ interceptors/tenant.interceptor.ts
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.service.ts
│  │  │  └─ strategies/
│  │  │     ├─ jwt.strategy.ts
│  │  │     └─ otp.strategy.ts
│  │  ├─ users/
│  │  │  ├─ users.module.ts
│  │  │  ├─ users.controller.ts
│  │  │  └─ users.service.ts
│  │  ├─ schools/
│  │  │  ├─ schools.module.ts
│  │  │  ├─ schools.controller.ts
│  │  │  └─ schools.service.ts
│  │  ├─ classes/
│  │  │  ├─ classes.module.ts
│  │  │  ├─ classes.controller.ts
│  │  │  └─ classes.service.ts
│  │  └─ homework/
│  │     ├─ homework.module.ts
│  │     ├─ homework.controller.ts
│  │     └─ homework.service.ts
│  └─ prisma/
│     └─ prisma.service.ts
└─ .env.example
```

**Sample Auth module**

```ts
// src/modules/auth/auth.module.ts
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts
// src/modules/homework/homework.controller.ts
@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard, TenantInterceptor)
export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  @Post(':courseId')
  @Roles(Role.Teacher)
  create(@Param('courseId') courseId: string, @Body() dto: CreateHomeworkDto, @CurrentUser() user: AuthUser) {
    return this.service.create(courseId, dto, user);
  }

  @Post(':homeworkId/submissions')
  @Roles(Role.Student)
  @UseInterceptors(AnyFilesInterceptor())
  submit(@Param('homeworkId') id: string, @Body() dto: SubmitHomeworkDto, @UploadedFiles() files: Express.Multer.File[], @CurrentUser() user: AuthUser) {
    return this.service.submit(id, dto, files, user);
  }
}
```

**Key backend considerations**
- `TenantInterceptor` injects `schoolId` from headers/subdomain into Prisma middleware for RLS.
- DTO validation with `class-validator`; `Zod` optional for shared schemas with frontend.
- Use Prisma `softDelete` middleware for historical data (students, staff).
- Razorpay integration via dedicated service handling `createOrder`, `capturePayment`, and webhook signature verification.
- Background jobs via BullMQ for notifications, PDF generation, scheduled reminders.

---

## 6. Local Development & Deployment

### Prerequisites
- Node.js ≥ 18, PNPM (recommended) or npm/yarn.
- PostgreSQL 15+, Redis (for queues), and access to S3-compatible storage (MinIO for local).
- Razorpay test keys, email provider API key (SendGrid/SES).

### Environment
```
# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxx

# backend/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/alfanumrik
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxxxxxxx
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=schoolos-uploads
EMAIL_PROVIDER_API_KEY=...
```

### Running locally
1. **Install dependencies**
   - `cd frontend && pnpm install`
   - `cd backend && pnpm install`
2. **Start services**
   - `docker compose up postgres redis minio` (optional helper)
3. **Backend**
   - `cd backend`
   - `pnpm prisma migrate dev`
   - `pnpm run start:dev`
4. **Frontend**
   - `cd frontend`
   - `pnpm dev`
5. Access app at `http://localhost:3000`, API at `http://localhost:4000`.

### Deployment
- **Frontend (Vercel)**
  - Connect GitHub repo in Vercel, set `NEXT_PUBLIC_*` envs.
  - Enable preview deployments per branch; protected routes use Vercel middleware to enforce auth.
- **Backend (Render/Railway)**
  - Create web service, set env vars, enable auto deploy on `main`.
  - Configure health check `/healthz`.
  - Attach managed PostgreSQL + Redis add-ons or external instances.
  - Set up cron job (Render cron/ Railway job) hitting `/tasks/cron/daily`.
- **Workers**
  - Separate deployment running same codebase with `WORKER=true` env to process BullMQ queues.
- **Razorpay webhooks**
  - Expose `/payments/razorpay/webhook` via HTTPS, verify signature using `RAZORPAY_KEY_SECRET`.
  - Store webhook logs for reconciliation.
- **Observability**
  - Configure Sentry DSNs, Logflare ingestion URLs, and OpenTelemetry exporter endpoints.

### QA & rollout checklist
- Seed demo school and sample data via `pnpm prisma db seed`.
- Run `pnpm test` for backend unit tests; `pnpm lint` for both apps.
- Execute Cypress/Playwright smoke tests covering login, homework submission, payment flow.
- Use feature flags (GrowthBook or LaunchDarkly) for staged module releases.

---

This blueprint supplies the architecture, schema, API contract, frontend/back-end scaffolding, and deployment workflow needed to start building Alfanumrik SchoolOS. Extend each module iteratively, layering analytics and AI-driven adaptive content once the core workflows stabilize.
