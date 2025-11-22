# Alfanumrik SchoolOS – Technical Blueprint

**Date:** 2025-11-22  
**Scope:** Full-stack School ERP + Adaptive LMS covering Super Admin, School Admin, Teacher, Student, and Parent personas.

---

## 1. System Architecture

### 1.1 Logical View

```
End Users (Web / Mobile Browsers)
        │
        ▼
Next.js (App Router, Tailwind, React Query)
        │ HTTPS (REST/GraphQL, WebSockets for live events)
        ▼
NestJS API Gateway (Render/Railway)
        │
 ┌──────┴─────────────────────────────────────────────────────────┐
 │ Domain Micro-Modules (Auth, ERP, LMS, Homework, Exams, Finance) │
 └──────┬─────────────────────────────────────────────────────────┘
        │
   PostgreSQL (Amazon RDS / Neon)
        │
   Prisma ORM + Row Level Security
        │
Redis (BullMQ queues, cache, rate-limits)
        │
S3-compatible Object Storage (file uploads, homework assets)
        │
3rd-party services: Razorpay (payments), Resend/SendGrid (email), Firebase/APNS (push), Meilisearch/Algolia (search)
```

### 1.2 Deployment Topology
- **Frontend:** Next.js deployed on Vercel with edge caching, ISR for marketing pages, React Server Components for dashboards.
- **Backend:** NestJS deployed on Render/Railway using Docker; auto-scaled web service + worker dynos for BullMQ queues.
- **Database:** Managed PostgreSQL (e.g., Neon) with automated backups, PITR, logical replication to read replicas for analytics.
- **Redis:** Upstash/Render Redis for caching, session tokens (if not pure JWT), and job queues.
- **Object Storage:** AWS S3 or Cloudflare R2 for media (homework drawings, uploads, report PDFs) with signed URL access.
- **Observability:** OpenTelemetry traces, Loki logs, Prometheus metrics; alerts routed to PagerDuty/Slack.
- **CDN & Edge Security:** Vercel + Cloudflare for WAF, DDoS protection, and smart caching of static assets.

### 1.3 Key Cross-Cutting Concerns
- **Authentication:** Password + OTP (email/SMS) via Cognito/Supabase Auth or custom NestJS Passport strategy; JWT access + refresh tokens; role claims embedded.
- **Authorization:** CASL/AccessControl in backend; React Guards + feature flags in frontend.
- **Tenant Isolation:** Every record scoped by `school_id`; Super Admin bypass with global queries; use Postgres Row Level Security for extra guarantees.
- **File Handling:** Students can draw (canvas → PNG), upload PDFs/images; files go through signed upload URLs to S3; metadata stored in `file_assets`.
- **Notifications:** Transactional emails (Resend), SMS (Twilio), and in-app notifications persisted in DB + delivered via WebSocket channel.
- **Payments:** Razorpay subscription per school; webhooks processed by backend worker to activate/expire schools.

---

## 2. Database Schema (PostgreSQL via Prisma)

### 2.1 Entity Relationship Highlights
- `users` ↔ `user_roles` ↔ `roles` (many-to-many).
- `schools` 1↔n `campuses` 1↔n `classes` 1↔n `sections`.
- `students` linked to `users`, `parents`, `admissions`, `class_sections`.
- `teachers` ↔ `class_sections` via `teacher_assignments`.
- `courses` ↔ `course_modules` ↔ `lessons`; `homeworks` tied to `lessons`.
- `homework_submissions` store multi-modal submissions referencing `file_assets`.
- `exams` ↔ `exam_schedules` ↔ `grade_entries` ↔ `report_cards`.
- `payments` ↔ `subscriptions`; `payments` store Razorpay order + webhook payloads.
- `notifications` link to `users`, optional `context_resource`.

### 2.2 Tables Overview

