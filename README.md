# Alfanumrik SchoolOS

A comprehensive School ERP + Adaptive LMS platform built with Next.js and NestJS.

## 🚀 Features

### School ERP
- **School Management**: Multi-school support with separate admin dashboards
- **Admissions**: Online admission applications and management
- **Student Management**: Complete student profiles and enrollment tracking
- **Teacher & Staff**: Employee management with roles and permissions
- **Attendance**: Digital attendance marking and tracking
- **Timetable**: Class scheduling and teacher allocation
- **Fee Management**: Fee structures, payment tracking, and receipts
- **Report Cards**: Digital report card generation with PDF export

### Learning Management System (LMS)
- **Courses**: Class-wise subject management
- **Content Delivery**: Video, PDF, documents, and multimedia content
- **Homework System**: 
  - Text submissions
  - Drawing/sketching tool
  - File uploads (images, PDFs)
  - Auto-grading support
- **Quizzes & Tests**: MCQ, true/false, short answer formats
- **Exams**: Comprehensive exam management with grade tracking
- **Progress Analytics**: Student performance tracking and insights

### User Roles
1. **Super Admin**: System-wide management
2. **School Admin**: School-level administration
3. **Teacher**: Course and student management
4. **Student**: Learning and submissions
5. **Parent**: Progress monitoring and communication

### Additional Features
- **Authentication**: Email/phone login with JWT
- **Payments**: Razorpay integration for fee collection
- **Notifications**: Email and in-app notifications
- **Announcements**: School-wide and class-specific announcements
- **Analytics**: Comprehensive dashboards and reports

## 📁 Project Structure

```
alfanumrik-schoolos/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── schools/        # School management
│   │   ├── classes/        # Class management
│   │   ├── courses/        # Course management
│   │   ├── homework/       # Homework & submissions
│   │   ├── quizzes/        # Quiz management
│   │   ├── attendance/     # Attendance tracking
│   │   ├── timetable/      # Timetable management
│   │   ├── staff/          # Staff management
│   │   ├── admissions/     # Admission applications
│   │   ├── fees/           # Fee management
│   │   ├── exams/          # Exam management
│   │   ├── reports/        # Report cards
│   │   ├── notifications/  # Notifications
│   │   ├── announcements/  # Announcements
│   │   ├── payments/       # Payment integration
│   │   └── common/         # Shared utilities
│   ├── package.json
│   └── README.md
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js pages (App Router)
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles
│   ├── package.json
│   └── README.md
│
├── ARCHITECTURE.md         # System architecture
├── DATABASE_SCHEMA.md      # Database design
├── API_ENDPOINTS.md        # API documentation
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **API Docs**: Swagger/OpenAPI
- **File Upload**: Multer + AWS S3
- **Email**: NodeMailer
- **Payment**: Razorpay

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI + Custom
- **HTTP Client**: Axios
- **Icons**: Heroicons

### Database
- **RDBMS**: PostgreSQL 15+
- **Migrations**: TypeORM migrations

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git
- AWS S3 account (for file storage)
- Razorpay account (for payments)
- SMTP server or SendGrid (for emails)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd alfanumrik-schoolos
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env with your credentials:
# - Database credentials
# - JWT secrets
# - AWS S3 credentials
# - Razorpay keys
# - Email SMTP settings

# Create database
createdb schoolos

# Run migrations (after creating them)
npm run migration:run

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Edit .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open `http://localhost:3000` in your browser.

#### Default Super Admin (Create manually in database)
```sql
-- You'll need to create the first super admin user manually
-- Or use the registration endpoint and assign super_admin role
```

## 📝 Environment Variables

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=schoolos

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=7d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=schoolos-files

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-password
MAIL_FROM=noreply@schoolos.com

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

## 🗄️ Database Setup

### Create Database

```bash
# Using PostgreSQL command line
createdb schoolos

# Or using psql
psql -U postgres
CREATE DATABASE schoolos;
```

### Run Migrations

```bash
cd backend
npm run migration:run
```

### Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema documentation.

## 📚 API Documentation

Once the backend is running, access Swagger documentation at:
```
http://localhost:3001/api/docs
```

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for detailed API documentation.

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture.

## 🚢 Deployment

### Backend Deployment (Railway/Render)

#### Railway
1. Create Railway account
2. Create new project
3. Add PostgreSQL service
4. Connect GitHub repository
5. Add environment variables
6. Deploy

#### Render
1. Create Render account
2. Create Web Service
3. Connect GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
cd frontend
vercel
```

### Environment Variables for Production

Make sure to update all environment variables with production values:
- Database connection strings
- API URLs (https)
- Production secrets
- Production Razorpay keys
- Production AWS S3 bucket

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests (when configured)
npm run test
```

## 🔧 Development

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

## 📖 Additional Documentation

- [System Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Endpoints](./API_ENDPOINTS.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue in GitHub
- Contact: support@alfanumrik.com

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core ERP features
- ✅ LMS with homework system
- ✅ Authentication & roles
- ✅ Basic dashboards

### Phase 2 (Planned)
- [ ] Advanced analytics with AI insights
- [ ] Mobile apps (React Native)
- [ ] Video conferencing integration
- [ ] Multi-language support
- [ ] Advanced reporting

### Phase 3 (Future)
- [ ] Blockchain certificates
- [ ] Adaptive learning paths
- [ ] Gamification
- [ ] Parent-teacher chat
- [ ] Integration marketplace

## 👥 Team

Built by Alfanumrik

---

**Note**: This is a production-ready starter template. You may need to customize features based on specific school requirements.
