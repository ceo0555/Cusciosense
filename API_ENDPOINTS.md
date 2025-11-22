# Alfanumrik SchoolOS - API Endpoints Documentation

Base URL: `/api/v1`

## Authentication & Authorization

### Auth Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/auth/register` | Register new user | No | - |
| POST | `/auth/login` | Login with email/password | No | - |
| POST | `/auth/login/phone` | Login with phone OTP | No | - |
| POST | `/auth/send-otp` | Send OTP to phone/email | No | - |
| POST | `/auth/verify-otp` | Verify OTP | No | - |
| POST | `/auth/refresh-token` | Refresh JWT token | No | - |
| POST | `/auth/logout` | Logout user | Yes | All |
| POST | `/auth/forgot-password` | Request password reset | No | - |
| POST | `/auth/reset-password` | Reset password with token | No | - |
| PATCH | `/auth/change-password` | Change password | Yes | All |
| GET | `/auth/me` | Get current user profile | Yes | All |

## User Management

### Users

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/users` | List all users | Yes | super_admin, school_admin |
| GET | `/users/:id` | Get user by ID | Yes | All |
| POST | `/users` | Create new user | Yes | super_admin, school_admin |
| PATCH | `/users/:id` | Update user | Yes | All (own profile) |
| DELETE | `/users/:id` | Delete user | Yes | super_admin, school_admin |
| POST | `/users/:id/upload-photo` | Upload profile photo | Yes | All |
| GET | `/users/:id/roles` | Get user roles | Yes | All |
| POST | `/users/:id/roles` | Assign role to user | Yes | super_admin, school_admin |
| DELETE | `/users/:id/roles/:roleId` | Remove role from user | Yes | super_admin, school_admin |

### Parent-Student Relations

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/users/:studentId/parents` | Link parent to student | Yes | school_admin |
| GET | `/users/:studentId/parents` | Get student's parents | Yes | teacher, school_admin, parent |
| GET | `/users/:parentId/children` | Get parent's children | Yes | parent, school_admin |
| DELETE | `/users/:studentId/parents/:parentId` | Unlink parent | Yes | school_admin |

## School Management

### Schools

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools` | List all schools | Yes | super_admin |
| GET | `/schools/:id` | Get school by ID | Yes | All |
| POST | `/schools` | Create new school | Yes | super_admin |
| PATCH | `/schools/:id` | Update school | Yes | super_admin, school_admin |
| DELETE | `/schools/:id` | Delete school | Yes | super_admin |
| POST | `/schools/:id/upload-logo` | Upload school logo | Yes | school_admin |
| GET | `/schools/:id/stats` | Get school statistics | Yes | super_admin, school_admin |
| PATCH | `/schools/:id/settings` | Update school settings | Yes | school_admin |

### Subscriptions

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/subscription` | Get school subscription | Yes | super_admin, school_admin |
| POST | `/schools/:schoolId/subscription` | Create subscription | Yes | super_admin |
| PATCH | `/schools/:schoolId/subscription` | Update subscription | Yes | super_admin |
| POST | `/schools/:schoolId/subscription/upgrade` | Upgrade plan | Yes | school_admin |
| POST | `/schools/:schoolId/subscription/renew` | Renew subscription | Yes | school_admin |
| GET | `/subscriptions/plans` | Get available plans | No | - |

## Class Management

### Classes

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/classes` | List school classes | Yes | All |
| GET | `/classes/:id` | Get class by ID | Yes | All |
| POST | `/schools/:schoolId/classes` | Create class | Yes | school_admin |
| PATCH | `/classes/:id` | Update class | Yes | school_admin |
| DELETE | `/classes/:id` | Delete class | Yes | school_admin |
| GET | `/classes/:id/students` | Get class students | Yes | teacher, school_admin |
| GET | `/classes/:id/teachers` | Get class teachers | Yes | All |
| GET | `/classes/:id/timetable` | Get class timetable | Yes | All |

### Enrollments

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/classes/:classId/enrollments` | Enroll student | Yes | school_admin |
| GET | `/classes/:classId/enrollments` | Get class enrollments | Yes | teacher, school_admin |
| GET | `/students/:studentId/enrollments` | Get student enrollments | Yes | All |
| PATCH | `/enrollments/:id` | Update enrollment | Yes | school_admin |
| DELETE | `/enrollments/:id` | Remove enrollment | Yes | school_admin |

