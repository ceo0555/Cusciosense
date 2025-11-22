# Quick Start Guide - Alfanumrik SchoolOS

Get up and running with SchoolOS in 10 minutes!

## Prerequisites

Make sure you have installed:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ PostgreSQL 15+ ([Download](https://www.postgresql.org/download/))
- ✅ Git ([Download](https://git-scm.com/))

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd alfanumrik-schoolos

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

## Step 2: Database Setup (2 minutes)

```bash
# Create database
createdb schoolos

# Or using psql
psql -U postgres
CREATE DATABASE schoolos;
\q
```

## Step 3: Configure Backend (2 minutes)

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with minimal required values:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your-postgres-password
# DB_DATABASE=schoolos
# JWT_SECRET=your-secret-key-min-32-characters
# JWT_REFRESH_SECRET=another-secret-key-min-32-chars

# For local development, you can skip AWS, Razorpay, and Email config for now
```

**Quick `.env` for development:**

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=schoolos

JWT_SECRET=dev-secret-key-change-in-production-min-32-chars
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-prod-min-32-chars
JWT_REFRESH_EXPIRATION=7d

FRONTEND_URL=http://localhost:3000
```

## Step 4: Configure Frontend (1 minute)

```bash
cd ../frontend

# Copy environment file
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**Quick `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Step 5: Start Development Servers (1 minute)

### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

Wait for message: `🚀 Application is running on: http://localhost:3001/api/v1`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Wait for message: `Ready on http://localhost:3000`

## Step 6: Access the Application (1 minute)

1. Open browser: `http://localhost:3000`
2. Click "Get Started" or "Login"
3. Register a new account
4. You're in! 🎉

## Step 7: Create First Super Admin (Optional)

If you need super admin access:

```bash
# Option 1: Register normally, then update in database
# After registration, get your user ID and run:

psql schoolos

INSERT INTO user_roles (user_id, role, is_primary)
VALUES ('your-user-id-here', 'super_admin', true);
```

Or manually set the role via a database client.

## What You Can Do Now

### As a User (Default)
- ✅ View dashboard
- ✅ Explore the interface
- ✅ See sample data

### After Assigning Roles
- 🏫 **School Admin**: Manage school, add teachers/students
- 👨‍🏫 **Teacher**: Create courses, homework, grade submissions
- 👨‍🎓 **Student**: Submit homework, take quizzes
- 👨‍👩‍👧 **Parent**: View child's progress

## Common Development Tasks

### View API Documentation

```bash
# Start backend, then visit:
http://localhost:3001/api/docs
```

### Reset Database

```bash
dropdb schoolos
createdb schoolos
cd backend
npm run migration:run
```

### View Database

```bash
psql schoolos

# Useful commands:
\dt          # List tables
\d users     # Describe users table
SELECT * FROM users;
```

## Troubleshooting

### Backend Won't Start

**Issue**: Database connection error

```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep schoolos

# Verify credentials in .env match PostgreSQL setup
```

**Issue**: Port 3001 already in use

```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or change PORT in backend/.env
```

### Frontend Won't Start

**Issue**: Port 3000 already in use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or start on different port
npm run dev -- -p 3001
```

**Issue**: API connection errors

- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Database Issues

**Issue**: "relation does not exist"

```bash
# Run migrations
cd backend
npm run migration:run
```

**Issue**: Can't create database

```bash
# Check PostgreSQL is running
sudo service postgresql status

# Start if needed
sudo service postgresql start
```

## Next Steps

### Development Workflow

1. **Add Sample Data**
   - Create a school via API or UI
   - Add classes, courses
   - Create sample students and teachers

2. **Test Features**
   - Try creating homework
   - Test file uploads (configure S3 for production)
   - Test notifications (configure email for production)

3. **Customize**
   - Modify UI components in `frontend/src/components`
   - Add new API endpoints in `backend/src`
   - Update database schema if needed

### Production Setup

When ready to deploy:

1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Setup AWS S3 for file storage
3. Configure SendGrid/SMTP for emails
4. Setup Razorpay for payments
5. Deploy to Railway/Render (backend)
6. Deploy to Vercel (frontend)

## Useful Commands

### Backend

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run
```

### Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

## Resources

- 📚 [Full Documentation](./README.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)
- 🗄️ [Database Schema](./DATABASE_SCHEMA.md)
- 🔌 [API Endpoints](./API_ENDPOINTS.md)
- 🚢 [Deployment Guide](./DEPLOYMENT.md)

## Getting Help

### Check Logs

**Backend logs:**
```bash
# Development mode shows logs in terminal
# Check for errors in red
```

**Frontend logs:**
```bash
# Check terminal for server errors
# Check browser console (F12) for client errors
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` |
| Database error | Check PostgreSQL running & credentials |
| CORS error | Verify backend CORS config |
| API 404 | Check backend is running on correct port |
| Build fails | Clear `node_modules` and reinstall |

## Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload
2. **Database GUI**: Use pgAdmin or TablePlus for easier database management
3. **API Testing**: Use Swagger UI at `/api/docs` or Postman
4. **Code Editor**: VS Code with extensions:
   - ESLint
   - Prettier
   - TypeScript
   - Tailwind CSS IntelliSense

## Sample API Requests

### Register User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile (with token)

```bash
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## That's It! 🎉

You now have a fully functional School ERP + LMS running locally!

**Next**: Create your first school, add some classes, and explore the features!

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).

Happy coding! 🚀
