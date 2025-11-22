# Alfanumrik SchoolOS – Technical Blueprint

## 1. System Architecture

### 1.1 High-level components
- **Clients**: Responsive Next.js web app (desktop/tablet/mobile) + optional mobile wrapper via Expo.
- **Frontend**: Next.js 15 (App Router, RSC) + TailwindCSS + TanStack Query + Zustand for lightweight global state.
- **Backend**: NestJS 11 monolith with modular domains (Auth, User, School, Class, LMS, Homework, Exams, Fees, Notifications). Uses Fastify adapter.
- **Database**: PostgreSQL 15 using Prisma ORM; row-level security (RLS) for tenant isolation.
- **Cache & Queues**: Redis for session cache + BullMQ for async jobs (emails, notifications, PDF generation).
- **Storage**: S3-compatible bucket (e.g., Cloudflare R2) for homework attachments, report cards, rich media.
- **Real-time**: Socket.IO gateway in NestJS for live attendance, homework status, notifications.
- **Payments**: Razorpay subscription APIs handled by dedicated billing service inside NestJS.
- **Observability**: OpenTelemetry traces + Prometheus metrics + Grafana dashboards; Sentry for error tracking.

### 1.2 Logical flow
```mermaid
graph LR
    A[Client: Next.js] -- HTTPS --> B[NestJS API Gateway]
    B --> C[(Auth Module)]
    B --> D[(School ERP Modules)]
    B --> E[(LMS Modules)]
    B --> F[(Homework & Exams)]
    B --> G[(Billing + Razorpay)]
    B --> H[(Notification Service)]
    C --- I[(PostgreSQL)]
    D --- I
    E --- I
    F --- I
    B <---> J[(Redis Cache)]
    H --> K[(Email/SMS Providers)]
    G --> L[(Razorpay)]
    F --> M[(S3 Storage)]
    B <---> N[(Socket.IO Clients)]
```

### 1.3 Multi-tenancy & security
- Each `school` row defines a tenant. All domain tables include `school_id`.
- RLS policies enforce `school_id = current_setting('app.current_school')`.
- Super Admin bypasses RLS; School Admin limited to their school.
- JWT auth with refresh tokens + short-lived access tokens. OTP flow for phone login.
- Audit trail captured in `audit_events` table.
- Secrets managed via Vercel/Render env vars; never hardcode keys.

### 1.4 Cross-cutting concerns
- **Validation**: Zod/DTO validation at API boundary + react-hook-form client side.
- **Internationalization**: next-intl with default en-IN, fallback en.
- **Theming**: Tailwind tokens + CSS variables for brand overrides per school.
- **Accessibility**: Headless UI + aria attributes baked into components.


## 2. Database Schema (PostgreSQL)