#### Identity & Access
| Table | Key Columns | Notes |
| --- | --- | --- |
| `users` | `id (UUID)`, `email`, `phone`, `password_hash`, `status`, `last_login_at` | Central profile for all personas. |
| `roles` | `id`, `name (super_admin/admin/teacher/student/parent)`, `scope` | Seeded. |
| `user_roles` | `id`, `user_id`, `role_id`, `school_id`, `meta` | Multi-tenant role assignments. |
| `sessions` | `id`, `user_id`, `refresh_token`, `expires_at`, `ip`, `user_agent` | Optional if not pure stateless JWT. |
| `permissions` | `id`, `code`, `description` | For fine-grained feature flags. |
| `role_permissions` | `role_id`, `permission_id` | Joins. |

#### School ERP
| Table | Key Columns | Notes |
| --- | --- | --- |
| `schools` | `id`, `name`, `slug`, `subscription_status`, `razorpay_customer_id` | Master tenant. |
| `campuses` | `id`, `school_id`, `name`, `address`, `timezone` | Optional multi-branch support. |
| `classes` | `id`, `school_id`, `name`, `grade_level` | Academic levels. |
| `sections` | `id`, `class_id`, `label`, `capacity` | Sub groups. |
| `students` | `id`, `user_id`, `school_id`, `admission_no`, `dob`, `gender`, `status` | Student profile. |
| `parents` | `id`, `user_id`, `school_id`, `relationship` | Linked to `student_parents`. |
| `student_parents` | `id`, `student_id`, `parent_id`, `is_primary` | Many-to-many link. |
| `teachers` | `id`, `user_id`, `school_id`, `employee_code`, `join_date` | Staff. |
| `staff_members` | `id`, `user_id`, `school_id`, `department`, `designation` | Non-teaching staff. |
| `admissions` | `id`, `school_id`, `student_id`, `status`, `applied_on`, `documents` | Admission workflow. |
| `attendance_registers` | `id`, `school_id`, `date`, `class_section_id`, `session` | Class-level roll. |
| `attendance_entries` | `id`, `register_id`, `student_id`, `status`, `remark` | Student presence. |
| `timetables` | `id`, `school_id`, `class_section_id`, `week_start`, `version` | Master plan. |
| `timetable_slots` | `id`, `timetable_id`, `day_of_week`, `period`, `subject_id`, `teacher_id` | Period detail. |

#### LMS & Homework
| Table | Key Columns | Notes |
| --- | --- | --- |
| `subjects` | `id`, `school_id`, `name`, `code`, `color` | Display metadata. |
| `courses` | `id`, `school_id`, `class_section_id`, `subject_id`, `title`, `status` | Class-wise courses. |
| `course_modules` | `id`, `course_id`, `title`, `sequence` | Module grouping. |
| `lessons` | `id`, `module_id`, `title`, `objectives`, `content_richtext` | Supports Markdown/JSON. |
| `content_assets` | `id`, `lesson_id`, `type`, `storage_key`, `mime`, `duration` | Reusable digital assets. |
| `homeworks` | `id`, `lesson_id`, `assigned_by`, `due_at`, `submission_type`, `rubric` | Multi-modal allowed. |
| `homework_submissions` | `id`, `homework_id`, `student_id`, `status`, `text_entry`, `drawing_svg`, `grade`, `feedback` | Stores writing/drawing. |
| `submission_attachments` | `id`, `submission_id`, `file_asset_id` | File uploads. |

#### Exams, Grades, Reports
| Table | Key Columns | Notes |
| --- | --- | --- |
| `exams` | `id`, `school_id`, `name`, `term`, `grading_schema` | e.g., Midterm, Final. |
| `exam_schedules` | `id`, `exam_id`, `class_section_id`, `subject_id`, `exam_date`, `duration` | Paper schedule. |
| `grade_entries` | `id`, `exam_schedule_id`, `student_id`, `marks_obtained`, `remarks`, `graded_by` | Raw marks. |
| `report_cards` | `id`, `student_id`, `exam_id`, `overall_grade`, `rank`, `pdf_storage_key` | Exportable PDF. |

#### Finance & Subscriptions
| Table | Key Columns | Notes |
| --- | --- | --- |
| `subscriptions` | `id`, `school_id`, `plan`, `seats`, `billing_cycle`, `status`, `renews_at` | SaaS subscription. |
| `payments` | `id`, `subscription_id`, `razorpay_order_id`, `amount`, `currency`, `status`, `payload_json` | Razorpay integration. |
| `fees_structures` | `id`, `school_id`, `title`, `due_date`, `frequency`, `meta` | Student fees config. |
| `fees_invoices` | `id`, `student_id`, `structure_id`, `amount`, `status`, `issued_at` | Student-level invoices. |
| `fees_payments` | `id`, `invoice_id`, `payment_mode`, `reference_no`, `paid_at` | Offline/online payments. |

