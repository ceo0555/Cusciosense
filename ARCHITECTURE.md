# Alfanumrik SchoolOS – Solution Blueprint

Comprehensive reference for building the School ERP + adaptive LMS portal described in the brief. All sections assume the canonical stack: Next.js + Tailwind (frontend), NestJS (backend), PostgreSQL (database), Redis (caching/queues), S3-compatible object storage, Razorpay (payments), and SES/SendGrid + FCM/OneSignal for notifications.

---

## 1. System Architecture

### 1.1 High-level flow

1. **Clients (web, mobile, kiosk)** reach Vercel-hosted Next.js. Static assets are edge cached; authenticated routes proxy through Next.js middleware that injects session context.
2. **Next.js** talks to a single HTTPS entry (`https://api.schoolos.app`) terminated behind Cloudflare/Render ingress. Middleware attaches JWT/refresh tokens and tenant (school) slug headers.
3. **NestJS API** runs on Render/Railway. Modular services expose REST + GraphQL (optional) + WebSocket gateways for realtime homework/chat/notifications.
4. **PostgreSQL (Neon/Railway)** holds transactional data. **Redis (Upstash/Elasticache)** powers caching, rate limits, sessions, and BullMQ queues.
5. **Object storage (R2/S3)** stores homework uploads, report cards, rich content. Signed URLs issued via Backend.
6. **Third-party integrations**:
   - Razorpay for subscription and fee payments (webhooks hit `/payments/razorpay/webhook`).
   - Email (SES/SendGrid) + push (FCM/OneSignal) handled via Notification service.
7. **Observability**: OpenTelemetry + Loki/Grafana for logs, Prometheus metrics, Sentry for error tracking.

### 1.2 Deployment topology

| Layer | Platform | Notes |
| --- | --- | --- |
| Frontend | Vercel | Preview deployments from PRs, ISR for marketing pages |
| API | Render / Railway | Autoscale containers, expose `/api` |
| DB | Managed PostgreSQL (Neon, Supabase, Railway) | Daily backups, PITR |
| Cache / Queue | Upstash Redis | BullMQ queues for async jobs (notifications, PDF render) |
| Files | Cloudflare R2 / AWS S3 | Signed upload/download, lifecycle policies |
| Monitoring | Grafana Cloud / Sentry | Alerts on latency, queue depth |

### 1.3 Service modules

- **Auth & RBAC**: JWT access/refresh, short-lived magic links/OTP, role scopes per school, impersonation for Super Admin.
- **Tenant (School) service**: onboarding, subscription state, branding, academic sessions.
- **Directory service**: users, staff, students, parents, relationships, enrolments.
- **ERP suite**: admissions pipeline, attendance, timetable, staff mgmt, fees, transport (future), asset mgmt (future).
- **Adaptive LMS**: course catalogs, lesson plans, adaptive paths, quizzes, analytics.
- **Homework/Content**: canvas-based submissions (draw/write), uploads, grading workflow.
- **Assessment**: exams, gradebooks, report cards, PDF export workers.
- **Payments**: Razorpay order creation, webhook reconciliation, invoices.
- **Notifications**: email/in-app/push, templates, preference center.
- **File & media**: upload policies, virus scan hooks, CDN urls.

---

## 2. Data Model (PostgreSQL)

### 2.1 Core tables