## Academic/LMS Modules

### Courses

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/classes/:classId/courses` | List class courses | Yes | All |
| GET | `/courses/:id` | Get course by ID | Yes | All |
| POST | `/classes/:classId/courses` | Create course | Yes | school_admin |
| PATCH | `/courses/:id` | Update course | Yes | teacher, school_admin |
| DELETE | `/courses/:id` | Delete course | Yes | school_admin |
| GET | `/courses/:id/students` | Get enrolled students | Yes | teacher, school_admin |

### Content (Learning Materials)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/courses/:courseId/content` | List course content | Yes | All |
| GET | `/content/:id` | Get content by ID | Yes | All |
| POST | `/courses/:courseId/content` | Create content | Yes | teacher |
| PATCH | `/content/:id` | Update content | Yes | teacher |
| DELETE | `/content/:id` | Delete content | Yes | teacher |
| POST | `/content/:id/upload` | Upload content file | Yes | teacher |
| PATCH | `/content/:id/publish` | Publish/unpublish content | Yes | teacher |

### Homework

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/courses/:courseId/homework` | List course homework | Yes | All |
| GET | `/homework/:id` | Get homework by ID | Yes | All |
| POST | `/courses/:courseId/homework` | Create homework | Yes | teacher |
| PATCH | `/homework/:id` | Update homework | Yes | teacher |
| DELETE | `/homework/:id` | Delete homework | Yes | teacher |
| PATCH | `/homework/:id/publish` | Publish homework | Yes | teacher |
| GET | `/homework/:id/submissions` | Get all submissions | Yes | teacher |
| GET | `/students/:studentId/homework` | Get student homework | Yes | student, parent, teacher |

### Homework Submissions

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/homework/:homeworkId/submissions/:studentId` | Get student submission | Yes | student, teacher, parent |
| POST | `/homework/:homeworkId/submissions` | Create submission | Yes | student |
| PATCH | `/submissions/:id` | Update submission | Yes | student |
| POST | `/submissions/:id/submit` | Submit for grading | Yes | student |
| POST | `/submissions/:id/upload` | Upload file/image | Yes | student |
| POST | `/submissions/:id/drawing` | Save drawing data | Yes | student |
| PATCH | `/submissions/:id/grade` | Grade submission | Yes | teacher |
| GET | `/submissions/:id` | Get submission details | Yes | student, teacher, parent |

### Quizzes

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/courses/:courseId/quizzes` | List course quizzes | Yes | All |
| GET | `/quizzes/:id` | Get quiz by ID | Yes | All |
| POST | `/courses/:courseId/quizzes` | Create quiz | Yes | teacher |
| PATCH | `/quizzes/:id` | Update quiz | Yes | teacher |
| DELETE | `/quizzes/:id` | Delete quiz | Yes | teacher |
| PATCH | `/quizzes/:id/publish` | Publish quiz | Yes | teacher |
| GET | `/quizzes/:id/questions` | Get quiz questions | Yes | teacher, student |
| POST | `/quizzes/:id/questions` | Add question | Yes | teacher |
| PATCH | `/questions/:id` | Update question | Yes | teacher |
| DELETE | `/questions/:id` | Delete question | Yes | teacher |

### Quiz Submissions

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/quizzes/:quizId/start` | Start quiz attempt | Yes | student |
| POST | `/quizzes/:quizId/submit` | Submit quiz | Yes | student |
| GET | `/quizzes/:quizId/submissions/:studentId` | Get student submissions | Yes | student, teacher, parent |
| GET | `/submissions/:submissionId/result` | Get quiz result | Yes | student, teacher, parent |
| GET | `/quizzes/:quizId/results` | Get all quiz results | Yes | teacher |

