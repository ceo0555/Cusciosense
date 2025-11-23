# Alfanumrik SchoolOS – System Blueprint

## 1. Platform Overview
- **Goal**: Unified School ERP + Adaptive LMS supporting Super Admin, School Admin, Teacher, Student, Parent roles.
- **Tenancy**: Multi-tenant by `school_id`. Super Admin manages onboarding and subscriptions.
- **Deployment**: Next.js frontend on Vercel, NestJS backend on Render/Railway, PostgreSQL + Redis managed services.

## 2. High-Level Architecture
```
[Next.js App Router + Tailwind] --(HTTPS)--> [NestJS API Gateway]
            |                                       |
       NextAuth + JWT                        Prisma / TypeORM
            |                                       |
      Vercel Edge Cache                    PostgreSQL + Redis
            |                                       |
    Homework uploads (S3/R2)            BullMQ workers + S3 + Razorpay
```

- **Frontend**: Route groups per role, SWR/React Query for data fetching, TanStack Table for grid-heavy views, Fabric.js canvas for drawing homework responses.
- **Backend**: Modular monolith (Auth, Users, Schools, Classes, Homework, Attendance, Fees, Exams, Payments, Notifications). JWT auth with role claims + RolesGuard. BullMQ workers for notifications/report generation. WebSockets (Gateway) for live notifications.
- **Integrations**: Razorpay (subscriptions & invoices), SES/Resend (email), S3-compatible storage (drawings, PDFs), Sentry/Logtail monitoring.

## 3. Database Schema (PostgreSQL)

| Table | Key Fields | Notes |
| --- | --- | --- |
| `super_admins` | `id`, `email`, `password_hash` | Internal control plane |
| `schools` | `id`, `name`, `slug`, `address`, `subscription_status`, `razorpay_customer_id` | `has_many` users, classes |
| `users` | `id`, `school_id`, `role`, `email`, `phone`, `password_hash`, `status` | Parent entity for all roles |
| `students` | `id`, `user_id`, `admission_no`, `class_id`, `parent_contact_id` | Child of `users` |
| `teachers` | `id`, `user_id`, `staff_no`, `subjects[]` | |
| `parents` | `id`, `user_id` | M2M via `student_parents` join |
| `classes` | `id`, `school_id`, `grade`, `section`, `timetable_json` | |
| `courses` | `id`, `class_id`, `teacher_id`, `subject`, `syllabus` | LMS content container |
| `homeworks` | `id`, `course_id`, `title`, `instructions`, `due_at`, `attachments[]` | JSON for attachments |
| `homework_submissions` | `id`, `homework_id`, `student_id`, `content_json`, `status`, `score`, `feedback` | `content_json` stores text/draw/upload refs |
| `attendance_records` | `id`, `class_id`, `student_id`, `date`, `status`, `remarks` | |
| `fees_invoices` | `id`, `school_id`, `student_id`, `amount`, `due_date`, `status`, `razorpay_order_id` | |
| `payments` | `id`, `invoice_id`, `razorpay_payment_id`, `amount`, `status`, `metadata` | |
| `exams` | `id`, `class_id`, `name`, `schedule`, `max_marks`, `grading_schema` | |
| `exam_results` | `id`, `exam_id`, `student_id`, `marks_json`, `grade`, `remarks` | |
| `report_cards` | `id`, `student_id`, `term`, `pdf_url`, `generated_at` | |
| `notifications` | `id`, `user_id`, `type`, `title`, `body`, `data_json`, `is_read` | in-app feed |
| `subscriptions` | `id`, `school_id`, `plan`, `status`, `starts_at`, `ends_at`, `razorpay_subscription_id` | Billing |
| `audit_logs` | `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `metadata`, `created_at` | Compliance |

> All tables include `created_at`, `updated_at`, soft-delete flag where critical.

## 4. API Surface (REST-first)

- **Auth & Session**
  - `POST /auth/register` – Super Admin invites School Admin.
  - `POST /auth/login` – Email/phone + OTP/password.
  - `POST /auth/otp` – Request OTP.
  - `POST /auth/refresh`, `POST /auth/logout`.

- **User & Role Management**
  - `GET /users`, `POST /users` (role-specific payload validation).
  - `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`.
  - `POST /schools/:id/invite` (email/sms invites).

- **Schools & Classes**
  - `GET /schools`, `POST /schools`.
  - `GET /schools/:id`, `PATCH /schools/:id`.
  - `GET /classes`, `POST /classes`.
  - `GET /classes/:id/timetable`, `POST /classes/:id/timetable`.

- **LMS / Homework**
  - `GET /classes/:id/courses`, `POST /courses`.
  - `GET /courses/:id/content`, `POST /courses/:id/homework`.
  - `GET /homework/:id`, `POST /homework/:id/submit`.
  - `PATCH /homework-submissions/:id` (grading).

- **Attendance & ERP**
  - `POST /classes/:id/attendance`, `GET /classes/:id/attendance?date=`.
  - `GET /students/:id/attendance`.
  - `POST /admissions`, `GET /admissions/:id`.

- **Fees & Payments**
  - `POST /fees/invoices`, `GET /fees/invoices/:id`.
  - `POST /payments/create-order` (Razorpay order).
  - `POST /payments/webhook`.

- **Exams & Reports**
  - `POST /classes/:id/exams`, `GET /exams/:id`.
  - `POST /exams/:id/results`.
  - `POST /students/:id/report-card` (trigger generation).

- **Notifications**
  - `GET /notifications`, `PATCH /notifications/:id/read`.
  - WebSocket channel `/ws/notifications`.

- **Admin Analytics**
  - `GET /dashboard/metrics` (aggregate KPIs).
  - `GET /subscriptions`, `POST /subscriptions/activate`.

## 5. Next.js Frontend Structure
```
frontend/
  src/
    app/
      layout.tsx
      page.tsx                    # marketing/landing
      (auth)/
        login/page.tsx
        signup/page.tsx
        otp/page.tsx
      dashboard/
        layout.tsx
        page.tsx                  # role-aware overview
        classes/page.tsx
        classes/[classId]/page.tsx
        homework/page.tsx
        homework/[homeworkId]/page.tsx
        attendance/page.tsx
        fees/page.tsx
        exams/page.tsx
        reports/page.tsx
    components/
      ui/ (Button, Card, Table, Modal)
      navigation/Sidebar.tsx, Topbar.tsx
      lms/HomeworkEditor.tsx      # tabs Write/Draw/Upload
    hooks/
      useUser.ts, useRole.ts
    lib/
      apiClient.ts (fetch wrapper)
      auth.ts (role guards)
      constants.ts
    styles/globals.css
