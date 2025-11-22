# Alfanumrik SchoolOS - Backend API

NestJS-based backend for School ERP + LMS platform.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials and API keys
```

## Database Setup

```bash
# Create PostgreSQL database
createdb schoolos

# Run migrations (after creating them)
npm run migration:run
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api/v1`

## API Documentation

Swagger documentation available at: `http://localhost:3001/api/docs`

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── schools/           # School management
├── classes/           # Class management
├── courses/           # Course management
├── homework/          # Homework & submissions
├── quizzes/           # Quiz module
├── attendance/        # Attendance tracking
├── timetable/         # Timetable management
├── staff/             # Staff management
├── admissions/        # Admission applications
├── fees/              # Fee management
├── exams/             # Exam management
├── reports/           # Report cards
├── notifications/     # Notification system
├── announcements/     # Announcements
├── payments/          # Payment integration
├── common/            # Shared utilities
│   ├── decorators/    # Custom decorators
│   ├── guards/        # Auth guards
│   ├── filters/       # Exception filters
│   ├── interceptors/  # Response interceptors
│   ├── dto/           # Common DTOs
│   └── enums/         # Enums
└── database/          # Database config
```

## Key Features

- JWT-based authentication
- Role-based access control (RBAC)
- RESTful API endpoints
- OpenAPI/Swagger documentation
- PostgreSQL with TypeORM
- Input validation with class-validator
- Global exception handling
- Response transformation

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Deploy to Railway

1. Create Railway account
2. Create new project
3. Add PostgreSQL service
4. Add environment variables
5. Deploy from GitHub

### Deploy to Render

1. Create Render account
2. Create Web Service
3. Connect GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

## Environment Variables

See `.env.example` for all required variables.

## License

MIT