| Table | Key Columns | Description / Notes |
| --- | --- | --- |
| `roles` | `id`, `name` (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`) | Seeded reference. |
| `permissions` | `id`, `code`, `description` | Fine-grained authorizations. |
| `role_permissions` | `role_id`, `permission_id` | M2M join. |
| `schools` | `id`, `name`, `slug`, `board`, `subscription_plan_id`, `status` | Tenant root entity. |
| `users` | `id`, `name`, `email`, `phone`, `password_hash`, `role_id`, `last_login_at`, `avatar_url`, `is_active` | Global identities. Super Admin lives here. |
| `school_members` | `id`, `school_id`, `user_id`, `metadata`, `joined_at`, `status` | Links users to a school; holds school-specific roles. |
| `students` | `id`, `school_member_id`, `admission_no`, `dob`, `gender`, `address`, `guardian_contact` | Student profile. |
| `parents` | `id`, `school_member_id`, `relationship`, `primary_contact` | Parent profile tied to user. |
| `teachers` | `id`, `school_member_id`, `employee_code`, `subject_specialty`, `designation` | Teacher profile. |
| `classes` | `id`, `school_id`, `name`, `grade_level`, `academic_year_id` | Grade container. |
| `sections` | `id`, `class_id`, `label`, `mentor_teacher_id` | Splits class into sections. |
| `class_enrollments` | `id`, `section_id`, `student_id`, `roll_no`, `status` | Student membership per section. |
| `subjects` | `id`, `school_id`, `name`, `code` | Academic subjects. |
| `timetables` | `id`, `section_id`, `day_of_week`, `periods jsonb` | Weekly schedule. |
| `attendances` | `id`, `section_id`, `student_id`, `date`, `status`, `marked_by` | Daily attendance logs. |
| `courses` | `id`, `class_id`, `subject_id`, `title`, `description`, `visibility` | LMS course per class-subject. |
| `modules` | `id`, `course_id`, `title`, `order`, `release_at` | Course module ordering. |
| `lessons` | `id`, `module_id`, `content_richtext`, `attachments jsonb`, `duration_minutes` | Lesson content (Quill/TipTap). |
| `homeworks` | `id`, `section_id`, `assigned_by`, `title`, `instructions`, `due_at`, `submission_type`, `rubric jsonb` | Homework definitions. |
| `homework_submissions` | `id`, `homework_id`, `student_id`, `text_answer`, `sketch_url`, `attachments jsonb`, `submitted_at`, `graded_at`, `score`, `feedback` | Student submissions, supports drawing/uploads. |
| `quizzes` | `id`, `course_id`, `title`, `settings jsonb` | Adaptive quiz blueprint. |
| `quiz_questions` | `id`, `quiz_id`, `question`, `options jsonb`, `answer_key`, `bloom_level` | Questions library. |
| `quiz_attempts` | `id`, `quiz_id`, `student_id`, `score`, `mastery_map jsonb`, `started_at`, `completed_at` | Adaptive attempt logs. |
| `exams` | `id`, `school_id`, `name`, `term`, `weightage`, `publish_at` | Exam session. |
| `exam_schedules` | `id`, `exam_id`, `section_id`, `subject_id`, `exam_date`, `duration` | Exam timetable. |
| `exam_results` | `id`, `exam_schedule_id`, `student_id`, `marks_obtained`, `grade`, `remarks`, `pdf_url` | Report card entries. |
| `fee_plans` | `id`, `school_id`, `name`, `amount`, `billing_cycle`, `features jsonb` | Subscription for schools. |
| `payments` | `id`, `school_id`, `razorpay_subscription_id`, `status`, `amount`, `currency`, `paid_at`, `payload jsonb` | Razorpay webhooks. |
| `notifications` | `id`, `recipient_id`, `channel`, `title`, `body`, `data jsonb`, `status`, `sent_at` | Email/in-app notifications. |
| `notification_preferences` | `id`, `user_id`, `channel`, `enabled` | User opt-ins. |
| `attachments` | `id`, `owner_type`, `owner_id`, `file_url`, `mime`, `size`, `uploader_id` | Generic files (lessons, homework). |
| `audit_events` | `id`, `actor_id`, `school_id`, `action`, `metadata jsonb`, `created_at` | Compliance trail. |

**Indices & constraints**
- Unique (`school_id`, `slug`) on `classes`, `subjects`.
- Partial indexes on `homework_submissions` (`graded_at IS NULL`) for pending queues.
- GIN indexes on jsonb columns used for search (`modules.order`, `rubric`, `notifications.data`).


## 3. API Surface (NestJS /api)

> Version routes with `/api/v1`. All endpoints expect `Authorization: Bearer <token>`.

### Auth
- `POST /auth/login-email` – email/password login.
- `POST /auth/login-otp` – phone + OTP.
- `POST /auth/refresh` – refresh JWT.
- `POST /auth/logout` – revoke refresh token.
- `POST /auth/invite` – Super/School Admin invites new user.

### Users & Roles
- `GET /users/me` – profile bootstrap.
- `PUT /users/me` – update profile, avatar.
- `GET /schools/:schoolId/members` – list members w/ filters.
- `POST /schools/:schoolId/members` – add (assign role & join school).
- `PATCH /school-members/:id/status` – activate/deactivate.

### Schools & Administration
- `GET /schools` – Super Admin listing with subscription status.
- `POST /schools` – create school, choose plan.
- `GET /schools/:id` – details (RLS ensures same tenant).
- `PATCH /schools/:id` – update branding, board, etc.
- `POST /schools/:id/timetable/import` – bulk CSV upload.
- `GET /schools/:id/dashboard` – stats (enrollment, overdue fees).

### Classes, Sections & Timetable
- `GET /schools/:schoolId/classes` – filter by academic year.
- `POST /schools/:schoolId/classes` – create class + sections.
- `PATCH /classes/:id` – rename, assign mentors.
- `GET /sections/:id/timetable` – fetch structured timetable.
- `PUT /sections/:id/timetable` – update JSON periods.

### LMS (Courses, Lessons, Quizzes)
- `GET /classes/:classId/courses` – list.
- `POST /classes/:classId/courses` – create course per subject.
- `POST /courses/:courseId/modules` – create module.
- `POST /modules/:moduleId/lessons` – author lesson.
- `GET /lessons/:id` – fetch content (role-based.
- `POST /courses/:courseId/quizzes` – adaptive quiz settings.
- `POST /quizzes/:quizId/questions` – CRUD question bank.
- `POST /quizzes/:quizId/attempts` – student attempt start.
- `PATCH /quiz-attempts/:id/complete` – submit result.

### Homework
- `POST /sections/:sectionId/homeworks` – assign homework.
- `GET /sections/:sectionId/homeworks` – teacher view.
- `GET /students/me/homeworks` – student prioritized feed.
- `POST /homeworks/:id/submissions` – write/draw/upload (multipart).
- `PATCH /homework-submissions/:id/grade` – rubric-scored grading.
- `GET /homeworks/:id/submissions/export` – CSV/PDF summary job.

### Attendance & Exams
- `POST /sections/:sectionId/attendance` – mark daily attendance.
- `GET /sections/:sectionId/attendance` – filter by date range.
- `POST /schools/:schoolId/exams` – create exam term.
- `POST /exams/:examId/schedule` – attach sections/subjects.
- `POST /exam-schedules/:id/results` – bulk upload marks.
- `GET /students/:id/report-cards` – list generated PDFs.

### Fees & Payments
- `GET /billing/plans` – available SchoolOS plans.
- `POST /billing/subscribe` – create Razorpay subscription.
- `POST /billing/webhook` – Razorpay webhook endpoint (signature verified).
- `GET /schools/:id/payments` – payment history.

### Notifications
- `GET /notifications` – in-app notifications (paginated).
- `PATCH /notifications/:id/read` – mark read.
- `PUT /notification-preferences` – toggle channels.

### Utilities
- `POST /uploads/presign` – S3 presigned URL (scoped path).
- `GET /health` – readiness/liveness aggregator.


## 4. Next.js Frontend Structure

### 4.1 Directory layout
```
apps/frontend/
  app/
    (auth)/
      login/page.tsx
      otp/page.tsx
    (dashboard)/
      layout.tsx
      page.tsx               # role-aware landing
      super-admin/page.tsx
      school-admin/page.tsx
      teacher/page.tsx
      student/page.tsx
      parent/page.tsx
      schools/[schoolId]/...
    api/
      auth/route.ts          # SSR-only helpers
    globals.css
  components/
    ui/
      Button.tsx
      Card.tsx
      DataTable.tsx
      StatTile.tsx
    charts/
      AttendanceSpark.tsx
      PerformanceRadar.tsx
    lms/
      CourseCard.tsx
      LessonViewer.tsx
    homework/
      SubmissionComposer.tsx
  hooks/
    useAuth.ts
    useTenant.ts
    useSocket.ts
  lib/
    api-client.ts
    auth.ts
    permissions.ts
  providers/
    AuthProvider.tsx
    ThemeProvider.tsx
  styles/
    tailwind.css
```

### 4.2 Example pages & components

`apps/frontend/app/(dashboard)/layout.tsx`
```tsx
import { AuthProvider } from '@/providers/AuthProvider';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
```

`apps/frontend/components/homework/SubmissionComposer.tsx`
```tsx
export function SubmissionComposer({ homework }: { homework: Homework }) {
  const [mode, setMode] = useState<'write' | 'draw' | 'upload'>('write');

  return (
    <Card>
      <SegmentedControl
        options={[
          { value: 'write', label: 'Write' },
          { value: 'draw', label: 'Draw' },
          { value: 'upload', label: 'Upload' },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === 'write' && <RichTextEditor />}
      {mode === 'draw' && <CanvasPad />}
      {mode === 'upload' && <FileDropzone accept={['image/*', 'application/pdf']} />}
    </Card>
  );
}
```

### 4.3 Data fetching strategy
- Server Components fetch initial data via `api-client` (fetch with cookies) to leverage SSR caching.
- TanStack Query hydrates on client for interactions (homework submission, attendance).
- optimistic updates for attendance toggles and homework grading.

### 4.4 Styling & UX
- Tailwind + shadcn UI for consistency.
- `ThemeProvider` switches based on school branding tokens stored in `schools.branding jsonb`.
- Global notification center uses Headless UI `Popover`.


## 5. NestJS Backend Starter

### 5.1 Directory layout
```
apps/backend/
  src/
    app.module.ts
    common/
      guards/
      interceptors/
      decorators/
      filters/
    config/
      app.config.ts
      database.config.ts
    database/
      prisma.service.ts
      migrations/
    modules/
      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
        dto/
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
      lms/
        lms.module.ts
        courses.service.ts
        lessons.service.ts
      notifications/
        notifications.module.ts
      billing/
        billing.module.ts
      sockets/
        events.gateway.ts
  test/
    auth.e2e-spec.ts
    homework.e2e-spec.ts
```

### 5.2 Example Auth module snippet
`apps/backend/src/modules/auth/auth.module.ts`
```ts
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('auth.jwtSecret'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, PhoneOtpService],
  exports: [AuthService],
})
export class AuthModule {}
```

`apps/backend/src/modules/homework/homework.controller.ts`
```ts
@Controller({ path: 'homeworks', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles(Role.TEACHER)
  create(@Body() dto: CreateHomeworkDto, @CurrentSchool() school: SchoolContext) {
    return this.homeworkService.assign(dto, school);
  }

  @Get(':id/submissions')
  @Roles(Role.TEACHER, Role.SCHOOL_ADMIN)
  findSubmissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.homeworkService.listSubmissions(id);
  }
}
```

### 5.3 Key technical decisions
- Prisma for productivity, but wrap in repositories for future migration to pure SQL.
- BullMQ queues defined in modules needing async tasks (`notifications`, `reports`).
- File uploads: generate presigned URL via backend, client uploads directly to storage, metadata persisted via `attachments`.
- Adaptive LMS: quiz engine uses mastery map stored in `quiz_attempts.mastery_map`.


## 6. Local Development & Deployment

### 6.1 Prerequisites
- Node.js 20.x, PNPM 9.x (monorepo), Docker Desktop or Podman.
- PostgreSQL 15 & Redis 7 (use docker-compose).
- Razorpay test keys, SendGrid (or AWS SES) API key, SMTP fallback.

### 6.2 Environment setup
```
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```
Populate:
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/schoolos`
- `REDIS_URL=redis://localhost:6379`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `EMAIL_PROVIDER_API_KEY`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1`

### 6.3 Running locally
```
docker compose up postgres redis -d
pnpm install
pnpm prisma migrate deploy