## ERP Modules

### Attendance

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/classes/:classId/attendance` | Get class attendance | Yes | teacher, school_admin |
| POST | `/classes/:classId/attendance` | Mark attendance | Yes | teacher |
| PATCH | `/attendance/:id` | Update attendance | Yes | teacher |
| GET | `/students/:studentId/attendance` | Get student attendance | Yes | All |
| GET | `/attendance/report` | Attendance report | Yes | teacher, school_admin |
| GET | `/students/:studentId/attendance/summary` | Get attendance summary | Yes | All |

### Timetable

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/classes/:classId/timetable` | Get class timetable | Yes | All |
| POST | `/classes/:classId/timetable` | Create timetable entry | Yes | school_admin |
| PATCH | `/timetable/:id` | Update timetable | Yes | school_admin |
| DELETE | `/timetable/:id` | Delete timetable entry | Yes | school_admin |
| GET | `/teachers/:teacherId/timetable` | Get teacher schedule | Yes | teacher, school_admin |

### Staff Management

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/staff` | List school staff | Yes | school_admin |
| GET | `/staff/:id` | Get staff by ID | Yes | school_admin |
| POST | `/schools/:schoolId/staff` | Add staff member | Yes | school_admin |
| PATCH | `/staff/:id` | Update staff | Yes | school_admin |
| DELETE | `/staff/:id` | Remove staff | Yes | school_admin |
| GET | `/staff/:id/leaves` | Get staff leaves | Yes | school_admin, teacher |
| POST | `/staff/:id/leaves` | Apply for leave | Yes | teacher |

### Admissions

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/admissions` | List applications | Yes | school_admin |
| GET | `/admissions/:id` | Get application | Yes | school_admin |
| POST | `/schools/:schoolId/admissions` | Submit application | No | - |
| PATCH | `/admissions/:id` | Update application | Yes | school_admin |
| PATCH | `/admissions/:id/status` | Update status | Yes | school_admin |
| POST | `/admissions/:id/documents` | Upload documents | No | - |
| POST | `/admissions/:id/approve` | Approve admission | Yes | school_admin |
| POST | `/admissions/:id/reject` | Reject admission | Yes | school_admin |

### Fees

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/fees` | List fee structures | Yes | school_admin, parent |
| GET | `/fees/:id` | Get fee details | Yes | school_admin, parent |
| POST | `/schools/:schoolId/fees` | Create fee structure | Yes | school_admin |
| PATCH | `/fees/:id` | Update fee | Yes | school_admin |
| DELETE | `/fees/:id` | Delete fee | Yes | school_admin |
| GET | `/students/:studentId/fees` | Get student fees | Yes | school_admin, parent |

### Fee Payments

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/students/:studentId/payments` | Get payment history | Yes | school_admin, parent |
| GET | `/payments/:id` | Get payment details | Yes | school_admin, parent |
| POST | `/payments/initiate` | Initiate payment | Yes | parent, school_admin |
| POST | `/payments/verify` | Verify payment | Yes | parent, school_admin |
| POST | `/payments/webhook` | Razorpay webhook | No | - |
| GET | `/payments/:id/receipt` | Download receipt | Yes | school_admin, parent |
| GET | `/schools/:schoolId/payments/report` | Payment report | Yes | school_admin |

### Exams

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/exams` | List exams | Yes | All |
| GET | `/classes/:classId/exams` | List class exams | Yes | All |
| GET | `/exams/:id` | Get exam by ID | Yes | All |
| POST | `/classes/:classId/exams` | Create exam | Yes | school_admin |
| PATCH | `/exams/:id` | Update exam | Yes | school_admin |
| DELETE | `/exams/:id` | Delete exam | Yes | school_admin |

### Exam Marks

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/exams/:examId/marks` | Get all marks | Yes | teacher, school_admin |
| GET | `/exams/:examId/students/:studentId/marks` | Get student marks | Yes | All |
| POST | `/exams/:examId/marks` | Enter marks | Yes | teacher |
| PATCH | `/marks/:id` | Update marks | Yes | teacher |
| POST | `/exams/:examId/marks/bulk` | Bulk mark entry | Yes | teacher |

