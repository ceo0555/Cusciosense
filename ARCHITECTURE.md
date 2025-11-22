# Alfanumrik SchoolOS - System Architecture

## Overview
Alfanumrik SchoolOS is a comprehensive School ERP + Adaptive LMS platform designed for modern educational institutions.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js Frontend (Vercel)                   │  │
│  │  - Server-side rendering (SSR)                        │  │
│  │  - Static generation for public pages                 │  │
│  │  - Tailwind CSS for styling                           │  │
│  │  - Role-based UI components                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        NestJS Backend API (Render/Railway)            │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Authentication & Authorization Module         │  │  │
│  │  │  - JWT-based auth                              │  │  │
│  │  │  - Role-based access control (RBAC)            │  │  │
│  │  │  - Email/Phone OTP login                       │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  ERP Modules                                   │  │  │
│  │  │  - School Management                           │  │  │
│  │  │  - Admissions & Enrollments                    │  │  │
│  │  │  - Attendance Management                       │  │  │
│  │  │  - Fee Management                              │  │  │
│  │  │  - Timetable & Scheduling                      │  │  │
│  │  │  - Staff Management                            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  LMS Modules                                   │  │  │
│  │  │  - Course Management                           │  │  │
│  │  │  - Homework System (text, draw, upload)        │  │  │
│  │  │  - Content Library                             │  │  │
│  │  │  - Quiz & Assessment Engine                    │  │  │
│  │  │  - Exam Management                             │  │  │
│  │  │  - Report Cards (PDF generation)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Payment Module                                │  │  │
│  │  │  - Razorpay Integration                        │  │  │
│  │  │  - Subscription Management                     │  │  │
│  │  │  - Invoice Generation                          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Notification Module                           │  │  │
│  │  │  - Email notifications (SMTP/SendGrid)         │  │  │
│  │  │  - In-app notifications                        │  │  │
│  │  │  - Push notifications (future)                 │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                      │  │
│  │  - User & Role Management                             │  │
│  │  - School & Class Data                                │  │
│  │  - Academic Records                                   │  │
│  │  - LMS Content & Submissions                          │  │
│  │  - Payment & Transaction Records                      │  │
│  │  - Audit Logs                                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  - Razorpay (Payments)                                      │
│  - SendGrid/AWS SES (Email)                                 │
│  - AWS S3/Cloudinary (File Storage)                         │
│  - Twilio (SMS/OTP - optional)                              │
└─────────────────────────────────────────────────────────────┘
```

## User Roles & Permissions

### 1. Super Admin
- Full system access
- Manage all schools
- View analytics across all schools
- Manage subscriptions and payments
- System configuration

### 2. School Admin
- Manage their school data
- Manage teachers, students, and staff
- Configure school settings
- View school-level analytics
- Manage admissions and fees

### 3. Teacher
- Manage assigned classes
- Create and grade assignments/homework
- Mark attendance
- Conduct quizzes and exams
- Generate report cards
- Communicate with students and parents

### 4. Student
- View courses and content
- Submit homework (write, draw, upload)
- Take quizzes and exams
- View grades and report cards
- View attendance
- Access learning materials

### 5. Parent
- View child's progress
- View attendance and grades
- View report cards
- Receive notifications
- Pay fees online
- Communicate with teachers

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3
- **State Management**: React Context + React Query
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Headless UI + Radix UI
- **Charts**: Recharts
- **File Upload**: react-dropzone
- **Drawing**: react-canvas-draw or Excalidraw
- **PDF Generation**: @react-pdf/renderer
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS v10
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL 15+
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI
- **File Upload**: Multer + AWS S3
- **Email**: NodeMailer + SendGrid
- **Payment**: Razorpay SDK
- **PDF Generation**: PDFKit or Puppeteer
- **Caching**: Redis (optional)

### Database
- **RDBMS**: PostgreSQL 15+
- **Migrations**: TypeORM migrations
- **Connection Pooling**: pg
- **Backup**: Automated daily backups

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / Railway
- **Database Hosting**: Railway / Supabase / Neon
- **File Storage**: AWS S3 / Cloudinary
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Logging**: Winston + LogTail

## Security Considerations

1. **Authentication**
   - JWT tokens with refresh tokens
   - Secure password hashing (bcrypt)
   - OTP-based phone verification
   - Session management

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - API endpoint guards

3. **Data Protection**
   - SQL injection prevention (ORM)
   - XSS protection
   - CSRF tokens
   - Rate limiting
   - Input validation and sanitization

4. **File Upload Security**
   - File type validation
   - Size limits
   - Virus scanning
   - Secure storage

5. **Payment Security**
   - PCI DSS compliance via Razorpay
   - Webhook signature verification
   - Encrypted transaction logs

## Scalability Strategy

1. **Horizontal Scaling**: Backend can scale via container replication
2. **Database Optimization**: Indexes, query optimization, connection pooling
3. **Caching**: Redis for session data and frequently accessed data
4. **CDN**: Static assets served via Vercel Edge Network
5. **File Storage**: External S3 bucket for scalable storage
6. **Microservices**: Future split into notification, payment, and analytics services

## API Design Principles

1. **RESTful** conventions
2. **Versioned** APIs (/api/v1/...)
3. **Consistent** response format
4. **Paginated** list endpoints
5. **Filtered** and **Sorted** data support
6. **Comprehensive** error handling
7. **OpenAPI/Swagger** documentation

## Data Flow Examples

### Student Submitting Homework
```
Student → Next.js UI → Upload file/drawing
         ↓
      Validate client-side
         ↓
      POST /api/v1/homework/submissions
         ↓
      NestJS Backend → Validate auth & permissions
         ↓
      Upload to S3 → Store metadata in PostgreSQL
         ↓
      Send notification to teacher
         ↓
      Return success response → Update UI
