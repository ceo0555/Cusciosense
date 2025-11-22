# Alfanumrik SchoolOS

A comprehensive School ERP + Adaptive LMS platform built with Next.js and NestJS.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Contributing](#contributing)

## ✨ Features

### School ERP
- **User Management**: Multi-role support (Super Admin, School Admin, Teacher, Student, Parent)
- **Admissions**: Student registration and enrollment management
- **Attendance**: Daily attendance tracking with reports
- **Fees Management**: Fee structures, payment processing, receipts
- **Timetable**: Class scheduling and teacher assignment
- **Staff Management**: Teacher profiles and performance tracking

### Learning Management System (LMS)
- **Course Management**: Class-wise courses with syllabus
- **Content Library**: Study materials (videos, PDFs, presentations)
- **Homework System**: 
  - Multiple submission types (text, drawing, images, PDFs)
  - Canvas for math/science problems
  - Teacher grading and feedback
- **Quizzes**: MCQ, true/false, short answer questions
- **Progress Tracking**: Student performance analytics

### Examination System
- **Exam Management**: Scheduling and configuration
- **Grade Entry**: Teacher grade input
- **Report Cards**: Automated PDF generation
- **Historical Records**: Past performance tracking

### Additional Features
- **Payment Integration**: Razorpay for fees and subscriptions
- **Notifications**: Email and in-app notifications
- **Analytics**: Comprehensive reports and dashboards
- **Multi-tenant**: Support for multiple schools

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Context
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Rich Text**: TipTap
- **Drawing**: React Canvas Draw

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Payments**: Razorpay SDK

### Database
- **Primary**: PostgreSQL 15+
- **Cache**: Redis (optional)

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / Railway
- **Version Control**: Git
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
schoolos/
├── backend/              # NestJS Backend API
│   ├── prisma/          # Database schema and migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # User management
│   │   ├── schools/     # School management
│   │   ├── classes/     # Class management
│   │   ├── homework/    # Homework system
│   │   ├── quizzes/     # Quiz system
│   │   ├── attendance/  # Attendance tracking
│   │   ├── exams/       # Examination system
│   │   ├── fees/        # Fee management
│   │   ├── common/      # Shared utilities
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .env.example
│
├── frontend/            # Next.js Frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── homework/
│   │   │   └── classes/
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts
│   │   ├── lib/        # Utilities and API client
│   │   └── styles/     # Global styles
│   ├── package.json
│   └── .env.example
│
├── ARCHITECTURE.md      # System architecture
├── DATABASE_SCHEMA.md   # Database design
├── API_ENDPOINTS.md     # API documentation
└── README.md           # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v15 or higher
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/schoolos.git
cd schoolos
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Required Environment Variables (.env):**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/schoolos?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="30d"

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="SchoolOS <noreply@schoolos.com>"

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=schoolos-files
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local file
nano .env.local
```

**Required Environment Variables (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=SchoolOS
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
```

## 🗄 Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE schoolos;

# Exit
\q
```

### 2. Run Migrations

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 3. Seed Database (Optional)

Create a seed file to populate initial data:

```bash
# Create seed file
touch prisma/seed.ts

# Add seed script to package.json
# Then run:
npm run seed
```

## 💻 Running Locally

### Start Backend Server

```bash
cd backend

# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Backend will run at: `http://localhost:3001`

API Documentation (Swagger): `http://localhost:3001/api/docs`

### Start Frontend Server

```bash
cd frontend

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will run at: `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render / Railway)

#### Using Render:

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install && npm run build && npx prisma generate`
   - **Start Command**: `cd backend && npm run start:prod`
   - **Environment**: Add all environment variables from `.env`
4. Create a PostgreSQL database on Render
5. Link database to your service
6. Deploy!

#### Using Railway:

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize project:
   ```bash
   cd backend
   railway init
   railway link
   ```
4. Add PostgreSQL database: `railway add postgresql`
5. Set environment variables: `railway variables set KEY=value`
6. Deploy: `railway up`

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy:
   ```bash
   cd frontend
   vercel
   ```
3. Or use Vercel Dashboard:
   - Import GitHub repository
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Add environment variables
   - Deploy!

### Environment Variables for Production

**Backend (Render/Railway):**
- Update `DATABASE_URL` with production database
- Change `NODE_ENV` to `production`
- Update `FRONTEND_URL` to your Vercel domain
- Set strong secrets for JWT keys

**Frontend (Vercel):**
- Update `NEXT_PUBLIC_API_URL` to your backend URL
- Add production Razorpay keys

## 📚 API Documentation

Once the backend is running, visit:
- **Local**: http://localhost:3001/api/docs
- **Production**: https://your-backend-url.com/api/docs

Full API documentation is available in [API_ENDPOINTS.md](./API_ENDPOINTS.md)

### Quick API Examples

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone": "admin@school.com", "password": "password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 User Roles

### 1. Super Admin
- Full system access
- Manage all schools
- View cross-school analytics
- Configure platform settings

### 2. School Admin
- Manage school configuration
- Add/remove teachers, students, parents
- Configure academic calendar
- View school-wide reports
- Manage fees & subscriptions

### 3. Teacher
- Manage assigned classes
- Create & grade homework
- Record attendance
- Enter exam marks
- Upload study materials
- Communicate with students & parents

### 4. Student
- View class schedule
- Access course materials
- Submit homework (text, drawing, images, PDFs)
- Take quizzes
- View grades & report cards
- Receive notifications

### 5. Parent
- View child's academic progress
- View attendance records
- Communicate with teachers
- Pay fees online
- Receive notifications

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Test coverage
npm run test:coverage
```

## 🔒 Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Data Protection**: Input validation and sanitization
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Never commit secrets to Git
6. **Database**: Use connection pooling and parameterized queries
7. **File Uploads**: Validate file types and sizes
8. **Rate Limiting**: Implemented on API endpoints

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

**Port Already in Use:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Frontend Issues

**API Connection Error:**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📈 Performance Optimization

- **Database**: Use indexes on frequently queried fields
- **Caching**: Implement Redis for session storage
- **CDN**: Use Cloudinary/S3 for static assets
- **Code Splitting**: Implemented in Next.js
- **Lazy Loading**: For images and heavy components
- **API Pagination**: Limit results to 20-50 per page

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Team

**Alfanumrik** - School Management Solutions

## 📧 Support

For support, email: support@schoolos.com

## 🙏 Acknowledgments

- NestJS Team
- Next.js Team
- Prisma Team
- All open-source contributors

---

**Built with ❤️ by Alfanumrik**