| Table | Purpose | Key fields & relations |
| --- | --- | --- |
| `users` | Global user identities across tenants | `id`, `email`, `phone`, `password_hash`, `status` |
| `roles` | System & tenant roles | `name` (super_admin, school_admin, teacher, student, parent) |
| `user_roles` | User-to-role map scoped by `school_id` | FK `user_id`, `role_id`, `school_id` |
| `schools` | Tenant metadata | `slug`, `name`, `subscription_plan_id`, `branding` JSON |
| `school_subscriptions` | Billing + limits | `school_id`, `plan`, `status`, `razorpay_subscription_id`, `renew_at` |
| `academic_sessions` | Year/term boundaries | `school_id`, `name`, `start_date`, `end_date` |
| `classes` | Class or grade definition | `school_id`, `name`, `grade`, `homeroom_teacher_id` |
| `sections` | Sub divisions within classes | `class_id`, `code`, capacity |
| `subjects` | Subjects offered | `school_id`, `name`, `code`, `type` (core/elective) |
| `staff_profiles` | Teacher/staff data | `user_id`, `school_id`, employment info |
| `student_profiles` | Student attributes | `user_id`, `school_id`, `admission_no`, `section_id` |
| `guardians` | Parent profiles | `user_id`, `relationship`, `student_id` (many-to-many via `guardian_links`) |
| `enrolments` | Student ↔ class/section history | `student_id`, `section_id`, `session_id`, `status` |
| `attendance_records` | Daily/period attendance | `section_id`, `date`, `type`, `record JSONB` |
| `timetables` | Weekly schedules | `section_id`, `day_of_week`, `slots JSONB` |
| `courses` | LMS courses | `school_id`, `subject_id`, `delivery_mode`, `adaptive_config JSONB` |
| `course_units` / `lessons` | Content hierarchy | FK `course_id`, ordering, metadata |
| `homework` | Assignments | `course_id`, `section_id`, `due_at`, `instructions`, `submission_type` |
| `homework_submissions` | Student submissions | `homework_id`, `student_id`, `status`, `grade`, `feedback` |
| `homework_assets` | Uploads/canvas data | `submission_id`, `url`, `type` (image/pdf/draw_json) |
| `quizzes` / `quiz_attempts` | Adaptive quiz engine | Link to `course_unit_id`, question banks |
| `exams` | Exam definition | `school_id`, `session_id`, `type`, `grading_schema JSONB` |
| `exam_schedules` | Exam timetable | `exam_id`, `section_id`, `subject_id`, `start_at` |
| `exam_results` | Marks per student per subject | `exam_schedule_id`, `student_id`, `marks_obtained`, `grade` |
| `report_cards` | Generated PDF metadata | `student_id`, `exam_id`, `pdf_url`, `issued_at` |
| `fee_plans` | Fee categories | `school_id`, `name`, `frequency`, `amount`, `currency` |
| `invoices` | Generated fee invoices | `fee_plan_id`, `student_id`, `due_at`, `status`, `razorpay_order_id` |
| `payments` | Razorpay transactions | `invoice_id`, `razorpay_payment_id`, `amount_paid`, `status`, `meta JSONB` |
| `notifications` | Audit of notifications | `user_id`, `channel`, `payload`, `status` |
| `notification_preferences` | User opt-ins | `user_id`, `channel`, `enabled` |
| `audit_logs` | Immutable ops log | `actor_id`, `school_id`, `action`, `entity`, `diff JSONB` |

### 2.2 Relationship highlights

- `schools` → `classes` → `sections` (1:N chains).
- `sections` join `subjects` via `section_subjects` pivot (teacher assignments & timetable).
- `users` share identities; user-role rows scoped by school to support multi-tenant teachers/parents.
- `homework` references either `course_id` (LMS) or `section_id` (ERP). Use check constraints to enforce at least one link.
- `exam_results` aggregate into `report_cards` through `report_card_results` pivot to keep normalized.
- Soft deletes via `deleted_at` columns on user-facing tables for audit compliance.
- All tenant-scoped tables carry `school_id` to enable row-level security when leveraging PostgreSQL RLS.

---

## 3. API Surface (REST-first, GraphQL optional)

> Prefix all routes with `/v1`. Auth: Bearer JWT from `POST /auth/login` or refresh token rotation via HTTP-only cookie. Super Admin uses `X-Act-As-School` header for impersonation.