```

### Teacher Generating Report Card
```
Teacher → Select student & term
         ↓
      GET /api/v1/reports/student/:id?term=1
         ↓
      Backend fetches: grades, attendance, remarks
         ↓
      Generate PDF using template
         ↓
      Store PDF in S3
         ↓
      Send notification to student/parent
         ↓
      Return PDF URL → Display/Download
```

## Module Dependency Graph

```
┌─────────────┐
│    Auth     │ (Core - all modules depend on this)
└─────────────┘
       ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │ ←── │   School    │ ←── │  Admission  │
└─────────────┘     └─────────────┘     └─────────────┘
       ↓                   ↓                    ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Class     │ ←── │   Course    │ ←── │  Homework   │
└─────────────┘     └─────────────┘     └─────────────┘
       ↓                   ↓                    ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Attendance  │     │    Quiz     │     │    Exam     │
└─────────────┘     └─────────────┘     └─────────────┘
       ↓                   ↓                    ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Timetable  │     │   Report    │     │   Payment   │
└─────────────┘     └─────────────┘     └─────────────┘
                           ↓
                    ┌─────────────┐
                    │Notification │
                    └─────────────┘
```

## Performance Targets

- **API Response Time**: < 200ms (95th percentile)
- **Page Load Time**: < 2s (initial load)
- **Database Query Time**: < 50ms (average)
- **File Upload**: Support up to 50MB files
- **Concurrent Users**: 10,000+ per school
- **Uptime**: 99.9% SLA

## Future Enhancements

1. **AI/ML Features**
   - Adaptive learning paths
   - Student performance prediction
   - Automated grading for essays

2. **Mobile Apps**
   - React Native iOS/Android apps

3. **Video Conferencing**
   - Integrated virtual classrooms

4. **Advanced Analytics**
   - Predictive analytics dashboard
   - Student behavior insights

5. **Multi-language Support**
   - i18n for global markets

6. **Blockchain**
   - Immutable certificate generation