#### Notifications, Storage & System
| Table | Key Columns | Notes |
| --- | --- | --- |
| `notifications` | `id`, `user_id`, `type`, `title`, `body`, `cta`, `is_read` | In-app feed. |
| `email_queue` | `id`, `user_id`, `template`, `payload`, `status`, `sent_at` | Outbox pattern. |
| `file_assets` | `id`, `uploader_id`, `school_id`, `storage_key`, `mime`, `size`, `checksum`, `visibility` | S3 metadata. |
| `audit_logs` | `id`, `actor_id`, `action`, `entity`, `entity_id`, `metadata`, `created_at` | Compliance. |
| `settings` | `id`, `school_id`, `key`, `value_json`, `updated_by` | Feature toggles. |

---

## 3. API Endpoint Catalog (NestJS REST)

> Version all endpoints under `/api/v1`. Use DTO validation + Swagger/OpenAPI.

### Auth & Identity
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/auth/register` | Super Admin bootstrap school admin. | Super Admin |
| POST | `/auth/login` | Email/phone + password/OTP login. | All |
| POST | `/auth/refresh` | Rotate tokens. | All |
| POST | `/auth/request-otp` | Send OTP for passwordless/2FA. | All |
| POST | `/auth/reset-password` | Reset via OTP link. | All |
| GET | `/auth/profile` | Get current user with roles & permissions. | Authenticated |

### Schools & Org Setup
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/schools` | Create school + subscription plan. | Super Admin |
| GET | `/schools` | List schools with filters. | Super Admin |
| GET | `/schools/:id` | Fetch school profile, campuses, billing. | Super Admin, School Admin |
| PATCH | `/schools/:id` | Update branding, settings. | School Admin |
| POST | `/schools/:id/campuses` | Add campus. | School Admin |
| POST | `/schools/:id/subscribe` | Create Razorpay order for plan. | School Admin |

### Users, Roles, Classes
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/users` | Invite teacher/staff/parent. | School Admin |
| GET | `/users` | Search users by role/status. | Admin |
| PATCH | `/users/:id` | Update profile/role metadata. | Admin |
| POST | `/classes` | Create class grade. | School Admin |
| POST | `/classes/:classId/sections` | Add section. | School Admin |
| POST | `/sections/:id/teachers` | Assign teacher to section. | School Admin |
| GET | `/sections/:id/roster` | Roster list. | Teacher, Admin |

### Admissions, Attendance, Timetable
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/admissions` | Submit new student application. | Admin |
| PATCH | `/admissions/:id/status` | Move through pipeline. | Admin |
| GET | `/attendance/:sectionId` | Get register for date range. | Teacher |
| POST | `/attendance/:sectionId` | Submit attendance. | Teacher |
| POST | `/timetables/:sectionId` | Create timetable version. | Admin |
| GET | `/timetables/:sectionId` | Retrieve timetable. | Teacher, Student, Parent |

### LMS, Homework, Content
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/courses` | Create course for class-section. | Teacher/Admin |
| GET | `/courses/:id` | Course detail with modules/lessons. | Teacher/Student |
| POST | `/lessons/:id/homeworks` | Assign homework. | Teacher |
| GET | `/homeworks/:id` | Homework detail with rubric. | Teacher/Student |
| POST | `/homeworks/:id/submissions` | Submit text/drawing/upload. | Student |
| PATCH | `/homeworks/:id/submissions/:submissionId` | Grade/feedback. | Teacher |
| POST | `/assets/sign-url` | Get signed upload URL. | Authenticated |

### Exams, Reports
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/exams` | Create exam/term. | Admin |
| POST | `/exams/:id/schedule` | Attach schedule per class. | Admin |
| POST | `/exams/:id/grades/import` | Bulk import CSV marks. | Teacher/Admin |
| GET | `/students/:id/report-cards` | List reports with download link. | Teacher, Student, Parent |
| GET | `/report-cards/:id/pdf` | Signed URL for PDF. | Authorized |

