# Alfanumrik SchoolOS

A comprehensive School ERP + LMS (Learning Management System) portal built with modern technologies.

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) - System architecture and design
- [Database Schema](./DATABASE_SCHEMA.md) - Complete database structure
- [API Endpoints](./API_ENDPOINTS.md) - Full API documentation

## 🚀 Features

### Core Modules

- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **Multi-tenant SaaS**: Support for multiple schools with data isolation
- **User Management**: Super Admin, School Admin, Teacher, Student, Parent roles

### School ERP Features

- **Admissions Management**: Online admission applications and approval workflow
- **Student Information System**: Complete student profiles and records
- **Staff Management**: Teacher and staff profiles with qualifications
- **Attendance Tracking**: Digital attendance with reports and analytics
- **Fee Management**: Fee structures, online payments, receipt generation
- **Timetable Management**: Class schedules and room allocation
- **Academic Year & Classes**: Flexible class and section management

### LMS Features

- **Course Management**: Create and organize course content
- **Content Delivery**: Video, documents, PDFs, and text-based content
- **Homework System**: 
  - Text-based submissions
  - Drawing canvas for hand-drawn answers
  - Image and PDF uploads
  - Mixed-format submissions
- **Quiz System**: MCQ quizzes with auto-grading
- **Exam Management**: Schedule exams, enter marks, generate report cards
- **Report Cards**: Automated PDF report generation with grades

### Additional Features

- **Payments Integration**: Razorpay integration for school subscriptions and fees
- **Notifications**: Email and in-app notifications
- **File Upload**: Support for images, PDFs, and documents
- **Analytics Dashboard**: Performance metrics and insights

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: NestJS
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Passport.js + JWT
- **Validation**: Class-validator
- **File Upload**: Multer
- **PDF Generation**: PDFKit

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: Managed PostgreSQL
- **File Storage**: AWS S3 / Cloudinary
- **Email**: SendGrid / Nodemailer

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/schoolos?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@schoolos.com

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=schoolos-files

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Alfanumrik SchoolOS
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
4. Deploy

### Backend (Railway / Render)

#### Railway

1. Create new project in Railway
2. Add PostgreSQL database
3. Add your backend repository
4. Set all environment variables
5. Deploy

#### Render

1. Create new Web Service
2. Connect your repository
3. Add PostgreSQL database
4. Set environment variables
5. Add build command: `npm install && npm run build && npm run prisma:generate && npm run prisma:migrate`
6. Add start command: `npm run start:prod`
7. Deploy

### Database Migration

```bash
# Production migration
npm run prisma:migrate deploy
```

## 📖 Usage

### User Roles

#### Super Admin
- Manage all schools
- View system-wide analytics
- Manage subscriptions

#### School Admin
- Manage school settings
- Add/manage staff and teachers
- Configure academic year and classes
- View school reports
- Manage admissions and fees

#### Teacher
- Manage assigned classes
- Mark attendance
- Create and grade homework/quizzes
- Enter exam marks
- View student progress

#### Student
- View courses and content
- Submit homework (text, drawing, upload)
- Take quizzes and exams
- View grades and report cards
- Receive notifications

#### Parent
- View child's progress
- View attendance and grades
- Pay fees online
- Receive notifications

### Default Login Credentials

For testing purposes (create these users after setup):

```
Super Admin: admin@schoolos.com / admin123
School Admin: school@schoolos.com / school123
Teacher: teacher@schoolos.com / teacher123
Student: student@schoolos.com / student123
```

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

# Run tests
npm run test
```

## 📁 Project Structure

```
schoolos/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── schools/
│   │   │   ├── academic/
│   │   │   ├── staff/
│   │   │   ├── students/
│   │   │   ├── attendance/
│   │   │   ├── lms/
│   │   │   ├── homework/
│   │   │   ├── quiz/
│   │   │   ├── exams/
│   │   │   ├── fees/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   └── file-upload/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   ├── school-admin/
│   │   │   └── super-admin/
│   │   ├── components/
│   │   │   └── Layout/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   └── store/
│   └── package.json
├── ARCHITECTURE.md
├── DATABASE_SCHEMA.md
├── API_ENDPOINTS.md
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Support

For support, email support@alfanumrik.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Advanced analytics and reporting
- [ ] Parent-teacher communication module
- [ ] Library management system
- [ ] Transport management
- [ ] Hostel management
- [ ] AI-powered learning recommendations

## 📞 Contact

- Website: https://alfanumrik.com
- Email: contact@alfanumrik.com
- Twitter: @alfanumrik

---

Built with ❤️ by Alfanumrik Team