### Report Cards

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/students/:studentId/report-cards` | Get student reports | Yes | All |
| GET | `/report-cards/:id` | Get report card | Yes | All |
| POST | `/exams/:examId/report-cards/generate` | Generate reports | Yes | school_admin, teacher |
| GET | `/report-cards/:id/download` | Download PDF | Yes | All |
| PATCH | `/report-cards/:id` | Update remarks | Yes | teacher, school_admin |
| POST | `/report-cards/:id/send` | Email report card | Yes | teacher, school_admin |

## Communication

### Notifications

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/notifications` | Get user notifications | Yes | All |
| GET | `/notifications/:id` | Get notification | Yes | All |
| PATCH | `/notifications/:id/read` | Mark as read | Yes | All |
| PATCH | `/notifications/read-all` | Mark all as read | Yes | All |
| DELETE | `/notifications/:id` | Delete notification | Yes | All |
| GET | `/notifications/unread-count` | Get unread count | Yes | All |

### Announcements

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/announcements` | List announcements | Yes | All |
| GET | `/announcements/:id` | Get announcement | Yes | All |
| POST | `/schools/:schoolId/announcements` | Create announcement | Yes | school_admin, teacher |
| PATCH | `/announcements/:id` | Update announcement | Yes | school_admin, teacher |
| DELETE | `/announcements/:id` | Delete announcement | Yes | school_admin |
| PATCH | `/announcements/:id/publish` | Publish announcement | Yes | school_admin, teacher |

## Analytics & Reports

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/schools/:schoolId/analytics/dashboard` | School dashboard stats | Yes | school_admin |
| GET | `/classes/:classId/analytics/performance` | Class performance | Yes | teacher, school_admin |
| GET | `/students/:studentId/analytics/progress` | Student progress | Yes | All |
| GET | `/teachers/:teacherId/analytics/workload` | Teacher workload | Yes | teacher, school_admin |
| GET | `/schools/:schoolId/reports/attendance` | Attendance report | Yes | school_admin |
| GET | `/schools/:schoolId/reports/fees` | Fee collection report | Yes | school_admin |
| GET | `/schools/:schoolId/reports/academic` | Academic report | Yes | school_admin |

## File Management

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/files/upload` | Upload file | Yes | All |
| DELETE | `/files/:id` | Delete file | Yes | All |
| GET | `/files/:id/download` | Download file | Yes | All |
| POST | `/files/upload/bulk` | Bulk upload | Yes | All |

## Admin

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/admin/system/health` | System health check | Yes | super_admin |
| GET | `/admin/audit-logs` | View audit logs | Yes | super_admin, school_admin |
| GET | `/admin/stats/overview` | System overview | Yes | super_admin |
| POST | `/admin/cache/clear` | Clear cache | Yes | super_admin |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (e.g., "createdAt")
- `order`: Sort order ("asc" or "desc")
- `search`: Search query
- `filter`: Filter criteria (JSON encoded)

## Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Rate Limiting

- **Default**: 100 requests per minute
- **Auth endpoints**: 5 requests per minute
- **File uploads**: 10 requests per minute

## Webhooks

### Razorpay Webhook
- **URL**: `/api/v1/payments/webhook`
- **Events**: payment.captured, payment.failed, subscription.activated, etc.
- **Verification**: Razorpay signature verification

## API Versioning

Current version: `v1`

Future versions will be accessible via:
- `/api/v2/...`

## Deprecation Policy

- 6 months notice for breaking changes
- Deprecated endpoints marked in documentation
- Version support for at least 12 months