### Auth & Identity

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/auth/register-school` | Provision new school, admin user, subscription trial | Public |
| POST | `/auth/login` | Email/phone + password/OTP login | Public |
| POST | `/auth/otp/send` | Send OTP via SMS/email | Public |
| POST | `/auth/token/refresh` | Rotate JWT | Authenticated |
| POST | `/auth/logout` | Revoke refresh token | Authenticated |
| GET | `/auth/me` | Current profile + roles + permissions | Authenticated |

### Schools & Directory

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET/PUT | `/schools/:schoolId` | Fetch/update school profile, branding | Super Admin, School Admin |
| GET | `/schools/:schoolId/staff` | Paginated list, filters | School Admin |
| POST | `/schools/:schoolId/staff` | Invite teacher/staff | School Admin |
| GET/POST | `/schools/:schoolId/students` | Manage student roster | School Admin |
| POST | `/schools/:schoolId/import` | CSV import for bulk admissions | School Admin |

### Classes, Sections, Timetable

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET/POST | `/classes` | List or create classes for school scope | School Admin |
| PATCH | `/classes/:id` | Update metadata / assign teachers | School Admin |
| GET/POST | `/classes/:id/sections` | Manage sections | School Admin |
| GET/PUT | `/sections/:id/timetable` | CRUD timetable blocks | School Admin, Teacher |
| POST | `/attendance/daily` | Submit attendance for section/date | Teacher |
| GET | `/attendance/history` | Query attendance by student/date range | Teacher, Parent |

### LMS & Homework

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET/POST | `/courses` | Manage courses | School Admin, Teacher |
| GET | `/courses/:id` | Course detail + adaptive config | Teacher, Student |
| POST | `/courses/:id/lessons` | Create lessons/units | Teacher |
| POST | `/homework` | Create assignment (text/draw/upload) | Teacher |
| GET | `/homework?sectionId=&due<=` | Filter assignments | Teacher, Student, Parent |
| POST | `/homework/:id/submissions` | Submit (multipart + JSON) | Student |
| PATCH | `/homework/:id/submissions/:submissionId` | Grade/feedback | Teacher |
| POST | `/quizzes/:id/attempts` | Start adaptive quiz attempt | Student |

### Exams & Reports

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/exams` | Create exam definition | School Admin |
| POST | `/exams/:id/schedules` | Set timetable per section | School Admin |
| POST | `/exams/:id/results/import` | Bulk upload marks | Teacher |
| GET | `/exams/:id/results/:studentId` | Student report | Teacher, Parent |
| POST | `/report-cards/:examId/generate` | Queue PDF render | School Admin |
| GET | `/report-cards/:id/download` | Signed URL fetch | Authenticated w/ access |

### Fees & Payments

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/fees/plans` | Define fee components | School Admin |
| POST | `/fees/invoices` | Generate invoices per class/batch | School Admin |
| GET | `/fees/invoices?studentId=` | List outstanding bills | School Admin, Parent |
| POST | `/payments/checkout` | Create Razorpay order (school subscription or fees) | School Admin, Parent |
| POST | `/payments/razorpay/webhook` | Validate signature, update invoice | System |

### Notifications & Misc

| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET/PUT | `/notifications/preferences` | Manage channels | All |
| GET | `/notifications` | Paginated notifications | All |
| POST | `/notifications/test` | Send test template (admin only) | Super Admin |

Realtime channels (WebSockets) enable attendance updates, homework grading, notifications. Use namespaces per school and include role-based authorization.

---

## 4. Next.js (App Router) Frontend Structure

```
src/
  app/
    layout.tsx
    globals.css
    (auth)/
      login/page.tsx
      magic-link/page.tsx
    (dashboard)/
      layout.tsx
      page.tsx                // Super Admin overview
      schools/[slug]/
        layout.tsx
        page.tsx              // School admin home
        admissions/page.tsx
        attendance/page.tsx
        timetable/page.tsx
        fees/page.tsx
        lms/
          courses/page.tsx
          courses/[courseId]/page.tsx
        homework/
          page.tsx
          [id]/page.tsx
        exams/page.tsx
        reports/page.tsx
        settings/page.tsx
      teacher/
        classes/page.tsx
        homework/[id]/grade/page.tsx
      student/
        courses/page.tsx
        homework/[id]/submit/page.tsx
      parent/
        children/[studentId]/page.tsx
  components/
    ui/                      // shadcn-inspired primitives
    charts/
    layout/
    navigation/
    forms/
    homework/
  features/
    auth/
    admissions/
    attendance/
    homework/
    lms/
    exams/
    payments/
  lib/
    api-client.ts            // axios/fetch wrapper
    auth.ts                  // token helpers
    rbac.ts                  // ability definitions
    validators/              // zod schemas
  store/
    use-session-store.ts
    queryClient.ts           // React Query setup
  hooks/
    useTenant.ts
    useRealtime.ts
```

### Example UX flows

- `app/(auth)/login/page.tsx`: email/phone login, OTP toggle, handles redirect by role.
- `app/(dashboard)/schools/[slug]/homework/[id]/page.tsx`: fetch assignment, render tabs for description, submissions, analytics.
- `app/(dashboard)/teacher/classes/page.tsx`: table of assigned sections, quick attendance action.
- `components/homework/SubmissionCanvas.tsx`: integrates fabric.js or tldraw for drawing, uploads to R2 via signed URLs.
- `features/payments/FeeInvoiceTable.tsx`: fetch invoices, trigger Razorpay checkout modal via `useRazorpay`.

Routing uses parallel routes for role dashboards. Data fetching via React Query + server components for initial hydration. Use middleware to check session tokens and push unauthorized users to login.

---

## 5. NestJS Backend Starter

```
src/
  main.ts
  app.module.ts
  config/
    configuration.ts
    validation.ts
  common/
    decorators/
    guards/
    interceptors/
    dto/
  modules/
    auth/
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      strategies/
    users/
      users.module.ts
      users.service.ts
      dto/
    schools/
    classes/
    lms/
    homework/
    exams/
    payments/
    notifications/
    files/
  database/
    prisma/ (or TypeORM entities)
  jobs/
    bull.config.ts
    processors/