### Fees & Payments
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| POST | `/subscriptions/:id/checkout` | Generate Razorpay order. | School Admin |
| POST | `/payments/razorpay/webhook` | Handle payment events. | System |
| GET | `/fees/invoices` | List invoices per student. | Admin, Parent |
| POST | `/fees/invoices/:id/pay` | Mark offline payment or confirm Razorpay payment. | Admin |

### Notifications & Messaging
| Method | Path | Description | Roles |
| --- | --- | --- | --- |
| GET | `/notifications` | Paginated feed. | Authenticated |
| POST | `/notifications/broadcast` | Send announcement to role/class. | Admin |
| PATCH | `/notifications/:id/read` | Mark read. | Authenticated |

---

## 4. Next.js Frontend Structure (App Router + Tailwind)

### 4.1 Directory Layout

```text
apps/frontend/
  app/
    layout.tsx
    globals.css
    (public)/
      page.tsx
      pricing/page.tsx
    (auth)/
      login/page.tsx
      reset-password/page.tsx
    (dashboard)/
      layout.tsx
      page.tsx                 # role auto-redirect
      super-admin/page.tsx
      admin/page.tsx
      teacher/page.tsx
      student/page.tsx
      parent/page.tsx
      schools/[schoolId]/settings/page.tsx
      classes/[classId]/page.tsx
      homework/[homeworkId]/page.tsx
  components/
    ui/                       # Tailwind primitives (Button, Card, Tabs, Drawer)
    charts/
    layout/
    data/
  features/
    auth/
      hooks.ts
      components.tsx
    schools/
    attendance/
    lms/
    homework/
    exams/
    payments/
  hooks/
    use-role-guard.ts
    use-toast.ts
  lib/
    api-client.ts             # Axios w/ interceptors
    auth.ts                   # token helpers
    constants.ts
  store/
    index.ts                  # Zustand/Redux store
  styles/
    tailwind.config.ts
    postcss.config.js
  public/
    brand/
```

### 4.2 Example Components & Pages

- **Role-aware Dashboard:** `app/(dashboard)/layout.tsx` loads session via `cookies()` and passes to `RoleGate` component to guard nested routes.
- **Homework Canvas:** Use `<CanvasDraw />` or custom fabric.js component enabling draw/upload.
- **Data Fetching:** React Query hooks per feature (`features/homework/api.ts`) hitting `/api` routes proxied to backend.

```tsx
// components/dashboard/metric-card.tsx
import { cn } from '@/lib/utils';

type MetricCardProps = {
  label: string;
  value: string | number;
  trend?: { delta: number; isPositive: boolean };
};

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-3xl font-semibold text-slate-900">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {trend.isPositive ? '▲' : '▼'} {trend.delta}%
          </span>
        )}
      </div>
    </div>
  );
}
```

### 4.3 Styling & UX Guidelines
- Tailwind + Radix UI primitives for accessibility.
- Maintain responsive grid (mobile-first) and global search bar accessible from all dashboards.
- Use `next-intl` for localization and date-fns-tz for timezone-aware scheduling.
- Integrate `react-hot-toast` or custom toast system for notifications from mutation hooks.

---

## 5. NestJS Backend Starter

### 5.1 Directory Structure

```text
apps/backend/
  src/
    main.ts
    app.module.ts
    config/
      validation.ts
      prisma.service.ts
    common/
      decorators/
      guards/
      interceptors/
      dto/pagination.dto.ts
    modules/
      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
        dto/login.dto.ts
        strategies/jwt.strategy.ts
      users/
        users.module.ts
        users.controller.ts
        users.service.ts
      schools/
        schools.module.ts
        schools.controller.ts
        schools.service.ts
      classes/
        classes.module.ts
        classes.controller.ts
        classes.service.ts
      homework/
        homework.module.ts
        homework.controller.ts
        homework.service.ts
      notifications/
      payments/
    prisma/
      schema.prisma
  test/
    auth.e2e-spec.ts
    homework.spec.ts
```

