# Alfanumrik SchoolOS - System Architecture

## Overview
Full-featured School ERP + Adaptive LMS portal for multi-tenant school management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Web App      │  │ Mobile View  │  │ Admin Panel  │      │
│  │ (Next.js)    │  │ (Responsive) │  │ (Super Admin)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         NestJS Backend (Node.js)                     │   │
│  │  - Authentication & Authorization (JWT)              │   │
│  │  - Role-based Access Control (RBAC)                  │   │
│  │  - Rate Limiting & Security                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
┌───────────▼─────┐ ┌──────▼──────┐ ┌─────▼─────────┐
│  Business Logic │ │  Services   │ │  External APIs│
│                 │ │             │ │               │
│  - Auth Module  │ │  - Email    │ │  - Razorpay   │
│  - School ERP   │ │  - SMS      │ │  - Storage    │
│  - LMS Module   │ │  - PDF Gen  │ │  - Email      │
│  - Exam Module  │ │  - File Mgmt│ │               │
│  - Payment Mod  │ │             │ │               │
└─────────────────┘ └─────────────┘ └───────────────┘
            │
┌───────────▼─────────────────────────────────────────┐
│              Data Access Layer                       │
│  ┌────────────────────────────────────────────┐     │
│  │         Prisma ORM                         │     │
│  └────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────┐
│              PostgreSQL Database                     │
│  - Schools, Users, Classes, Courses                  │
│  - Attendance, Fees, Timetables                      │
│  - Homework, Exams, Report Cards                     │
│  - Payments, Notifications                           │
└──────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend (Next.js + Tailwind CSS)
- **App Router**: Modern Next.js 14+ routing
- **Authentication**: JWT-based with HTTP-only cookies
- **State Management**: React Context + Server Components
- **UI Components**: Custom components with Tailwind
- **File Upload**: Multi-format support (images, PDFs, documents)
- **Drawing Canvas**: HTML5 canvas for homework
- **Responsive Design**: Mobile-first approach

### 2. Backend (NestJS)
- **Modular Architecture**: Separated concerns by domain
- **Authentication**: Passport.js + JWT strategy
- **Authorization**: Role-based guards (RBAC)
- **Validation**: Class-validator + DTOs
- **Error Handling**: Global exception filters
- **Logging**: Winston logger
- **File Storage**: Multer + Cloud storage integration

### 3. Database (PostgreSQL + Prisma)
- **Multi-tenancy**: School-based data isolation
- **Relationships**: Proper foreign keys and cascades
- **Indexes**: Optimized for common queries
- **Soft Deletes**: Data retention policy
- **Audit Trail**: Created/updated timestamps

## User Roles & Permissions

### Super Admin
- Manage all schools
- View analytics across schools
- Manage subscriptions and payments
- System-wide configuration

### School Admin
- Manage school profile
- Manage staff and teachers
- Configure academic year and classes
- View school-wide reports
- Manage fees and admissions

### Teacher
- Manage assigned classes
- Mark attendance
- Create and grade homework/quizzes
- Enter exam marks
- View student progress

### Student
- View courses and content
- Submit homework (write, draw, upload)
- Take quizzes and exams
- View grades and report cards
- Receive notifications

### Parent
- View child's progress
- View attendance and grades
- Pay fees online
- Receive notifications
- Communicate with teachers

## Security Considerations

1. **Authentication**: JWT tokens with refresh token rotation
2. **Authorization**: Role-based access control at route level
3. **Data Isolation**: Multi-tenant data segregation
4. **Input Validation**: DTO validation on all inputs
5. **Rate Limiting**: API rate limiting per user/IP
6. **HTTPS**: All communications encrypted
7. **File Upload**: Virus scanning and type validation
8. **SQL Injection**: Prisma ORM prevents SQL injection
9. **XSS Protection**: Content sanitization
10. **CORS**: Configured for specific origins

## Scalability Strategy

1. **Horizontal Scaling**: Stateless backend services
2. **Database Optimization**: Indexes, query optimization
3. **Caching**: Redis for session and frequently accessed data
4. **CDN**: Static assets served via CDN
5. **Load Balancing**: Multiple backend instances
6. **Database Replication**: Read replicas for reporting

## Deployment Architecture

### Production Setup
```
Vercel (Frontend)
    │
    ├── Next.js App
    ├── Static Assets
    └── Edge Functions

Railway/Render (Backend)
    │
    ├── NestJS API (Multiple instances)
    ├── Redis (Cache)
    └── Background Jobs

Database
    │
    └── PostgreSQL (Managed service)

External Services
    │
    ├── Razorpay (Payments)
    ├── AWS S3 (File Storage)
    └── SendGrid (Email)
```

## Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend Framework | Next.js 14+ |
| UI Library | Tailwind CSS |
| Backend Framework | NestJS |
| Runtime | Node.js 18+ |
| Database | PostgreSQL 14+ |
| ORM | Prisma |
| Authentication | JWT + Passport.js |
| File Storage | AWS S3 / Cloudinary |
| Payment Gateway | Razorpay |
| Email Service | SendGrid / Nodemailer |
| PDF Generation | PDFKit / Puppeteer |
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Railway / Render |
| Version Control | Git |

## Development Workflow

1. **Local Development**: 
   - Frontend: `localhost:3000`
   - Backend: `localhost:5000`
   - Database: PostgreSQL on `localhost:5432`

2. **Testing**: 
   - Unit tests with Jest
   - E2E tests with Playwright
   - API tests with Supertest

3. **CI/CD**:
   - GitHub Actions
   - Automated testing
   - Deployment on merge to main

## Monitoring & Analytics

1. **Application Monitoring**: Sentry for error tracking
2. **Performance**: Vercel Analytics
3. **Logs**: Winston + CloudWatch
4. **Database**: Query performance monitoring
5. **Usage Analytics**: Custom dashboard