```

Sample wiring (`app.module.ts`):

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfigService }),
    BullModule.forRootAsync({ useClass: QueueConfigService }),
    AuthModule,
    UsersModule,
    SchoolsModule,
    ClassesModule,
    LmsModule,
    HomeworkModule,
    ExamsModule,
    PaymentsModule,
    NotificationsModule,
    FilesModule,
  ],
})
export class AppModule {}
```

Module responsibilities:

- **AuthModule**: local + OTP strategies, JWT issuance, guards, password reset, impersonation.
- **UsersModule**: CRUD, role assignment, search, CSV import, parents-students linking.
- **SchoolsModule**: tenant provisioning, subscription lifecycle, usage metrics, branding.
- **ClassesModule**: classes/sections, timetable, attendance, staff assignment.
- **LmsModule**: courses, lessons, adaptive engine (question bank, attempt scoring).
- **HomeworkModule**: assignment CRUD, submissions, grading, asset storage integration.
- **ExamsModule**: exam definitions, schedules, gradebooks, report generation queue.
- **PaymentsModule**: plan catalog, Razorpay order creation, webhook validation, invoice reconciliation.
- **NotificationsModule**: template rendering (Handlebars), multi-channel dispatch, user preferences.
- **FilesModule**: signed URLs, virus scanning hooks, PDF generation microservice integration.

Security considerations:

- Enable global validation pipe + class-transformer.
- Apply multi-tenant guard (extract `schoolId` from token/header) to scope queries.
- Use CASL or custom rules for fine-grained permissions.
- Rate limit login + OTP endpoints with Redis.

---

## 6. Runbooks

### 6.1 Local development

1. `cp .env.example .env` and populate:
   - `DATABASE_URL=postgresql://user:pass@localhost:5432/schoolos`
   - `REDIS_URL=redis://localhost:6379`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
   - `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`
   - `EMAIL_PROVIDER_API_KEY`, `FCM_SERVER_KEY`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
2. Start services: `docker compose up postgres redis minio`.
3. Backend: `cd apps/api && npm install && npm run start:dev`.
4. Frontend: `cd apps/web && npm install && npm run dev`.
5. Seed data: `npm run prisma migrate dev && npm run seed` (or TypeORM migrations).
6. Visit `http://localhost:3000` (Next) and `http://localhost:4000` (Nest).

### 6.2 Testing

- Unit tests: `npm run test` (per workspace).
- E2E API tests via Nest testing module + Supertest.
- Frontend Playwright suite for core flows (login, homework submission, payment).
- Contract tests defined via Pact if cross-team.

### 6.3 Deployment

- **Frontend (Vercel)**:
  1. Connect Git repo, set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SENTRY_DSN`, etc.
  2. Enable preview deployments; use ISR or SSR where needed.
  3. Protect env secrets via Vercel Env dashboard.

- **Backend (Render/Railway)**:
  1. Create Web Service from Git, set build command `npm install && npm run build` and start `npm run start:prod`.
  2. Configure environment variables (mirror `.env`).
  3. Attach PostgreSQL + Redis add-ons; run migrations via deploy hooks.
  4. Set health check path `/healthz`.
  5. Configure autoscaling thresholds on CPU/RAM.

- **Database & Storage**:
  - Provision managed Postgres with daily backups + PITR.
  - Configure read replicas for analytics (future).
  - Use Cloudflare R2 or AWS S3 with lifecycle rules, CloudFront CDN for downloads.

- **CI/CD**:
  - GitHub Actions workflow: lint, test, build, run migrations, deploy.
  - Security scanning (Snyk) + secret scanning.

- **Monitoring**:
  - Sentry DSN in Next.js + NestJS.
  - Prometheus metrics exported via `/metrics`, scraped by Grafana Cloud.
  - Alert policies for queue depth, payment webhook failures, high error rates.

---

This blueprint covers the initial architecture, schema, API surface, and implementation scaffolding required to kick off Alfanumrik SchoolOS. Extend modules iteratively and enforce automated tests plus observability from day one.
