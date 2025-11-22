# Alfanumrik SchoolOS - System Architecture

## Overview
Full-featured School ERP + Adaptive Learning Management System (LMS) portal designed for educational institutions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (Vercel)                     │  │
│  │  - SSR/SSG Pages                                      │  │
│  │  - Tailwind CSS                                       │  │
│  │  - Role-based UI                                      │  │
│  │  - Real-time notifications                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │ WebSocket (notifications)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Application Layer (Backend)                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      NestJS Backend (Render/Railway)                  │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ Auth Module  │  │ School Module│  │ LMS Module │ │  │
│  │  │ - JWT        │  │ - Admissions │  │ - Courses  │ │  │
│  │  │ - RBAC       │  │ - Attendance │  │ - Homework │ │  │
│  │  │ - Sessions   │  │ - Fees       │  │ - Quizzes  │ │  │
│  │  └──────────────┘  │ - Timetable  │  │ - Content  │ │  │
│  │                     └──────────────┘  └────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ User Module  │  │ Exam Module  │  │ Payment    │ │  │
│  │  │ - Students   │  │ - Grades     │  │ - Razorpay │ │  │
│  │  │ - Teachers   │  │ - Reports    │  │ - Subscr.  │ │  │
│  │  │ - Parents    │  │ - Analytics  │  │ - Invoices │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐                  │  │
│  │  │ Notification │  │ File Storage │                  │  │
│  │  │ - Email      │  │ - S3/Cloudry │                  │  │
│  │  │ - In-app     │  │ - PDFs       │                  │  │
│  │  │ - WebSocket  │  │ - Images     │                  │  │
│  │  └──────────────┘  └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ TypeORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            PostgreSQL Database                        │  │
│  │  - User data                                          │  │
│  │  - School data                                        │  │
│  │  - Academic data                                      │  │
│  │  - Transactional data                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 External Services                            │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │  Razorpay   │  │   SMTP      │  │  File Storage    │    │
│  │  (Payments) │  │   (Email)   │  │  (AWS S3/Cloud)  │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## User Roles & Access Matrix

| Feature | Super Admin | School Admin | Teacher | Student | Parent |
|---------|-------------|--------------|---------|---------|--------|
| Manage Schools | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Schools | ✅ | ❌ | ❌ | ❌ | ❌ |
| School Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Staff | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Students | ✅ | ✅ | ✅ (view) | ❌ | ❌ |
| Admissions | ✅ | ✅ | ❌ | ❌ | ❌ |
| Attendance | ✅ | ✅ | ✅ | ✅ (view) | ✅ (view) |
| Timetable | ✅ | ✅ | ✅ (view) | ✅ (view) | ✅ (view) |
| Create Courses | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Courses | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assign Homework | ✅ | ✅ | ✅ | ❌ | ❌ |
| Submit Homework | ❌ | ❌ | ❌ | ✅ | ❌ |
| Grade Homework | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Exams | ✅ | ✅ | ✅ | ❌ | ❌ |
| Enter Grades | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Report Cards | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Fees | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pay Fees | ❌ | ❌ | ❌ | ✅ | ✅ |
| System Payments | ✅ | ✅ | ❌ | ❌ | ❌ |

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts / Chart.js
- **Real-time**: Socket.io-client
- **File Upload**: react-dropzone
- **PDF Generation**: react-pdf / jsPDF
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **File Upload**: Multer
- **Payment**: Razorpay SDK
- **Email**: Nodemailer
- **Real-time**: Socket.io
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Render / Railway

### Database
- **Primary**: PostgreSQL 15+
- **Features**: JSONB, Full-text search, Triggers

## Security Features

1. **Authentication**
   - JWT-based authentication
   - Refresh token mechanism
   - Password hashing (bcrypt)
   - Email/Phone verification

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - Route guards on frontend and backend

3. **Data Security**
   - SQL injection prevention (parameterized queries)
   - XSS protection
   - CSRF tokens
   - Rate limiting
   - Input validation and sanitization

4. **API Security**
   - HTTPS only
   - CORS configuration
   - API rate limiting
   - Request validation

## Performance Optimizations

1. **Frontend**
   - Server-side rendering (SSR)
   - Static site generation (SSG) for public pages
   - Image optimization (Next.js Image)
   - Code splitting
   - Lazy loading
   - CDN for static assets

2. **Backend**
   - Database indexing
   - Query optimization
   - Caching (Redis optional)
   - Pagination
   - Compression

3. **Database**
   - Proper indexing
   - Connection pooling
   - Query optimization
   - Foreign key constraints

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Load balancer ready
   - Session management via JWT

2. **Database Scaling**
   - Read replicas support
   - Connection pooling
   - Query optimization

3. **File Storage**
   - External storage (S3/Cloudinary)
   - CDN integration

## Monitoring & Logging

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - API analytics

2. **Logging**
   - Structured logging
   - Log levels (error, warn, info, debug)
   - Log aggregation

## Development Workflow

1. **Version Control**: Git + GitHub
2. **Branching Strategy**: GitFlow
3. **CI/CD**: GitHub Actions
4. **Testing**: Jest + Supertest
5. **Code Quality**: ESLint + Prettier
6. **Documentation**: Markdown + Swagger

## Deployment Architecture

### Production Environment

```
Frontend (Vercel)
├── Auto-deployment from main branch
├── Environment variables
├── Custom domain
└── CDN + Edge caching

Backend (Render/Railway)
├── Docker container
├── Auto-deployment from main branch
├── Environment variables
├── Database connection
└── Health checks

Database (Managed PostgreSQL)
├── Automated backups
├── Connection pooling
├── SSL connections
└── Monitoring
```

## Data Flow Examples

### 1. Student Submitting Homework
```
Student Browser
    → Next.js Frontend (Upload files)
    → NestJS API (POST /homework/submit)
    → File Storage (Upload to S3)
    → PostgreSQL (Save metadata)
    → WebSocket (Notify teacher)
    → Response to Student
```

### 2. Payment Processing
```
Parent Browser
    → Next.js Frontend (Initiate payment)
    → NestJS API (POST /payments/create)
    → Razorpay API (Create order)
    → Razorpay Checkout (Process payment)
    → Webhook (Payment confirmation)
    → PostgreSQL (Update fee status)
    → Email Notification (Receipt)
    → Response to Parent
```

### 3. Report Card Generation
```
Teacher Dashboard
    → Next.js Frontend (Request report)
    → NestJS API (GET /reports/:studentId)
    → PostgreSQL (Fetch grades, attendance)
    → PDF Generator (Create report)
    → File Storage (Store PDF)
    → Response with PDF URL
    → Download/View in Browser
```