### 5.2 Example Module Snippets

```ts
// src/modules/auth/auth.module.ts
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts
// src/modules/homework/homework.controller.ts
@Controller({ path: 'homeworks', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles('teacher', 'admin')
  create(@Body() dto: CreateHomeworkDto, @AuthUser() user: AuthUserPayload) {
    return this.homeworkService.create(dto, user);
  }

  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string, @AuthUser() user: AuthUserPayload) {
    return this.homeworkService.getOne(id, user);
  }

  @Post(':id/submissions')
  @Roles('student')
  submit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitHomeworkDto,
    @AuthUser() user: AuthUserPayload,
  ) {
    return this.homeworkService.submit(id, user.sub, dto);
  }
}
```

### 5.3 Key Technical Decisions
- **ORM:** Prisma for typed schemas, migrations (`prisma migrate deploy`) and generated DTO typings.
- **Validation:** `class-validator` + `class-transformer`.
- **Guards:** `JwtAuthGuard`, `RolesGuard`, `TenantGuard` to ensure `school_id` scoping.
- **Background Jobs:** `@nestjs/bullmq` workers for notification sending, report PDF generation, Razorpay webhook processing.
- **Storage Integration:** Pre-signed URL service in `files` module (S3 SDK).
- **Testing:** `@nestjs/testing` for unit tests, `supertest` for e2e hitting a test Postgres (e.g., Testcontainers).

---

## 6. Running Locally & Deployment

### 6.1 Prerequisites
- Node.js 20+, pnpm 9+, Docker (for Postgres + Redis), OpenSSL (for key generation).
- Env files: `apps/frontend/.env.local`, `apps/backend/.env`.

### 6.2 Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/schoolos
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret
NEXT_PUBLIC_API_URL=http://localhost:3001/api
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_PROVIDER_API_KEY=...
STORAGE_BUCKET=schoolos-dev
STORAGE_REGION=ap-south-1
```

### 6.3 Local Development Steps
1. **Install deps:** `pnpm install` from repo root (assuming monorepo managed by Turborepo).
2. **Start infra:** `docker compose up -d postgres redis minio`.
3. **Apply migrations:** `pnpm prisma migrate dev` (runs against local DB).
4. **Seed data:** `pnpm backend seed` to create Super Admin + demo school.
5. **Run backend:** `pnpm backend start:dev` (NestJS on `:3001`).
6. **Run frontend:** `pnpm frontend dev` (Next.js on `:3000`, proxy to backend).

### 6.4 Recommended Developer Workflow
- Use Storybook (`pnpm frontend storybook`) for UI validation.
- Lint/format: `pnpm lint`, `pnpm format`.
- Run tests: `pnpm backend test`, `pnpm backend test:e2e`, `pnpm frontend test`.

### 6.5 Deployment

**Frontend (Vercel)**
- Connect GitHub repo; set `framework: Next.js`.
- Configure environment variables + secrets in Vercel dashboard.
- Enable preview deployments per branch; restrict production to `main`.

**Backend (Render/Railway)**
- Create Docker-based web service pointing to `apps/backend/Dockerfile`.
- Set `DATABASE_URL`, `REDIS_URL`, `RAZORPAY_*`, etc. Use managed Postgres + Redis add-ons.
- Add worker service for BullMQ processors (command `node dist/apps/backend/main.worker.js`).
- Use Render CRON for nightly tasks (e.g., attendance reminders, backup exports).

**Database & Storage**
- Provision managed Postgres (Neon/AWS RDS) with automatic backups, read replica for analytics.
- Use Prisma migration pipeline (`prisma migrate deploy`) during release.
- S3 bucket with lifecycle policies + signed URL IAM user.

**Observability & Alerts**
- Ship logs via OpenTelemetry → Grafana Cloud.
- Health checks `/api/healthz` monitored by Vercel + Render.
- Set up Razorpay webhook redundancy (primary worker + dead-letter queue).

---

## 7. Next Steps
- Flesh out detailed UI wireframes per persona.
- Implement feature flagging for staged rollout (e.g., ConfigCat or LaunchDarkly).
- Add automated compliance exports (attendance, fee receipts) to satisfy school audits.