pnpm --filter backend start:dev   # NestJS on :3001
pnpm --filter frontend dev        # Next.js on :3000
```
- Use `pnpm turbo dev` for concurrent dev with Turborepo.
- Storybook: `pnpm --filter frontend storybook`.
- E2E tests via Playwright hitting local stack.

### 6.4 Data seeding & fixtures
- `pnpm prisma db seed` seeds roles, permissions, demo school, sample classes, and demo homework.
- Use `apps/backend/scripts/seed-tenants.ts` for generating load-test data.

### 6.5 Deployment
- **Frontend (Vercel)**: connect repo, set framework to Next.js, configure env secrets, enable Turbopack. Use build command `pnpm --filter frontend build`.
- **Backend (Render/Railway)**: Dockerfile with multi-stage build; set start command `pnpm --filter backend start:prod`. Add PostgreSQL + Redis managed services or external.
- Run `prisma migrate deploy` during release command; use `DATABASE_URL` referencing managed Postgres.
- **File storage**: configure S3-compatible bucket (AWS S3, R2). Provide `STORAGE_BUCKET`, `STORAGE_REGION`.
- **Background jobs**: Render worker or Railway cron to run `pnpm --filter backend bull:worker`.
- **Monitoring**: ship logs to Grafana Loki or New Relic; configure Sentry DSN in both frontend and backend.

### 6.6 Production readiness checklist
- Enforce HTTPS and secure cookies.
- Configure Razorpay webhook whitelist & signature validation.
- Enable WAF & rate limiting on `/auth/*` endpoints.
- Nightly backup for Postgres (Point-in-time recovery).
- Incident response SOP with alerting on failed payments, queue backlog, and error budgets.