```

### UX Considerations
- Responsive layout with persistent sidebar + top bar.
- Role-based navigation tree.
- Homework editor uses tabs: **Write** (rich text), **Draw** (Fabric.js canvas), **Upload** (images/PDFs).
- Attendance table with sticky headers, quick status toggles.
- Notification bell component wired to WebSocket for real-time updates.

## 6. NestJS Backend Starter
```
backend/
  src/
    main.ts
    app.module.ts
    config/config.module.ts
    common/
      guards/jwt-auth.guard.ts
      guards/roles.guard.ts
      decorators/user.decorator.ts
      filters/http-exception.filter.ts
    database/
      prisma.service.ts or typeorm.module.ts
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
    classes/
      classes.module.ts
    homework/
      homework.module.ts
    exams/
      exams.module.ts
    payments/
      payments.module.ts
      razorpay.service.ts
      webhook.controller.ts
    notifications/
      notifications.module.ts
      notifications.gateway.ts
```
- Use Prisma schema mirroring DB tables above; configure multi-tenant middleware injecting `school_id`.
- Global pipes for validation (class-validator).
- File uploads via AWS SDK (S3 compatible) abstracted through StorageService.
- BullMQ queues for notifications/report generation (Redis connection in dedicated module).

## 7. Running Locally
```bash
# 1. Clone & install deps
pnpm install --filter frontend...
pnpm install --filter backend...

# 2. Environment
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 3. Infra
docker compose up -d postgres redis

# 4. Database
cd backend && pnpm prisma migrate dev

# 5. Start services
pnpm --filter backend start:dev
pnpm --filter frontend dev
```
- Frontend served at `http://localhost:3000`.
- Backend served at `http://localhost:4000`.

## 8. Deployment
- **Frontend (Vercel)**: Connect repo, set env vars (`NEXTAUTH_SECRET`, `API_BASE_URL`, `RAZORPAY_KEY_ID`, etc.), build command `pnpm build`.
- **Backend (Render/Railway)**: Deploy via Dockerfile or `pnpm start:prod`. Run `pnpm prisma migrate deploy` on release. Attach managed Postgres + Redis; store secrets (JWT, Razorpay, S3, email).
- **Payments**: Configure Razorpay webhooks to `<backend>/payments/webhook`.
- **Storage**: Use Cloudflare R2/AWS S3; set signed URL expiry policy.
- **Monitoring**: Add Sentry DSN + Logtail token env vars; enable uptime checks via Better Stack.

## 9. Next Steps
1. Scaffold Prisma schema & migration scripts.
2. Bootstrap NestJS modules with DTOs, guards, and controllers.
3. Implement Next.js app router pages with role-based layouts.
4. Integrate Razorpay sandbox + S3 storage.
5. Add automated tests + GitHub Actions CI/CD.

